import ws from 'ws';
import mqtt from 'mqtt';
import { v1 } from 'uuid';
import { ISocketUser, socketUsers } from './model';
import { EventEmitter } from 'events';
import { setTimeout } from 'timers';
import { machineRepository } from './repository';
import { servicesController } from '../services/controller';
import { IProduct } from '../../interfaces/postgres_responses';

interface IMessage {
    type?: number
    data?: any
}

enum MachineTypes {
    List = 0,
    GetProducts = 1,
    GetMachine = 2,
    Dispense = 3,
}

enum LockersTypes {
    List = 4,
    GetLocker = 5,
    OpenLocker = 6,
}

enum Types {
    Error = -1,
}


class Emitter extends EventEmitter { }

class SocketController {

    private machineRequestTopic: string = process.env.MACHINE_REQUEST_TOPIC!;
    private machineResponseTopic: string = process.env.MACHINE_RESPONSE_TOPIC!;
    private lockersRequestTopic: string = process.env.LOCKERS_REQUEST_TOPIC!;
    private lockersResponseTopic: string = process.env.LOCKERS_RESPONSE_TOPIC!;
    private host: string = process.env.MQTT_HOST!;

    public onConnect = async (socket: ws): Promise<void> => {

        console.log('User connected');
        socket.on('message', (data) => this.onMessage(socket, data));
    };

    private onMessage = async (socket: ws, data: ws.Data): Promise<void> => {

        const message: IMessage = JSON.parse(data.toString());

        this.saveUser(socket, message);

        const user = socketUsers.getUserById(message.data.id)!;
        user.mqtt = user.mqtt || this.createMQTTConnection(user.user_id);

        switch (message.type) {

            // Vendings
            case MachineTypes.List: this.machineList(user, message); break;
            case MachineTypes.GetProducts: this.getMachineProducts(user, message); break;
            case MachineTypes.GetMachine: this.consultMachine(user, message); break;
            case MachineTypes.Dispense: this.dispense(user, message); break;

            // Lockers
            case LockersTypes.List: this.consultLocker(user, message); break;
            case LockersTypes.GetLocker: this.consultAllLockers(socket, message); break;
            case LockersTypes.OpenLocker: this.openBox(user, message); break;
            default:
                socket.send(JSON.stringify({
                    type: Types.Error,
                    data: {
                        message: 'Type not found'
                    }
                }));
                break;
        }

    };


    private consultMachine = async (user: ISocketUser, message: IMessage): Promise<void> => {

        const machine_id: string = message.data.machine_id;

        user.mqtt!.subscribe(this.machineResponseTopic);
        user.mqtt!.on('connect', () => {
            user.mqtt!.publish(this.machineRequestTopic, JSON.stringify({
                action: 'machine.status',
                device_id: machine_id,
            }));
        });

        user.mqtt!.on('message', (_, message) => {

            console.log('MESSAGE');

            const response = JSON.parse(message.toString());

            console.log(response);

            switch (response.action) {
                case 'machine.status':
                    user.socket!.send(JSON.stringify({
                        type: 2,
                        data: response,
                    }));
                    user.mqtt!.end();
                    break;
            }

        });
    }

    private getMachineProducts = async (user: ISocketUser, message: IMessage): Promise<void> => {

        user.mqtt!.subscribe(this.machineResponseTopic);

        user.mqtt!.publish(this.machineRequestTopic, JSON.stringify({
            action: 'product.keys.request',
            device_id: message.data.machine_id,
        }));

        user.mqtt!.on('message', (_, message) => {

            console.log('MESSAGE');

            const response = JSON.parse(message.toString());

            console.log(response);

            switch (response.action) {
                case 'product.keys.response':
                    user.socket!.send(JSON.stringify({
                        type: 7,
                        data: response,
                    }));
                    user.mqtt!.end();
                    break;
            }

        });
    }

    public machineList = async (user: ISocketUser, message: IMessage): Promise<void> => {

        user.mqtt!.publish(this.machineRequestTopic, JSON.stringify({
            action: 'machine.list',
        }));

        user.mqtt!.on('message', (_, message) => {

            const response = JSON.parse(message.toString());

            console.log(response);

            switch (response.action) {
                case 'machine.list':
                    user.socket!.send(JSON.stringify({
                        type: 6,
                        data: {
                            machines: response.machines,
                        }
                    }));
                    break;
            }
        });
    };

