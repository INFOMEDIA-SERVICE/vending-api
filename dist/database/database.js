"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const pg_1 = require("pg");
// POSTGRESS_USER='postgres'
// POSTGRESS_DATABASE='vendings'
// POSTGRESS_HOST='localhost'
// POSTGRESS_PASSWORD='37375930'
exports.database = new pg_1.Pool({
    user: (process.env.ENV == 'D') ? 'postgres' : process.env.POSTGRESS_USER,
    database: (process.env.ENV == 'D') ? 'vendings' : process.env.POSTGRESS_DATABASE,
    host: (process.env.ENV == 'D') ? 'localhost' : process.env.POSTGRESS_HOST,
    password: (process.env.ENV == 'D') ? '37375930' : process.env.POSTGRESS_PASSWORD
});
//# sourceMappingURL=database.js.map