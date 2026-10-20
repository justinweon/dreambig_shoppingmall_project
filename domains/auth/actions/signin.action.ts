'use server';

import { redirect } from 'next/navigation';
import { createServerClient } from '@/shared/lib/supabase';
import { ActionState } from '@/shared/types/action.types';
import { validateSignInInput } from '../utils/authValidation';

// 돌아갈 주소가 안전한 우리 사이트 안쪽 주소인지 확인
function getSafeRedirect(path: string): string {
    if (!path.startsWith('/') || path.startsWith('//') || path.startsWith('/login')) {
        return '/';
    }
    return path;
}

export async function signInAction(
    prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const input = {
        email: String(formData.get('email') ?? ''),
        password: String(formData.get('password') ?? ''),
    };
    const redirectTo = getSafeRedirect(String(formData.get('redirectTo') ?? '/'));
    const keep = { email: input.email };

    const errors = validateSignInInput(input);
    if (Object.keys(errors).length > 0) {
        return { success: false, errors, data: keep };
    }

    const supabase = createServerClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({
        email: input.email.trim(),
        password: input.password,
    });

    if (signInError) {
        return {
            success: false,
            message: '이메일 또는 비밀번호가 맞지 않아요.',
            data: keep,
        };
    }

    redirect(redirectTo);
}