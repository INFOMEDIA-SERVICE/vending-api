import mqtt from 'mqtt';
import {Request, Response} from 'express';
import { IQueryResponse } from '../../interfaces/postgres_responses';

class MachineController {

    private topic: string = 'infomedia/vmc/novaventas/vmc0003';

    private sucessProducts = [];

    private options: mqtt.IClientOptions = {
        clientId: 'infomedia-vmc0003',
        username: 'infomedia',
        password: 'infomedia',
        port: 10110
    };
    
    public dispense = async(req: Request, res: Response): Promise<void> => {

        // await machineRepository.updateClientsRequest('');

        const data: any[] = req.body.data;

        const client: mqtt.MqttClient = mqtt.connect('mqtt://iot.infomediaservice.com', this.options);

        client.subscribe(`${this.topic}`);

        client.on('connect', async() => {
            
            const response: IQueryResponse = await this.dispenseSecuense(client, res, '15');

            res.send(response);
            
        });
    };

    private dispenseSecuense = async(client: mqtt.MqttClient, res: Response, product: string): Promise<IQueryResponse> => {

        let status: IQueryResponse = {
            ok: true
        };

        // STARTING

        client.publish(`${this.topic}`, 'vmstart');

        client.on('message', async(data, message) => {

            const response = JSON.parse(message.toString());

            console.log(response);

            switch (response.action) {

                case 'session.active': 
                    status = {ok: true};
                    client.publish(`${this.topic}`, `vmkey=${product}`);
                break;
                case 'session.status': 
                    status = {ok: false, data: 'The machine is busy'};
                break;
            
                default: status = {ok: false, data: 'Error to connect with machine'}; break;
            }
        });

        // // SENDING PRODUCTS

        // if(!status.ok) return status;

        await new Promise(resolve => setTimeout(resolve, 5000));
        
        return status;
    };

    private start = (client: mqtt.MqttClient) => {

        client.publish(`${this.topic}`, 'vmstart');

        return client.on('message', (data, message) => {
            return JSON.parse(message.toString());
        });
    }

    private selectProducts = (client: mqtt.MqttClient, products: string[]) => {
        client.publish(`${this.topic}`, `vmkey=${products[0]}`);
        return client.on('message', (data, message) => {
            return JSON.parse(message.toString());
        });
    }
}

export const machineController = new MachineController;
 






























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