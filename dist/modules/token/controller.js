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
exports.tokenController = void 0;
const repository_1 = require("./repository");
class TokenController {
    constructor() {
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const response = yield repository_1.tokensRepository.create(body.token, body.refreshToken);
            if (response.ok) {
                res.send({
                    ok: true,
                    token: response.data,
                });
            }
            else {
                res.status(400).json({
                    ok: false,
                    message: response.data,
                });
            }
        });
        this.refreshToken = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const token = req.body.refresh_token;
            console.log(token);
            if (!token) {
                res.status(400).json({
                    message: "refresh token is missed",
                });
                return;
            }
            const response = yield repository_1.tokensRepository.getByToken(token);
            if (response.ok) {
                res.send({
                    ok: true,
                    token: response.data,
                });
            }
            else {
                res.status(400).json({
                    ok: false,
                    message: response.data,
                });
            }
        });
    }
}
exports.tokenController = new TokenController();
//# sourceMappingURL=controller.js.map