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
exports.authController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_decode_1 = __importDefault(require("jwt-decode"));
class AuthController {
    constructor() {
        this.generateToken = (user) => __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.sign({
                email: user.email,
                role: user.role,
                id: user.id
            }, process.env.TOKEN_KEY + '', {
                expiresIn: process.env.TOKEN_DURATION
            });
            //const response = await axios.get(
            //`https://iot.infomediaservice.com/cws/jwt?u=${process.env.MQTT_USERNAME}&p=${process.env.MQTT_PASSWORD}&c=${process.env.MQTT_CLIENTID}`,
            //);
            // return response.data.jwt;
        });
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