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
exports.adminsRepository = void 0;
const database_1 = require("../../database/database");
class AdminsRepository {
    constructor() {
        this.table = 'users';
        this.signup = (user) => __awaiter(this, void 0, void 0, function* () {
            return database_1.database.query(`insert into ${this.table}(first_name, last_name, email, password, role) values('${user.first_name}', '${user.last_name}', '${user.email}', '${user.password}', 2) RETURNING *`)
                .then((value) => {
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
        this.login = (email) => __awaiter(this, void 0, void 0, function* () {
            return database_1.database.query(`SELECT * FROM ${this.table} WHERE email = '${email}' AND role = 2`)
                .then((value) => {
                if (value.rowCount === 0)
                    return {
                        ok: false,
                        data: 'Email or Password does\'not match'
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
        this.getAll = () => __awaiter(this, void 0, void 0, function* () {
            return database_1.database.query(`SELECT * FROM ${this.table} WHERE role = 2`)
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
            return database_1.database.query(`SELECT * FROM ${this.table} WHERE id = '${id}' AND role = 2`)
                .then((value) => {
                if (value.rowCount === 0)
                    return {
                        ok: false,
                        data: 'Client not found'
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
        this.update = (id, user) => __awaiter(this, void 0, void 0, function* () {
            return database_1.database.query(`UPDATE ${this.table} SET(first_name, last_name, email) = ('${user.first_name}', '${user.last_name}', '${user.email}') WHERE id = '${id}' AND role = 2 RETURNING *`)
                .then((value) => __awaiter(this, void 0, void 0, function* () {
                if (value.rowCount === 0)
                    return {
                        ok: false,
                        data: 'Client not found'
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
            return database_1.database.query(`SELECT * FROM ${this.table}`)
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
            return database_1.database.query(`delete from ${this.table} WHERE id = '${id}' AND role = 2`)
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
exports.adminsRepository = new AdminsRepository;
//# sourceMappingURL=admin_repository.js.map