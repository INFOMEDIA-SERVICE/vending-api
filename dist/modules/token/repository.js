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
exports.tokensRepository = void 0;
const database_1 = require("../../database/database");
class TokensRepository {
    constructor() {
        this.table = "tokens";
        this.create = (token, refreshToken) => __awaiter(this, void 0, void 0, function* () {
            return database_1.database
                .query(`insert into ${this.table}(token, refresh_token) values('${token}', '${refreshToken}') RETURNING *`)
                .then((value) => {
                return {
                    ok: true,
                    data: value.rows[0],
                };
            })
                .catch((err) => {
                console.log(err);
                return {
                    ok: false,
                    data: err.message,
                };
            });
        });
        this.getByToken = (refreshToken) => __awaiter(this, void 0, void 0, function* () {
            return database_1.database
                .query(`SELECT * FROM ${this.table} WHERE refresh_token = '${refreshToken}'`)
                .then((value) => {
                console.log(value.rows.length);
                if (value.rows.length == 0) {
                    return {
                        ok: false,
                        data: "token not found",
                    };
                }
                return {
                    ok: true,
                    data: value.rows[0],
                };
            })
                .catch((err) => {
                console.log(err);
                return {
                    ok: false,
                    data: err.message,
                };
            });
        });
    }
}
exports.tokensRepository = new TokensRepository();
//# sourceMappingURL=repository.js.map