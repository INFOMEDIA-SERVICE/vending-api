"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const app_1 = require("../../app");
const url_1 = __importDefault(require("url"));
const controller_1 = require("./controller");
const wsServer = new ws_1.default.Server({ noServer: true });
wsServer.on('connection', controller_1.socketController.onConnect);
app_1.server.on('upgrade', (req, socket, head) => {
    const pathname = url_1.default.parse(req.url).pathname + '';
    if (pathname === '/connection/') {
        wsServer.handleUpgrade(req, socket, head, socket => {
            wsServer.emit('connection', socket);
        });
    }
});
//# sourceMappingURL=routes.js.map