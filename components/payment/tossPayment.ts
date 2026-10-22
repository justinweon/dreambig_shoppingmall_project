// 정기 아 끝난 줄 알았는데 왜 계속 있어...
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import type { OrderRow } from "@/util/api/types";

// DB에서 생성한 주문으로 테스트 결제창 요청
export async function requestTestCardPayment(
    order: OrderRow,
    isCurrent: () => boolean
): Promise<void> {
    const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;

    // API 개별 연동의 테스트 클라이언트 키만 허용
    if (!clientKey?.startsWith("test_ck_")) {
        throw new Error("토스 테스트 클라이언트 키 설정을 확인해 주세요")
    }

    if (order.status !== "pending_payment") {
        throw new Error("결제 대기 상태의 주문만 결제할 수 있습니다.");
    }

    if (
        order.currency !== "KRW" ||
        !Number.isSafeInteger(order.amount_minor) ||
        order.amount_minor < 1
    ) {
        throw new Error("주문의 결제 금액을 확인할 수 없습니다.");
    }
    
    if (!isCurrent()) return;

    // 브라우저에서 토스 SDK 로드
    const tossPayments = await loadTossPayments(clientKey);

    // SDK를 기다리는 동안 계정·장바구니가 바뀌었으면 중단
    if (!isCurrent()) return;

    const payment = tossPayments.payment({
        customerKey: order.user_id,
    });
    
    await payment.requestPayment({
        method: "CARD",
        amount: {
            currency: order.currency,
            value: order.amount_minor
        },
        orderId: order.id,
        orderName: "문화상품 주문",
        successUrl: `${window.location.origin}/checkout/success`,
        failUrl: `${window.location.origin}/checkout/fail`,
        card: {
            flowMode: "DEFAULT",
        },
    });
}

// 서버에서 확인한 결제 완료 정보
export type ConfirmedPayment = {
    orderId: string;
    amount: number;
};

// 우리 서버에 승인 요청을 보내고 결과 검사
export async function confirmTestPayment(input: {
    orderId: string;
    paymentKey: string;
    amount: number;
}): Promise<ConfirmedPayment> {
    const response = await fetch("/api/payments/confirm", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "same-origin",
        cache: "no-store",
        body: JSON.stringify(input),
    });

    const result: unknown = await response.json().catch(() => null);

    // 서버가 반환한 안내 문구 사용
    if (!response.ok) {
        const message = 
        typeof result === "object" &&
        result !== null &&
        "message" in result &&
        typeof result.message === "string"
        ? result.message
        : "결제 처리 결과를 확인하지 못했습니다. 새 결제를 시작하지 말고 같은 주문의 상태를 다시  확인해 주세요.";

        throw new Error(message);
    }

    if (
        typeof result !== "object" ||
        result === null ||
        !("payment" in result)
    ) {
        throw new Error("서버의 결제 확인 응답을 읽을 수 없습니다.");
    }

    const payment = result.payment;

    // 정상 HTTP 응답이어도 결제 내용이 맞는지 검사
    if (
        typeof payment !== "object" ||
        payment === null ||
        !("order_id" in payment) ||
        typeof payment.order_id !== "string" ||
        payment.order_id !== input.orderId ||
        !("amount_minor" in payment) ||
        typeof payment.amount_minor !== "number" ||
        payment.amount_minor !== input.amount ||
        !("currency" in payment) ||
        payment.currency !== "KRW" ||
        !("status" in payment) ||
        payment.status !== "DONE"
    ) {
        throw new Error(
            "결제 완료 정보를 확인할 수 없습니다. 새 결제를 시작하지 말고 같은 주문의 상태를 다시 확인해 주세요."
        );
    }

    return {
        orderId: payment.order_id,
        amount: payment.amount_minor
    }
}