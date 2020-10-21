// import Vending from '../../models/vending_model';
import {Request, Response} from 'express';

class VendingController {

    public create = async(req: Request, res: Response):Promise<void> => {
        
        // const {name} = req.body;

        // const newVending = await Vending.create({
        //     name
        // }, {
        //     fields: ['name']
        // }).catch((err: any) => {
        //     res.status(400).json({
        //         ok: false,
        //         message: err.message
        //     });
        // })

        // if(newVending) res.send({
        //     ok: true,
        //     product: newVending
        // });

    };

    public getAll = async(req: Request, res: Response):Promise<void> => {
        
        // const vendings = await Vending.findAll()
        // .catch((err: any) => {
        //     res.status(400).json({
        //         ok: false,
        //         message: err.message
        //     });
        // });

        // if(vendings) res.send({
        //     ok: true,
        //     project: vendings
        // });

    };

    public getCount = async(req: Request, res: Response):Promise<void> => {
        
        // const vendings = await Vending.findAll()
        // .catch((err: any) => {
        //     res.status(400).json({
        //         ok: false,
        //         message: err.message
        //     });
        // });

        // if(vendings) res.send({
        //     ok: true,
        //     count: vendings.length
        // });

    };

    public getById = async(req: Request, res: Response):Promise<void> => {

        // const id: string = req.params.id;
        
        // const product = await Vending.findOne({where: {id}})
        // .catch((err: any) => {
        //     res.status(400).json({
        //         ok: false,
        //         message: err.message
        //     });
        // });

        // console.log(product);

        // if(product) res.send({
        //     ok: true,
        //     product
        // });
        // else res.status(400).json({
        //     ok: false,
        //     message: 'Vending not found'
        // });

    };

    public update = async(req: Request, res: Response):Promise<void> => {

        // const id: string = req.params.id;

        // const {name} = req.body;
        
        // const product = await Vending.findOne({
        //     attributes: ['name'],
        //     where: {
        //         id
        //     }
        // }).catch((err: any) => {
        //     res.status(400).json({
        //         ok: false,
        //         message: err.message
        //     });
        // }) || null;

        // if(product) {
        //     let update: any = {};

        //     if(name) update.name = name;

        //     const updatedVending = await product.update(update);

        //     res.send({
        //         ok: true,
        //         product: updatedVending
        //     });
        // }
        // else res.status(400).json({
        //     ok: false,
        //     message: 'Vending not found'
        // });
    };

    public delete = async(req: Request, res: Response):Promise<void> => {

        // const id: string = req.params.id;
        
        // const deleteRowCount = await Vending.destroy({where: {id}})
        // .catch((err: any) => {
        //     res.status(400).json({
        //         ok: false,
        //         message: err.message
        //     });
        // });

        // if(deleteRowCount) res.send({
        //     ok: true,
        //     message: 'Vending deleted succesfully' 
        // });
        // else res.status(400).json({
        //     ok: false,
        //     message: 'Vending not found'
        // });

    };
}

export const vendingsController = new VendingController;