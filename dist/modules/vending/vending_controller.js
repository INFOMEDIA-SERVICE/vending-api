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
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendingsController = void 0;
class VendingController {
    constructor() {
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
        });
        this.getAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
        });
        this.getCount = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
        });
        this.getById = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
        });
    }
}
exports.vendingsController = new VendingController;
//# sourceMappingURL=vending_controller.js.map