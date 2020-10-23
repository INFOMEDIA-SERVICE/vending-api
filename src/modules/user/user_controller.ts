import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { IQueryResponse } from '../../models/postgres_responses';
import {usersRepository} from './user_repository'
import { IUser } from './users_model';
import { authController } from '../../utils/auth_controller';

class UserController {

    public signup = async(req: Request, res: Response):Promise<void> => {

        const {first_name, last_name, email, password}: IUser = req.body;

        if(!first_name || first_name.match(' ')) {
            res.send({
                ok: false,
                message: 'Invalid first_name'
            });
            return;
        }

        if(!last_name || last_name.match(' ')) {
            res.send({
                ok: false,
                message: 'Invalid last_name'
            });
            return;
        }

        const newPass: string = bcrypt.hashSync(password, 10);

        const response:IQueryResponse = await usersRepository.signup({
            first_name,
            last_name,
            email,
            password: newPass
        });
        
        if(response.ok) {
            delete response.data.password;
            const token: string = authController.generateToken(response.data);
            res.send({
                ok: true,
                user: response.data,
                token
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

            const token: string = authController.generateToken(response.data);
            
            res.send({
                ok: true,
                user: response.data,
                token
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

        const response = await usersRepository.getById(req.params.id);

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

        const response:IQueryResponse = await usersRepository.update(req.params.id, req.body);

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

        const response:IQueryResponse = await usersRepository.delete(req.params.id);

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