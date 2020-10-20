import mqtt from 'mqtt';
import {Request, Response} from 'express';

class MachineController {
    
    public dispense = (req: Request, res: Response) => {

        const options: mqtt.IClientOptions = {
            clientId: 'infomedia-vmc0003',
            username: 'infomedia',
            password: 'infomedia',
            port: 10110,
        };

        const data: any[] = req.body.data;

        const client: mqtt.MqttClient = mqtt.connect('wxs://iot.infomediaservice.com', options);

        client.on('connect', () => {

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
                item: 'STM32-24001A001557414D38313320',
                tid: 345,
                credit: -1,
                products: [
                    {'item': '01', 'qty': '1'},
                    {'item': '02', 'qty': '2'}
                ]
            };

            // {
            //     "action":"vend.request",
            //     "item":"STM32-24001A001557414D38313320",
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
            ], (err, data: mqtt.ISubscriptionGrant[]) => {
                // if(!err) console.log(data);
            });
    
            client.on('message', (topic, message, packet) => {

                if (topic === 'infomedia/vmc/machinewallet/vmc0003/vend') {
                    
                    console.log('CONNECTED TO TOPIC');
                    console.log(message.toString());

                    // client.end();

                    // res.send({
                    //     ok: true,
                    //     message: 'connected'
                    // });

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
 