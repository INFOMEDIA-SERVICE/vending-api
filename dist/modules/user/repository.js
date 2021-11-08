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
exports.usersRepository = void 0;
const database_1 = require("../../database/database");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
class UsersRepository {
    constructor() {
        this.table = 'users';
        this.signup = (user) => __awaiter(this, void 0, void 0, function* () {
            return database_1.database.query(`insert into ${this.table}(first_name, last_name, email, password, role) values('${user.first_name}', '${user.last_name}', '${user.email}', '${user.password}', 0) RETURNING *`).then((value) => {
                return {
                    ok: true,
                    data: value.rows[0]
                };
            }).catch((err) => {
                console.log(err);
                return {
                    ok: false,
                    data: err.message
                };
            });
        });
        this.login = (email) => __awaiter(this, void 0, void 0, function* () {
            return database_1.database.query(`SELECT * FROM ${this.table} WHERE email = '${email}' AND role = 0`)
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
                console.log(err);
                return {
                    ok: false,
                    data: err.message
                };
            });
        });
        this.googleLogin = (token) => __awaiter(this, void 0, void 0, function* () {
            return firebase_admin_1.default.auth().verifyIdToken(token).then((decodedToken) => __awaiter(this, void 0, void 0, function* () {
                console.log(decodedToken.name);
                const response = yield this.login(decodedToken.email || 'jyrdc');
                if (!response.ok)
                    return {
                        ok: false,
                        data: 'User not found'
                    };
                const user = response.data;
                return {
                    ok: true,
                    data: user
                };
            })).catch(function (error) {
                return {
                    ok: false,
                    data: error.message
                };
            });
        });
        this.googleSignup = (token) => __awaiter(this, void 0, void 0, function* () {
            return firebase_admin_1.default.auth().verifyIdToken(token).then((decodedToken) => __awaiter(this, void 0, void 0, function* () {
                const name = decodedToken.name + '';
                const cuttedName = name.split(' ');
                let first_name;
                let last_name;
                if (cuttedName.length == 2) {
                    first_name = cuttedName[0];
                    last_name = cuttedName[1];
                }
                else if (cuttedName.length == 3) {
                    first_name = cuttedName[0];
                    last_name = cuttedName[1] + cuttedName[2];
                }
                else {
                    first_name = cuttedName[0];
                    last_name = cuttedName[1];
                }
                const response = yield this.signup({
                    email: decodedToken.email || '',
                    first_name,
                    last_name,
                });
                if (!response.ok)
                    return {
                        ok: false,
                        data: 'User already exists'
                    };
                const user = response.data;
                return {
                    ok: true,
                    data: user
                };
            })).catch(function (error) {
                return {
                    ok: false,
                    data: error.message
                };
            });
        });
        this.getAll = () => __awaiter(this, void 0, void 0, function* () {
            return database_1.database.query(`SELECT * FROM ${this.table} AND role = 0`)
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
            return database_1.database.query(`SELECT * FROM ${this.table} WHERE id = '${id}' AND role = 0`)
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
        this.update = (id, user) => __awaiter(this, void 0, void 0, function* () {
            return database_1.database.query(`UPDATE ${this.table} SET(first_name, last_name, email) = ('${user.first_name}', '${user.last_name}', '${user.email}') WHERE id = '${id}' RETURNING *`)
                .then((value) => __awaiter(this, void 0, void 0, function* () {
                if (value.rowCount === 0)
                    return {
                        ok: false,
                        data: 'User not found'
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
        this.updateStatus = (id, status) => __awaiter(this, void 0, void 0, function* () {
            return database_1.database.query(`UPDATE ${this.table} SET status = ${status} WHERE id = '${id}' RETURNING *`)
                .then((value) => __awaiter(this, void 0, void 0, function* () {
                if (value.rowCount === 0)
                    return {
                        ok: false,
                        data: 'User not found'
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
            return database_1.database.query(`delete from ${this.table} WHERE id = '${id}' AND role = 0 RETURNING *`)
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
exports.usersRepository = new UsersRepository;
//# sourceMappingURL=repository.js.map