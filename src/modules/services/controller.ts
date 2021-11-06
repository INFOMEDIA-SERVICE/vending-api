import { Request, Response } from 'express';
import { servicesRepository } from './repository';
import { IProduct, IQueryResponse } from '../../interfaces/postgres_responses';
import { IService } from './model';
import { IUser } from '../../modules/user/model';

class ServiceController {

    public create = async (req: Request, res: Response) => {

        const service: IService = req.body;

        const response = await this.createNoRequest(service);

        if (response.ok) {
            res.send({
                service: response.data,
            });
        } else {
            res.send(400).json({
                message: response.data
            });
        }
    };

    public createNoRequest = async (service: IService): Promise<IQueryResponse> => {
        const response: IQueryResponse = await servicesRepository.create(service);

        console.log(`SERVICE ${JSON.stringify(response.data)}`);

        if (response.ok) {

            let products: IProduct[] = service.products;
            let newService: IService = response.data;

            newService.products = [];

            for (let product of products) {
                product.service_id = response.data.id;
                await servicesRepository.insertProduct(product);
                newService.products.push(product);
            }

            return {
                ok: true,
                data: {
                    service: newService,
                }
            }
        } else {
            return {
                ok: false,
                data: {
                    message: response.data,
                },
            };
        }
    };

    public getServicesByUser = async (req: Request, res: Response): Promise<void> => {

        const response: IQueryResponse = await servicesRepository.getServicesByUser(req.params.id);

        if (response.ok) {

            const services: IService[] = response.data;

            for (const service of services) {
                service.id = (service as any).service_id;
                delete (service as any).service_id;
            }

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

            const services: IService[] = response.data;

            for (const service of services) {
                service.id = (service as any).service_id;
                delete (service as any).service_id;
            }

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

            const services: IService[] = response.data;

            for (const service of services) {
                service.id = (service as any).service_id;
                delete (service as any).service_id;
            }

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

        const user: IUser | null = req.body.user;

        const response: IQueryResponse = await servicesRepository.getByUserId(user?.id ?? '');

        if (response.ok) {

            const services: IService[] = response.data;

            for (const service of services) {
                service.id = (service as any).service_id;
                delete (service as any).service_id;
            }

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
}

export const servicesController: ServiceController = new ServiceController;

