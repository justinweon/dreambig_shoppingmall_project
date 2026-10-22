// 정기 아.. 이제 끝이 보이는건가
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@/shared/lib/supabase";
import { createDreambigServerApi } from "@/util/api/server";
import { DreambigApiError } from "@/util/api/core";
import type { Database } from "@/util/api/types";

// 결제 관련 응답은 캐시에 저장하지 않음
function reply(body: unknown, status: number): Response {
    return Response.json(body, {
        status,
        headers: {
            "Cache-Control": "private, no-store",
        },
    });
}

export async function POST(request: Request): Promise<Response> {
    // 현재 사이트에서 보낸 요청만 허용
    if (request.headers.get("origin") !== new URL(request.url).origin) {
        return reply({ message: "허용되지 않은 요청입니다."}, 403);
    }

    // 잘못된 JSON도 입력 오류로 처리
    const input: unknown = await request.json().catch(()=> null);

    if (
        typeof input !== "object" ||
        input === null ||
        !("orderId" in input) ||
        typeof input.orderId !== "string" ||
        !("paymentKey" in input) ||
        typeof input.paymentKey !== "string" ||
        input.paymentKey.length === 0 ||
        input.paymentKey.length > 200 || 
        input.paymentKey.trim() !== input.paymentKey ||
        !("amount" in input) ||
        typeof input.amount !== "number" ||
        !Number.isSafeInteger(input.amount) ||
        input.amount < 1
    ) {
        return reply({ message : "올바른 결제 요청 정보가 필요합니다."}, 400);
    }
    
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseSecret = process.env.SUPABASE_SECRET_KEY;
    const tossSecretKey = process.env.TOSS_SECRET_KEY;

    // 새 Supabase Secret key와 토스 테스트 서버 키 확인
    if (
        !url ||
        !supabaseSecret?.startsWith("sb_secret_") ||
        !tossSecretKey?.startsWith("test_sk_")
    ) {
        return reply({ message : " 서버의 테스트 결제 설정을 확인해주세요." }, 503)
    }
    
    try {
        // 로그인 회원 확인용 연결
        const userClient = createServerClient();

        // 로그인 세션과 분리된 서버 관리자 연결
        const serviceClient = createClient<Database>(url, supabaseSecret, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false,
            },
        });
        
        const api = createDreambigServerApi(userClient, {
            serviceClient,
            tossSecretKey,
        });

        // 회원·주문·금액· 검증 -> 토스 승인 -> DB반영
        const payment = await api.payments.confirmTossPayment({
            orderId: input.orderId,
            paymentKey: input.paymentKey,
            amount: input.amount,
        });

        // 저장된 주문과 결제 기록을 다시 확인
        const savedOrder = await api.orders.getMyOrder(input.orderId);
        const savedPayment = await api.orders.getMyPayment(input.orderId);

        if (
            !savedOrder ||
            savedOrder.status !== "paid" ||
            savedOrder.amount_minor !== input.amount ||
            savedOrder?.currency !== "KRW" ||
            !savedPayment ||
            savedPayment.id !== payment.id ||
            savedPayment.order_id !== savedOrder.id ||
            savedPayment.status !== "DONE" ||
            savedPayment.amount_minor !== savedOrder.amount_minor ||
            savedPayment.currency !== savedOrder.currency
        ) {
            throw new Error("결제 반영 결과를 확인할 수 없습니다.")
        }

        // 공통 조회 함수가 결제 키를 제외한 정보만 반환
        return reply({ payment: savedPayment}, 200);
} catch(error) {
    if (error instanceof DreambigApiError) {
        if (error.code === "AUTH_REQUIRED") {
            return reply({message: "로그인 후 다시 확인해주세요"}, 401);
        }

        if (error.code === "ORDER_NOT_FOUND") {
            return reply({message: "확인할 주문을 찾을 수 없습니다."}, 404);
        }

        if (
            ["INVALID_INPUT", "INVALID_PAYMENT", "PAYMENT_AMOUNT_MISMATCH"].includes(error.code)
        ) {
            return reply({message: "주문번호와 결제정보를 확인해 주세요."}, 400)
        }
    }
    // 승인 후 저장·재조회 오류일 수 있으므로 실패로 단정하지 않음
    return reply({
        message: "결제처리 결과를 확인하지 못했습니다. 새 결제를 만들지 말고 같은 주문의 상태를 확인해 주세요."
    }, 502);    
}
}
    