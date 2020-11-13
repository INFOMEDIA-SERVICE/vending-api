import { IService } from './services_model';
import { database } from '../../database/database';
import { IQueryResponse } from '../../interfaces/postgres_responses';

class ServicesRepository {

    private table: string = 'services';

    public create = async(service: IService): Promise<IQueryResponse> => {

        return database.query(
            `insert into ${this.table}(user_id, machine_id, products, reference, value, success) values('${service.user_id}', '${service.machine_id}', '${service.products}', '${service.reference}', ${service.value}, ${service.success}) RETURNING *`
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

    public getAll = async(): Promise<IQueryResponse> => {

        return database.query(
            `SELECT * FROM ${this.table}`
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

    public getServicesByUser = async(user_id: string): Promise<IQueryResponse> => {

        return database.query(
            `SELECT * FROM ${this.table} WHERE user_id = '${user_id}'`
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

    public getServicesByMachine = async(machine_id: string): Promise<IQueryResponse> => {

        return database.query(
            `SELECT * FROM ${this.table} WHERE machine_id = '${machine_id}'`
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
            `SELECT * FROM ${this.table} WHERE id = '${id}'`
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

    public getByUserId = async(id: string): Promise<IQueryResponse> => {

        return database.query(
            `SELECT * FROM ${this.table} WHERE user_id = '${id}'`
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

    public update = async(id: string, service: IService): Promise<IQueryResponse> => {

        return database.query(
            `UPDATE ${this.table} SET(user_id, machine_id, success) = ('${service.user_id}', '${service.machine_id}', '${service.success}') WHERE id = '${id}' RETURNING *`
        ).then(async(value) => {
        
            if(value.rowCount === 0) return {
                ok: false,
                data: 'Service not found'
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

export const servicesRepository: ServicesRepository = new ServicesRepository;
