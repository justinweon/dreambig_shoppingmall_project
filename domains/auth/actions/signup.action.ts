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
    options: {
        data: {
            nickname: input.name.trim(),   // 트리거가 꺼내는 필수 이름표
            name: input.name.trim(),       // 트리거가 꺼내는 선택 이름표
        },
    },
});

    if (signUpError || !authData.user) {
    const msg = signUpError?.message?.toLowerCase() ?? '';
    const isDuplicate = msg.includes('already');
    const isProfileError = msg.includes('database error saving new user');

    return {
        success: false,
        message: isDuplicate
            ? '이미 가입된 이메일이에요.'
            : isProfileError
            ? '이미 사용 중인 이름이거나 가입 정보를 저장하지 못했어요. 다른 이름으로 다시 시도해 주세요.'
            : `회원가입에 실패했어요: ${signUpError?.message ?? '알 수 없는 오류'}`,
        data: keep,
    };
}

    redirect('/');
}