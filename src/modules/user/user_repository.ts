import { IUser } from './users_model';
import { database } from '../../database/database';
import { IQueryResponse } from '../../models/postgres_responses';

class UsersRepository {

    public signup = async(user: IUser): Promise<IQueryResponse> => {

        return database.query(
            `insert into users(username, email, password) values('${user.username}', '${user.email}', '${user.password}')`
        )
        .then((value) => {
            user.status = true;
            return {
                ok: true,
                data: user
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

        return database.query(`SELECT * FROM users WHERE email = '${email}'`)
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

        return database.query('SELECT * FROM users')
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

        return database.query(`SELECT * FROM users WHERE id = ${id}`)
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

    public update = async(id: number, user: IUser): Promise<IQueryResponse> => {

        return database.query(`UPDATE users SET(username, email) = ('${user.username}', '${user.email}') WHERE id = ${id}`)

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

        return database.query('SELECT * FROM users')
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

        return database.query(`delete from users WHERE id = ${id}`)
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
