"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const app_1 = require("../../app");
const url_1 = __importDefault(require("url"));
const socket_controller_1 = require("./socket_controller");
const wsServer = new ws_1.default.Server({ noServer: true });
wsServer.on('connection', socket_controller_1.socketController.onConnect);
app_1.server.on('upgrade', (request, socket, head) => {
    const pathname = url_1.default.parse(request.url).pathname + '';
    if (pathname === '/connection') {
        wsServer.handleUpgrade(request, socket, head, socket => {
            wsServer.emit('connection', socket, request);
        });
    }
});
//# sourceMappingURL=socket_routes.js.map