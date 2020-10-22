import jwt from 'jsonwebtoken';
import jwt_decode from 'jwt-decode';
import { IUser } from '../modules/user/users_model';

class AuthController {

    public generateToken = (user: IUser) => {
        return jwt.sign(user, process.env.USER_TOKEN_KEY + '');
    }

    public validateToken = (token: string) => {
        return jwt.verify(token, process.env.USER_TOKEN_KEY + '', (err) => {
        
            if(err) return {
                ok: false,
                message: err.message
            }
    
            return {
                ok: true,
                data: jwt_decode(token + '')
            };
    
        });
    }
}

export const authController: AuthController = new AuthController;
