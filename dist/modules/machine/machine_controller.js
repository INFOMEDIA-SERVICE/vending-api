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
exports.machineController = void 0;
const mqtt_1 = __importDefault(require("mqtt"));
class MachineController {
    constructor() {
        this.topic = 'infomedia/vmc/novaventas/vmc0003';
        this.sucessProducts = [];
        this.options = {
            clientId: 'infomedia-vmc0003',
            username: 'infomedia',
            password: 'infomedia',
            port: 10110
        };
        this.dispense = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // await machineRepository.updateClientsRequest('');
            const data = req.body.data;
            const client = mqtt_1.default.connect('mqtt://iot.infomediaservice.com', this.options);
            client.subscribe(`${this.topic}`);
            client.on('connect', () => __awaiter(this, void 0, void 0, function* () {
                const response = yield this.dispenseSecuense(client, res, '15');
                res.send(response);
            }));
        });
        this.dispenseSecuense = (client, res, product) => __awaiter(this, void 0, void 0, function* () {
            let status = {
                ok: true
            };
            // STARTING
            client.publish(`${this.topic}`, 'vmstart');
            client.on('message', (data, message) => __awaiter(this, void 0, void 0, function* () {
                const response = JSON.parse(message.toString());
                console.log(response);
                switch (response.action) {
                    case 'session.active':
                        status = { ok: true };
                        client.publish(`${this.topic}`, `vmkey=${product}`);
                        break;
                    case 'session.status':
                        status = { ok: false, data: 'The machine is busy' };
                        break;
                    default:
                        status = { ok: false, data: 'Error to connect with machine' };
                        break;
                }
            }));
            // // SENDING PRODUCTS
            // if(!status.ok) return status;
            yield new Promise(resolve => setTimeout(resolve, 5000));
            return status;
        });
        this.start = (client) => {
            client.publish(`${this.topic}`, 'vmstart');
            return client.on('message', (data, message) => {
                return JSON.parse(message.toString());
            });
        };
        this.selectProducts = (client, products) => {
            client.publish(`${this.topic}`, `vmkey=${products[0]}`);
            return client.on('message', (data, message) => {
                return JSON.parse(message.toString());
            });
        };
    }
}
exports.machineController = new MachineController;
// let connected: boolean = false;
//             console.log('CONNECTED');
//             let products: object[] = [];
//             data.forEach(product => {
//                 products.push({
//                     item: product.item,
//                     qty: product.quantity
//                 });
//             });
//             let order = {
//                 // action: 'vend.reset',
//                 action: 'vend.request',
//                 mid: 'STM32-123456789JVKJVHJjuidwW',
//                 tid: uuidv4(),
//                 credit: -1,
//                 products
//             };
//             client.publish(`${this.topic}`, JSON.stringify(order), {qos: 1, retain: true});
//             client.subscribe([
//                 `${this.topic}`,
//                 // 'infomedia/vmc/machinewallet/vmc0003/cless'
//             ]);
//             // setTimeout(() => {
//             //     if(!connected) res.send({
//             //         ok: false,
//             //         message: 'The machine is off'
//             //     })
//             // }, 3000);
//             client.on('message', (topic: string, message: Buffer) => {
//                 console.log('CONNECTED TO', topic);
//                 console.log(message.toString());
//                 // console.log(packet);
//                 // if (topic === 'infomedia/vmc/machinewallet/vmc0003/vend') {
//                 //     connected = true;
//                 //     console.log('CONNECTED TO TOPIC');
//                 //     console.log(message.toString());
//                 //     console.log(packet.cmd);
//                 //     // client.publish('infomedia/vmc/machinewallet/vmc0003/vend', JSON.stringify({action: 'session.status'}))
//                 //     // client.end();
//                 // }
//             });
//# sourceMappingURL=machine_controller.js.map