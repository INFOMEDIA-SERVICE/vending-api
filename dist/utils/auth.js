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
        this.generateUserToken = (user) => {
            return jsonwebtoken_1.default.sign(user, process.env.USER_TOKEN_KEY + '');
        };
        this.validateUserToken = (token) => {
            return jsonwebtoken_1.default.verify(token, process.env.USER_TOKEN_KEY + '', (err) => {
                if (err)
                    return {
                        ok: false,
                        message: err.message
                    };
                const user = jwt_decode_1.default(token);
                if (user.role !== 0)
                    return {};
                return {
                    ok: true,
                };
            });
        };
        this.generateClientToken = (user) => {
            return jsonwebtoken_1.default.sign(user, process.env.USER_TOKEN_KEY + '');
        };
        this.validateClientToken = (token) => {
            return jsonwebtoken_1.default.verify(token, process.env.USER_TOKEN_KEY + '', (err) => {
                if (err)
                    return {
                        ok: false,
                        message: err.message
                    };
                const user = jwt_decode_1.default(token);
                if (user.role !== 0)
                    return {};
                return {
                    ok: true,
                };
            });
        };
    }
}
exports.authController = new AuthController;
//# sourceMappingURL=auth.js.map