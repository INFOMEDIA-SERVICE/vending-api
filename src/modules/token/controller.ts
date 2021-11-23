import { Request, Response } from 'express';
import { IToken } from '../../interfaces/postgres_responses';
import { tokensRepository } from './repository';

class TokenController {

    public create = async (req: Request, res: Response): Promise<void> => {

        const body = req.body;

        const response = await tokensRepository.create(body.token, body.refreshToken);

        if (response.ok) {
            res.send({
                ok: true,
                tokens: response.data
            });
        } else {
            res.status(400).json({
                ok: false,
                message: response.data
            });
        }

    };

    public refreshToken = async (req: Request, res: Response): Promise<void> => {

        const token: string = req.body;

        const response = await tokensRepository.getByToken(token);

        if (response.ok) {
            res.send({
                ok: true,
                tokens: response.data
            });
        } else {
            res.status(400).json({
                ok: false,
                message: response.data
            });
        }
    };
}

export const tokenController = new TokenController;