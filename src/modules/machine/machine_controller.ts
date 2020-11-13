import ws from 'ws';
import mqtt from 'mqtt';
import { Request } from 'express';
import { ISocketUser, socketUsers } from './machine_model';
import { EventEmitter } from 'events';
import { setTimeout } from 'timers';
import { machineRepository } from './machine_repository';
import { authController } from '../../utils/auth_controller';
import { servicesController } from '../services/services_controller';

interface IMessage {
    type?: number
    data?: any
}

interface IProduct {
    id: string
    name: string
    item: number
    price: number
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

        const auth: any = authController.validateSocketAccess(message.data.token);

        if(!auth.ok) return socket.send(JSON.stringify({
            type: -1,
            data: {
                message: auth.message
            }
        }));

        switch (message.type) {
            case 0: this.saveUser(socket, message); break;
            case 1: this.dispense(socket, message); break;
            case 2: this.verifyStatus(socket, message); break;
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

    public verifyStatus = async(socket: ws, message: IMessage): Promise<void> => {

        const machineId: string = message.data.machineId;

        const options: mqtt.IClientOptions = {
            clientId: `${process.env.MQTT_CLIENTID}:${machineId}`,
            username: process.env.MQTT_USERNAME,
            password: process.env.MQTT_PASSWORD,
            port: parseInt(process.env.MQTT_PORT || '') || 10110
        };

        let client: mqtt.MqttClient = mqtt.connect('mqtt://iot.infomediaservice.com', options);

        client.subscribe(`${this.topic}`);

        client.on('connect', () => {

            client.publish(`${this.topic}`, 'vmstatus');

            client.on('message', (_, message) => {

                if(message.toString().toLowerCase().includes('date')) {
                    return;
                }

                if(message.toString().toLowerCase().includes('vm')) {
                    return;
                }

                const response = JSON.parse(message.toString());

                console.log(response);

                switch (response.action) {

                    case 'session.idle':
                        
                        client.end();

                        socket.send(JSON.stringify({
                            type: 2,
                            data: {
                                message: 'machine is available'
                            }
                        }));

                    default: break;
                }
            });

        });
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

        client.subscribe(`${this.topic}`);

        console.log({
            products: message.data.products,
            userId: message.data.userId
        });

        client.on('connect', () => {

            const products: IProduct[] = message.data.products;

            let counter = 0;

            this.createService(listener, socket, machineId, userId);
            
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

    private createService = (listener: Emitter, socket: ws, machine_id: string, user_id: string) => {

        let products: any[] = [];
        let value: number = 0;

        listener.on('addProduct', (data) => {
            products.push(data);
        });

        listener.on('save', async() => {

            products.forEach((p) => {
                value += p.price || 0
            });

            const response = await servicesController.create({
                machine_id,
                user_id,
                products,
                value,
                reference: (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2),
                success: value >= 0
            });

            return socket.send(JSON.stringify({
                type: 0,
                data: {
                    message: 'sale summary',
                    service: response.service
                }
            }));
        });
    }

    private dispenseSecuense = (client: mqtt.MqttClient, socket: ws, product: IProduct, listener: Emitter, isLast: boolean) => {

        // STARTING

        let dispensed: boolean;

        client.publish(`${this.topic}`, 'vmstart');

        client.on('message', (_, message) => {

            if(message.toString().toLowerCase().includes('date')) {
                return;
            }

            if(message.toString().toLowerCase().includes('vm')) {
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
                    dispensed = false;
                    socket.send(JSON.stringify({
                        type: -1,
                        data: {
                            product,
                            message: `product ${product.name} not dispensed`
                        }
                    }));
                break;

                case 'vend.sucess':
                    dispensed = true;
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

                    listener.emit('addProduct', {
                        id: product.id,
                        dispensed,
                        price: product.price || 0
                    });

                    if(isLast) {
                        listener.emit('save');
                        socket.send(JSON.stringify({
                            type: 0,
                            data: {
                                message: 'sale finished'
                            }
                        }));
                    }
                    
                    setTimeout(() => {
                        listener.emit('next');
                    }, 1000);

                break;

                default: break;
            }
        });

    };

    private saveUser = async(socket:ws, message:IMessage): Promise<void> => {

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
        1: Error
*/
