import { Request, Response } from 'express';
import { vendingsRepository } from './repository';
import { IQueryResponse } from '../../interfaces/postgres_responses';

class VendingController {

    public getAll = async (req: Request, res: Response): Promise<void> => {

        const response = await vendingsRepository.getAll();

        if (response.ok) {
            res.send({
                ok: true,
                vendings: response.data
            });
        } else {
            res.status(400).json({
                ok: false,
                message: response.data
            });
        }

    };

    public getCount = async (req: Request, res: Response): Promise<void> => {

        const response = await vendingsRepository.getAll();

        if (response.ok) {
            res.send({
                ok: true,
                count: response.data
            });
        } else {
            res.status(400).json({
                ok: false,
                message: response.data
            });
        }

    };

    public getById = async (req: Request, res: Response): Promise<void> => {

        const response = await vendingsRepository.getById(req.params.id);

        if (response.ok) {
            res.send({
                ok: true,
                vending: response.data
            });
        } else {
            res.status(400).json({
                ok: false,
                message: response.data
            });
        }

    };

    public update = async (req: Request, res: Response): Promise<void> => {

        const response: IQueryResponse = await vendingsRepository.update(req.params.id, req.body);

        if (response.ok) {
            res.send({
                ok: true,
                vending: response.data
            });
        } else {
            res.status(400).json({
                ok: false,
                message: response.data
            });
        }
    };

    public delete = async (req: Request, res: Response): Promise<void> => {

        const response: IQueryResponse = await vendingsRepository.delete(req.params.id);

        if (response.ok) {
            res.send({
                ok: true,
                message: 'Product deleted successfully'
            });
        } else {
            res.status(400).json({
                ok: false,
                message: response.data
            });
        }

    };
}

export const vendingsController = new VendingController;