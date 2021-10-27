export interface IUser {
    id?: string
    first_name: string
    last_name: string
    email: string
    uid?: string
    password?: string
    requests?: number
    role?: number
    status?: boolean
    created_at?: Date
    updated_at?: Date
}