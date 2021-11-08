import ws from 'ws';
import mqtt from 'mqtt';
import { ISocketUser, socketUsers } from './model';
import { EventEmitter } from 'events';
import { servicesController } from '../services/controller';
import { IProduct } from '../../interfaces/postgres_responses';
import { IService } from '../../modules/services/model';

interface IMessage {
    type?: number
    action?: MachineActions
    data?: any
}

enum MachineTypes {
    List = 0,
    GetProducts = 1,
    GetMachine = 2,
    Dispense = 3,
}

enum MachineActions {
    Dispensing = 'vending.dispensing',
    VendFinished = 'vending.vend.finished',
    StartingVend = 'vending.vend.startind',
    RequestingVend = 'vend.request',
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
    private listener: Emitter = new Emitter();

    public onConnect = async (socket: ws): Promise<void> => {
        console.log('user connected');
        socket.on('message', (data) => this.onMessage(socket, data));
        socket.on('close', () => this.onDisconnectedUser(socket));
    };

    private onMessage = async (socket: ws, data: ws.Data): Promise<void> => {

        const message: IMessage = JSON.parse(data.toString());

        console.log(message);

        this.saveUser(socket, message);

        const user = socketUsers.getUserById(message.data.user_id)!;

        if (!user.mqtt?.connected) {
            user.mqtt = this.createMQTTConnection(message.data.user_id);
            this.saveUser(socket, message);
        }

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


    public machineList = async (user: ISocketUser, message: IMessage): Promise<void> => {

        user.mqtt!.subscribe(this.machineResponseTopic);
        user.mqtt!.publish(this.machineRequestTopic, JSON.stringify({
            action: 'machine.list',
        }));

        user.mqtt!.on('message', (_, message) => {

            const response = JSON.parse(message.toString());

            console.log(response);

            switch (response.action) {
                case 'machine.list':
                    user.socket!.send(JSON.stringify({
                        type: 0,
                        data: {
                            machines: response.machines,
                        }
                    }));
                    break;
            }
        });
    };

    private getMachineProducts = async (user: ISocketUser, message: IMessage, responseToUser: boolean = true): Promise<void> => {

        const machine_id: string = (message.data.machine_id as string).replace('VM', '');
        const topic: string = 'infomedia/vmachines/' + machine_id;

        user.mqtt!.subscribe(topic.toLocaleLowerCase());
        user.mqtt!.publish(this.machineRequestTopic, JSON.stringify({
            action: 'product.list.request',
            device_id: message.data.machine_id,
        }));

        user.mqtt!.on('message', (_, message) => {

            const response = JSON.parse(message.toString());

            console.log(response);

            switch (response.action) {
                case 'product.list.response':
                    if (responseToUser) {
                        user.socket!.send(JSON.stringify({
                            type: MachineTypes.GetProducts,
                            data: {
                                products: response.products,
                            },
                        }));
                    } else {
                        this.listener.emit('products_list', response.products);
                    }
                    break;
            }

        });
    }

    private consultMachine = async (user: ISocketUser, message: IMessage): Promise<void> => {

        const machine_id: string = message.data.machine_id;

        user.mqtt!.subscribe(this.machineResponseTopic);
        user.mqtt!.publish(this.machineRequestTopic, JSON.stringify({
            action: 'machine.status',
            device_id: machine_id,
        }));

        user.mqtt!.on('message', (_, message) => {

            const response = JSON.parse(message.toString());

            switch (response.action) {
                case 'machine.status':
                    if (response.status < 0) {
                        user.socket!.send(JSON.stringify({
                            type: -1,
                            data: {
                                message: response.message
                            },
                        }));
                        return;
                    }
                    user.socket!.send(JSON.stringify({
                        type: 2,
                        data: response,
                    }));
                    break;
            }
        });
    }

    public dispense = async (user: ISocketUser, message: IMessage): Promise<void> => {

        this.getMachineProducts(user, message, false);

        this.listener.on('products_list', (data) => {
            this.listener.removeAllListeners('products_list')
            this.dispenseExecution(user, message, data);
        });
    };

    public dispenseExecution = async (user: ISocketUser, message: IMessage, data: any): Promise<void> => {

        const allProducts: IProduct[] = data;
        const machine_id: string = message.data.machine_id;
        const user_id: string = message.data.user_id;

        const products: IProduct[] = message.data.products;

        var serviceProducts: IProduct[] = [];

        if (!products) {
            return user.socket!.send(JSON.stringify({
                type: Types.Error,
                data: {
                    message: `products are required`,
                }
            }));
        }

        for (const product of products) {
            const index: number = allProducts.findIndex((p: IProduct): boolean => {
                return product.key === p.key;
            });

            if (index === -1) {

                const productIndex: number = products.findIndex((p: IProduct): boolean => {
                    return product.key === p.key;
                });

                products.splice(productIndex, 1);
                return user.socket!.send(JSON.stringify({
                    type: Types.Error,
                    data: {
                        message: `product ${product.key} does'nt exists`,
                    }
                }));
            }

            product.value = allProducts[index].value;
        }

        let value: number = 0;

        products.forEach((p) => {
            return value += p.value! * p.quantity!;
        });

        user.mqtt!.subscribe(`${this.machineResponseTopic}`);

        const params = {
            action: 'vend.request',
            device_id: machine_id,
            credit: value,
            tid: Math.random().toString(36).substring(2, 9),
            items: products.map((p) => {
                return {
                    key: p.key,
                    qty: p.quantity,
                };
            }),
        };

        user.mqtt!.publish(
            `${this.machineRequestTopic}`,
            JSON.stringify(params)
        );

        user.mqtt!.on('message', (_, message) => {

            const response = JSON.parse(message.toString());

            console.log('ACTION:' + response.action);

            switch (response.action) {
                case 'machine.vend.start':
                    user.socket!.send(JSON.stringify({
                        type: MachineTypes.Dispense,
                        action: MachineActions.StartingVend,
                        data: {
                            message: 'starting vend',
                        },
                    }));
                    break;
                case 'vend.request':
                    user.socket!.send(JSON.stringify({
                        type: MachineTypes.Dispense,
                        action: MachineActions.RequestingVend,
                        data: {
                            message: 'requesting vend',
                        },
                    }));
                    break;
                case 'vend.dispensing':
                    delete response.action;

                    serviceProducts.push({
                        key: response.item,
                        dispensed: response.sucess === 'true',
                        quantity: response.pcount,
                        value: response.value,
                    });

                    user.socket!.send(JSON.stringify({
                        type: MachineTypes.Dispense,
                        action: MachineActions.Dispensing,
                        data: {
                            success: response.sucess === 'true',
                            products_dispensed: response.pcount,
                            key: response.item,
                        },
                    }));
                    break;

                case 'vend.closed':

                    console.log(JSON.stringify(serviceProducts));

                    const service: IService = {
                        machine_id,
                        user_id: user_id,
                        products: serviceProducts,
                        value,
                        success: serviceProducts.findIndex((p: IProduct): boolean => p.dispensed || false) !== -1,
                    };

                    user.socket!.send(JSON.stringify({
                        type: MachineTypes.Dispense,
                        action: MachineActions.VendFinished,
                        data: {
                            message: 'sale finished'
                        }
                    }));

                    servicesController.createNoRequest(service);

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

        const user_id: string = message.data.user_id;

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
            clientId: clientId,
            username: process.env.MQTT_USERNAME,
            password: process.env.MQTT_PASSWORD,
            port: parseInt(process.env.MQTT_PORT || '') || 10110
        };

        return mqtt.connect(this.host, options);
    }

    private onDisconnectedUser = async (socket: ws): Promise<void> => {
        socketUsers.disconnectUser(socket);
    }
}

export const socketController = new SocketController;
