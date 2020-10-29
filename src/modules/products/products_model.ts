
export interface IProduct {
    id?: number
    name: string
    price: number
    image: string
    item: string
    description: string
    quantity: number
    machine_id: number
    status?: boolean
    createdAt?: Date;
    updatedAt?: Date;
}
