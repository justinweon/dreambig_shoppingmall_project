import {
    type ApiClient,
    pageRange,
    requireUser,
    requireUuid,
    unwrap,
    validateItems,
} from './core';
import type { Json, OrderItemInput, OrderRow } from './types';

export function createOrdersApi(client: ApiClient) {
    return {
        /** 같은 구매의 재시도에는 같은 requestId와 items를 전달한다. 가격은 DB가 확정한다. */
        async createOrder(
            requestId: string,
            items: readonly OrderItemInput[],
        ): Promise<OrderRow> {
            await requireUser(client);
            return unwrap(
                await client.rpc('create_order', { // 멱등성
                    p_request_id: requireUuid(requestId),
                    p_items: validateItems(items) as unknown as Json,
                }),
            ) as unknown as OrderRow;
        },
        async listMyOrders(page = 1, pageSize = 20) {
            const user = await requireUser(client);
            return unwrap(
                await client
                    .from('orders')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .order('id')
                    .range(...pageRange(page, pageSize)),
            );
        },
        async getMyOrder(orderId: string) {
            const user = await requireUser(client);
            return unwrap(
                await client
                    .from('orders')
                    .select('*')
                    .eq('id', requireUuid(orderId))
                    .eq('user_id', user.id)
                    .maybeSingle(),
            );
        },
        async listMyOrderItems(orderId: string) {
            const user = await requireUser(client);
            const order = unwrap(
                await client
                    .from('orders')
                    .select('id')
                    .eq('id', requireUuid(orderId))
                    .eq('user_id', user.id)
                    .maybeSingle(),
            );
            if (!order) return [];
            return unwrap(
                await client
                    .from('order_items')
                    .select('*')
                    .eq('order_id', orderId)
                    .order('display_order'),
            );
        },
        async getMyPayment(orderId: string) {
            const user = await requireUser(client);
            const order = unwrap(
                await client
                    .from('orders')
                    .select('id')
                    .eq('id', requireUuid(orderId))
                    .eq('user_id', user.id)
                    .maybeSingle(),
            );
            if (!order) return null;
            // 결제 키는 화면에 노출하지 않는다.
            return unwrap(
                await client
                    .from('payments')
                    .select(
                        'id,order_id,provider,amount_minor,currency,status,approved_at,created_at',
                    )
                    .eq('order_id', orderId)
                    .maybeSingle(),
            );
        },
    };
}
