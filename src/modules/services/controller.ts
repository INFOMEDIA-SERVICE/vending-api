import { Request, Response } from 'express';
import { servicesRepository } from './repository';
import { IQueryResponse } from '../../interfaces/postgres_responses';
import { IService } from './model';

class ServiceController {

    public create = async (service: IService) => {

        service.products = this.parseObjectToSqlArray(service.products) + '';

        const response: IQueryResponse = await servicesRepository.create(service);

        if (response.ok) {

            response.data.products = this.parseListToObject(response.data.products);

            return {
                ok: true,
                service: response.data
            };

        } else {
            return {
                ok: false,
                message: response.data
            };
        }
    };

    public getServicesByUser = async (req: Request, res: Response): Promise<void> => {

        const response: IQueryResponse = await servicesRepository.getServicesByUser(req.params.id);

        if (response.ok) {

            response.data.forEach((s: any) => {

                s.products = this.parseListToObject(s.products);

                return s;
            });

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

    public getServicesByMachine = async (req: Request, res: Response): Promise<void> => {

        const response: IQueryResponse = await servicesRepository.getServicesByMachine(req.params.id);

        if (response.ok) {

            response.data.forEach((s: any) => {

                s.products = this.parseListToObject(s.products);

                return s;
            });

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

    public getAll = async (req: Request, res: Response): Promise<void> => {

        const response: IQueryResponse = await servicesRepository.getAll();

        if (response.ok) {

            response.data.forEach((s: any) => {

                s.products = this.parseListToObject(s.products);

                return s;
            });

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

    public getById = async (req: Request, res: Response): Promise<void> => {

        const response: IQueryResponse = await servicesRepository.getById(req.params.id);

        if (response.ok) {

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

    public me = async (req: Request, res: Response): Promise<void> => {

        const user = req.body.user;

        console.log(user.id);

        const response: IQueryResponse = await servicesRepository.getByUserId(user.id);

        if (response.ok) {

            response.data.forEach((s: any) => {

                s.products = this.parseListToObject(s.products);

                return s;
            });

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

    public update = async (req: Request, res: Response): Promise<void> => {

        const response: IQueryResponse = await servicesRepository.update(req.params.id, req.body);

        if (response.ok) {

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

    public delete = async (req: Request, res: Response): Promise<void> => {

        const response: IQueryResponse = await servicesRepository.delete(req.params.id);

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

    private parseObjectToSqlArray = (value: any[] | string) => {

        let products;

        for (let i = 0; i < value.length; i++) {

            if (i === 0) products = products ?? '' + '{';
            products = products + `{"id","${value[i].id}","dispensed",${value[i].dispensed},"price",${value[i].price}}`;
            if (i !== value.length - 1) products = products + ',';
            if (i === value.length - 1) products = products + '}';

        }

        return products
    }

    private parseListToObject = (value: any[]) => {

        let products: any[] = [];

        value.forEach((p: any) => {
            products.push({
                id: p[1],
                dispensed: Boolean(p[3]),
                price: p[5]
            });
        });

        return products;

    }
}

export const servicesController: ServiceController = new ServiceController;
