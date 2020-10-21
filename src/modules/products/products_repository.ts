import { IProduct } from './products_model';
import { database } from '../../database/database';
import { IQueryResponse } from '../../models/postgres_responses';

class ProductsRepository {

    public create = async(product: IProduct): Promise<IQueryResponse> => {

        return database.query(
            `insert into products(name, price, image, item) values('${product.name}', ${product.price}, '${product.image}', ${product.item})`
        )
        .then((value) => {
            console.log(value);
            return {
                ok: true,
                data: product
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

        return database.query('SELECT * FROM products')
        .then((value) => {
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

    public getById = async(id: number): Promise<IQueryResponse> => {

        return database.query(`SELECT * FROM products WHERE id = ${id}`)
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

    public update = async(id: number, product: IProduct): Promise<IQueryResponse> => {

        // if(name) update.name = name;
        // if(price) update.price = price;
        // if(image) update.image = image;
        // if(item) update.name = item;

        return database.query(`UPDATE products SET(name, price, item) = ('${product.name}', ${product.price}, ${product.item}) WHERE id = ${id}`)

        .then(async(value) => {
        
            if(value.rowCount === 0) return {
                ok: false,
                data: 'User not found'
            }

            const user = await this.getById(id);
            if(!user.ok) return user;

            return {
                ok: true,
                data: user.data
            }
        })
        .catch((err) => {
            return {
                ok: false,
                data: err.message
            }
        });
    }

    public getCount = async(): Promise<IQueryResponse> => {

        return database.query('SELECT * FROM products')
        .then((value) => {
            return {
                ok: true,
                data: value.rowCount
            }
        })
        .catch((err) => {
            return {
                ok: false,
                data: err.message
            }
        });
    }

    public delete = async(id: number): Promise<IQueryResponse> => {

        return database.query(`delete from products WHERE id = ${id}`)
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
}

export const productsRepository = new ProductsRepository;
