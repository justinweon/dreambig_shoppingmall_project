'use server';

import { redirect } from 'next/navigation';
import { createServerClient } from '@/shared/lib/supabase';
import { ActionState } from '@/shared/types/action.types';
import { SignUpInput } from '../types/auth.types';
import { validateSignUpInput } from '../utils/authValidation';
import { getSafeRedirect } from '../utils/redirect';

export async function signUpAction(
    prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const input: SignUpInput = {
        name: String(formData.get('name') ?? ''),
        nickname: String(formData.get('nickname') ?? ''),
        email: String(formData.get('email') ?? ''),
        password: String(formData.get('password') ?? ''),
        passwordConfirm: String(formData.get('passwordConfirm') ?? ''),
        phone: String(formData.get('phone') ?? ''),
        zipCode: String(formData.get('zipCode') ?? ''),
        address: String(formData.get('address') ?? ''),
        addressDetail: String(formData.get('addressDetail') ?? ''),
    };
    const redirectTo = getSafeRedirect(String(formData.get('redirectTo') ?? '/'));
    const keep = {
        name: input.name,
        nickname: input.nickname,
        email: input.email,
        phone: input.phone,
        addressDetail: input.addressDetail,
    };

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
                nickname: input.nickname.trim(),
                name: input.name.trim(),
                phone: input.phone.replace(/\D/g, ''),
                zip_code: input.zipCode,
                address: input.address,
                address_detail: input.addressDetail.trim(),
            },
        },
    });

    if (signUpError || !authData.user) {
        const msg = signUpError?.message?.toLowerCase() ?? '';
        const isDuplicate = msg.includes('already');
        const isProfileError = msg.includes('database error saving new user');

        if (isProfileError) {
            return {
                success: false,
                errors: { nickname: '이미 사용 중인 닉네임이에요. 다른 닉네임을 입력해 주세요.' },
                data: keep,
            };
        }

        return {
            success: false,
            message: isDuplicate
                ? '이미 가입된 이메일이에요.'
                : `회원가입에 실패했어요: ${signUpError?.message ?? '알 수 없는 오류'}`,
            data: keep,
        };
    }

    redirect(redirectTo);
}