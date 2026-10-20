'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { signUpAction } from '../actions/signup.action';
import { INITIAL_ACTION_STATE } from '@/shared/types/action.types';

export default function SignupForm() {
    const [state, formAction, isPending] = useActionState(signUpAction, INITIAL_ACTION_STATE);
    const kept = state.data as { name?: string; email?: string } | undefined;

    const field = (name: string, label: string, type = 'text', defaultValue = '') => (
        <div className="flex flex-col gap-1">
            <label htmlFor={name} className="text-sm font-medium">{label}</label>
            <input
                id={name}
                name={name}
                type={type}
                defaultValue={defaultValue}
                className="h-10 rounded-lg border px-3 text-sm"
            />
            {state.errors?.[name] && (
                <p className="text-xs text-red-500">{state.errors[name]}</p>
            )}
        </div>
    );

    return (
        <form action={formAction} noValidate className="flex w-full max-w-sm flex-col gap-4">
            <h1 className="text-2xl font-bold">회원가입</h1>

            {state.message && !state.success && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{state.message}</p>
            )}

            {field('name', '이름', 'text', kept?.name)}
            {field('email', '이메일', 'email', kept?.email)}
            {field('password', '비밀번호 (8자 이상)', 'password')}
            {field('passwordConfirm', '비밀번호 확인', 'password')}

            <button
                type="submit"
                disabled={isPending}
                className="h-10 rounded-full bg-[#8bdb38] font-bold disabled:opacity-50"
            >
                {isPending ? '가입 처리 중...' : '가입하기'}
            </button>

            <p className="text-center text-sm text-gray-500">
                이미 계정이 있나요?{' '}
                <Link href="/login" className="font-bold underline">로그인</Link>
            </p>
        </form>
    );
}