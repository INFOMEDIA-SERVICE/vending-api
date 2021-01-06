
export interface IService {
    id?: string
    user_id: string
    machine_id: string
    products: any[] | string
    reference?: string
    success?: boolean
    status?: boolean
    value?: number
    created_at?: Date
    updated_at?: Date    
};
