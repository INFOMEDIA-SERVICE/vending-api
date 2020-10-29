import jwt from 'jsonwebtoken';
import jwt_decode from 'jwt-decode';
import { IUser } from '../modules/user/users_model';
import { NextFunction, Request, Response } from 'express';

class AuthController {

    public generateToken = (user: IUser) => {
        return jwt.sign({
            email: user.email,
            role: user.role,
            id: user.id
        }, process.env.TOKEN_KEY + '');
    }

    public validateUserToken = (req: Request, res: Response, next: NextFunction) => {

        const token: string = req.headers.authorization + '';

        return jwt.verify(token, process.env.TOKEN_KEY + '', (err) => {

            if(err) return res.status(401).json({
                ok: false,
                message: err.message
            });

            const user: IUser = jwt_decode(token);

            if(user.role !== 2) if(user.role !== 0) return res.status(401).json({
                ok: false,
                message: 'Rol inválido'
            });

            req.body.user = user;

            next();
    
            // return res.status(401).json({
            //     ok: true,
            //     user
            // });
    
        });
    }

    public validateAccess = (req: Request, res: Response, next: NextFunction) => {
        
        const token: string = req.headers.authorization + '';

        return jwt.verify(token, process.env.TOKEN_KEY + '', (err) => {
        
            if(err) return res.status(401).json({
                ok: false,
                message: err.message
            })

            const user: IUser = jwt_decode(token);

            req.body.user = user;

            next();

            // return {
            //     ok: true,
            //     user
            // };
    
        });
    }

    public validateClientToken = (req: Request, res: Response, next: NextFunction) => {
        
        const token: string = req.headers.authorization + '';

        return jwt.verify(token, process.env.TOKEN_KEY + '', (err) => {
        
            if(err) return res.status(401).json({
                ok: false,
                message: err.message
            })

            const user: IUser = jwt_decode(token);

            if(user.role !== 2) if(user.role !== 1) return res.status(401).json({
                ok: false,
                message: 'Rol inválido'
            });

            req.body.user = user;

            next();

            // return {
            //     ok: true,
            //     user
            // };
    
        });
    }

    public validateAdminToken = (req: Request, res: Response, next: NextFunction) => {

        const token: string = req.headers.authorization + '';

        return jwt.verify(token, process.env.TOKEN_KEY + '', (err) => {
        
            if(err) return res.status(401).json({
                ok: false,
                message: err.message
            });

            const user: IUser = jwt_decode(token);

            if(user.role !== 2) return res.status(401).json({
                ok: false,
                message: 'Rol inválido'
            });

            req.body.user = user;
            
            next();

            // return {
            //     ok: true,
            //     user
            // };
    
        });
    }
}

export const authController: AuthController = new AuthController;
