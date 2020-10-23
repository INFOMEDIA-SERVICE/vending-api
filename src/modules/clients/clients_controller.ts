import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { IQueryResponse } from '../../models/postgres_responses';
import {clientsRepository} from './clients_repository'
import { IUser } from '../user/users_model';

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

        const newPass: string = bcrypt.hashSync(password, 15);

        const response: IQueryResponse = await clientsRepository.signup({
            first_name,
            last_name,
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

        const response:IQueryResponse = await clientsRepository.login(email);

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
                client: response.data
            });
        } else {
            res.send({
                ok: false,
                message: response.data
            });
        }
    }

    public getAll = async(req: Request, res: Response):Promise<void> => {

        const response = await clientsRepository.getAll();

        if(response.ok) {
            response.data.forEach((client: any) => {
                delete client.password;
                return client;
            });
            res.send({
                ok: true,
                clients: response.data
            });
        } else {
            res.send({
                ok: false,
                message: response.data
            });
        }

    };

    public getById = async(req: Request, res: Response):Promise<void> => {

        const response = await clientsRepository.getById(req.params.id);

        if(response.ok) {
            delete response.data.password;
            res.send({
                ok: true,
                client: response.data
            });
        } else {
            res.send({
                ok: false,
                message: response.data
            });
        }

    };

    public me = async(req: Request, res: Response):Promise<void> => {

        const user = req.body.user;

        console.log(user);

        const response = await clientsRepository.getById(user.id);

        if(response.ok) {
            delete response.data.password;
            res.send({
                ok: true,
                client: response.data
            });
        } else {
            res.send({
                ok: false,
                message: response.data
            });
        }

    };

    public update = async(req: Request, res: Response):Promise<void> => {

        const response:IQueryResponse = await clientsRepository.update(req.params.id, req.body);

        if(response.ok) {
            res.send({
                ok: true,
                client: response.data
            });
        } else {
            res.send({
                ok: false,
                message: response.data
            });
        }
    };

    public delete = async(req: Request, res: Response):Promise<void> => {

        const response:IQueryResponse = await clientsRepository.delete(req.params.id);

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

export const clientController = new UserController;