'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/shared/lib/supabase';
import { createDreambigApi } from '@/util/api';

const api = createDreambigApi(supabase);

// 지금 로그인한 사람을 알려 주는 훅 (없으면 null)
export function useCurrentUser() {
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);

    // 페이지를 옮길 때마다 상태확인
    useEffect(() => {
        api.auth.getCurrentUser().then(setUser).catch(() => setUser(null));
    }, [pathname]);

    // 이 브라우저에서 로그인·로그아웃이 일어나면 바로 반영
    useEffect(() => {
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => data.subscription.unsubscribe();
    }, []);

    return user;
}