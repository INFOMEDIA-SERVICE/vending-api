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
const model_1 = require("./model");
const events_1 = require("events");
const timers_1 = require("timers");
var MachineTypes;
(function (MachineTypes) {
    MachineTypes[MachineTypes["List"] = 0] = "List";
    MachineTypes[MachineTypes["GetProducts"] = 1] = "GetProducts";
    MachineTypes[MachineTypes["GetMachine"] = 2] = "GetMachine";
    MachineTypes[MachineTypes["Dispense"] = 3] = "Dispense";
})(MachineTypes || (MachineTypes = {}));
var LockersTypes;
(function (LockersTypes) {
    LockersTypes[LockersTypes["List"] = 4] = "List";
    LockersTypes[LockersTypes["GetLocker"] = 5] = "GetLocker";
    LockersTypes[LockersTypes["OpenLocker"] = 6] = "OpenLocker";
})(LockersTypes || (LockersTypes = {}));
var Types;
(function (Types) {
    Types[Types["Error"] = -1] = "Error";
})(Types || (Types = {}));
class Emitter extends events_1.EventEmitter {
}
class SocketController {
    constructor() {
        this.machineRequestTopic = process.env.MACHINE_REQUEST_TOPIC;
        this.machineResponseTopic = process.env.MACHINE_RESPONSE_TOPIC;
        this.lockersRequestTopic = process.env.LOCKERS_REQUEST_TOPIC;
        this.lockersResponseTopic = process.env.LOCKERS_RESPONSE_TOPIC;
        this.host = process.env.MQTT_HOST;
        this.onConnect = (socket) => __awaiter(this, void 0, void 0, function* () {
            socket.on('message', (data) => this.onMessage(socket, data));
        });
        this.onMessage = (socket, data) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const message = JSON.parse(data.toString());
            this.saveUser(socket, message);
            const user = model_1.socketUsers.getUserById(message.data.user_id);
            if (!((_a = user.mqtt) === null || _a === void 0 ? void 0 : _a.connected)) {
                user.mqtt = this.createMQTTConnection(message.data.user_id);
                this.saveUser(socket, message);
            }
            switch (message.type) {
                // Vendings
                case MachineTypes.List:
                    this.machineList(user, message);
                    break;
                case MachineTypes.GetProducts:
                    this.getMachineProducts(user, message);
                    break;
                case MachineTypes.GetMachine:
                    this.consultMachine(user, message);
                    break;
                case MachineTypes.Dispense:
                    this.dispense(user, message);
                    break;
                // Lockers
                case LockersTypes.List:
                    this.consultLocker(user, message);
                    break;
                case LockersTypes.GetLocker:
                    this.consultAllLockers(socket, message);
                    break;
                case LockersTypes.OpenLocker:
                    this.openBox(user, message);
                    break;
                default:
                    socket.send(JSON.stringify({
                        type: Types.Error,
                        data: {
                            message: 'Type not found'
                        }
                    }));
                    break;
            }
        });
        this.machineList = (user, message) => __awaiter(this, void 0, void 0, function* () {
            user.mqtt.subscribe(this.machineResponseTopic);
            user.mqtt.publish(this.machineRequestTopic, JSON.stringify({
                action: 'machine.list',
            }));
            user.mqtt.on('message', (_, message) => {
                const response = JSON.parse(message.toString());
                console.log(response);
                switch (response.action) {
                    case 'machine.list':
                        user.socket.send(JSON.stringify({
                            type: 0,
                            data: {
                                machines: response.machines,
                            }
                        }));
                        break;
                }
            });
        });
        this.getMachineProducts = (user, message) => __awaiter(this, void 0, void 0, function* () {
            user.mqtt.subscribe(this.machineResponseTopic);
            user.mqtt.publish(this.machineRequestTopic, JSON.stringify({
                action: 'product.keys.request',
                device_id: message.data.machine_id,
            }));
            user.mqtt.on('message', (_, message) => {
                const response = JSON.parse(message.toString());
                switch (response.action) {
                    case 'product.keys.response':
                        user.socket.send(JSON.stringify({
                            type: 3,
                            data: response,
                        }));
                        break;
                }
            });
        });
        this.consultMachine = (user, message) => __awaiter(this, void 0, void 0, function* () {
            const machine_id = message.data.machine_id;
            user.mqtt.subscribe(this.machineResponseTopic);
            user.mqtt.publish(this.machineRequestTopic, JSON.stringify({
                action: 'machine.status',
                device_id: machine_id,
            }));
            user.mqtt.on('message', (_, message) => {
                const response = JSON.parse(message.toString());
                switch (response.action) {
                    case 'machine.status':
                        if (response.status < 0) {
                            user.socket.send(JSON.stringify({
                                type: -1,
                                data: {
                                    message: response.message
                                },
                            }));
                            return;
                        }
                        user.socket.send(JSON.stringify({
                            type: 2,
                            data: response,
                        }));
                        break;
                }
            });
        });
        this.dispense = (user, message) => __awaiter(this, void 0, void 0, function* () {
            const machineId = message.data.machineId;
            const user_id = message.data.user_id || uuid_1.v1();
            // const userResponse = await machineRepository.updateRequests(user_id);
            // if (!userResponse.ok) {
            //     return user.socket!.send(JSON.stringify({
            //         type: Types.Error,
            //         data: {
            //             message: `${userResponse.data}`
            //         }
            //     }));
            // }
            const products = message.data.products;
            if (!products) {
                return user.socket.send(JSON.stringify({
                    type: Types.Error,
                    data: {
                        message: `products is required`
                    }
                }));
            }
            const listener = new Emitter();
            user.mqtt.subscribe(`${this.machineResponseTopic}`);
            console.log({
                products: message.data.products,
                user_id: message.data.user_id
            });
            user.mqtt.on('message', (_, message) => {
                const response = JSON.parse(message.toString());
                console.log(response);
                switch (response.action) {
                    case 'vend.dispensing':
                        user.socket.send(JSON.stringify({
                            type: 0,
                            data: {}
                        }));
                        break;
                    case 'vend.closed':
                        listener.emit('save');
                        user.socket.send(JSON.stringify({
                            type: 3,
                            data: {
                                message: 'sale finished'
                            }
                        }));
                        break;
                }
            });
            // user.mqtt!.on('connect', () => {
            //     let counter = 0;
            //     this.createService(listener, user, machineId);
            //     listener.on('next', () => {
            //         if (counter < products.length) {
            //             console.log(`Product #${counter + 1}`);
            //             if (counter > 0) {
            //                 user.mqtt = this.createMQTTConnection(user_id);
            //                 user.mqtt!.subscribe(`${this.machineResponseTopic}`);
            //             }
            //             this.dispenseSecuense(
            //                 user,
            //                 products[counter],
            //                 listener,
            //                 counter === products.length - 1
            //             );
            //             counter++;
            //         }
            //     });
            //     listener.emit('next');
            // });
        });
        this.createService = (listener, user, machine_id) => {
            let products = [];
            let value = 0;
            listener.on('addProduct', (data) => {
                products.push(data);
            });
            listener.on('save', () => __awaiter(this, void 0, void 0, function* () {
                products.forEach((p) => {
                    value += p.value;
                });
                // const response = await servicesController.create({
                //     machine_id,
                //     user_id: user.user_id,
                //     products,
                //     value,
                //     success: value >= 0
                // });
                // console.log(`RESPONSE SERVICE: ${response.service} MESSAGE ${response.message}`);
                // return user.socket!.send(JSON.stringify({
                //     type: 0,
                //     data: {
                //         message: 'sale summary',
                //         service: response.service
                //     }
                // }));
            }));
        };
        this.dispenseSecuense = (user, product, listener, isLast) => {
            // STARTING
            let dispensed;
            user.mqtt.publish(`${this.machineRequestTopic}`, 'vend.dispensing');
            user.mqtt.on('message', (_, message) => {
                if (message.toString().toLowerCase().includes('date')) {
                    return;
                }
                if (message.toString().toLowerCase().includes('vm')) {
                    return;
                }
                const response = JSON.parse(message.toString());
                console.log(response);
                switch (response.action) {
                    case 'vend.dispensing':
                        dispensed = true;
                        user.socket.send(JSON.stringify({
                            type: 0,
                            data: {
                                product,
                                message: `product ${product.key} dispensed`
                            }
                        }));
                        break;
                    case 'vend.closed':
                        user.mqtt.end();
                        listener.emit('addProduct', {
                            key: product.key,
                            dispensed,
                            price: product.value || 0
                        });
                        if (isLast) {
                            listener.emit('save');
                            user.socket.send(JSON.stringify({
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
                }
            });
        };
        this.saveUser = (socket, message) => __awaiter(this, void 0, void 0, function* () {
            const user = {
                socket,
                user_id: message.data.user_id,
            };
            socket.id = message.data.user_id;
            model_1.socketUsers.addUser(user);
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
        this.openBox = (user, message) => __awaiter(this, void 0, void 0, function* () {
            const token = message.data.token;
            const locker_name = message.data.locker_name;
            const box_name = message.data.box_name;
            const action = {
                'action': 'box.open',
                'locker-name': locker_name,
                'box-name': box_name,
                'token': token,
                'sender-id': user.user_id,
            };
            user.mqtt.publish(this.lockersRequestTopic, JSON.stringify(action));
            user.mqtt.subscribe(this.lockersResponseTopic);
            user.mqtt.on('message', (_, message) => {
                const response = JSON.parse(message.toString());
                console.log(response);
                switch (response.action) {
                    case 'locker-box-change':
                        user.socket.send(JSON.stringify({
                            type: 5,
                            data: {
                                locker_name: response['locker-name'],
                                box_name: response['box-name'],
                                is_open: response.state !== 0,
                            }
                        }));
                        user.mqtt.end();
                        break;
                    case 'box.open.error':
                        user.socket.send(JSON.stringify({
                            type: Types.Error,
                            data: {
                                message: response.error,
                            }
                        }));
                        user.mqtt.end();
                        break;
                }
            });
        });
        this.consultLocker = (user, message) => __awaiter(this, void 0, void 0, function* () {
            const locker_name = message.data.locker_name;
            user.mqtt.subscribe(this.lockersResponseTopic);
            user.mqtt.publish(this.lockersRequestTopic, JSON.stringify({
                'action': 'get.status',
                'locker-name': `${locker_name}`,
            }));
            user.mqtt.on('message', (_, message) => {
                const response = JSON.parse(message.toString());
                response.boxes = response.boxes.map((box) => {
                    box.is_open = (box.state !== 0);
                    delete box.state;
                    return box;
                });
                switch (response.action) {
                    case 'locker.status':
                        user.socket.send(JSON.stringify({
                            type: 3,
                            data: {
                                locker_name: response['locker-name'],
                                boxes: response.boxes,
                            }
                        }));
                        user.mqtt.end();
                        break;
                }
            });
        });
        this.createMQTTConnection = (clientId) => {
            const options = {
                clientId: clientId,
                username: process.env.MQTT_USERNAME,
                password: process.env.MQTT_PASSWORD,
                port: parseInt(process.env.MQTT_PORT || '') || 10110
            };
            return mqtt_1.default.connect(this.host, options);
        };
    }
}
exports.socketController = new SocketController;
//# sourceMappingURL=controller.js.map