export interface IQueryResponse {
    ok: boolean
    data?: any
}

export interface IProduct {
    stock?: number
    key?: string
    name?: string
    description?: string
    value?: number
    quantity?: number
    service_id?: string
    dispensed?: boolean
}

export interface IToken {
    token: string
    expireAt: Date
    refreshToken: string
}
