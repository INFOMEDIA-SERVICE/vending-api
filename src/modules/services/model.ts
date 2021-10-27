import { IProduct } from '../../interfaces/postgres_responses';

export interface IService {
    id?: string
    user_id: string
    machine_id: string
    products: IProduct[]
    reference?: number
    success?: boolean
    status?: boolean
    value?: number
    created_at?: Date
    updated_at?: Date
};
