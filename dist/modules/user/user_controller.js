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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_repository_1 = require("./user_repository");
const auth_controller_1 = require("../../utils/auth_controller");
class UserController {
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
            const newPass = bcryptjs_1.default.hashSync(password || '', 10);
            const response = yield user_repository_1.usersRepository.signup({
                first_name,
                last_name,
                email,
                password: newPass
            });
            if (response.ok) {
                delete response.data.password;
                const token = auth_controller_1.authController.generateToken(response.data);
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
            const response = yield user_repository_1.usersRepository.login(email);
            if (response.ok) {
                let pass = yield bcryptjs_1.default.compare(password, response.data.password);
                if (!pass) {
                    res.status(400).json({
                        ok: false,
                        message: 'Email or Password does\'not match'
                    });
                    return;
                }
                delete response.data.password;
                const token = auth_controller_1.authController.generateToken(response.data);
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
        this.googleLogin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { token } = req.body;
            const response = yield user_repository_1.usersRepository.googleLogin(token);
            if (response.ok) {
                delete response.data.password;
                const jwtToken = auth_controller_1.authController.generateToken(response.data);
                res.send({
                    ok: true,
                    user: response.data,
                    token: jwtToken
                });
            }
            else {
                res.status(400).json({
                    ok: false,
                    message: response.data
                });
            }
        });
        this.googleSignup = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { token } = req.body;
            const response = yield user_repository_1.usersRepository.googleSignup(token);
            if (response.ok) {
                delete response.data.password;
                const jwtToken = auth_controller_1.authController.generateToken(response.data);
                res.send({
                    ok: true,
                    user: response.data,
                    token: jwtToken
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
            const response = yield user_repository_1.usersRepository.getAll();
            if (response.ok) {
                response.data.forEach((user) => {
                    delete user.password;
                    return user;
                });
                res.send({
                    ok: true,
                    users: response.data
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
            const response = yield user_repository_1.usersRepository.getById(user.id);
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
        this.getById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const response = yield user_repository_1.usersRepository.getById(req.params.id);
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
            const response = yield user_repository_1.usersRepository.update(req.params.id, req.body);
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
        this.updateStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const response = yield user_repository_1.usersRepository.updateStatus(req.params.id, req.body);
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
            const response = yield user_repository_1.usersRepository.delete(req.params.id);
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
exports.userController = new UserController;
//# sourceMappingURL=user_controller.js.map