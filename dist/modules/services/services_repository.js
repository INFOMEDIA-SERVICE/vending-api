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
const database_1 = require("../../database/database");
class ServicesRepository {
    constructor() {
        this.table = 'services';
        this.create = (service) => __awaiter(this, void 0, void 0, function* () {
            return database_1.database.query(`insert into ${this.table}(user_id, machine_id, products, value, success) values('${service.user_id}', '${service.machine_id}', '${service.products}', ${service.value}, ${service.success}) RETURNING *`).then((value) => {
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
            return database_1.database.query(`SELECT * FROM ${this.table}`).then((value) => {
                if (value.rowCount === 0)
                    return {
                        ok: true,
                        data: []
                    };
                else
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
        this.getServicesByUser = (user_id) => __awaiter(this, void 0, void 0, function* () {
            return database_1.database.query(`SELECT * FROM ${this.table} WHERE user_id = '${user_id}'`).then((value) => {
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
        this.getServicesByMachine = (machine_id) => __awaiter(this, void 0, void 0, function* () {
            return database_1.database.query(`SELECT * FROM ${this.table} WHERE machine_id = '${machine_id}'`).then((value) => {
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
            return database_1.database.query(`SELECT * FROM ${this.table} WHERE id = '${id}'`).then((value) => {
                if (value.rowCount === 0)
                    return {
                        ok: false,
                        data: 'Service not found'
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
        this.getByUserId = (id) => __awaiter(this, void 0, void 0, function* () {
            return database_1.database.query(`SELECT * FROM ${this.table} WHERE user_id = '${id}'`).then((value) => {
                if (value.rowCount === 0)
                    return {
                        ok: true,
                        data: []
                    };
                else
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
        this.update = (id, service) => __awaiter(this, void 0, void 0, function* () {
            return database_1.database.query(`UPDATE ${this.table} SET(user_id, machine_id, success) = ('${service.user_id}', '${service.machine_id}', '${service.success}') WHERE id = '${id}' RETURNING *`).then((value) => __awaiter(this, void 0, void 0, function* () {
                if (value.rowCount === 0)
                    return {
                        ok: false,
                        data: 'Service not found'
                    };
                return {
                    ok: true,
                    data: value.rows[0]
                };
            }))
                .catch((err) => {
                return {
                    ok: false,
                    data: err.message
                };
            });
        });
        this.delete = (id) => __awaiter(this, void 0, void 0, function* () {
            return database_1.database.query(`delete from ${this.table} WHERE id = '${id}'`)
                .then((value) => {
                if (value.rowCount === 0)
                    return {
                        ok: false,
                        data: 'Service not found'
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
exports.servicesRepository = new ServicesRepository;
//# sourceMappingURL=services_repository.js.map