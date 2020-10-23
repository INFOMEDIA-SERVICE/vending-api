import jwt from 'jsonwebtoken';
import jwt_decode from 'jwt-decode';
import { IUser } from '../modules/user/users_model';

class AuthController {

    public generateToken = (user: IUser) => {
        return jwt.sign(user, process.env.USER_TOKEN_KEY + '');
    }

    public validateUserToken = (token: string) => {
        return jwt.verify(token, process.env.USER_TOKEN_KEY + '', (err) => {
        
            if(err) return {
                ok: false,
                message: err.message
            }

            const user:IUser = jwt_decode(token);

            if(user.role !== 0) return {
                ok: false,
                message: 'Rol inválido'
            };
    
            return {
                ok: true,
                user
            };
    
        });
    }

    public validateClientToken = (token: string) => {
        return jwt.verify(token, process.env.USER_TOKEN_KEY + '', (err) => {
        
            if(err) return {
                ok: false,
                message: err.message
            }

            const user:IUser = jwt_decode(token);

            if(user.role !== 1) return {
                ok: false,
                message: 'Rol inválido'
            };

            return {
                ok: true,
                user
            };
    
        });
    }
}

export const authController: AuthController = new AuthController;
