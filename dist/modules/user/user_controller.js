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
exports.userController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_repository_1 = require("./user_repository");
class UserController {
    constructor() {
        this.signup = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { username, email, password } = req.body;
            if (username.match(' ')) {
                res.send({
                    ok: false,
                    message: 'Invalid username'
                });
                return;
            }
            const newPass = bcryptjs_1.default.hashSync(password, 10);
            const response = yield user_repository_1.usersRepository.signup({
                username,
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
                res.send({
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
                    res.send({
                        ok: false,
                        message: 'Email or Password does\'not match'
                    });
                    return;
                }
                delete response.data.password;
                res.send({
                    ok: true,
                    user: response.data
                });
            }
            else {
                res.send({
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
                res.send({
                    ok: false,
                    message: response.data
                });
            }
        });
        this.getCount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const response = yield user_repository_1.usersRepository.getCount();
            if (response.ok) {
                res.send({
                    ok: true,
                    count: response.data
                });
            }
            else {
                res.send({
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
                res.send({
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
                res.send({
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
                res.send({
                    ok: false,
                    message: response.data
                });
            }
        });
    }
}
exports.userController = new UserController;
//# sourceMappingURL=user_controller.js.map