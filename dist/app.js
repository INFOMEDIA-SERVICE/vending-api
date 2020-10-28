"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const express_1 = __importDefault(require("express"));
const products_routes_1 = __importDefault(require("./modules/products/products_routes"));
const vending_routes_1 = __importDefault(require("./modules/vending/vending_routes"));
const user_routes_1 = __importDefault(require("./modules/user/user_routes"));
const admin_routes_1 = __importDefault(require("./modules/admin/admin_routes"));
const clients_routes_1 = __importDefault(require("./modules/clients/clients_routes"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const app = express_1.default();
exports.server = http_1.default.createServer(app);
app.set('port', process.env.PORT || 3000);
// Middelwares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cors_1.default());
// Routes
app.use('/api/users', user_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/clients', clients_routes_1.default);
app.use('/api/vendings', vending_routes_1.default);
app.use('/api/products', products_routes_1.default);
app.use('/api/users', admin_routes_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map