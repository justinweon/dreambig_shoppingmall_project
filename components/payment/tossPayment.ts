// 정기
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