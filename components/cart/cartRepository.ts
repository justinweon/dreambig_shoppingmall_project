// 정기 사용자 장바구니 조회 함수
import { supabase } from "@/shared/lib/supabase-browser";
import type { CartItem } from "@/util/types/cart";

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