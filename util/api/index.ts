import type { ApiClient } from './core';
import { createAuthApi } from './auth';
import { createProductsApi } from './products';
import { createCartApi } from './cart';
import { createOrdersApi } from './orders';

/** 요청별/로그인 세션별 클라이언트를 주입한다. 서버 전용 기능은 ./server에서 제공한다. */
export function createDreambigApi(client: ApiClient) {
    return {
        auth: createAuthApi(client),
        products: createProductsApi(client),
        cart: createCartApi(client),
        orders: createOrdersApi(client),
    };
}
export { DreambigApiError } from './core';
export type { ApiClient } from './core';
export type * from './types';
