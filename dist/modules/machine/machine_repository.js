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
exports.machineRepository = void 0;
const database_1 = require("../../database/database");
class MachineRepository {
    constructor() {
        this.table = 'users';
        this.updateClientsRequest = (id) => __awaiter(this, void 0, void 0, function* () {
            return database_1.database.query(`UPDATE ${this.table} SET request = request + 1 WHERE id = '${id}' AND status = true RETURNING *`)
                .then((value) => {
                if (value.rowCount === 0)
                    return {
                        ok: false,
                        data: 'Client not found'
                    };
                return {
                    ok: true
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
exports.machineRepository = new MachineRepository;
//# sourceMappingURL=machine_repository.js.map