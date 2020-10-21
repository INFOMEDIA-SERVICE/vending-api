import { Request, Response } from 'express';
// import User from '../../models/users_model';
import bcrypt from 'bcryptjs';

class UserController {

    public login = async(req: Request, res: Response):Promise<void> => {

        // const {email, password} = req.body;

        // const user = await User.findOne({
        //     where: {
        //         email
        //     }
        // }).catch((err: any) => {
        //     res.send({
        //         ok: false,
        //         message: err.message
        //     });
        // });

        // if(user) {
        //     // let pass = await bcrypt.compare(password, user.password);
        //     res.send({
        //         ok: true,
        //         user
        //     });
        // }
        // else res.send({
        //     ok: false,
        //     message: 'User not found'
        // })
    }
}

export const userController = new UserController;