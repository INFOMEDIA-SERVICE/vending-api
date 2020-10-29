import {Request, Response} from 'express';
import { productsRepository } from './products_repository';
import { IQueryResponse } from '../../interfaces/postgres_responses';

class ProductsController {

    public create = async(req: Request, res: Response):Promise<void> => {

        const response: IQueryResponse = await productsRepository.create(req.body);

        if(response.ok) {
            res.send({
                ok: true,
                product: response.data
            });
        } else {
            res.status(400).json({
                ok: false,
                message: response.data
            });
        }
    };

    public getAll = async(req: Request, res: Response):Promise<void> => {

        const response: IQueryResponse = await productsRepository.getAll();

        if(response.ok) {
            res.send({
                ok: true,
                products: response.data
            });
        } else {
            res.status(400).json({
                ok: false,
                message: response.data
            });
        }

    };

    public getById = async(req: Request, res: Response):Promise<void> => {

        const response: IQueryResponse = await productsRepository.getById(req.params.id);

        if(response.ok) {
            res.send({
                ok: true,
                product: response.data
            });
        } else {
            res.status(400).json({
                ok: false,
                message: response.data
            });
        }

    };

    public update = async(req: Request, res: Response):Promise<void> => {

        const response: IQueryResponse = await productsRepository.update(req.params.id, req.body);

        if(response.ok) {
            res.send({
                ok: true,
                product: response.data
            });
        } else {
            res.status(400).json({
                ok: false,
                message: response.data
            });
        }
    };

    public delete = async(req: Request, res: Response):Promise<void> => {

        const response: IQueryResponse = await productsRepository.delete(req.params.id);

        if(response.ok) {
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

export const productsController = new ProductsController;
