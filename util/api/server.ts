import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { createDreambigApi } from './index';
import { createAdminApi } from './admin';
import { createPaymentsApi } from './payments';
import { type ApiClient, DreambigApiError, requireText, unwrap } from './core';
import type { Database } from './types';

export function createDreambigServerApi(
    userClient: ApiClient,
    options: { serviceClient?: ApiClient; tossSecretKey?: string } = {},
) {
    let serviceClient = options.serviceClient;
    function getServiceClient() {
        if (serviceClient) return serviceClient;
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!url || !key)
            throw new DreambigApiError(
                'CONFIG_REQUIRED',
                'Server Supabase configuration is required',
            );
        serviceClient = createClient<Database>(url, key, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false,
            },
        });
        return serviceClient;
    }
    const api = createDreambigApi(userClient);
    return {
        ...api,
        auth: {
            ...api.auth,
            /** profiles의 본인 조회 RLS로는 전체 중복을 판정할 수 없어 서버에서 boolean만 반환한다. */
            async checkNicknameDuplicate(nickname: string) {
                const value = requireText(nickname, 'nickname');
                const rows = unwrap(
                    await getServiceClient()
                        .from('profiles')
                        .select('id')
                        .eq('nickname', value)
                        .limit(1),
                );
                return rows.length > 0;
            },
        },
        get admin() {
            return createAdminApi(userClient, getServiceClient());
        },
        get payments() {
            return createPaymentsApi(
                userClient,
                getServiceClient(),
                options.tossSecretKey ?? process.env.TOSS_SECRET_KEY,
            );
        },
    };
}
