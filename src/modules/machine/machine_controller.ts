import mqtt from 'mqtt';
import {Request, Response} from 'express';
import { v4 as uuidv4 } from 'uuid';
import { machineRepository } from './machine_repository';

class MachineController {

    private options: mqtt.IClientOptions = {
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

    public dispense = async(req: Request, res: Response): Promise<void> => {

        // await machineRepository.updateClientsRequest('');

        const data: any[] = req.body.data;

        const client: mqtt.MqttClient = mqtt.connect('mqtt://iot.infomediaservice.com', this.options);

        client.on('connect', () => {

            let connected: boolean = false;

            console.log('CONNECTED');

            let products: object[] = [];

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
                tid: uuidv4(),
                credit: -1,
                products
            };

            client.publish('infomedia/vmc/machinewallet/vmc0003/', JSON.stringify(order), {qos: 1, retain: true});
            client.subscribe([
                'infomedia/vmc/machinewallet/vmc0003/vend',
                // 'infomedia/vmc/machinewallet/vmc0003/cless'
            ]);

            setTimeout(() => {

                if(!connected) res.send({
                    ok: false,
                    message: 'The machine is off'
                })
            }, 3000);
    
            client.on('message', (topic: string, message: Buffer) => {

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
    };
}

// qos: 

export const machineController = new MachineController;
 