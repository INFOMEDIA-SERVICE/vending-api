import mqtt from 'mqtt';
import {Request, Response} from 'express';

class MachineController {

    private options: mqtt.IClientOptions = {
        clientId: 'infomedia-vmc0003',
        username: 'infomedia',
        password: 'infomedia',
        port: 10110
    };
    
    public getPin = (req: Request, res: Response) => {

        const client: mqtt.MqttClient = mqtt.connect('mqtt://iot.infomediaservice.com', this.options);

        client.on('connect', () => {

            let connected: boolean = false;

            console.log('CONNECTED');

            let order = {
                action: 'vend.request',
                mid: 'STM32-24001A001557414D38313320',
                tid: '345',
                credit: '-1'
            };

            client.publish('infomedia/vmc/machinewallet/vmc0003/', JSON.stringify(order));
            client.subscribe([
                'infomedia/vmc/machinewallet/vmc0003/vend',
                'infomedia/vmc/machinewallet/vmc0003/cless'
            ]);

            setTimeout(() => {

                if(!connected) res.send({
                    ok: false,
                    message: 'The machine is off'
                })
            }, 3000);
    
        });
    };

    public dispense = (req: Request, res: Response) => {

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
                mid: 'STM32-24001A001557414D38313320',
                tid: 'VMOK',
                credit: '-1',
                products
            };

            client.publish('infomedia/vmc/machinewallet/vmc0003/', JSON.stringify(order));
            client.subscribe([
                'infomedia/vmc/machinewallet/vmc0003/vend',
                'infomedia/vmc/machinewallet/vmc0003/cless'
            ]);

            setTimeout(() => {

                if(!connected) res.send({
                    ok: false,
                    message: 'The machine is off'
                })
            }, 3000);
    
            client.on('message', (topic, message, packet) => {

                if (topic === 'infomedia/vmc/machinewallet/vmc0003/vend') {

                    connected = true;
                    
                    console.log('CONNECTED TO TOPIC');
                    console.log(message.toString());

                    client.publish('infomedia/vmc/machinewallet/vmc0003/vend', JSON.stringify({action: 'session.status'}))

                    // client.end();
                }
            });
        });
    };
}

export const machineController = new MachineController;
 