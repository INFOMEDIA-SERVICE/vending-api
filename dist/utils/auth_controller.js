"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_decode_1 = __importDefault(require("jwt-decode"));
class AuthController {
    constructor() {
        this.generateToken = (user) => {
            return jsonwebtoken_1.default.sign({
                email: user.email,
                role: user.role,
                id: user.id
            }, process.env.TOKEN_KEY + '');
        };
        this.validateUserToken = (req, res, next) => {
            const token = req.headers.authorization + '';
            return jsonwebtoken_1.default.verify(token, process.env.TOKEN_KEY + '', (err) => {
                if (err)
                    return res.send({
                        ok: false,
                        message: err.message
                    });
                const user = jwt_decode_1.default(token);
                if (user.role !== 2)
                    if (user.role !== 0)
                        return res.send({
                            ok: false,
                            message: 'Rol inválido'
                        });
                req.body.user = user;
                next();
                // return res.send({
                //     ok: true,
                //     user
                // });
            });
        };
        this.validateAccess = (req, res, next) => {
            const token = req.headers.authorization + '';
            return jsonwebtoken_1.default.verify(token, process.env.TOKEN_KEY + '', (err) => {
                if (err)
                    return res.send({
                        ok: false,
                        message: err.message
                    });
                const user = jwt_decode_1.default(token);
                req.body.user = user;
                next();
                // return {
                //     ok: true,
                //     user
                // };
            });
        };
        this.validateClientToken = (req, res, next) => {
            const token = req.headers.authorization + '';
            return jsonwebtoken_1.default.verify(token, process.env.TOKEN_KEY + '', (err) => {
                if (err)
                    return res.send({
                        ok: false,
                        message: err.message
                    });
                const user = jwt_decode_1.default(token);
                if (user.role !== 2)
                    if (user.role !== 1)
                        return res.send({
                            ok: false,
                            message: 'Rol inválido'
                        });
                req.body.user = user;
                next();
                // return {
                //     ok: true,
                //     user
                // };
            });
        };
        this.validateAdminToken = (req, res, next) => {
            const token = req.headers.authorization + '';
            return jsonwebtoken_1.default.verify(token, process.env.TOKEN_KEY + '', (err) => {
                if (err)
                    return res.send({
                        ok: false,
                        message: err.message
                    });
                const user = jwt_decode_1.default(token);
                if (user.role !== 1)
                    return res.send({
                        ok: false,
                        message: 'Rol inválido'
                    });
                req.body.user = user;
                next();
                // return {
                //     ok: true,
                //     user
                // };
            });
        };
    }
}
exports.authController = new AuthController;
//# sourceMappingURL=auth_controller.js.map