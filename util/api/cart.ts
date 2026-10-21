import {
    type ApiClient,
    requirePositiveInt,
    requireUser,
    unwrap,
} from './core';
import type { CartRow } from './types';

export function createCartApi(client: ApiClient) {
    return {
        async listMyCartItems() {
            const user = await requireUser(client);
            return unwrap(
                await client
                    .from('cart_items')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('product_id'),
            );
        },
        /** quantity는 추가 수량. 동시 요청의 수량 병합은 DB RPC가 처리한다. */
        async addMyCartItem(productId: number, quantity = 1): Promise<CartRow> {
            await requireUser(client);
            return unwrap(
                await client.rpc('add_my_cart_item', {
                    p_product_id: requirePositiveInt(productId),
                    p_quantity: requirePositiveInt(quantity),
                }),
            ) as unknown as CartRow;
        },
        /** quantity는 변경 후 전체 수량. 0개로 바꾸려면 deleteMyCartItem을 사용한다. */
        async updateMyCartItem(productId: number, quantity: number) {
            const user = await requireUser(client);
            return unwrap(
                await client
                    .from('cart_items')
                    .update({ quantity: requirePositiveInt(quantity) })
                    .eq('user_id', user.id)
                    .eq('product_id', requirePositiveInt(productId))
                    .select('*')
                    .single(),
            );
        },
        async deleteMyCartItem(productId: number) {
            const user = await requireUser(client);
            return unwrap(
                await client
                    .from('cart_items')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('product_id', requirePositiveInt(productId))
                    .select('product_id'),
            );
        },
    };
}
