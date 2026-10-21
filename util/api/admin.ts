import 'server-only';
import {
    type ApiClient,
    DreambigApiError,
    pageRange,
    requirePositiveInt,
    requireUser,
    requireUuid,
    unwrap,
} from './core';
import type { ProductDetailRow, ProductRow } from './types';

/** serviceClient는 서버에서만 생성하며, 모든 호출에서 요청자의 관리자 역할을 다시 확인한다. */
export function createAdminApi(
    userClient: ApiClient,
    serviceClient: ApiClient,
) {
    async function requireAdmin() {
        const user = await requireUser(userClient);
        const profile = unwrap(
            await serviceClient
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .maybeSingle(),
        );
        if (profile?.role !== 'admin')
            throw new DreambigApiError('FORBIDDEN', 'Admin role required');
    }
    return {
        async getDashboardSummary() {
            await requireAdmin();
            const results = await Promise.all([
                serviceClient
                    .from('products')
                    .select('id', { count: 'exact', head: true }),
                serviceClient
                    .from('profiles')
                    .select('id', { count: 'exact', head: true }),
                serviceClient
                    .from('orders')
                    .select('id', { count: 'exact', head: true })
                    .eq('status', 'pending_payment'),
                serviceClient
                    .from('orders')
                    .select('id', { count: 'exact', head: true })
                    .eq('status', 'paid'),
            ]);
            results.forEach(unwrap);
            return {
                productCount: results[0].count ?? 0,
                memberCount: results[1].count ?? 0,
                pendingOrderCount: results[2].count ?? 0,
                paidOrderCount: results[3].count ?? 0,
            };
        },
        async checkProductIdDuplicate(productId: number) {
            await requireAdmin();
            return (
                unwrap(
                    await serviceClient
                        .from('products')
                        .select('id')
                        .eq('id', requirePositiveInt(productId))
                        .maybeSingle(),
                ) !== null
            );
        },
        async listProfiles(page = 1, pageSize = 20) {
            await requireAdmin();
            return unwrap(
                await serviceClient
                    .from('profiles')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .order('id')
                    .range(...pageRange(page, pageSize)),
            );
        },
        async listOrders(
            options: {
                page?: number;
                pageSize?: number;
                status?: 'pending_payment' | 'paid';
            } = {},
        ) {
            await requireAdmin();
            let query = serviceClient.from('orders').select('*');
            if (options.status) query = query.eq('status', options.status);
            return unwrap(
                await query
                    .order('created_at', { ascending: false })
                    .order('id')
                    .range(...pageRange(options.page, options.pageSize)),
            );
        },
        async getOrder(orderId: string) {
            await requireAdmin();
            const id = requireUuid(orderId);
            const order = unwrap(
                await serviceClient
                    .from('orders')
                    .select('*')
                    .eq('id', id)
                    .maybeSingle(),
            );
            if (!order) return null;
            const items = unwrap(
                await serviceClient
                    .from('order_items')
                    .select('*')
                    .eq('order_id', id)
                    .order('display_order'),
            );
            return { order, items };
        },
        async listPayments(page = 1, pageSize = 20) {
            await requireAdmin();
            return unwrap(
                await serviceClient
                    .from('payments')
                    .select(
                        'id,order_id,provider,amount_minor,currency,status,approved_at,created_at',
                    )
                    .order('created_at', { ascending: false })
                    .order('id')
                    .range(...pageRange(page, pageSize)),
            );
        },
        async createProduct(input: ProductRow) {
            await requireAdmin();
            requirePositiveInt(input.id);
            return unwrap(
                await serviceClient
                    .from('products')
                    .insert(input)
                    .select('*')
                    .single(),
            );
        },
        async updateProduct(
            productId: number,
            input: Partial<Omit<ProductRow, 'id'>>,
        ) {
            await requireAdmin();
            // 런타임 입력에 id가 섞여도 수정할 수 없다.
            const {
                name,
                price_minor,
                currency,
                category,
                image_url,
                erase_image_url,
                description,
                display_order,
            } = input;
            return unwrap(
                await serviceClient
                    .from('products')
                    .update({
                        name,
                        price_minor,
                        currency,
                        category,
                        image_url,
                        erase_image_url,
                        description,
                        display_order,
                    })
                    .eq('id', requirePositiveInt(productId))
                    .select('*')
                    .single(),
            );
        },
        async upsertProductDetail(input: ProductDetailRow) {
            await requireAdmin();
            requirePositiveInt(input.product_id);
            return unwrap(
                await serviceClient
                    .from('product_details')
                    .upsert(input, { onConflict: 'product_id' })
                    .select('*')
                    .single(),
            );
        },
    };
}
