// 정기 주문서 생성 공통함수
import { supabase } from "@/shared/lib/supabase-browser";
import { createDreambigApi } from "@/util/api";
import type { OrderRow } from "@/util/api/types";
import type { CartItem } from "@/util/types/cart";

const api = createDreambigApi(supabase);

// 상품 ID와 수량으로 주문 생성 요청
export async function createCheckoutOrder(
    requestId: string,
    items: readonly CartItem[]
): Promise<OrderRow> {
    const order = await api.orders.createOrder(requestId, items);

    // 반환된 주문과 결제 금액 검사
    if (
        !order ||
        typeof order.id !== "string" ||
        order.request_id !== requestId ||
        order.currency !== "KRW" ||
        !Number.isSafeInteger(order.amount_minor) ||
        order.amount_minor < 1
    ) {
        throw new Error("주문 생성 결과를 확인할 수 없습니다.");
    }

    return order;
}

// 같은 구매의 재시도에 사용할 요청번호 보관
export function getCheckoutRequestId(
    userId: string,
    items: readonly CartItem[]
): string {
    // 상품 순서가 달라도 같은 구성으로 구분
    const itemsKey = JSON.stringify(
        items
            .map(({ productId, quantity }) => ({
                productId,
                quantity,
            }))
            .sort((a,b) => a.productId - b.productId) 
    );
    const storageKey = `dreambig:checkout:${userId}:${itemsKey}`;
    const savedRequestId = sessionStorage.getItem(storageKey);

    if (savedRequestId !== null) {
        return savedRequestId
    }

    const requestId = crypto.randomUUID();

    // DB 요청 전에 보관해야 응답 유실 후에도 재사용 가능
    sessionStorage.setItem(storageKey, requestId);

    return requestId
}