import {Request, Response} from 'express';
import { productsRepository } from './products_repository';
import { IQueryResponse } from '../../models/postgres_responses';

class ProductsController {

    public create = async(req: Request, res: Response):Promise<void> => {

        const response:IQueryResponse = await productsRepository.create(req.body);

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

        const response = await productsRepository.getAll();

        if(response.ok) {
            res.send({
                ok: true,
                products: response.data
            });
        } else {
            res.send({
                ok: false,
                message: response.data
            });
        }

    };

    public getCount = async(req: Request, res: Response):Promise<void> => {
        
        const response = await productsRepository.getCount();

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

        const response = await productsRepository.getById(parseInt(req.params.id));

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

        const response:IQueryResponse = await productsRepository.update(parseInt(req.params.id), req.body);

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

        const response:IQueryResponse = await productsRepository.delete(parseInt(req.params.id));

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

export const productsController = new ProductsController;
