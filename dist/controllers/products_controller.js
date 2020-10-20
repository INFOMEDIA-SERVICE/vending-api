"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsController = void 0;
const products_model_1 = __importDefault(require("../models/products_model"));
class ProductsController {
    constructor() {
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { name, price, image, item } = req.body;
            const newProduct = yield products_model_1.default.create({
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
            });
            if (newProduct)
                res.send({
                    ok: true,
                    product: newProduct
                });
        });
        this.getAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const products = yield products_model_1.default.findAll()
                .catch((err) => {
                res.status(400).json({
                    ok: false,
                    message: err.message
                });
            });
            if (products)
                res.send({
                    ok: true,
                    project: products
                });
        });
        this.getCount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const products = yield products_model_1.default.findAll()
                .catch((err) => {
                res.status(400).json({
                    ok: false,
                    message: err.message
                });
            });
            if (products)
                res.send({
                    ok: true,
                    count: products.length
                });
        });
        this.getById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            console.log(id);
            const product = yield products_model_1.default.findOne({ where: { id } })
                .catch((err) => {
                res.status(400).json({
                    ok: false,
                    message: err.message
                });
            });
            console.log(product);
            if (product)
                res.send({
                    ok: true,
                    product
                });
            else
                res.status(400).json({
                    ok: false,
                    message: 'Product not found'
                });
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const { name, price, image, item } = req.body;
            const product = (yield products_model_1.default.findOne({
                attributes: ['name', 'price', 'image', 'item'],
                where: {
                    id
                }
            }).catch((err) => {
                res.status(400).json({
                    ok: false,
                    message: err.message
                });
            })) || null;
            if (product) {
                let update = {};
                if (name)
                    update.name = name;
                if (price)
                    update.price = price;
                if (image)
                    update.image = image;
                if (item)
                    update.name = item;
                const updatedProduct = yield product.update(update);
                res.send({
                    ok: true,
                    product: updatedProduct
                });
            }
            else
                res.status(400).json({
                    ok: false,
                    message: 'Product not found'
                });
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const deleteRowCount = yield products_model_1.default.destroy({ where: { id } })
                .catch((err) => {
                res.status(400).json({
                    ok: false,
                    message: err.message
                });
            });
            if (deleteRowCount)
                res.send({
                    ok: true,
                    message: 'Project deleted succesfully'
                });
            else
                res.status(400).json({
                    ok: false,
                    message: 'Product not found'
                });
        });
    }
}
exports.productsController = new ProductsController;
//# sourceMappingURL=products_controller.js.map