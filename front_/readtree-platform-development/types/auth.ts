export type User = {
    id: string
    email: string
    name?: string
    avatar_url?: string
    created_at: string
    updated_at: string
}

export type AuthProvider = 'kakao' | 'google' | 'email'

export type LoginRequest = {
    provider?: AuthProvider
    email?: string
    password?: string
}

export type SignupRequest = {
    email: string
    password: string
    name?: string
}

export type ResetPasswordRequest = {
    email: string
}
