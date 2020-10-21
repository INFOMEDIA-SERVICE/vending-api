"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketController = void 0;
const socket_model_1 = require("./socket_model");
class SocketController {
    constructor() {
        this.onConnect = (socket, req) => __awaiter(this, void 0, void 0, function* () {
            console.log('User connected');
            socket.on('message', (data) => this.onMessage(socket, data, req));
        });
        this.onMessage = (socket, data, req) => __awaiter(this, void 0, void 0, function* () {
            const message = JSON.parse(data.toString());
            switch (message.type) {
                case 0:
                    this.saveUser(socket, message);
                    break;
                default:
                    socket.send(JSON.stringify({
                        type: -1,
                        message: 'Type not found'
                    }));
                    break;
            }
        });
        this.saveUser = (socket, message) => __awaiter(this, void 0, void 0, function* () {
            const user = {
                client: socket,
                userId: message.data.userId,
                userName: message.data.userName
            };
            socket_model_1.socketUsers.addUser(user);
        });
    }
}
exports.socketController = new SocketController;
/*
    type:
        -1: Error
        0: new Connection || Save || OK
*/
//# sourceMappingURL=socket_controller.js.map