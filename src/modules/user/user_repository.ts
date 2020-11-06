import { IUser } from './users_model';
import { database } from '../../database/database';
import { IQueryResponse } from '../../interfaces/postgres_responses';
import admin from 'firebase-admin';

class UsersRepository {

    private table: string = 'users';

    public signup = async(user: IUser): Promise<IQueryResponse> => {

        return database.query(
            `insert into ${this.table}(first_name, last_name, email, password, role) values('${user.first_name}', '${user.last_name}', '${user.email}', '${user.password}', 0) RETURNING *`
        )
        .then((value) => {
            return {
                ok: true,
                data: value.rows[0]
            }
        })
        .catch((err) => {
            console.log(err);
            return {
                ok: false,
                data: err.message
            }
        });
    }

    public login = async(email: string): Promise<IQueryResponse> => {

        return database.query(`SELECT * FROM ${this.table} WHERE email = '${email}' AND role = 0`)
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

    public googleLogin = async(token: string): Promise<IQueryResponse> => {

        return admin.auth().verifyIdToken(token).then( async(decodedToken) => {

            console.log(decodedToken.name);
            
            const response: IQueryResponse = await this.login(decodedToken.email || 'jyrdc');

            if(!response.ok) return {
                ok: false,
                data: 'User not found'
            };

            const user: IUser = response.data;

            return {
                ok: true,
                data: user
            };
            
        }).catch(function(error) {
            return {
                ok: false,
                data: error.message
            };
        });
    }

    public googleSignup = async(token: string): Promise<IQueryResponse> => {

        return admin.auth().verifyIdToken(token).then( async(decodedToken) => {

            const name: string = decodedToken.name + '';

            const cuttedName: string[] = name.split(' ');

            let first_name: string;
            let last_name: string;

            if(cuttedName.length == 2) {
                first_name = cuttedName[0];
                last_name = cuttedName[1];
            }
            else if(cuttedName.length == 3) {
                first_name = cuttedName[0];
                last_name = cuttedName[1] + cuttedName[2];
            }
            else {
                first_name = cuttedName[0];
                last_name = cuttedName[1];
            }
            
            const response: IQueryResponse = await this.signup({
                email: decodedToken.email || '',
                first_name,
                last_name,
            });

            if(!response.ok) return {
                ok: false,
                data: 'User already exists'
            };

            const user: IUser = response.data;

            return {
                ok: true,
                data: user
            };
            
        }).catch(function(error) {
            return {
                ok: false,
                data: error.message
            };
        });
    }
    
    public getAll = async(): Promise<IQueryResponse> => {

        return database.query(`SELECT * FROM ${this.table} AND role = 0`)
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

        return database.query(`SELECT * FROM ${this.table} WHERE id = '${id}' AND role = 0`)
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

    public delete = async(id: string): Promise<IQueryResponse> => {

        return database.query(`delete from ${this.table} WHERE id = '${id}' AND role = 0`)
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
