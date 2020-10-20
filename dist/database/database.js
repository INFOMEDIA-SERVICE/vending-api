"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
exports.sequelize = new sequelize_1.Sequelize('vending', 'postgres', '37375930', {
    host: 'localhost',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        // require: 30000,
        idle: 10000
    },
    logging: false
});
//# sourceMappingURL=database.js.map