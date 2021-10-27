"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const pg_1 = require("pg");
exports.database = new pg_1.Pool({
    user: process.env.POSTGRESS_USER,
    database: process.env.POSTGRESS_DATABASE,
    host: process.env.POSTGRESS_HOST,
    password: process.env.POSTGRESS_PASSWORD
});
//# sourceMappingURL=database.js.map