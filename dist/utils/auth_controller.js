"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const rand_token_1 = __importDefault(require("rand-token"));
const jwt_decode_1 = __importDefault(require("jwt-decode"));
class AuthController {
    constructor() {
        this.generateToken = (user) => {
            var _a;
            const token = jsonwebtoken_1.default.sign({
                email: user.email,
                role: user.role,
                id: user.id
            }, process.env.TOKEN_KEY + '', {
                expiresIn: process.env.TOKEN_DURATION
            });
            const date = moment_1.default();
            const hours = +((_a = process.env.TOKEN_DURATION) === null || _a === void 0 ? void 0 : _a.replace('h', ''));
            const expireAt = moment_1.default(date).add(hours, 'h').toDate();
            const refreshToken = rand_token_1.default.uid(256);
            return {
                expireAt,
                refreshToken,
                token,
            };
        };
        this.decodeToken = (token) => {
            return jwt_decode_1.default(token || '');
        };
        this.validateUserToken = (req, res, next) => {
            // next();
            const token = req.headers.authorization + '';
            return jsonwebtoken_1.default.verify(token, process.env.TOKEN_KEY + '', (err) => {
                if (err)
                    return res.status(401).json({
                        ok: false,
                        message: err.message
                    });
                const user = jwt_decode_1.default(token);
                if (user.role !== 2)
                    if (user.role !== 0)
                        return res.status(401).json({
                            ok: false,
                            message: 'insufficient privileges'
                        });
                req.body.user = user;
                next();
            });
        };
        this.validateAccess = (req, res, next) => {
            // next();
            const token = req.headers.authorization + '';
            return jsonwebtoken_1.default.verify(token, process.env.TOKEN_KEY + '', (err) => {
                if (err)
                    return res.status(401).json({
                        ok: false,
                        message: err.message
                    });
                const user = jwt_decode_1.default(token);
                req.body.user = user;
                next();
            });
        };
        this.validateAdminToken = (req, res, next) => {
            // next();
            const token = req.headers.authorization + '';
            return jsonwebtoken_1.default.verify(token, process.env.TOKEN_KEY + '', (err) => {
                if (err)
                    return res.status(401).json({
                        ok: false,
                        message: err.message
                    });
                const user = jwt_decode_1.default(token);
                if (user.role !== 2)
                    return res.status(401).json({
                        ok: false,
                        message: 'insufficient privileges'
                    });
                req.body.user = user;
                next();
            });
        };
        this.validateSocketAccess = (token) => {
            return jsonwebtoken_1.default.verify(token || '', process.env.TOKEN_KEY + '', (err) => {
                if (err)
                    return {
                        ok: false,
                        message: err.message
                    };
                const user = jwt_decode_1.default(token || '');
                return {
                    ok: true,
                    user
                };
            });
        };
    }
}
exports.authController = new AuthController;
//# sourceMappingURL=auth_controller.js.map