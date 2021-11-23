import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { IQueryResponse, IToken } from '../../interfaces/postgres_responses';
import { adminsRepository } from './repository';
import { IUser } from '../user/model';
import { authController } from '../../utils/auth_controller';

class AdminController {

    public signup = async (req: Request, res: Response): Promise<void> => {

        const { first_name, last_name, email, password }: IUser = req.body;

        if (!first_name || first_name.match(' ')) {

            res.send({
                ok: false,
                message: 'Invalid first_name'
            });

            return;
        }

        if (!last_name || last_name.match(' ')) {

            res.send({
                ok: false,
                message: 'Invalid last_name'
            });

            return;
        }

        const newPass: string = bcrypt.hashSync(password || '', 15);

        const response: IQueryResponse = await adminsRepository.signup({
            first_name,
            last_name,
            email,
            password: newPass
        });

        if (response.ok) {

            delete response.data.password;

            const token: IToken = authController.generateToken(response.data);

            res.send({
                ok: true,
                user: response.data,
                token
            });

        } else {

            res.status(400).json({
                ok: false,
                message: response.data
            });

        }
    }

    public login = async (req: Request, res: Response): Promise<void> => {

        const { email, password } = req.body;

        const response: IQueryResponse = await adminsRepository.login(email);

        if (response.ok) {

            let pass: boolean = await bcrypt.compare(password, response.data.password);

            if (!pass) {

                res.send({
                    ok: false,
                    message: 'Email or Password does\'not match'
                });

                return;
            }

            delete response.data.password;

            const token: IToken = authController.generateToken(response.data);

            res.send({
                ok: true,
                user: response.data,
                token
            });

        } else {

            res.status(400).json({
                ok: false,
                message: response.data
            });

        }
    }

    public getAll = async (req: Request, res: Response): Promise<void> => {

        const response: IQueryResponse = await adminsRepository.getAll();

        if (response.ok) {

            response.data.forEach((user: any) => {
                delete user.password;
                return user;
            });

            res.send({
                ok: true,
                admins: response.data
            });

        } else {

            res.status(400).json({
                ok: false,
                message: response.data
            });

        }

    };

    public getById = async (req: Request, res: Response): Promise<void> => {

        const response: IQueryResponse = await adminsRepository.getById(req.params.id);

        if (response.ok) {
            delete response.data.password;
            res.send({
                ok: true,
                user: response.data
            });
        } else {
            res.status(400).json({
                ok: false,
                message: response.data
            });
        }

    };

    public me = async (req: Request, res: Response): Promise<void> => {

        const user = req.body.user;

        const response: IQueryResponse = await adminsRepository.getById(user.id);

        if (response.ok) {
            delete response.data.password;
            res.send({
                ok: true,
                user: response.data
            });
        } else {
            res.status(400).json({
                ok: false,
                message: response.data
            });
        }

    };

    public update = async (req: Request, res: Response): Promise<void> => {

        const response: IQueryResponse = await adminsRepository.update(req.params.id, req.body);

        if (response.ok) {
            res.send({
                ok: true,
                user: response.data
            });
        } else {
            res.status(400).json({
                ok: false,
                message: response.data
            });
        }
    };

    public delete = async (req: Request, res: Response): Promise<void> => {

        const response: IQueryResponse = await adminsRepository.delete(req.params.id);

        if (response.ok) {
            res.send({
                ok: true,
                message: 'Admin deleted successfully'
            });
        } else {
            res.status(400).json({
                ok: false,
                message: response.data
            });
        }

    };
}

export const adminController = new AdminController;