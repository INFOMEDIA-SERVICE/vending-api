import { IProduct } from "../../modules/products/products_model";

export interface IService {
    id?: string
    user_id: string
    machine_id: string
    products: IProduct[] | string
    reference?: number
    success?: boolean
    status?: boolean
    value?: number
    created_at?: Date
    updated_at?: Date
};
