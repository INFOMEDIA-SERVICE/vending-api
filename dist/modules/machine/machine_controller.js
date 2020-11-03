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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketController = void 0;
const mqtt_1 = __importDefault(require("mqtt"));
const machine_model_1 = require("./machine_model");
const events_1 = require("events");
const timers_1 = require("timers");
const machine_repository_1 = require("./machine_repository");
class Emitter extends events_1.EventEmitter {
}
class SocketController {
    constructor() {
        this.topic = process.env.MACHINE_TOPIC || '';
        this.options = {
            clientId: process.env.MQTT_CLIENTID,
            username: process.env.MQTT_USERNAME,
            password: process.env.MQTT_PASSWORD,
            port: parseInt(process.env.MQTT_PORT || '') || 10110
        };
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
                case 1:
                    this.dispense(socket, message);
                    break;
                default:
                    socket.send(JSON.stringify({
                        type: -1,
                        message: 'Type not found'
                    }));
                    break;
            }
        });
        this.dispense = (socket, message) => __awaiter(this, void 0, void 0, function* () {
            const userId = message.data.userId;
            const userResponse = yield machine_repository_1.machineRepository.updateRequests(userId);
            if (!userResponse.ok) {
                return socket.send(JSON.stringify({
                    type: -1,
                    data: `${userResponse.data}`
                }));
            }
            const listener = new Emitter();
            let client = mqtt_1.default.connect('mqtt://iot.infomediaservice.com', this.options);
            const machineId = message.data.machineId;
            client.publish(`${this.topic}`, `{"action":"send","id":${machineId},"data":"vmkey=12","format":"text"}`);
            client.subscribe(`${this.topic}`);
            client.on('connect', () => {
                const products = message.data.products;
                console.log(products.length);
                let counter = 0;
                listener.on('next', () => {
                    if (counter < products.length) {
                        console.log(`Product #${counter + 1}`);
                        if (counter > 0) {
                            client = mqtt_1.default.connect('mqtt://iot.infomediaservice.com', this.options);
                            client.subscribe(`${this.topic}`);
                        }
                        this.dispenseSecuense(client, socket, products[counter], listener, counter === products.length - 1);
                        counter++;
                    }
                });
                listener.emit('next');
            });
        });
        this.dispenseSecuense = (client, socket, product, listener, isLast) => {
            // STARTING
            client.publish(`${this.topic}`, 'vmstart');
            client.on('message', (_, message) => {
                if (message.toString() === 'vmstart') {
                    return;
                }
                if (message.toString() === 'vmdeny') {
                    return;
                }
                const response = JSON.parse(message.toString());
                console.log(response);
                switch (response.action) {
                    case 'session.active':
                        socket.send(JSON.stringify({
                            type: 0,
                            data: 'machine started'
                        }));
                        client.publish(`${this.topic}`, `vmkey=${product.item}`);
                        break;
                    case 'session.status':
                        // client.end();
                        socket.send(JSON.stringify({
                            type: -1,
                            data: 'the machine is busy'
                        }));
                        break;
                    case 'vend.request':
                        socket.send(JSON.stringify({
                            type: 0,
                            data: 'approving sale'
                        }));
                        client.publish(`${this.topic}`, `vmok`);
                        break;
                    case 'vend.approved':
                        socket.send(JSON.stringify({
                            type: 0,
                            data: 'sale approved'
                        }));
                        break;
                    case 'vend.fails':
                        socket.send(JSON.stringify({
                            type: 0,
                            data: `product ${product.name} not dispensed`
                        }));
                        break;
                    case 'vend.sucess':
                        socket.send(JSON.stringify({
                            type: 0,
                            data: `product ${product.name} dispensed`
                        }));
                        break;
                    case 'session.closed':
                        client.end();
                        machine_repository_1.machineRepository.editProduct(product.id);
                        timers_1.setTimeout(() => {
                            listener.emit('next');
                        }, 1000);
                        if (isLast)
                            socket.send(JSON.stringify({
                                type: 0,
                                data: 'sale finished'
                            }));
                        break;
                    default:
                        break;
                }
                return true;
            });
        };
        this.saveUser = (socket, message) => __awaiter(this, void 0, void 0, function* () {
            const user = {
                client: socket,
                userId: message.data.userId,
                userName: message.data.userName
            };
            machine_model_1.socketUsers.addUser(user);
        });
    }
}
exports.socketController = new SocketController;
/*
    type:
        -1: Error
        0: new Connection || Save || OK
*/
//# sourceMappingURL=machine_controller.js.map