    public dispense = async (user: ISocketUser, message: IMessage): Promise<void> => {

        const machineId: string = message.data.machineId;

        const user_id: string = message.data.user_id || v1();

        const userResponse = await machineRepository.updateRequests(user_id);

        if (!userResponse.ok) {
            return user.socket!.send(JSON.stringify({
                type: Types.Error,
                data: {
                    message: `${userResponse.data}`
                }
            }));
        }

        const listener: Emitter = new Emitter();

        user.mqtt!.subscribe(`${this.machineResponseTopic}`);

        console.log({
            products: message.data.products,
            user_id: message.data.user_id
        });

        user.mqtt!.on('connect', () => {

            const products: IProduct[] = message.data.products;

            let counter = 0;

            this.createService(listener, user, machineId);

            listener.on('next', () => {

                if (counter < products.length) {

                    console.log(`Product #${counter + 1}`);

                    if (counter > 0) {

                        user.mqtt = this.createMQTTConnection(user_id);
                        user.mqtt!.subscribe(`${this.machineResponseTopic}`);
                    }

                    this.dispenseSecuense(
                        user,
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

    private createService = (listener: Emitter, user: ISocketUser, machine_id: string) => {

        let products: IProduct[] = [];
        let value: number = 0;

        listener.on('addProduct', (data) => {
            products.push(data);
        });

        listener.on('save', async () => {

            products.forEach((p) => {
                value += p.value
            });

            // const response = await servicesController.create({
            //     machine_id,
            //     user_id: user.user_id,
            //     products,
            //     value,
            //     success: value >= 0
            // });

            // console.log(`RESPONSE SERVICE: ${response.service} MESSAGE ${response.message}`);

            // return user.socket!.send(JSON.stringify({
            //     type: 0,
            //     data: {
            //         message: 'sale summary',
            //         service: response.service
            //     }
            // }));
        });
    }

    private dispenseSecuense = (user: ISocketUser, product: IProduct, listener: Emitter, isLast: boolean) => {

        // STARTING

        let dispensed: boolean;

        user.mqtt!.publish(`${this.machineRequestTopic}`, 'vend.dispensing');

        user.mqtt!.on('message', (_, message) => {

            if (message.toString().toLowerCase().includes('date')) {
                return;
            }

            if (message.toString().toLowerCase().includes('vm')) {
                return;
            }

            const response = JSON.parse(message.toString());

            console.log(response);

            switch (response.action) {
                case 'vend.dispensing':
                    dispensed = true;
                    user.socket!.send(JSON.stringify({
                        type: 0,
                        data: {
                            product,
                            message: `product ${product.key} dispensed`
                        }
                    }));
                    break;

                case 'vend.closed':

                    user.mqtt!.end();

                    listener.emit('addProduct', {
                        key: product.key,
                        dispensed,
                        price: product.value || 0
                    });

                    if (isLast) {
                        listener.emit('save');
                        user.socket!.send(JSON.stringify({
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
            }
        });

    };

    private saveUser = async (socket: ws, message: IMessage): Promise<void> => {

        const user: ISocketUser = {
            socket,
            user_id: message.data.user_id,
        };

        (socket as any).id = message.data.user_id;

        socketUsers.addUser(user);
    }

    private consultAllLockers = async (socket: ws, message: IMessage): Promise<void> => {

        const user_id: string = message.data.user_id || v1();

        const options: mqtt.IClientOptions = {
            clientId: user_id,
            username: process.env.LOCKERS_USERNAME,
            password: process.env.LOCKERS_PASSWORD,
            port: parseInt(process.env.MQTT_PORT || '10110') || 10110,
        };

        let client: mqtt.MqttClient = mqtt.connect(this.host, options);

        client.publish(this.lockersRequestTopic, JSON.stringify({
            'action': 'get.lockers',
        }));

        client.on('connect', () => {
            client.subscribe(this.lockersResponseTopic);
        });

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

    private openBox = async (user: ISocketUser, message: IMessage): Promise<void> => {

        const token: string = message.data.token;
        const locker_name: string = message.data.locker_name;
        const box_name: string = message.data.box_name;

        const action = {
            'action': 'box.open',
            'locker-name': locker_name,
            'box-name': box_name,
            'token': token,
            'sender-id': user.user_id,
        };

        user.mqtt!.publish(this.lockersRequestTopic, JSON.stringify(action));

        user.mqtt!.subscribe(this.lockersResponseTopic);

        user.mqtt!.on('message', (_, message) => {

            const response = JSON.parse(message.toString());

            console.log(response);

            switch (response.action) {
                case 'locker-box-change':
                    user.socket!.send(JSON.stringify({
                        type: 5,
                        data: {
                            locker_name: response['locker-name'],
                            box_name: response['box-name'],
                            is_open: response.state !== 0,
                        }
                    }));
                    user.mqtt!.end();
                    break;
                case 'box.open.error':
                    user.socket!.send(JSON.stringify({
                        type: Types.Error,
                        data: {
                            message: response.error,
                        }
                    }));
                    user.mqtt!.end();
                    break;
            }
        });
    }

    private consultLocker = async (user: ISocketUser, message: IMessage): Promise<void> => {

        const locker_name: string = message.data.locker_name;

        user.mqtt!.subscribe(this.lockersResponseTopic);

        user.mqtt!.publish(this.lockersRequestTopic, JSON.stringify({
            'action': 'get.status',
            'locker-name': `${locker_name}`,
        }));

        user.mqtt!.on('message', (_, message) => {

            const response = JSON.parse(message.toString());

            response.boxes = response.boxes.map((box: any) => {
                box.is_open = (box.state !== 0);
                delete box.state;
                return box;
            });

            switch (response.action) {
                case 'locker.status':
                    user.socket!.send(JSON.stringify({
                        type: 3,
                        data: {
                            locker_name: response['locker-name'],
                            boxes: response.boxes,
                        }
                    }));
                    user.mqtt!.end();
                    break;
            }

        });
    }

    private createMQTTConnection = (clientId: string): mqtt.MqttClient => {
        const options: mqtt.IClientOptions = {
            clientId: 'andres.carrillo.1001',
            username: process.env.MQTT_USERNAME,
            password: process.env.MQTT_PASSWORD,
            port: parseInt(process.env.MQTT_PORT || '') || 10110
        };

        return mqtt.connect(this.host, options);
    }
}

export const socketController = new SocketController;
