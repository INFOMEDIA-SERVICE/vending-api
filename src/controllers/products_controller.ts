import Product, { IProduct } from '../models/products_model';
import {Request, Response} from 'express';
import { Model } from 'sequelize';

class ProductsController {

    public create = async(req: Request, res: Response):Promise<void> => {
        
        const {name, price, image, item}: IProduct = req.body;

        const newProduct = await Product.create({
            name,
            price,
            image,
            item
        }, {
            fields: ['name', 'price', 'image', 'item']
        }).catch((err) => {
            res.status(400).json({
                ok: false,
                message: err.message
            });
        })

        if(newProduct) res.send({
            ok: true,
            product: newProduct
        });

    };

    public getAll = async(req: Request, res: Response):Promise<void> => {
        
        const products = await Product.findAll()
        .catch((err) => {
            res.status(400).json({
                ok: false,
                message: err.message
            });
        });

        if(products) res.send({
            ok: true,
            project: products
        });

    };

    public getCount = async(req: Request, res: Response):Promise<void> => {
        
        const products = await Product.findAll()
        .catch((err) => {
            res.status(400).json({
                ok: false,
                message: err.message
            });
        });

        if(products) res.send({
            ok: true,
            count: products.length
        });

    };

    public getById = async(req: Request, res: Response):Promise<void> => {

        const id: string = req.params.id;

        console.log(id);
        
        const product = await Product.findOne({where: {id}})
        .catch((err) => {
            res.status(400).json({
                ok: false,
                message: err.message
            });
        });

        console.log(product);

        if(product) res.send({
            ok: true,
            product
        });
        else res.status(400).json({
            ok: false,
            message: 'Product not found'
        });

    };

    public update = async(req: Request, res: Response):Promise<void> => {

        const id: string = req.params.id;

        const {name, price, image, item}: IProduct = req.body;
        
        const product = await Product.findOne({
            attributes: ['name', 'price', 'image', 'item'],
            where: {
                id
            }
        }).catch((err) => {
            res.status(400).json({
                ok: false,
                message: err.message
            });
        }) || null;

        if(product) {
            let update: any = {};

            if(name) update.name = name;
            if(price) update.price = price;
            if(image) update.image = image;
            if(item) update.name = item;

            const updatedProduct = await product.update(update);

            res.send({
                ok: true,
                product: updatedProduct
            });
        }
        else res.status(400).json({
            ok: false,
            message: 'Product not found'
        });
    };

    public delete = async(req: Request, res: Response):Promise<void> => {

        const id: string = req.params.id;
        
        const deleteRowCount = await Product.destroy({where: {id}})
        .catch((err) => {
            res.status(400).json({
                ok: false,
                message: err.message
            });
        });

        if(deleteRowCount) res.send({
            ok: true,
            message: 'Project deleted succesfully' 
        });
        else res.status(400).json({
            ok: false,
            message: 'Product not found'
        });

    };
}

export const productsController = new ProductsController;