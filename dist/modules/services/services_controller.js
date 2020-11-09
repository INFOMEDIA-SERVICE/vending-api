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
const services_repository_1 = require("./services_repository");
class ServiceController {
    constructor() {
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const response = yield services_repository_1.servicesRepository.create(req.body);
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
        this.getServicesByUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const response = yield services_repository_1.servicesRepository.getServicesByUser(req.params.id);
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
            const response = yield services_repository_1.servicesRepository.getServicesByMachine(req.params.id);
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
            const response = yield services_repository_1.servicesRepository.getAll();
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
            const response = yield services_repository_1.servicesRepository.getById(req.params.id);
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
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const response = yield services_repository_1.servicesRepository.update(req.params.id, req.body);
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
            const response = yield services_repository_1.servicesRepository.delete(req.params.id);
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
exports.servicesController = new ServiceController;
//# sourceMappingURL=services_controller.js.map