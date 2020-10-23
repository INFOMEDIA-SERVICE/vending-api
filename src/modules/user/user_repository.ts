import { IUser } from './users_model';
import { database } from '../../database/database';
import { IQueryResponse } from '../../models/postgres_responses';

class UsersRepository {

    private table: string = 'users';

    public signup = async(user: IUser): Promise<IQueryResponse> => {

        return database.query(
            `insert into ${this.table}(first_name, last_name, email, password) values('${user.first_name}', '${user.last_name}', '${user.email}', '${user.password}') RETURNING *`
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

    public login = async(email: string): Promise<IQueryResponse> => {

        return database.query(`SELECT * FROM ${this.table} WHERE email = '${email}'`)
        .then((value) => {
            if(value.rowCount === 0) return {
                ok: false,
                data: 'Email or Password does\'not match'
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
    
    public getAll = async(): Promise<IQueryResponse> => {

        return database.query(`SELECT * FROM ${this.table}`)
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

    public update = async(id: string, user: IUser): Promise<IQueryResponse> => {

        return database.query(`UPDATE ${this.table} SET(first_name, last_name, email) = ('${user.first_name}', '${user.last_name}', '${user.email}') WHERE id = '${id}' RETURNING *`)

        .then(async(value) => {
        
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

    public getCount = async(): Promise<IQueryResponse> => {

        return database.query(`SELECT * FROM ${this.table}`)
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

export const usersRepository = new UsersRepository;
