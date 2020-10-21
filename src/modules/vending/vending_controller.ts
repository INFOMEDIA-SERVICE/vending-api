// import Vending from '../../models/vending_model';
import {Request, Response} from 'express';
import {vendingsRepository} from './vending_repository';
import { IQueryResponse } from '../../models/postgres_responses';

class VendingController {

    public create = async(req: Request, res: Response):Promise<void> => {

        const response:IQueryResponse = await vendingsRepository.create(req.body);

        if(response.ok) {
            res.send({
                ok: true,
                product: response.data
            });
        } else {
            res.send({
                ok: false,
                message: response.data
            });
        }
    };

    public getAll = async(req: Request, res: Response):Promise<void> => {

        const response = await vendingsRepository.getAll();

        if(response.ok) {
            res.send({
                ok: true,
                vendings: response.data
            });
        } else {
            res.send({
                ok: false,
                message: response.data
            });
        }

    };

    public getCount = async(req: Request, res: Response):Promise<void> => {
        
        const response = await vendingsRepository.getAll();

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

        const response = await vendingsRepository.getById(parseInt(req.params.id));

        if(response.ok) {
            res.send({
                ok: true,
                product: response.data
            });
        } else {
            res.send({
                ok: false,
                message: response.data
            });
        }

    };

    public update = async(req: Request, res: Response):Promise<void> => {

        const response:IQueryResponse = await vendingsRepository.update(parseInt(req.params.id), req.body);

        if(response.ok) {
            res.send({
                ok: true,
                product: response.data
            });
        } else {
            res.send({
                ok: false,
                message: response.data
            });
        }
    };

    public delete = async(req: Request, res: Response):Promise<void> => {

        const response:IQueryResponse = await vendingsRepository.delete(parseInt(req.params.id));

        if(response.ok) {
            res.send({
                ok: true,
                message: 'Product deleted successfully'
            });
        } else {
            res.send({
                ok: false,
                message: response.data
            });
        }

    };
}

export const vendingsController = new VendingController;