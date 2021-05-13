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
    private lockersRequestTopic: string = process.env.LOCKERS_REQUEST_TOPIC || '';
    private lockersResponseTopic: string = process.env.LOCKERS_RESPONSE_TOPIC || '';
    private host: string = process.env.MQTT_HOST || '';

    public onConnect = async(socket: ws, req: Request): Promise<void> => {

        console.log('User connected');
        socket.on('message', (data) => this.onMessage(socket, data, req));
    };

    private onMessage = async(socket: ws, data: ws.Data, req: Request): Promise<void> => {

        const message: IMessage = JSON.parse(data.toString());

        switch (message.type) {
            case 0: this.saveUser(socket, message); break;
            case 1: this.dispense(socket, message); break;
            case 2: this.verifyStatus(socket, message); break;
            case 3: this.consultLocker(socket, message); break;
            case 4: this.consultAllLockers(socket, message); break;
            case 5: this.openBox(socket, message); break;
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

        let client: mqtt.MqttClient = mqtt.connect(this.host, options);

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

        let client: mqtt.MqttClient = mqtt.connect(this.host, options);

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

                        client = mqtt.connect(this.host, options);
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
                success: value >= 0
            });

            console.log(`RESPONSE SERVICE: ${response.service} MESSAGE ${response.message}`);

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
                    
                    if(dispensed) machineRepository.editProduct(product.id);

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

    private consultAllLockers = async(socket: ws, message: IMessage): Promise<void> => {

        const token: string = message.data.token;
        const userID: string = message.data.userID || '';

        const options: mqtt.IClientOptions = {
            clientId: `${userID}`,
            username: process.env.LOCKERS_USERNAME,
            password: process.env.LOCKERS_PASSWORD,
            port: parseInt(process.env.MQTT_PORT || '10110') || 10110,
        };

        let client: mqtt.MqttClient = mqtt.connect(this.host, options);

        client.publish(`${this.lockersRequestTopic}`, JSON.stringify({
            'action': 'get.lockers',
        }));

        client.on('connect', () => {
            client.subscribe(`${this.lockersResponseTopic}`);
        });

        console.log(client.connected);

        client.on('message', (_, message) => {

            const response = JSON.parse(message.toString());

            console.log(response);

            switch (response.action) {
                case 'locker.list':
                    socket.send(JSON.stringify({
                        type: 4,
                        data: {
                            lockers: response.lockers,
                        }
                    }));
                    client.end();
                break;
            }
        });
    }

    private openBox = async(socket: ws, message: IMessage): Promise<void> => {

        const token: string = message.data.token;
        const locker_name: string = message.data.locker_name;
        const box_name: string = message.data.box_name;
        const userID: string = message.data.userID || '';

        const options: mqtt.IClientOptions = {
            clientId: `${userID}`,
            username: process.env.LOCKERS_USERNAME,
            password: process.env.LOCKERS_PASSWORD,
            port: parseInt(process.env.MQTT_PORT || '10110') || 10110,
        };

        let client: mqtt.MqttClient = mqtt.connect(this.host, options);

        const action = {
            'action': 'box.open',
            'locker-name': locker_name,
            'box-name': box_name,
            'token': token,
            'sender-id': userID,
        };

        client.publish(`${this.lockersRequestTopic}`, JSON.stringify(action));

        client.on('connect', () => {
            client.subscribe(`${this.lockersResponseTopic}`);
        });

        client.on('message', (_, message) => {

            const response = JSON.parse(message.toString());
            
            console.log(response);

            switch (response.action) {
                case 'locker-box-change':
                    socket.send(JSON.stringify({
                        type: 5,
                        data: {
                            locker_name: response['locker-name'],
                            box_name: response['box-name'],
                            isOpen: response.state !== 0,
                        }
                    }));
                    client.end();
                break;
                case 'box.open.error':
                    socket.send(JSON.stringify({
                        type: -1,
                        data: {
                            message: response.error,
                        }
                    }));
                    client.end();
                break;
            }
        });
    }

    private consultLocker = async(socket: ws, message: IMessage): Promise<void> => {

        const userID: string = message.data.userID;
        const locker_name: string = message.data.locker_name;
        const token: string = message.data.token;

        const options: mqtt.IClientOptions = {
            clientId: `${userID}`,
            username: process.env.LOCKERS_USERNAME,
            password: process.env.LOCKERS_PASSWORD,
            port: parseInt(process.env.MQTT_PORT || '10110') || 10110,
        };

        let client: mqtt.MqttClient = mqtt.connect(this.host, options);

        client.publish(`${this.lockersRequestTopic}`, JSON.stringify({
            'action': 'get.status',
            'locker-name': `${locker_name}`,
        }));

        client.on('connect', () => {
            client.subscribe(`${this.lockersResponseTopic}`);
        });

        client.on('message', (_, message) => {

            const response = JSON.parse(message.toString());

            response.boxes = response.boxes.map((box: any) => {
                box.isOpen = (box.state !== 0);
                delete box.state;
                return box;
            });

            switch (response.action) {
                case 'locker.status':
                    socket.send(JSON.stringify({
                        type: 3,
                        data: {
                            locker_name: response['locker-name'],
                            boxes: response.boxes,
                        }
                    }));
                    client.end();
                break;
            }

        });
    }
}

export const socketController = new SocketController;

/*
    type:
        -1: Error
        0: new Connection || Save || OK
*/
