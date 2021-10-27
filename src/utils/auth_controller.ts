import jwt from 'jsonwebtoken';
import jwt_decode from 'jwt-decode';
import { IUser } from '../modules/user/model';
import { NextFunction, Request, Response } from 'express';
import axios from 'axios';

class AuthController {

    public generateToken = async (user: IUser) => {
        return jwt.sign({
            email: user.email,
            role: user.role,
            id: user.id
        },
            process.env.TOKEN_KEY + '',
            {
                expiresIn: process.env.TOKEN_DURATION
            }
        );

        //const response = await axios.get(
        //`https://iot.infomediaservice.com/cws/jwt?u=${process.env.MQTT_USERNAME}&p=${process.env.MQTT_PASSWORD}&c=${process.env.MQTT_CLIENTID}`,
        //);

        // return response.data.jwt;
    }

    public validateUserToken = (req: Request, res: Response, next: NextFunction) => {

        next();

        // const token: string = req.headers.authorization + '';

        // return jwt.verify(token, process.env.TOKEN_KEY + '', (err) => {

        //     if (err) return res.status(401).json({
        //         ok: false,
        //         message: err.message
        //     });

        //     const user: IUser = jwt_decode(token);

        //     if (user.role !== 2) if (user.role !== 0) return res.status(401).json({
        //         ok: false,
        //         message: 'insufficient privileges'
        //     });

        //     req.body.user = user;

        //     next();
        // });
    }

    public validateAccess = (req: Request, res: Response, next: NextFunction) => {

        next();

        // const token: string = req.headers.authorization + '';

        // return jwt.verify(token, process.env.TOKEN_KEY + '', (err) => {

        //     if (err) return res.status(401).json({
        //         ok: false,
        //         message: err.message
        //     })

        //     const user: IUser = jwt_decode(token);

        //     req.body.user = user;

        //     next();
        // });
    }

    public validateClientToken = (req: Request, res: Response, next: NextFunction) => {

        next();

        // const token: string = req.headers.authorization + '';

        // return jwt.verify(token, process.env.TOKEN_KEY + '', (err) => {

        //     if (err) return res.status(401).json({
        //         ok: false,
        //         message: err.message
        //     })

        //     const user: IUser = jwt_decode(token);

        //     if (user.role !== 2) if (user.role !== 1) return res.status(401).json({
        //         ok: false,
        //         message: 'insufficient privileges'
        //     });

        //     req.body.user = user;

        //     next();
        // });
    }

    public validateAdminToken = (req: Request, res: Response, next: NextFunction) => {

        next();

        // const token: string = req.headers.authorization + '';

        // return jwt.verify(token, process.env.TOKEN_KEY + '', (err) => {

        //     if (err) return res.status(401).json({
        //         ok: false,
        //         message: err.message
        //     });

        //     const user: IUser = jwt_decode(token);

        //     if (user.role !== 2) return res.status(401).json({
        //         ok: false,
        //         message: 'insufficient privileges'
        //     });

        //     req.body.user = user;

        //     next();
        // });
    }

    public validateSocketAccess = (token: string | undefined) => {

        return jwt.verify(token || '', process.env.TOKEN_KEY + '', (err) => {

            if (err) return {
                ok: false,
                message: err.message
            };

            const user: IUser = jwt_decode(token || '');

            return {
                ok: true,
                user
            };
        });
    }
}

export const authController: AuthController = new AuthController;
