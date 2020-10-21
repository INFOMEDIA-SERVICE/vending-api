"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.machineController = void 0;
const mqtt_1 = __importDefault(require("mqtt"));
const uuid_1 = require("uuid");
class MachineController {
    constructor() {
        this.options = {
            clientId: 'infomedia-vmc0003',
            username: 'infomedia',
            password: 'infomedia',
            port: 10110
        };
        this.getPin = (req, res) => {
            const client = mqtt_1.default.connect('mqtt://iot.infomediaservice.com', this.options);
            client.on('connect', () => {
                let connected = false;
                console.log('CONNECTED');
                let order = {
                    action: 'vend.request',
                    mid: 'STM32-24001A001557414D38313320',
                    tid: uuid_1.v4(),
                    credit: '-1'
                };
                console.log(order);
                client.publish('infomedia/vmc/machinewallet/vmc0003/', JSON.stringify(order));
                client.subscribe([
                    'infomedia/vmc/machinewallet/vmc0003/vend',
                    'infomedia/vmc/machinewallet/vmc0003/cless'
                ]);
                // setTimeout(() => {
                //     if(!connected) res.send({
                //         ok: false,
                //         message: 'The machine is off'
                //     })
                // }, 3000);
            });
        };
        this.dispense = (req, res) => {
            const data = req.body.data;
            const client = mqtt_1.default.connect('mqtt://iot.infomediaservice.com', this.options);
            client.on('connect', () => {
                let connected = false;
                console.log('CONNECTED');
                let products = [];
                data.forEach(product => {
                    products.push({
                        item: product.item,
                        qty: product.quantity
                    });
                });
                let order = {
                    // action: 'vend.reset',
                    action: 'vend.request',
                    mid: 'STM32-24001A001557414D38313320',
                    tid: uuid_1.v4(),
                    credit: -1,
                    products
                };
                client.publish('infomedia/vmc/machinewallet/vmc0003/', JSON.stringify(order));
                client.subscribe([
                    'infomedia/vmc/machinewallet/vmc0003/vend',
                ]);
                // setTimeout(() => {
                //     if(!connected) res.send({
                //         ok: false,
                //         message: 'The machine is off'
                //     })
                // }, 3000);
                client.on('message', (topic, message, packet) => {
                    console.log('CONNECTED TO', topic);
                    console.log(message.toString());
                    // if (topic === 'infomedia/vmc/machinewallet/vmc0003/vend') {
                    //     connected = true;
                    //     console.log('CONNECTED TO TOPIC');
                    //     console.log(message.toString());
                    //     console.log(packet.cmd);
                    //     // client.publish('infomedia/vmc/machinewallet/vmc0003/vend', JSON.stringify({action: 'session.status'}))
                    //     // client.end();
                    // }
                });
            });
        };
    }
}
exports.machineController = new MachineController;
//# sourceMappingURL=machine_controller.js.map