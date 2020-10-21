import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { IQueryResponse } from '../../models/postgres_responses';
import {usersRepository} from './user_repository'
import { IUser } from './users_model';

class UserController {

    public signup = async(req: Request, res: Response):Promise<void> => {

        const {username, email, password}: IUser = req.body;

        if(username.match(' ')) {
            res.send({
                ok: false,
                message: 'Invalid username'
            });
            return;
        }

        const newPass = bcrypt.hashSync(password, 15);

        const response:IQueryResponse = await usersRepository.signup({
            username,
            email,
            password: newPass
        });
        
        if(response.ok) {
            delete response.data.password;
            res.send({
                ok: true,
                user: response.data
            });
        } else {
            res.send({
                ok: false,
                message: response.data
            });
        }
    }

    public login = async(req: Request, res: Response):Promise<void> => {

        const {email, password} = req.body;

        const response:IQueryResponse = await usersRepository.login(email);

        if(response.ok) {

            let pass = await bcrypt.compare(password, response.data.password);

            if(!pass) {
                res.send({
                    ok: false,
                    message: 'Email or Password does\'not match'
                });
                return;
            }

            delete response.data.password;
            
            res.send({
                ok: true,
                user: response.data
            });
        } else {
            res.send({
                ok: false,
                message: response.data
            });
        }
    }

    public getAll = async(req: Request, res: Response):Promise<void> => {

        const response = await usersRepository.getAll();

        if(response.ok) {
            response.data.forEach((user: any) => {
                delete user.password;
                return user;
            });
            res.send({
                ok: true,
                users: response.data
            });
        } else {
            res.send({
                ok: false,
                message: response.data
            });
        }

    };

    public getCount = async(req: Request, res: Response):Promise<void> => {
        
        const response = await usersRepository.getCount();

        if(response.ok) {
            res.send({
                ok: true,
                count: response.data
            });
        } else {
            res.send({
                ok: false,
                message: response.data
            });
        }

    };

    public getById = async(req: Request, res: Response):Promise<void> => {

        const response = await usersRepository.getById(parseInt(req.params.id));

        if(response.ok) {
            delete response.data.password;
            res.send({
                ok: true,
                user: response.data
            });
        } else {
            res.send({
                ok: false,
                message: response.data
            });
        }

    };

    public update = async(req: Request, res: Response):Promise<void> => {

        const response:IQueryResponse = await usersRepository.update(parseInt(req.params.id), req.body);

        if(response.ok) {
            res.send({
                ok: true,
                user: response.data
            });
        } else {
            res.send({
                ok: false,
                message: response.data
            });
        }
    };

    public delete = async(req: Request, res: Response):Promise<void> => {

        const response:IQueryResponse = await usersRepository.delete(parseInt(req.params.id));

        if(response.ok) {
            res.send({
                ok: true,
                message: 'User deleted successfully'
            });
        } else {
            res.send({
                ok: false,
                message: response.data
            });
        }

    };
}

export const userController = new UserController;