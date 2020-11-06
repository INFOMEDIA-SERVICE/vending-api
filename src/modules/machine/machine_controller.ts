import ws from 'ws';
import mqtt from 'mqtt';
import { Request } from 'express';
import { ISocketUser, socketUsers } from './machine_model';
import { EventEmitter } from 'events';
import { setTimeout } from 'timers';
import { machineRepository } from './machine_repository';

interface IMessage {
    type?: number
    data?: any
}

interface IProduct {
    id: string
    name: string
    item: number
}

class Emitter extends EventEmitter {}

class SocketController {

    private topic: string = process.env.MACHINE_TOPIC || '';

    public onConnect = async(socket: ws, req: Request): Promise<void> => {

        console.log('User connected');
        socket.on('message', (data) => this.onMessage(socket, data, req));

    };

    private onMessage = async(socket: ws, data: ws.Data, req: Request): Promise<void> => {

        const message: IMessage = JSON.parse(data.toString());

        switch (message.type) {
            case 0: this.saveUser(socket, message); break;
            case 1: this.dispense(socket, message); break;
            default:
                socket.send(JSON.stringify({
                    type: -1,
                    data: {
                        message: 'Type not found'
                    }
                }));
            break;
        }
    };

    public dispense = async(socket: ws, message: IMessage): Promise<void> => {

        const machineId: string = message.data.machineId;

        const options: mqtt.IClientOptions = {
            clientId: `${process.env.MQTT_CLIENTID}:${machineId}`,
            username: process.env.MQTT_USERNAME,
            password: process.env.MQTT_PASSWORD,
            port: parseInt(process.env.MQTT_PORT || '') || 10110
        };

        const userId: string = message.data.userId;

        const userResponse = await machineRepository.updateRequests(userId);

        if(!userResponse.ok) {
            return socket.send(JSON.stringify({
                type: -1,
                data: {
                    message: `${userResponse.data}`
                }
            }));
        }

        const listener: Emitter = new Emitter();

        let client: mqtt.MqttClient = mqtt.connect('mqtt://iot.infomediaservice.com', options);

        // client.publish(`${this.topic}`, `{"action":"send","id":${machineId},"data":"vmkey=12","format":"text"}`);

        client.subscribe(`${this.topic}`);

        console.log(message.data.products);

        client.on('connect', () => {

            const products: IProduct[] = message.data.products;

            let counter = 0;

            listener.on('next', () => {
                
                if(counter < products.length) {

                    console.log(`Product #${counter+1}`);

                    if(counter > 0) {

                        client = mqtt.connect('mqtt://iot.infomediaservice.com', options);

                        client.subscribe(`${this.topic}`);
                    }
                    
                    this.dispenseSecuense(
                        client,
                        socket,
                        products[counter],
                        listener,
                        counter === products.length - 1
                    );

                    counter++;
                }
            });

            listener.emit('next');
        });
    };

    private dispenseSecuense = (client: mqtt.MqttClient, socket: ws, product: IProduct, listener: Emitter, isLast: boolean) => {

        // STARTING

        client.publish(`${this.topic}`, 'vmstart');

        client.on('message', (_, message) => {

            if(message.toString().toLowerCase().includes('date')) {
                return;
            }
            
            if(message.toString() === 'vmstart') {
                return;
            }

            if(message.toString() === 'vmdeny') {
                return;
            }

            const response = JSON.parse(message.toString());

            console.log(response);

            switch (response.action) {

                case 'session.active':
                    socket.send(JSON.stringify({
                        type: 0,
                        data: {
                            message: 'machine started'
                        }
                    }));
                    client.publish(`${this.topic}`, `vmkey=${product.item}`);
                break;

                case 'session.status':
                    // client.end();
                    socket.send(JSON.stringify({
                        type: -1,
                        data: {
                            message: 'the machine is busy'
                        }
                    }));
                break;

                case 'vend.request': 
                    socket.send(JSON.stringify({
                        type: 0,
                        data: {
                            message: 'approving sale'
                        }
                    }));
                    client.publish(`${this.topic}`, `vmok`);
                break;

                case 'vend.approved':
                    socket.send(JSON.stringify({
                        type: 0,
                        data: {
                            message: 'sale approved'
                        }
                    }));
                break;

                case 'session.timeout':
                    socket.send(JSON.stringify({
                        type: -1,
                        data: {
                            product,
                            message: `machine is off`
                        }
                    }));
                break;

                case 'vend.fails':
                    socket.send(JSON.stringify({
                        type: -1,
                        data: {
                            product,
                            message: `product ${product.name} not dispensed`
                        }
                    }));
                break;

                case 'vend.sucess':
                    socket.send(JSON.stringify({
                        type: 0,
                        data: {
                            product,
                            message: `product ${product.name} dispensed`
                        }
                    }));
                break;

                case 'session.closed':

                    client.end();
                    
                    machineRepository.editProduct(product.id);
                    
                    setTimeout(() => {
                        listener.emit('next');
                    }, 1000);
                    
                    if(isLast) socket.send(JSON.stringify({
                        type: 0,
                        data: {
                            message: 'sale finished'
                        }
                    }));

                break;

                default: break;
            }

            return true;
        });

    };

    private saveUser = async(socket:ws, message:IMessage):Promise<void> => {

        const user:ISocketUser = {
            client: socket,
            userId: message.data.userId,
            userName: message.data.userName
        };

        socketUsers.addUser(user);
    }
}

export const socketController = new SocketController;

/*
    type:
        -1: Error
        0: new Connection || Save || OK
*/
