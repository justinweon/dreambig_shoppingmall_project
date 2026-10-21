import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, OrderItemInput } from './types';

export type ApiClient = SupabaseClient<Database>;
export class DreambigApiError extends Error {
    constructor(
        public readonly code: string,
        message: string,
    ) {
        super(message);
        this.name = 'DreambigApiError';
    }
}

/** Supabase 코드와 DB 예외 메시지를 보존한다. 화면 문구는 호출부에서 결정한다. */
type ApiResponse = {
    data: unknown;
    error: { message: string; code?: string } | null;
};
type SuccessData<R extends ApiResponse> =
    Extract<R, { error: null }> extends { data: infer T } ? T : R['data'];
export function unwrap<R extends ApiResponse>(result: R): SuccessData<R> {
    if (result.error)
        throw new DreambigApiError(
            result.error.code ?? 'API_ERROR',
            result.error.message,
        );
    return result.data as SuccessData<R>;
}
export function requireText(value: string, field: string): string {
    const text = value.trim();
    if (!text)
        throw new DreambigApiError('INVALID_INPUT', `${field} is required`);
    return text;
}
export function requirePositiveInt(value: number): number {
    if (!Number.isInteger(value) || value < 1 || value > 2147483647)
        throw new DreambigApiError(
            'INVALID_INPUT',
            'Expected a positive PostgreSQL integer',
        );
    return value;
}
export function requireUuid(value: string): string {
    if (
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            value,
        )
    )
        throw new DreambigApiError('INVALID_INPUT', 'Expected a UUID');
    return value;
}
export function validateItems(
    items: readonly OrderItemInput[],
): OrderItemInput[] {
    if (items.length < 1 || items.length > 100)
        throw new DreambigApiError(
            'INVALID_ITEM_COUNT',
            'Expected 1 to 100 items',
        );
    const ids = new Set<number>();
    return items.map(({ productId, quantity }) => {
        requirePositiveInt(productId);
        requirePositiveInt(quantity);
        if (ids.has(productId))
            throw new DreambigApiError(
                'DUPLICATE_PRODUCT',
                'Duplicate product',
            );
        ids.add(productId);
        return { productId, quantity };
    });
}
export function pageRange(page = 1, pageSize = 20): [number, number] {
    requirePositiveInt(page);
    requirePositiveInt(pageSize);
    if (pageSize > 100 || !Number.isSafeInteger(page * pageSize))
        throw new DreambigApiError(
            'INVALID_INPUT',
            'Invalid pagination (pageSize max 100)',
        );
    return [(page - 1) * pageSize, page * pageSize - 1];
}
export async function requireUser(client: ApiClient) {
    const result = await client.auth.getUser();
    if (result.error?.name === 'AuthSessionMissingError')
        throw new DreambigApiError('AUTH_REQUIRED', 'Sign in required');
    const { user } = unwrap(result);
    if (!user) throw new DreambigApiError('AUTH_REQUIRED', 'Sign in required');
    return user;
}
