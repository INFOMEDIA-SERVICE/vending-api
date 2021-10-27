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
exports.servicesController = void 0;
const repository_1 = require("./repository");
class ServiceController {
    constructor() {
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const service = req.body;
            const response = yield repository_1.servicesRepository.create(service);
            if (response.ok) {
                let products = service.products;
                let newService = response.data;
                newService.products = [];
                for (let product of products) {
                    product.service_id = response.data.id;
                    yield repository_1.servicesRepository.insertProduct(product);
                    newService.products.push(product);
                    console.log(newService.products);
                }
                res.send({
                    service: newService,
                });
            }
            else {
                res.send(400).json({
                    message: response.data
                });
            }
        });
        this.getServicesByUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const response = yield repository_1.servicesRepository.getServicesByUser(req.params.id);
            if (response.ok) {
                res.send({
                    ok: true,
                    services: response.data
                });
            }
            else {
                res.status(400).json({
                    ok: false,
                    message: response.data
                });
            }
        });
        this.getServicesByMachine = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const response = yield repository_1.servicesRepository.getServicesByMachine(req.params.id);
            if (response.ok) {
                res.send({
                    ok: true,
                    services: response.data
                });
            }
            else {
                res.status(400).json({
                    ok: false,
                    message: response.data
                });
            }
        });
        this.getAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const response = yield repository_1.servicesRepository.getAll();
            if (response.ok) {
                res.send({
                    ok: true,
                    services: response.data
                });
            }
            else {
                res.status(400).json({
                    ok: false,
                    message: response.data
                });
            }
        });
        this.getById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const response = yield repository_1.servicesRepository.getById(req.params.id);
            if (response.ok) {
                res.send({
                    ok: true,
                    service: response.data
                });
            }
            else {
                res.status(400).json({
                    ok: false,
                    message: response.data
                });
            }
        });
        this.me = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = req.body.user;
            console.log(user.id);
            const response = yield repository_1.servicesRepository.getByUserId(user.id);
            if (response.ok) {
                res.send({
                    ok: true,
                    services: response.data
                });
            }
            else {
                res.status(400).json({
                    ok: false,
                    message: response.data
                });
            }
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const response = yield repository_1.servicesRepository.update(req.params.id, req.body);
            if (response.ok) {
                res.send({
                    ok: true,
                    service: response.data
                });
            }
            else {
                res.status(400).json({
                    ok: false,
                    message: response.data
                });
            }
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const response = yield repository_1.servicesRepository.delete(req.params.id);
            if (response.ok) {
                res.send({
                    ok: true,
                    message: 'Product deleted successfully'
                });
            }
            else {
                res.status(400).json({
                    ok: false,
                    message: response.data
                });
            }
        });
        this.parseObjectToSqlArray = (value) => {
            let products;
            for (let i = 0; i < value.length; i++) {
                if (i === 0)
                    products = products !== null && products !== void 0 ? products : '' + '{';
                products = products + `{"id","${value[i].id}","dispensed",${value[i].dispensed},"price",${value[i].price}}`;
                if (i !== value.length - 1)
                    products = products + ',';
                if (i === value.length - 1)
                    products = products + '}';
            }
            return products;
        };
    }
}
exports.servicesController = new ServiceController;
//# sourceMappingURL=controller.js.map