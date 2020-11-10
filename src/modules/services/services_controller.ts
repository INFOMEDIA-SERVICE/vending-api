import { Request, Response } from 'express';
import { servicesRepository } from './services_repository';
import { IQueryResponse } from '../../interfaces/postgres_responses';

class ServiceController {

    public create = async(req: Request, res: Response): Promise<void> => {

        req.body.products = this.parseObjectToSqlArray(req.body.products);

        const response: IQueryResponse = await servicesRepository.create(req.body);

        if(response.ok) {

            response.data.products = this.parseListToObject(response.data.products);

            res.send({
                ok: true,
                service: response.data
            });

        } else {
            res.status(400).json({
                ok: false,
                message: response.data
            });
        }
    };

    public getServicesByUser = async(req: Request, res: Response): Promise<void> => {

        const response: IQueryResponse = await servicesRepository.getServicesByUser(req.params.id);

        if(response.ok) {
            res.send({
                ok: true,
                services: response.data
            });
        } else {
            res.status(400).json({
                ok: false,
                message: response.data
            });
        }

    };

    public getServicesByMachine = async(req: Request, res: Response): Promise<void> => {

        const response: IQueryResponse = await servicesRepository.getServicesByMachine(req.params.id);

        if(response.ok) {
            res.send({
                ok: true,
                services: response.data
            });
        } else {
            res.status(400).json({
                ok: false,
                message: response.data
            });
        }

    };

    public getAll = async(req: Request, res: Response): Promise<void> => {

        const response: IQueryResponse = await servicesRepository.getAll();

        if(response.ok) {
            res.send({
                ok: true,
                services: response.data
            });
        } else {
            res.status(400).json({
                ok: false,
                message: response.data
            });
        }

    };

    public getById = async(req: Request, res: Response): Promise<void> => {

        const response: IQueryResponse = await servicesRepository.getById(req.params.id);

        if(response.ok) {
            res.send({
                ok: true,
                service: response.data
            });
        } else {
            res.status(400).json({
                ok: false,
                message: response.data
            });
        }

    };

    public update = async(req: Request, res: Response): Promise<void> => {

        const response: IQueryResponse = await servicesRepository.update(req.params.id, req.body);

        if(response.ok) {
            res.send({
                ok: true,
                service: response.data
            });
        } else {
            res.status(400).json({
                ok: false,
                message: response.data
            });
        }
    };

    public delete = async(req: Request, res: Response): Promise<void> => {

        const response: IQueryResponse = await servicesRepository.delete(req.params.id);

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

    private parseObjectToSqlArray = (value: any[]) => {
        
        let products;

        for (let i = 0; i < value.length; i++) {
            
            if(i === 0) products = products ?? '' + '{';
            products = products + `{"id","${value[i].id}","dispensed",${value[i].dispensed}}`;
            if(i !== value.length-1) products = products + ',';
            if(i === value.length-1) products = products + '}';
            
        }

        return products
    }

    private parseListToObject = (value: any[]) => {
        
        let products: any[] = [];

        value.forEach((p: any) => {
            products.push({
                id: p[1],
                dispensed: Boolean(p[3])
            });
        });

        return products;

    }
}

export const servicesController: ServiceController = new ServiceController;
