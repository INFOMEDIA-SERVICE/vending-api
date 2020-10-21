"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const pg_1 = require("pg");
exports.database = new pg_1.Pool({
    user: 'postgres',
    database: 'vendings',
    host: 'localhost',
    password: '37375930'
});
//# sourceMappingURL=database.js.map