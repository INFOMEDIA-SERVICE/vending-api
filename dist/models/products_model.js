"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const database_1 = require("../database/database");
const Product = database_1.sequelize.define('products', {
    id: {
        type: sequelize_1.default.INTEGER,
        primaryKey: true
    },
    name: {
        allowNull: false,
        type: sequelize_1.default.TEXT,
        unique: true
    },
    price: {
        type: sequelize_1.default.BIGINT,
    },
    image: {
        type: sequelize_1.default.TEXT,
    },
    item: {
        type: sequelize_1.default.INTEGER
    },
    status: {
        type: sequelize_1.default.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: false
});
exports.default = Product;
//# sourceMappingURL=products_model.js.map