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
exports.clientController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const clients_repository_1 = require("./clients_repository");
class ClientsController {
    constructor() {
        this.signup = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { first_name, last_name, email, password } = req.body;
            if (!first_name || first_name.match(' ')) {
                res.status(400).json({
                    ok: false,
                    message: 'Invalid first_name'
                });
                return;
            }
            if (!last_name || last_name.match(' ')) {
                res.status(400).json({
                    ok: false,
                    message: 'Invalid last_name'
                });
                return;
            }
            const newPass = bcryptjs_1.default.hashSync(password, 15);
            const response = yield clients_repository_1.clientsRepository.signup({
                first_name,
                last_name,
                email,
                password: newPass
            });
            if (response.ok) {
                delete response.data.password;
                res.send({
                    ok: true,
                    user: response.data
                });
            }
            else {
                res.status(400).json({
                    ok: false,
                    message: response.data
                });
            }
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const response = yield clients_repository_1.clientsRepository.login(email);
            if (response.ok) {
                let pass = yield bcryptjs_1.default.compare(password, response.data.password);
                if (!pass) {
                    res.send({
                        ok: false,
                        message: 'Email or Password does\'not match'
                    });
                    return;
                }
                delete response.data.password;
                res.send({
                    ok: true,
                    client: response.data
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
            const response = yield clients_repository_1.clientsRepository.getAll();
            if (response.ok) {
                response.data.forEach((client) => {
                    delete client.password;
                    return client;
                });
                res.send({
                    ok: true,
                    clients: response.data
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
            const response = yield clients_repository_1.clientsRepository.getById(req.params.id);
            if (response.ok) {
                delete response.data.password;
                res.send({
                    ok: true,
                    client: response.data
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
            const response = yield clients_repository_1.clientsRepository.getById(user.id);
            if (response.ok) {
                delete response.data.password;
                res.send({
                    ok: true,
                    client: response.data
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
            const response = yield clients_repository_1.clientsRepository.update(req.params.id, req.body);
            if (response.ok) {
                res.send({
                    ok: true,
                    client: response.data
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
            const response = yield clients_repository_1.clientsRepository.delete(req.params.id);
            if (response.ok) {
                res.send({
                    ok: true,
                    message: 'User deleted successfully'
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
exports.clientController = new ClientsController;
//# sourceMappingURL=clients_controller.js.map