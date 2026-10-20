export interface SignUpInput {
    name: string;
    nickname: string;
    email: string;
    password: string;
    passwordConfirm: string;
}

export interface SignInInput {
    email: string;
    password: string;
}