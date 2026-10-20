import { createBrowserClient, createServerClient as createSSRServerClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

// 서버용: 쿠키를 읽고 써서 로그인 상태를 기억함
export function createServerClient(): SupabaseClient {
    return createSSRServerClient(supabaseUrl, supabasePublishableKey, {
        cookies: {
            async getAll() {
                const { cookies } = await import('next/headers');
                return (await cookies()).getAll();
            },
            async setAll(cookiesToSet) {
                try {
                    const { cookies } = await import('next/headers');
                    const cookieStore = await cookies();
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options),
                    );
                } catch {
                    // 서버 컴포넌트 렌더링 중에는 쿠키를 쓸 수 없어서 무시
                }
            },
        },
    });
}

// 브라우저용
export const supabase = createBrowserClient(supabaseUrl, supabasePublishableKey);