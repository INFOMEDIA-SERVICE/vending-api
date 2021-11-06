export interface IQueryResponse {
    ok: boolean
    data?: any
}

export interface IProduct {
    stock: number
    key: string
    value: number
    quantity: number
    service_id?: string
    dispensed?: string
}
