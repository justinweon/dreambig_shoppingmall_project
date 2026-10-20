'use server';

import { redirect } from 'next/navigation';
import { createServerClient } from '@/shared/lib/supabase';
import { ActionState } from '@/shared/types/action.types';
import { validateSignUpInput } from '../utils/authValidation';

export async function signUpAction(
    prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const input = {
        name: String(formData.get('name') ?? ''),
        email: String(formData.get('email') ?? ''),
        password: String(formData.get('password') ?? ''),
        passwordConfirm: String(formData.get('passwordConfirm') ?? ''),
    };
    const keep = { name: input.name, email: input.email };

    const errors = validateSignUpInput(input);
    if (Object.keys(errors).length > 0) {
        return { success: false, errors, data: keep };
    }

    const supabase = createServerClient();

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: input.email.trim(),
        password: input.password,
    });

    if (signUpError || !authData.user) {
        const isDuplicate = signUpError?.message?.toLowerCase().includes('already');
        return {
            success: false,
            message: isDuplicate
                ? '이미 가입된 이메일이에요.'
                : `회원가입에 실패했어요: ${signUpError?.message ?? '알 수 없는 오류'}`,
            data: keep,
        };
    }

    const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        name: input.name.trim(),
        role: 'user',
    });

    if (profileError) {
        return {
            success: false,
            message: `프로필 저장에 실패했어요: ${profileError.message}`,
            data: keep,
        };
    }

    redirect('/');
}