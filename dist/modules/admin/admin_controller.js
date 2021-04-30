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
exports.adminController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const admin_repository_1 = require("./admin_repository");
const auth_controller_1 = require("../../utils/auth_controller");
class AdminController {
    constructor() {
        this.signup = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { first_name, last_name, email, password } = req.body;
            if (!first_name || first_name.match(' ')) {
                res.send({
                    ok: false,
                    message: 'Invalid first_name'
                });
                return;
            }
            if (!last_name || last_name.match(' ')) {
                res.send({
                    ok: false,
                    message: 'Invalid last_name'
                });
                return;
            }
            const newPass = bcryptjs_1.default.hashSync(password || '', 15);
            const response = yield admin_repository_1.adminsRepository.signup({
                first_name,
                last_name,
                email,
                password: newPass
            });
            if (response.ok) {
                delete response.data.password;
                const token = yield auth_controller_1.authController.generateToken(response.data);
                res.send({
                    ok: true,
                    user: response.data,
                    token
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
            const response = yield admin_repository_1.adminsRepository.login(email);
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
                const token = yield auth_controller_1.authController.generateToken(response.data);
                res.send({
                    ok: true,
                    user: response.data,
                    token
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
            const response = yield admin_repository_1.adminsRepository.getAll();
            if (response.ok) {
                response.data.forEach((user) => {
                    delete user.password;
                    return user;
                });
                res.send({
                    ok: true,
                    admins: response.data
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
            const response = yield admin_repository_1.adminsRepository.getById(req.params.id);
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
        this.me = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = req.body.user;
            const response = yield admin_repository_1.adminsRepository.getById(user.id);
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
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const response = yield admin_repository_1.adminsRepository.update(req.params.id, req.body);
            if (response.ok) {
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
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const response = yield admin_repository_1.adminsRepository.delete(req.params.id);
            if (response.ok) {
                res.send({
                    ok: true,
                    message: 'Admin deleted successfully'
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
exports.adminController = new AdminController;
//# sourceMappingURL=admin_controller.js.map