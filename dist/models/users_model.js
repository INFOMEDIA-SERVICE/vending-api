"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const database_1 = require("../database/database");
const User = database_1.sequelize.define('products', {
    id: {
        type: sequelize_1.default.INTEGER,
        primaryKey: true
    },
    username: {
        allowNull: false,
        type: sequelize_1.default.TEXT,
        unique: true
    },
    email: {
        allowNull: false,
        type: sequelize_1.default.TEXT,
        unique: true
    },
    password: {
        allowNull: false,
        type: sequelize_1.default.TEXT,
        unique: true
    },
    status: {
        type: sequelize_1.default.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: false
});
exports.default = User;
//# sourceMappingURL=users_model.js.map