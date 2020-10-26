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
const uuid_1 = require("uuid");
class MachineController {
    constructor() {
        this.options = {
            clientId: 'infomedia-vmc0003',
            username: 'infomedia',
            password: 'infomedia',
            port: 10110
        };
        // public getPin = (req: Request, res: Response) => {
        //     const client: mqtt.MqttClient = mqtt.connect('mqtt://iot.infomediaservice.com', this.options);
        //     client.on('connect', () => {
        //         let connected: boolean = false;
        //         console.log('CONNECTED');
        //         let order = {
        //             action: 'vend.request',
        //             mid: 'STM32-24001A001557414D38313320',
        //             tid: uuidv4(),
        //             credit: '-1'
        //         };
        //         console.log(order);
        //         client.publish('infomedia/vmc/machinewallet/vmc0003/', JSON.stringify(order));
        //         client.subscribe([
        //             'infomedia/vmc/machinewallet/vmc0003/vend',
        //             'infomedia/vmc/machinewallet/vmc0003/cless'
        //         ]);
        //         // setTimeout(() => {
        //         //     if(!connected) res.send({
        //         //         ok: false,
        //         //         message: 'The machine is off'
        //         //     })
        //         // }, 3000);
        //     });
        // };
        this.dispense = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // await machineRepository.updateClientsRequest('');
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
                    mid: 'STM32-123456789432RFD',
                    tid: uuid_1.v4(),
                    credit: -1,
                    products
                };
                client.publish('infomedia/vmc/machinewallet/vmc0003/', JSON.stringify(order), { qos: 1, retain: true });
                client.subscribe([
                    'infomedia/vmc/machinewallet/vmc0003/vend',
                ]);
                setTimeout(() => {
                    if (!connected)
                        res.send({
                            ok: false,
                            message: 'The machine is off'
                        });
                }, 3000);
                client.on('message', (topic, message) => {
                    console.log('CONNECTED TO', topic);
                    console.log(message.toString());
                    // console.log(packet);
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
        });
    }
}
// qos: 
exports.machineController = new MachineController;
//# sourceMappingURL=machine_controller.js.map