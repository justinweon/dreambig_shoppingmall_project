import { type ApiClient, pageRange, requirePositiveInt, unwrap } from './core';

export function createProductsApi(client: ApiClient) {
    const api = {
        async listProducts(
            options: {
                page?: number;
                pageSize?: number;
                category?: string;
            } = {},
        ) {
            let query = client.from('products').select('*');
            if (options.category !== undefined)
                query = query.eq('category', options.category);
            return unwrap(
                await query
                    .order('display_order')
                    .order('id')
                    .range(...pageRange(options.page, options.pageSize)),
            );
        },
        async getProduct(productId: number) {
            return unwrap(
                await client
                    .from('products')
                    .select('*')
                    .eq('id', requirePositiveInt(productId))
                    .maybeSingle(),
            );
        },
        async getProductDetail(productId: number) {
            return unwrap(
                await client
                    .from('product_details')
                    .select('*')
                    .eq('product_id', requirePositiveInt(productId))
                    .maybeSingle(),
            );
        },
        async listReviews(productId: number, page = 1, pageSize = 20) {
            return unwrap(
                await client
                    .from('reviews')
                    .select('*')
                    .eq('product_id', requirePositiveInt(productId))
                    .order('display_order')
                    .order('id')
                    .range(...pageRange(page, pageSize)),
            );
        },
        async listBanners() {
            return unwrap(
                await client
                    .from('product_banners')
                    .select('*')
                    .order('display_order')
                    .order('id'),
            );
        },
        async listCarouselItems() {
            return unwrap(
                await client
                    .from('carousel_items')
                    .select('*')
                    .order('display_order')
                    .order('id'),
            );
        },
    };
    return {
        ...api,
        async getProductPageData(
            productId: number,
            reviewPage = 1,
            reviewPageSize = 20,
        ) {
            const [product, detail, reviews] = await Promise.all([
                api.getProduct(productId),
                api.getProductDetail(productId),
                api.listReviews(productId, reviewPage, reviewPageSize),
            ]);
            return product ? { product, detail, reviews } : null;
        },
        async getHomeData() {
            const [banners, carouselItems] = await Promise.all([
                api.listBanners(),
                api.listCarouselItems(),
            ]);
            const ids = [
                ...new Set(
                    [...banners, ...carouselItems].map(
                        (item) => item.product_id,
                    ),
                ),
            ];
            const products = ids.length
                ? unwrap(
                      await client
                          .from('products')
                          .select('*')
                          .in('id', ids)
                          .order('display_order')
                          .order('id'),
                  )
                : [];
            return { banners, carouselItems, products };
        },
    };
}
