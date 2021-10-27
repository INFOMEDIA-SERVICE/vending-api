import { IService } from './model';
import { database } from '../../database/database';
import { IProduct, IQueryResponse } from '../../interfaces/postgres_responses';

class ServicesRepository {

    private table: string = 'services';
    private products_table: string = 'dispensed_products';

    public create = async (service: IService): Promise<IQueryResponse> => {

        return database.query(
            `insert into ${this.table}(user_id, machine_id, reference, value, success) values('${service.user_id}', '${service.machine_id}', nextval('serial'), ${service.value}, ${service.success}) RETURNING *`
        ).then((value) => {

            return {
                ok: true,
                data: value.rows[0]
            }

        }).catch((err) => {
            return {
                ok: false,
                data: err.message
            }
        });
    }

    public insertProduct = async (product: IProduct): Promise<IQueryResponse> => {

        return database.query(
            `insert into ${this.products_table}(
                service_id,
                value,
                key,
                dispensed
            ) values(
                '${product.service_id}',
                '${product.value}',
                '${product.key}',
                ${product.dispensed}
            ) RETURNING *`
        ).then((value) => {

            return {
                ok: true,
                data: value.rows[0]
            }

        }).catch((err) => {
            return {
                ok: false,
                data: err.message
            }
        });
    }

    public getAll = async (): Promise<IQueryResponse> => {

        return database.query(
            `SELECT * FROM ${this.table} S
                INNER JOIN dispensed_products P ON P.service_id = S.id`
        ).then((value) => {

            if (value.rowCount === 0) return {
                ok: true,
                data: []
            }

            else return {
                ok: true,
                data: value.rows
            }
        }).catch((err) => {
            return {
                ok: false,
                data: err.message
            }
        });
    }

    public getServicesByUser = async (user_id: string): Promise<IQueryResponse> => {

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

    public getServicesByMachine = async (machine_id: string): Promise<IQueryResponse> => {

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

    public getById = async (id: string): Promise<IQueryResponse> => {

        return database.query(
            `SELECT * FROM ${this.table} WHERE id = '${id}'`
        ).then((value) => {
            if (value.rowCount === 0) return {
                ok: false,
                data: 'service not found'
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

    public getByUserId = async (id: string): Promise<IQueryResponse> => {

        return database.query(
            `SELECT * FROM ${this.table} WHERE user_id = '${id}'`
        ).then((value) => {

            if (value.rowCount === 0) return {
                ok: true,
                data: []
            }

            else return {
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

    public update = async (id: string, service: IService): Promise<IQueryResponse> => {

        return database.query(
            `UPDATE ${this.table} SET(user_id, machine_id, success) = ('${service.user_id}', '${service.machine_id}', '${service.success}') WHERE id = '${id}' RETURNING *`
        ).then(async (value) => {

            if (value.rowCount === 0) return {
                ok: false,
                data: 'service not found'
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

    public delete = async (id: string): Promise<IQueryResponse> => {

        return database.query(`delete from ${this.table} WHERE id = '${id}'`)
            .then((value) => {

                if (value.rowCount === 0) return {
                    ok: false,
                    data: 'service not found'
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
