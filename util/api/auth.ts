import {
    type ApiClient,
    DreambigApiError,
    requireText,
    requireUser,
    unwrap,
} from './core';
import type { ProfileContactInput } from './types';

function normalizeContact(input: ProfileContactInput): ProfileContactInput {
    const result: ProfileContactInput = {};
    for (const field of [
        'phone',
        'zip_code',
        'address',
        'address_detail',
    ] as const) {
        if (input[field] !== undefined)
            result[field] = input[field]?.trim() || null;
    }
    if (result.phone && !/^\d+$/.test(result.phone))
        throw new DreambigApiError(
            'INVALID_INPUT',
            'phone must contain only digits',
        );
    return result;
}

export function createAuthApi(client: ApiClient) {
    return {
        async signIn(email: string, password: string) {
            return unwrap(
                await client.auth.signInWithPassword({
                    email: requireText(email, 'email'),
                    password,
                }),
            );
        },
        async signUp(
            input: {
                email: string;
                password: string;
                nickname: string;
                name?: string;
            } & ProfileContactInput,
        ) {
            return unwrap(
                await client.auth.signUp({
                    email: requireText(input.email, 'email'),
                    password: input.password,
                    options: {
                        data: {
                            nickname: requireText(input.nickname, 'nickname'),
                            name: input.name?.trim(),
                            ...normalizeContact(input),
                        },
                    },
                }),
            );
        },
        async signOut() {
            const { error } = await client.auth.signOut();
            unwrap({ data: null, error });
        },
        async getCurrentUser() {
            const result = await client.auth.getUser();
            if (result.error?.name === 'AuthSessionMissingError') return null;
            return unwrap(result).user;
        },
        async getMyProfile() {
            const user = await requireUser(client);
            return unwrap(
                await client
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .maybeSingle(),
            );
        },
        async updateMyProfile(input: {
            nickname: string;
            name: string | null;
        }) {
            const user = await requireUser(client);
            return unwrap(
                await client
                    .from('profiles')
                    .update({
                        nickname: requireText(input.nickname, 'nickname'),
                        name: input.name?.trim() ?? null,
                    })
                    .eq('id', user.id)
                    .select('*')
                    .single(),
            );
        },
    };
}
