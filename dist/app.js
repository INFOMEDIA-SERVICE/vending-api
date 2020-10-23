"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const express_1 = __importDefault(require("express"));
const machine_routes_1 = __importDefault(require("./modules/machine/machine_routes"));
const products_routes_1 = __importDefault(require("./modules/products/products_routes"));
const vending_routes_1 = __importDefault(require("./modules/vending/vending_routes"));
const user_routes_1 = __importDefault(require("./modules/user/user_routes"));
const clients_routes_1 = __importDefault(require("./modules/clients/clients_routes"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const app = express_1.default();
exports.server = http_1.default.createServer(app);
const publicPath = path_1.default.resolve(__dirname, '../public');
app.use('/', express_1.default.static(publicPath));
app.set('port', 3000);
// Middelwares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// Routes
app.use('/api/users', user_routes_1.default);
app.use('/api/clients', clients_routes_1.default);
app.use('/api/vendings', vending_routes_1.default);
app.use('/api/products', products_routes_1.default);
app.use('/api/machine', machine_routes_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map