import { type ApiClient, requireText, requireUser, unwrap } from './core';

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
        async signUp(input: {
            email: string;
            password: string;
            nickname: string;
            name?: string;
        }) {
            return unwrap(
                await client.auth.signUp({
                    email: requireText(input.email, 'email'),
                    password: input.password,
                    options: {
                        data: {
                            nickname: requireText(input.nickname, 'nickname'),
                            name: input.name?.trim(),
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
