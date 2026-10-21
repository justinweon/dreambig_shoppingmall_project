
export interface SignUpInput {
    name: string;
    nickname: string;
    email: string;
    password: string;
    passwordConfirm: string;
    phone: string;
    zipCode: string;
    address: string;
    addressDetail: string;

}

export interface SignInInput {
    email: string;
    password: string;
}