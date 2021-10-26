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
const uuid_1 = require("uuid");
const machine_model_1 = require("./machine_model");
const events_1 = require("events");
const timers_1 = require("timers");
const machine_repository_1 = require("./machine_repository");
const services_controller_1 = require("../services/services_controller");
class Emitter extends events_1.EventEmitter {
}
class SocketController {
    constructor() {
        this.topic = process.env.MACHINE_TOPIC || '';
        this.machineRequestTopic = process.env.MACHINE_REQUEST_TOPIC || '';
        this.machineResponseTopic = process.env.MACHINE_RESPONSE_TOPIC || '';
        this.lockersRequestTopic = process.env.LOCKERS_REQUEST_TOPIC || '';
        this.lockersResponseTopic = process.env.LOCKERS_RESPONSE_TOPIC || '';
        this.host = process.env.MQTT_HOST || '';
        this.onConnect = (socket, req) => __awaiter(this, void 0, void 0, function* () {
            console.log('User connected');
            socket.on('message', (data) => this.onMessage(socket, data, req));
        });
        this.onMessage = (socket, data, req) => __awaiter(this, void 0, void 0, function* () {
            const message = JSON.parse(data.toString());
            console.log(message);
            switch (message.type) {
                case 0:
                    this.saveUser(socket, message);
                    break;
                case 1:
                    this.dispense(socket, message);
                    break;
                case 2:
                    this.consultMachine(socket, message);
                    break;
                case 3:
                    this.consultLocker(socket, message);
                    break;
                case 4:
                    this.consultAllLockers(socket, message);
                    break;
                case 5:
                    this.openBox(socket, message);
                    break;
                case 9:
                    this.machineList(socket, message);
                    break;
                default:
                    socket.send(JSON.stringify({
                        type: -1,
                        data: {
                            message: 'Type not found'
                        }
                    }));
                    break;
            }
        });
        this.consultMachine = (socket, message) => __awaiter(this, void 0, void 0, function* () {
            const user_id = message.data.user_id || uuid_1.v1();
            const machine_id = message.data.machine_id || 'VM1004';
            let client = this.createMQTTConnection(user_id);
            client.subscribe(this.machineResponseTopic);
            client.publish(this.machineRequestTopic, JSON.stringify({
                action: 'machine.status',
                device_id: machine_id,
            }));
            client.on('message', (_, message) => {
                console.log('MESSAGE');
                const response = JSON.parse(message.toString());
                console.log(response);
                switch (response.action) {
                    case 'machine.status':
                        socket.send(JSON.stringify({
                            type: 2,
                            data: response,
                        }));
                        client.end();
                        break;
                }
            });
        });
        this.machineList = (socket, message) => __awaiter(this, void 0, void 0, function* () {
            const user_id = message.data.user_id || uuid_1.v1();
            let client = this.createMQTTConnection(user_id);
            client.subscribe(`${this.machineResponseTopic}`);
            client.publish(this.machineRequestTopic, JSON.stringify({
                action: 'machine.list',
            }));
            client.on('message', (_, message) => {
                const response = JSON.parse(message.toString());
                console.log(response);
                switch (response.action) {
                    case 'machine.list':
                        socket.send(JSON.stringify({
                            type: 9,
                            data: {
                                machines: response.machines,
                            }
                        }));
                        client.end();
                        break;
                }
            });
        });
        this.dispense = (socket, message) => __awaiter(this, void 0, void 0, function* () {
            const machineId = message.data.machineId;
            const user_id = message.data.user_id || uuid_1.v1();
            const userResponse = yield machine_repository_1.machineRepository.updateRequests(user_id);
            if (!userResponse.ok) {
                return socket.send(JSON.stringify({
                    type: -1,
                    data: {
                        message: `${userResponse.data}`
                    }
                }));
            }
            const listener = new Emitter();
            let client = this.createMQTTConnection(user_id);
            client.subscribe(`${this.topic}`);
            console.log({
                products: message.data.products,
                user_id: message.data.user_id
            });
            client.on('connect', () => {
                const products = message.data.products;
                let counter = 0;
                this.createService(listener, socket, machineId, user_id);
                listener.on('next', () => {
                    if (counter < products.length) {
                        console.log(`Product #${counter + 1}`);
                        if (counter > 0) {
                            client = this.createMQTTConnection(user_id);
                            client.subscribe(`${this.topic}`);
                        }
                        this.dispenseSecuense(client, socket, products[counter], listener, counter === products.length - 1);
                        counter++;
                    }
                });
                listener.emit('next');
            });
        });
        this.createService = (listener, socket, machine_id, user_id) => {
            let products = [];
            let value = 0;
            listener.on('addProduct', (data) => {
                products.push(data);
            });
            listener.on('save', () => __awaiter(this, void 0, void 0, function* () {
                products.forEach((p) => {
                    value += p.price || 0;
                });
                const response = yield services_controller_1.servicesController.create({
                    machine_id,
                    user_id,
                    products,
                    value,
                    success: value >= 0
                });
                console.log(`RESPONSE SERVICE: ${response.service} MESSAGE ${response.message}`);
                return socket.send(JSON.stringify({
                    type: 0,
                    data: {
                        message: 'sale summary',
                        service: response.service
                    }
                }));
            }));
        };
        this.dispenseSecuense = (client, socket, product, listener, isLast) => {
            // STARTING
            let dispensed;
            client.publish(`${this.topic}`, 'vmstart');
            client.on('message', (_, message) => {
                if (message.toString().toLowerCase().includes('date')) {
                    return;
                }
                if (message.toString().toLowerCase().includes('vm')) {
                    return;
                }
                const response = JSON.parse(message.toString());
                console.log(response);
                switch (response.action) {
                    case 'session.active':
                        socket.send(JSON.stringify({
                            type: 0,
                            data: {
                                message: 'machine started'
                            }
                        }));
                        client.publish(`${this.topic}`, `vmkey=${product.item}`);
                        break;
                    case 'session.status':
                        socket.send(JSON.stringify({
                            type: -1,
                            data: {
                                message: 'the machine is busy'
                            }
                        }));
                        break;
                    case 'vend.request':
                        socket.send(JSON.stringify({
                            type: 0,
                            data: {
                                message: 'approving sale'
                            }
                        }));
                        client.publish(`${this.topic}`, `vmok`);
                        break;
                    case 'vend.approved':
                        socket.send(JSON.stringify({
                            type: 0,
                            data: {
                                message: 'sale approved'
                            }
                        }));
                        break;
                    case 'session.timeout':
                        socket.send(JSON.stringify({
                            type: -1,
                            data: {
                                product,
                                message: `machine is off`
                            }
                        }));
                        break;
                    case 'vend.fails':
                        dispensed = false;
                        socket.send(JSON.stringify({
                            type: -1,
                            data: {
                                product,
                                message: `product ${product.name} not dispensed`
                            }
                        }));
                        break;
                    case 'vend.sucess':
                        dispensed = true;
                        socket.send(JSON.stringify({
                            type: 0,
                            data: {
                                product,
                                message: `product ${product.name} dispensed`
                            }
                        }));
                        break;
                    case 'session.closed':
                        client.end();
                        if (dispensed)
                            machine_repository_1.machineRepository.editProduct(product.id);
                        listener.emit('addProduct', {
                            id: product.id,
                            dispensed,
                            price: product.price || 0
                        });
                        if (isLast) {
                            listener.emit('save');
                            socket.send(JSON.stringify({
                                type: 0,
                                data: {
                                    message: 'sale finished'
                                }
                            }));
                        }
                        timers_1.setTimeout(() => {
                            listener.emit('next');
                        }, 1000);
                        break;
                    default: break;
                }
            });
        };
        this.saveUser = (socket, message) => __awaiter(this, void 0, void 0, function* () {
            const user = {
                client: socket,
                user_id: message.data.user_id,
                userName: message.data.userName
            };
            machine_model_1.socketUsers.addUser(user);
        });
        this.consultAllLockers = (socket, message) => __awaiter(this, void 0, void 0, function* () {
            const user_id = message.data.user_id || uuid_1.v1();
            const options = {
                clientId: user_id,
                username: process.env.LOCKERS_USERNAME,
                password: process.env.LOCKERS_PASSWORD,
                port: parseInt(process.env.MQTT_PORT || '10110') || 10110,
            };
            let client = mqtt_1.default.connect(this.host, options);
            client.publish(this.lockersRequestTopic, JSON.stringify({
                'action': 'get.lockers',
            }));
            client.on('connect', () => {
                client.subscribe(this.lockersResponseTopic);
            });
            client.on('message', (_, message) => {
                const response = JSON.parse(message.toString());
                console.log(response);
                switch (response.action) {
                    case 'locker.list':
                        socket.send(JSON.stringify({
                            type: 4,
                            data: {
                                lockers: response.lockers,
                            }
                        }));
                        client.end();
                        break;
                }
            });
        });
        this.openBox = (socket, message) => __awaiter(this, void 0, void 0, function* () {
            const token = message.data.token;
            const locker_name = message.data.locker_name;
            const box_name = message.data.box_name;
            const user_id = message.data.user_id || '';
            const options = {
                clientId: `${user_id}`,
                username: process.env.LOCKERS_USERNAME,
                password: token,
                port: parseInt(process.env.MQTT_PORT || '10110') || 10110,
            };
            let client = mqtt_1.default.connect(this.host, options);
            const action = {
                'action': 'box.open',
                'locker-name': locker_name,
                'box-name': box_name,
                'token': token,
                'sender-id': user_id,
            };
            client.publish(this.lockersRequestTopic, JSON.stringify(action));
            client.on('connect', () => {
                client.subscribe(this.lockersResponseTopic);
            });
            client.on('message', (_, message) => {
                const response = JSON.parse(message.toString());
                console.log(response);
                switch (response.action) {
                    case 'locker-box-change':
                        socket.send(JSON.stringify({
                            type: 5,
                            data: {
                                locker_name: response['locker-name'],
                                box_name: response['box-name'],
                                is_open: response.state !== 0,
                            }
                        }));
                        client.end();
                        break;
                    case 'box.open.error':
                        socket.send(JSON.stringify({
                            type: -1,
                            data: {
                                message: response.error,
                            }
                        }));
                        client.end();
                        break;
                }
            });
        });
        this.consultLocker = (socket, message) => __awaiter(this, void 0, void 0, function* () {
            const user_id = message.data.user_id;
            const locker_name = message.data.locker_name;
            const token = message.data.token;
            const options = {
                clientId: user_id,
                username: process.env.LOCKERS_USERNAME,
                password: process.env.LOCKERS_PASSWORD,
                port: parseInt(process.env.MQTT_PORT),
            };
            let client = mqtt_1.default.connect(this.host, options);
            client.publish(this.lockersRequestTopic, JSON.stringify({
                'action': 'get.status',
                'locker-name': `${locker_name}`,
            }));
            client.on('connect', () => {
                client.subscribe(this.lockersResponseTopic);
            });
            client.on('message', (_, message) => {
                const response = JSON.parse(message.toString());
                response.boxes = response.boxes.map((box) => {
                    box.is_open = (box.state !== 0);
                    delete box.state;
                    return box;
                });
                switch (response.action) {
                    case 'locker.status':
                        socket.send(JSON.stringify({
                            type: 3,
                            data: {
                                locker_name: response['locker-name'],
                                boxes: response.boxes,
                            }
                        }));
                        client.end();
                        break;
                }
            });
        });
        this.createMQTTConnection = (clientId) => {
            const options = {
                clientId: 'andres.carrillo.1001',
                username: process.env.MQTT_USERNAME,
                password: process.env.MQTT_PASSWORD,
                port: parseInt(process.env.MQTT_PORT || '') || 10110
            };
            return mqtt_1.default.connect(this.host, options);
        };
    }
}
exports.socketController = new SocketController;
//# sourceMappingURL=machine_controller.js.map