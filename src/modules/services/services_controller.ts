import { Request, Response } from 'express';
import { servicesRepository } from './services_repository';
import { IQueryResponse } from '../../interfaces/postgres_responses';

class ServiceController {

    public create = async(req: Request, res: Response):Promise<void> => {

        const response: IQueryResponse = await servicesRepository.create(req.body);

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

    public getServicesByUser = async(req: Request, res: Response):Promise<void> => {

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

    public getServicesByMachine = async(req: Request, res: Response):Promise<void> => {

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

    public getAll = async(req: Request, res: Response):Promise<void> => {

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

    public getById = async(req: Request, res: Response):Promise<void> => {

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

    public update = async(req: Request, res: Response):Promise<void> => {

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

    public delete = async(req: Request, res: Response):Promise<void> => {

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
}

export const servicesController: ServiceController = new ServiceController;
