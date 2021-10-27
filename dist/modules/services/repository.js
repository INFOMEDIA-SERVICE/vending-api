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
exports.servicesRepository = void 0;
const database_1 = require("../../database/database");
class ServicesRepository {
    constructor() {
        this.table = 'services';
        this.products_table = 'dispensed_products';
        this.create = (service) => __awaiter(this, void 0, void 0, function* () {
            return database_1.database.query(`insert into ${this.table}(user_id, machine_id, reference, value, success) values('${service.user_id}', '${service.machine_id}', nextval('serial'), ${service.value}, ${service.success}) RETURNING *`).then((value) => {
                return {
                    ok: true,
                    data: value.rows[0]
                };
            }).catch((err) => {
                return {
                    ok: false,
                    data: err.message
                };
            });
        });
        this.insertProduct = (product) => __awaiter(this, void 0, void 0, function* () {
            return database_1.database.query(`insert into ${this.products_table}(
                service_id,
                value,
                key,
                dispensed
            ) values(
                '${product.service_id}',
                '${product.value}',
                '${product.key}',
                ${product.dispensed}
            ) RETURNING *`).then((value) => {
                return {
                    ok: true,
                    data: value.rows[0]
                };
            }).catch((err) => {
                return {
                    ok: false,
                    data: err.message
                };
            });
        });
        this.getAll = () => __awaiter(this, void 0, void 0, function* () {
            return database_1.database.query(`SELECT * FROM ${this.table} S
                INNER JOIN dispensed_products P ON P.service_id = S.id`).then((value) => {
                if (value.rowCount === 0)
                    return {
                        ok: true,
                        data: []
                    };
                return {
                    ok: true,
                    data: value.rows
                };
            }).catch((err) => {
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
            }).catch((err) => {
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
            }).catch((err) => {
                return {
                    ok: false,
                    data: err.message
                };
            });
        });
        this.getById = (id) => __awaiter(this, void 0, void 0, function* () {
            return database_1.database.query(`SELECT * FROM ${this.table} WHERE id = '${id}';
            SELECT * FROM dispensed_products WHERE service_id = '${id}'`).then((value) => {
                if (value[0].rowCount === 0)
                    return {
                        ok: false,
                        data: 'service not found'
                    };
                const service = value[0].rows[0];
                if (!service)
                    return {
                        ok: false,
                        data: 'service not found',
                    };
                service.products = value[1].rows;
                return {
                    ok: true,
                    data: service,
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
                        data: 'service not found'
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
                        data: 'service not found'
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
//# sourceMappingURL=repository.js.map