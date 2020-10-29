import { IProduct } from './products_model';
import { database } from '../../database/database';
import { IQueryResponse } from '../../interfaces/postgres_responses';

class ProductsRepository {

    private table: string = 'products';

    public create = async(product: IProduct): Promise<IQueryResponse> => {

        return database.query(
            `insert into ${this.table}(name, price, image, quantity, description, item, machine_id) values('${product.name}', ${product.price}, '${product.image}', ${product.quantity}, '${product.description}', '${product.item}', '${product.machine_id}') RETURNING *`
        )
        .then((value) => {
            return {
                ok: true,
                data: value.rows[0]
            }
        })
        .catch((err) => {
            return {
                ok: false,
                data: err.message
            }
        });
    }

    public getAll = async(): Promise<IQueryResponse> => {

        return database.query(
            `SELECT * FROM ${this.table} WHERE status = true`
        ).then((value) => {
            return {
                ok: true,
                data: value.rows
            }
        })
        .catch((err) => {
            return {
                ok: false,
                data: err.message
            }
        });
    }

    public getById = async(id: string): Promise<IQueryResponse> => {

        return database.query(`SELECT * FROM ${this.table} WHERE id = '${id}'`)
        .then((value) => {
            if(value.rowCount === 0) return {
                ok: false,
                data: 'User not found'
            }
            else return {
                ok: true,
                data: value.rows[0]
            }
        })
        .catch((err) => {
            return {
                ok: false,
                data: err.message
            }
        });
    }

    public update = async(id: string, product: IProduct): Promise<IQueryResponse> => {

        return database.query(
            `UPDATE ${this.table} SET(name, price, image, quantity, description, item, machine_id) = ('${product.name}', ${product.price}, '${product.image}', ${product.quantity}, '${product.description}', '${product.item}', '${product.machine_id}') WHERE id = '${id}' RETURNING *`
        ).then(async(value) => {
        
            if(value.rowCount === 0) return {
                ok: false,
                data: 'Product not found'
            }
            return {
                ok: true,
                data: value.rows[0]
            }
        })
        .catch((err) => {
            return {
                ok: false,
                data: err.message
            }
        });
    }

    public delete = async(id: string): Promise<IQueryResponse> => {

        return database.query(
            `delete from ${this.table} WHERE id = '${id}'`
        ).then((value) => {
            if(value.rowCount === 0) return {
                ok: false,
                data: 'User not found'
            }
            else return {
                ok: true,
                data: value.rows[0]
            }
        })
        .catch((err) => {
            return {
                ok: false,
                data: err.message
            }
        });
    }
}

export const productsRepository = new ProductsRepository;
