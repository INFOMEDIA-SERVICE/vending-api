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
exports.vendingsRepository = void 0;
const database_1 = require("../../database/database");
class VendingRepository {
    constructor() {
        this.create = (vending) => __awaiter(this, void 0, void 0, function* () {
            return database_1.database.query(`insert into vendings(name, machine_id) values('${vending.name}', '${vending.machine_id}')`)
                .then((value) => {
                console.log(value);
                return {
                    ok: true,
                    data: vending
                };
            })
                .catch((err) => {
                return {
                    ok: false,
                    data: err.message
                };
            });
        });
        this.getAll = () => __awaiter(this, void 0, void 0, function* () {
            return database_1.database.query('SELECT * FROM vendings')
                .then((value) => {
                return {
                    ok: true,
                    data: value.rows
                };
            })
                .catch((err) => {
                return {
                    ok: false,
                    data: err.message
                };
            });
        });
        this.getById = (id) => __awaiter(this, void 0, void 0, function* () {
            return database_1.database.query(`SELECT * FROM vendings WHERE id = ${id}`)
                .then((value) => {
                if (value.rowCount === 0)
                    return {
                        ok: false,
                        data: 'User not found'
                    };
                else
                    return {
                        ok: true,
                        data: value.rows[0]
                    };
            })
                .catch((err) => {
                return {
                    ok: false,
                    data: err.message
                };
            });
        });
        this.update = (id, vending) => __awaiter(this, void 0, void 0, function* () {
            return database_1.database.query(`UPDATE vendings SET(name, machine_id) = ('${vending.name}', '${vending.machine_id}') WHERE id = ${id}`)
                .then((value) => __awaiter(this, void 0, void 0, function* () {
                if (value.rowCount === 0)
                    return {
                        ok: false,
                        data: 'User not found'
                    };
                const user = yield this.getById(id);
                if (!user.ok)
                    return user;
                return {
                    ok: true,
                    data: user.data
                };
            }))
                .catch((err) => {
                return {
                    ok: false,
                    data: err.message
                };
            });
        });
        this.getCount = () => __awaiter(this, void 0, void 0, function* () {
            return database_1.database.query('SELECT * FROM vendings')
                .then((value) => {
                return {
                    ok: true,
                    data: value.rowCount
                };
            })
                .catch((err) => {
                return {
                    ok: false,
                    data: err.message
                };
            });
        });
        this.delete = (id) => __awaiter(this, void 0, void 0, function* () {
            return database_1.database.query(`delete from vendings WHERE id = ${id}`)
                .then((value) => {
                if (value.rowCount === 0)
                    return {
                        ok: false,
                        data: 'User not found'
                    };
                else
                    return {
                        ok: true,
                        data: value.rows[0]
                    };
            })
                .catch((err) => {
                return {
                    ok: false,
                    data: err.message
                };
            });
        });
    }
}
exports.vendingsRepository = new VendingRepository;
//# sourceMappingURL=vending_repository.js.map