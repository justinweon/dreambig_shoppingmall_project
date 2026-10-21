import { SignInInput, SignUpInput } from '../types/auth.types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^01[016789]\d{7,8}$/;


export function validateSignUpInput(input: SignUpInput): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!input.name || !input.name.trim()) {
        errors.name = '이름을 입력해 주세요.';
    } else if (input.name.trim().length < 2) {
        errors.name = '이름은 최소 2자 이상 입력해야 합니다.';
    }

    if (!input.nickname || !input.nickname.trim()) {
    errors.nickname = '닉네임을 입력해 주세요.';
} else if (input.nickname.trim().length < 2 || input.nickname.trim().length > 12) {
    errors.nickname = '닉네임은 2자 이상 12자 이하로 입력해 주세요.';
}

    if (!input.email || !input.email.trim()) {
        errors.email = '이메일 주소를 입력해 주세요.';
    } else if (!EMAIL_REGEX.test(input.email.trim())) {
        errors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!input.password) {
        errors.password = '비밀번호를 입력해 주세요.';
    } else if (input.password.length < 8) {
        errors.password = '비밀번호는 최소 8자 이상이어야 합니다.';
    }

    if (!input.passwordConfirm) {
        errors.passwordConfirm = '비밀번호 확인을 입력해 주세요.';
    } else if (input.password !== input.passwordConfirm) {
        errors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    }

    const phone = (input.phone || '').replace(/\D/g, '');
    if (!phone) {
        errors.phone = '휴대폰 번호를 입력해 주세요.';
    } else if (!PHONE_REGEX.test(phone)) {
        errors.phone = '올바른 휴대폰 번호가 아닙니다.';
    }

    if (!input.zipCode || !input.address) {
        errors.address = '주소 찾기 버튼으로 주소를 입력해 주세요.';
    }

    return errors;
}

export function validateSignInInput(input: SignInInput): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!input.email || !input.email.trim()) {
        errors.email = '이메일 주소를 입력해 주세요.';
    } else if (!EMAIL_REGEX.test(input.email.trim())) {
        errors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!input.password) {
        errors.password = '비밀번호를 입력해 주세요.';
    }

    return errors;
}