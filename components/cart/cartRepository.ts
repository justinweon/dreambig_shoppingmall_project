// 정기 사용자 장바구니 조회 함수
import { supabase } from "@/shared/lib/supabase-browser";
import type { CartItem, AddToCartRequest } from "@/util/types/cart";

// 지정한 회원의 장바구니를 조회
export async function fetchCartItems(  //async 나왔다 promise는 세트
    userId: string
): Promise<CartItem[]> {
    const { data, error } = await supabase
    .from('cart_items')
    .select('product_id, quantity')
    .eq('user_id', userId)
    .order('product_id');

    if (error) {
        throw error;
    }

    return (data ?? []).map((row)=> ({
        productId: row.product_id,
        quantity: row.quantity
    }));
}

// 로그인한 회원의 장바구니에 상품 추가
export async function addCartItem(
    { productId, quantity } : AddToCartRequest
): Promise<CartItem> {
    const { data, error } = await supabase.rpc(
        "add_my_cart_item",
        {
            p_product_id: productId,
            p_quantity: quantity,
        }
    );

    if (error) {
        throw error;
    }

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