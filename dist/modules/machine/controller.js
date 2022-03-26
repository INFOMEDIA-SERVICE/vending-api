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
const model_1 = require("./model");
const events_1 = require("events");
const controller_1 = require("../services/controller");
const uuid_1 = require("uuid");
var MachineTypes;
(function (MachineTypes) {
    MachineTypes[MachineTypes["List"] = 0] = "List";
    MachineTypes[MachineTypes["GetProducts"] = 1] = "GetProducts";
    MachineTypes[MachineTypes["GetMachine"] = 2] = "GetMachine";
    MachineTypes[MachineTypes["Dispense"] = 3] = "Dispense";
    MachineTypes[MachineTypes["AddProduct"] = 4] = "AddProduct";
})(MachineTypes || (MachineTypes = {}));
var MachineActions;
(function (MachineActions) {
    MachineActions["Dispensing"] = "vending.dispensing";
    MachineActions["VendFinished"] = "vending.vend.finished";
    MachineActions["StartingVend"] = "vending.vend.startind";
    MachineActions["RequestingVend"] = "vend.request";
    MachineActions["AddProduct"] = "vend.request";
})(MachineActions || (MachineActions = {}));
var LockersTypes;
(function (LockersTypes) {
    LockersTypes[LockersTypes["GetLocker"] = 5] = "GetLocker";
    LockersTypes[LockersTypes["List"] = 6] = "List";
    LockersTypes[LockersTypes["OpenLocker"] = 7] = "OpenLocker";
    LockersTypes[LockersTypes["CloseLocker"] = 9897] = "CloseLocker";
})(LockersTypes || (LockersTypes = {}));
var BarCodeTypes;
(function (BarCodeTypes) {
    BarCodeTypes[BarCodeTypes["Listen"] = 8] = "Listen";
})(BarCodeTypes || (BarCodeTypes = {}));
var Types;
(function (Types) {
    Types[Types["Error"] = -1] = "Error";
})(Types || (Types = {}));
class Emitter extends events_1.EventEmitter {
}
class SocketController {
    constructor() {
        this.listener = new Emitter();
        this.onConnect = (socket) => __awaiter(this, void 0, void 0, function* () {
            console.log("user connected");
            socket.on("message", (data) => this.onMessage(socket, data));
            socket.on("close", () => this.onDisconnectedUser(socket));
        });
        this.onMessage = (socket, data) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const message = JSON.parse(data.toString());
            this.saveUser(socket, message);
            const user = model_1.socketUsers.getUserById(message.data.user_id);
            if (!((_a = user.mqtt) === null || _a === void 0 ? void 0 : _a.connected)) {
                user.mqtt = this.createMQTTConnection({ clientId: user.user_id });
                this.saveUser(socket, message, user);
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
                    this.consultAllLockers(user);
                    break;
                case LockersTypes.GetLocker:
                    this.consultLocker(user, message);
                    break;
                case LockersTypes.OpenLocker:
                    this.openBox(user, message);
                    break;
                case LockersTypes.CloseLocker:
                    this.closeLocker(user, message);
                    break;
                case BarCodeTypes.Listen:
                    this.listenBarCodeEvent(socket, message);
                    break;
                default:
                    socket.send(JSON.stringify({
                        type: Types.Error,
                        data: {
                            message: "Type not found",
                        },
                    }));
                    break;
            }
        });
        this.machineList = (user, message) => __awaiter(this, void 0, void 0, function* () {
            user.mqtt.subscribe(process.env.MACHINE_RESPONSE_TOPIC);
            user.mqtt.publish(process.env.MACHINE_REQUEST_TOPIC, JSON.stringify({
                action: "machine.list",
            }));
            user.mqtt.on("message", (_, message) => {
                const response = JSON.parse(message.toString());
                console.log(response);
                switch (response.action) {
                    case "machine.list":
                        user.socket.send(JSON.stringify({
                            type: 0,
                            data: {
                                machines: response.machines,
                            },
                        }));
                        break;
                }
            });
        });
        this.getMachineProducts = (user, message, responseToUser = true) => __awaiter(this, void 0, void 0, function* () {
            const machine_id = message.data.machine_id.replace("VM", "");
            const topic = "infomedia/vmachines/" + machine_id;
            user.mqtt.subscribe(topic.toLocaleLowerCase());
            user.mqtt.publish(process.env.MACHINE_REQUEST_TOPIC, JSON.stringify({
                action: "product.list.request",
                device_id: message.data.machine_id,
            }));
            user.mqtt.on("message", (_, message) => {
                const response = JSON.parse(message.toString());
                switch (response.action) {
                    case "product.list.response":
                        if (responseToUser) {
                            user.socket.send(JSON.stringify({
                                type: MachineTypes.GetProducts,
                                data: {
                                    products: response.products,
                                },
                            }));
                        }
                        else {
                            this.listener.emit("products_list", response.products);
                        }
                        break;
                }
            });
        });
        this.consultMachine = (user, message) => __awaiter(this, void 0, void 0, function* () {
            const machine_id = message.data.machine_id;
            user.mqtt.subscribe(process.env.MACHINE_RESPONSE_TOPIC);
            user.mqtt.publish(process.env.MACHINE_REQUEST_TOPIC, JSON.stringify({
                action: "machine.status",
                device_id: machine_id,
            }));
            user.mqtt.on("message", (_, message) => {
                const response = JSON.parse(message.toString());
                switch (response.action) {
                    case "machine.status":
                        if (response.status < 0) {
                            user.socket.send(JSON.stringify({
                                type: -1,
                                data: {
                                    message: response.message,
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
            this.getMachineProducts(user, message, false);
            this.listener.on("products_list", (data) => {
                this.listener.removeAllListeners("products_list");
                this.dispenseExecution(user, message, data);
            });
        });
        this.dispenseExecution = (user, message, data) => __awaiter(this, void 0, void 0, function* () {
            const allProducts = data;
            const machine_id = message.data.machine_id;
            const user_id = message.data.user_id;
            const products = message.data.products;
            var serviceProducts = [];
            if (!products) {
                return user.socket.send(JSON.stringify({
                    type: Types.Error,
                    data: {
                        message: `products are required`,
                    },
                }));
            }
            for (const product of products) {
                const index = allProducts.findIndex((p) => {
                    return product.key === p.key;
                });
                if (index === -1) {
                    const productIndex = products.findIndex((p) => {
                        return product.key === p.key;
                    });
                    products.splice(productIndex, 1);
                    return user.socket.send(JSON.stringify({
                        type: Types.Error,
                        data: {
                            message: `product ${product.key} does'nt exists`,
                        },
                    }));
                }
                product.value = allProducts[index].value;
            }
            let value = 0;
            products.forEach((p) => {
                return (value += p.value * p.quantity);
            });
            user.mqtt.subscribe(process.env.MACHINE_RESPONSE_TOPIC);
            const params = {
                action: "vend.request",
                device_id: machine_id,
                credit: value,
                tid: Math.random().toString(36).substring(2, 9),
                items: products.map((p) => {
                    return {
                        key: p.key,
                        qty: p.quantity,
                    };
                }),
            };
            user.mqtt.publish(process.env.MACHINE_REQUEST_TOPIC, JSON.stringify(params));
            user.mqtt.on("message", (_, message) => {
                const response = JSON.parse(message.toString());
                switch (response.action) {
                    case "machine.vend.start":
                        user.socket.send(JSON.stringify({
                            type: MachineTypes.Dispense,
                            action: MachineActions.StartingVend,
                            data: {
                                message: "starting vend",
                            },
                        }));
                        break;
                    case "vend.request":
                        user.socket.send(JSON.stringify({
                            type: MachineTypes.Dispense,
                            action: MachineActions.RequestingVend,
                            data: {
                                message: "requesting vend",
                            },
                        }));
                        break;
                    case "vend.dispensing":
                        delete response.action;
                        serviceProducts.push({
                            key: response.item,
                            dispensed: response.sucess === "true",
                            quantity: response.pcount,
                            value: response.value,
                        });
                        user.socket.send(JSON.stringify({
                            type: MachineTypes.Dispense,
                            action: MachineActions.Dispensing,
                            data: {
                                success: response.sucess === "true",
                                products_dispensed: response.pcount,
                                key: response.item,
                            },
                        }));
                        break;
                    case "vend.closed":
                        console.log(JSON.stringify(serviceProducts));
                        const service = {
                            machine_id,
                            user_id: user_id,
                            products: serviceProducts,
                            value,
                            success: serviceProducts.findIndex((p) => p.dispensed || false) !== -1,
                        };
                        user.socket.send(JSON.stringify({
                            type: MachineTypes.Dispense,
                            action: MachineActions.VendFinished,
                            data: {
                                message: "sale finished",
                            },
                        }));
                        controller_1.servicesController.createNoRequest(service);
                        break;
                }
            });
        });
        this.saveUser = (socket, message, user) => __awaiter(this, void 0, void 0, function* () {
            socket.id = message.data.user_id || message.data.device_id;
            model_1.socketUsers.addUser(user || {
                socket,
                user_id: message.data.user_id,
                device_id: message.data.device_id,
            });
        });
        this.consultAllLockers = (user) => __awaiter(this, void 0, void 0, function* () {
            let client = user.mqtt;
            client.subscribe(process.env.LOCKERS_RESPONSE_TOPIC);
            client.publish(process.env.LOCKERS_REQUEST_TOPIC, JSON.stringify({
                action: "get.lockers",
            }));
            client.on("message", (_, message) => {
                const response = JSON.parse(message.toString());
                console.log(response);
                switch (response.action) {
                    case "locker.list":
                        user.socket.send(JSON.stringify({
                            type: LockersTypes.List,
                            data: {
                                lockers: response.lockers,
                            },
                        }));
                        break;
                }
            });
        });
        this.openBox = (user, message) => __awaiter(this, void 0, void 0, function* () {
            const locker_name = message.data.locker_name.toLocaleLowerCase();
            const box_name = message.data.box_name.toLocaleLowerCase();
            const user_id = message.data.user_id;
            const token = message.data.token;
            const options = {
                clientId: user_id,
                username: process.env.MQTT_USERNAME,
                password: token,
                port: parseInt(process.env.MQTT_PORT),
            };
            let client = this.createMQTTConnection({ options });
            yield new Promise(f => setTimeout(f, 500));
            const requestTopic = process.env.LOCKERS_REQUEST_TOPIC;
            const responseTopic = process.env.LOCKERS_RESPONSE_TOPIC;
            client.subscribe(responseTopic);
            client.publish(requestTopic, JSON.stringify({
                'action': 'box.open',
                'locker-name': locker_name,
                'box-name': box_name,
                'sender-id': user_id,
                'token': token,
            }));
            client.on("message", (_, message) => {
                const response = JSON.parse(message.toString());
                switch (response.action) {
                    case "locker-box-change":
                        user.socket.send(JSON.stringify({
                            type: LockersTypes.OpenLocker,
                            data: {
                                locker_name: response["locker-name"],
                                box_name: response["box-name"],
                                is_open: response.state !== 0,
                            },
                        }));
                        break;
                    case "box.open.error":
                        user.socket.send(JSON.stringify({
                            type: Types.Error,
                            data: {
                                message: response.error,
                            },
                        }));
                        break;
                }
            });
        });
        this.consultLocker = (user, message) => __awaiter(this, void 0, void 0, function* () {
            const locker_name = message.data.locker_name;
            user.mqtt.subscribe(process.env.LOCKERS_RESPONSE_TOPIC);
            user.mqtt.publish(process.env.LOCKERS_REQUEST_TOPIC, JSON.stringify({
                action: "get.status",
                "locker-name": `${locker_name}`,
            }));
            user.mqtt.on("message", (_, message) => {
                var _a;
                const response = JSON.parse(message.toString());
                console.log(response);
                response.boxes = (_a = response.boxes) === null || _a === void 0 ? void 0 : _a.map((box) => {
                    box.is_open = box.state !== 0;
                    delete box.state;
                    return box;
                });
                switch (response.action) {
                    case "locker.status":
                        user.socket.send(JSON.stringify({
                            type: LockersTypes.GetLocker,
                            data: {
                                locker_name: response["locker-name"],
                                boxes: response.boxes,
                            },
                        }));
                        break;
                }
            });
        });
        this.closeLocker = (user, message) => __awaiter(this, void 0, void 0, function* () {
            const locker_name = message.data.locker_name.toLocaleLowerCase();
            const box_name = message.data.box_name.toLocaleLowerCase();
            const topic = `devices/lockers/${locker_name}/${box_name}`;
            user.mqtt.subscribe(topic);
            user.mqtt.publish(topic, '0');
            user.mqtt.on("message", (_, message) => {
                const response = JSON.parse(message.toString());
                console.log('RESPONSE: ' + response);
                user.socket.send(JSON.stringify({
                    type: LockersTypes.CloseLocker,
                    data: {
                        response,
                    },
                }));
            });
        });
        this.listenBarCode = () => __awaiter(this, void 0, void 0, function* () {
            const options = {
                clientId: uuid_1.v1(),
                username: process.env.MQTT_USERNAME,
                password: process.env.MQTT_PASSWORD,
                port: parseInt(process.env.MQTT_PORT || "") || 10110,
            };
            let client = this.createMQTTConnection({ options });
            client.on("connect", () => {
                console.log('MQTT CONNECTED');
            });
            client.on("error", (e) => {
                console.log('ERROR:' + e.message);
            });
            client.subscribe(process.env.BARCODE_RESPONSE_TOPIC);
            client.on("message", (_, message) => {
                var _a;
                const response = JSON.parse(message.toString());
                console.log(response);
                const device_id = response.device_id;
                const user = model_1.socketUsers.getUserByDeviceId(device_id);
                if (!user) {
                    console.log(`USER WITH DEVICE ID: ${device_id} NOT FOUND`);
                }
                (_a = user === null || user === void 0 ? void 0 : user.socket) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({
                    type: BarCodeTypes.Listen,
                    data: {
                        barcode: response,
                    }
                }));
            });
        });
        this.listenBarCodeEvent = (socket, message) => {
            var _a;
            this.saveUser(socket, message);
            const user = model_1.socketUsers.getUserByDeviceId(message.data.device_id);
            (_a = user === null || user === void 0 ? void 0 : user.socket) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({
                status: 'connected',
            }));
        };
        this.createMQTTConnection = (params) => {
            const client = mqtt_1.default.connect(process.env.MQTT_HOST, params.options || {
                clientId: params.clientId,
                username: process.env.MQTT_USERNAME,
                password: process.env.MQTT_PASSWORD,
                port: parseInt(process.env.MQTT_PORT || "") || 10110,
            });
            client.on("connect", () => {
                console.log('USER MQTT CONNECTED');
            });
            client.on("error", (e) => {
                console.log('ERROR:' + e.message);
            });
            return client;
        };
        this.onDisconnectedUser = (socket) => __awaiter(this, void 0, void 0, function* () {
            model_1.socketUsers.disconnectUser(socket);
        });
    }
}
exports.socketController = new SocketController();
//# sourceMappingURL=controller.js.map