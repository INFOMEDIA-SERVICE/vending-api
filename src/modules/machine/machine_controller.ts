import mqtt from 'mqtt';
import {Request, Response} from 'express';

class MachineController {
    
    public dispense = (req: Request, res: Response) => {

        const options: mqtt.IClientOptions = {
            clientId: 'infomedia-vmc0003',
            username: 'infomedia',
            password: 'infomedia',
            port: 10110
        };

        const data: any[] = req.body.data;

        const client: mqtt.MqttClient = mqtt.connect('mqtt://iot.infomediaservice.com', options);

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
                tid: '345',
                credit: '-1',
                products
            };

            // {
            //     "action":"vend.request",
            //     "mid":"STM32-24001A001557414D38313320",
            //     "tid":"345",
            //     "credit":"-1",
            //     "products":[
            //         {"item":"11", "qty": "1"},
            //         {"item":"21", "qty": "2"}
            //     ]
            // }
    
            client.publish('infomedia/vmc/machinewallet/vmc0003/', JSON.stringify(order));
            // client.emit('VMSTART', JSON.stringify(order));
            client.subscribe([
                // 'infomedia/vmc/machinewallet/vmc0003/',
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

                console.log(topic);

                if (topic === 'infomedia/vmc/machinewallet/vmc0003/vend') {

                    connected = true;
                    
                    console.log('CONNECTED TO TOPIC');
                    console.log(message.toString());

                    // client.end();

                    res.send({
                        ok: true,
                        message: 'connected'
                    });

                    // switch (JSON.parse(message.toString('utf8')).action) {
                        
                    //     case 'vend.fails':

                    //         client.end();

                    //         res.send({
                    //             'ok': false,
                    //             'data': 'Error al dispensar.'
                    //         });

                    //     break;

                    //     case 'vend.success':

                    //         client.end();

                    //         res.send({
                    //             'ok': true,
                    //             'data': 'Producto dispensado.'
                    //         });

                    //     break;
                    // }
                }
            });
        });
    };
}

export const machineController = new MachineController;
 