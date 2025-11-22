export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface UserData {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
}

export interface LoginResponse {
    user: UserData;
    tokens: AuthTokens;
}