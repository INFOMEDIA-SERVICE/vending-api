import { IVending } from './vending_model';
import { database } from '../../database/database';
import { IQueryResponse } from '../../interfaces/postgres_responses';

class VendingRepository {

    private table: string = 'vendings';

    public create = async(vending: IVending): Promise<IQueryResponse> => {

        return database.query(
            `insert into ${this.table}(name, machine_id) values('${vending.name}', '${vending.machine_id}') RETURNING *`
        ).then((value) => {
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

    public getVendingProducts = async(id: string): Promise<IQueryResponse> => {

        return database.query(
            `SELECT * FROM products WHERE machine_id = '${id}' AND status = true AND quantity > 0`
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

        return database.query(
            `SELECT * FROM ${this.table} WHERE id = '${id}' AND status = true`
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

    public update = async(id: string, vending: IVending): Promise<IQueryResponse> => {

        return database.query(
            `UPDATE ${this.table} SET(name, machine_id) = ('${vending.name}', '${vending.machine_id}') WHERE id = '${id}' AND status = true RETURNING *`
        ).then(async(value) => {
        
            if(value.rowCount === 0) return {
                ok: false,
                data: 'User not found'
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

        return database.query(`delete from ${this.table} WHERE id = '${id}'`)
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

export const vendingsRepository: VendingRepository = new VendingRepository;
