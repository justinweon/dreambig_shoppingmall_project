// 정기 사용자 장바구니 조회 함수
import { supabase } from "@/shared/lib/supabase-browser";
import type { CartItem, AddToCartRequest } from "@/util/types/cart";
import { createDreambigApi } from "@/util/api";

const api = createDreambigApi(supabase);

// 지정한 회원의 장바구니를 조회
export async function fetchCartItems(
    userId: string
): Promise<CartItem[]> {
    // 공통 함수로 로그인한 회원의 장바구니 조회
    const data = await api.cart.listMyCartItems();

    // 요청 당시 회원과 다른 회원의 결과는 사용하지 않음
    if (data.some((row) => row.user_id !== userId)) {
        throw new Error("로그인 상태가 변경되었습니다.");
    }

    // DB 컬럼명을 기존 화면용 이름으로 변환
    return data.map((row) => ({
        productId: row.product_id,
        quantity: row.quantity,
    }));
}

// 로그인한 회원의 장바구니에 상품 추가
export async function addCartItem(
    { productId, quantity } : AddToCartRequest
): Promise<CartItem> {
    // 공통 함수로 상품을 담고 DB의 최종 수량 받기
    const data = await api.cart.addMyCartItem(productId, quantity)

    if (
        !data ||
        !Number.isSafeInteger(data.product_id) ||
        !Number.isSafeInteger(data.quantity) ||
        data.quantity < 1
    ) {
        throw new Error("장바구니 저장 결과를 확인할 수 없습니다.");
    }

    return {
        productId: data.product_id,
        quantity: data.quantity,
    };
}

// 로그인한 회원의 장바구니 수량 변경
export async function updateCartItem(
    productId: CartItem['productId'],
    quantity: number
): Promise<CartItem> {
    // 공통 함수에 변경 후 최종 수량 전달
    const data = await api.cart.updateMyCartItem(productId, quantity);

    // 변경결과의 상품과 수량 검사
    if (
        !data ||
        data.product_id !== productId ||
        !Number.isSafeInteger(data.quantity) ||
        data.quantity < 1
    ) {
        throw new Error("장바구니 수량 변경 결과를 확인할 수 없습니다.");
    }

    // DB 컬럼명을 기존 화면용 이름으로 변환
    return {
        productId: data.product_id,
        quantity: data.quantity,
    };
}

// 로그인한 회원의 장바구니에서 상품 삭제
export async function deleteCartItem(
    productId: CartItem["productId"]
): Promise<void> {
    await api.cart.deleteMyCartItem(productId);
}