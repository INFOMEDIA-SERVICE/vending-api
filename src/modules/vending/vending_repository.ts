import { IVending } from './vending_model';
import { database } from '../../database/database';
import { IQueryResponse } from '../../models/postgres_responses';

class VendingRepository {

    public create = async(vending: IVending): Promise<IQueryResponse> => {

        return database.query(
            `insert into vendings(name, machine_id) values('${vending.name}', '${vending.machine_id}')`
        )
        .then((value) => {
            console.log(value);
            return {
                ok: true,
                data: vending
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

        return database.query('SELECT * FROM vendings')
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

        return database.query(`SELECT * FROM vendings WHERE id = ${id}`)
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

    public update = async(id: number, vending: IVending): Promise<IQueryResponse> => {

        return database.query(`UPDATE vendings SET(name, machine_id) = ('${vending.name}', '${vending.machine_id}') WHERE id = ${id}`)

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

        return database.query('SELECT * FROM vendings')
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

        return database.query(`delete from vendings WHERE id = ${id}`)
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

export const vendingsRepository = new VendingRepository;
