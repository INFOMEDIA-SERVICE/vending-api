"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthController {
    constructor() {
        this.generateUserToken = (user) => {
            return jsonwebtoken_1.default.sign(user, process.env.USER_TOKEN_KEY + '');
        };
        this.validateUserToken = (user) => {
            return jsonwebtoken_1.default.sign(user, process.env.USER_TOKEN_KEY + '');
        };
    }
}
exports.authController = new AuthController;
//# sourceMappingURL=auth.js.map