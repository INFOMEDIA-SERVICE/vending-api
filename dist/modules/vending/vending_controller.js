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
const vending_repository_1 = require("./vending_repository");
class VendingController {
    constructor() {
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const response = yield vending_repository_1.vendingsRepository.create(req.body);
            if (response.ok) {
                res.send({
                    ok: true,
                    vending: response.data
                });
            }
            else {
                res.status(400).json({
                    ok: false,
                    message: response.data
                });
            }
        });
        this.getVendingProducts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const response = yield vending_repository_1.vendingsRepository.getVendingProducts(req.params.id);
            if (response.ok) {
                res.send({
                    ok: true,
                    products: response.data
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
            const response = yield vending_repository_1.vendingsRepository.getAll();
            if (response.ok) {
                res.send({
                    ok: true,
                    vendings: response.data
                });
            }
            else {
                res.status(400).json({
                    ok: false,
                    message: response.data
                });
            }
        });
        this.getCount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const response = yield vending_repository_1.vendingsRepository.getAll();
            if (response.ok) {
                res.send({
                    ok: true,
                    count: response.data
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
            const response = yield vending_repository_1.vendingsRepository.getById(req.params.id);
            if (response.ok) {
                res.send({
                    ok: true,
                    vending: response.data
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
            const response = yield vending_repository_1.vendingsRepository.update(req.params.id, req.body);
            if (response.ok) {
                res.send({
                    ok: true,
                    vending: response.data
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
            const response = yield vending_repository_1.vendingsRepository.delete(req.params.id);
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
    }
}
exports.vendingsController = new VendingController;
//# sourceMappingURL=vending_controller.js.map