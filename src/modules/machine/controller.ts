import ws from "ws";
import mqtt from "mqtt";
import { Request, Response } from "express";
import { ISocketUser, socketUsers } from "./model";
import { EventEmitter } from "events";
import { servicesController } from "../services/controller";
import { IProduct } from "../../interfaces/postgres_responses";
import { IService } from "../../modules/services/model";

interface IMessage {
  type?: number;
  action?: MachineActions;
  data?: any;
}

enum MachineTypes {
  List = 0,
  GetProducts = 1,
  GetMachine = 2,
  Dispense = 3,
  AddProduct = 4,
}

enum MachineActions {
  Dispensing = "vending.dispensing",
  VendFinished = "vending.vend.finished",
  StartingVend = "vending.vend.startind",
  RequestingVend = "vend.request",
  AddProduct = "vend.request",
}

enum LockersTypes {
  List = 5,
  GetLocker = 6,
  OpenLocker = 7,
}

enum BarCodeTypes {
  Listen = 8
}

enum Types {
  Error = -1,
}

interface BarCodeMessage {
  device_id?: string;
  action?: string;
  device_type?: string;
  barcode?: Barcode;
}

interface Barcode {
  scanner_id?: string;
  data?: string;
  type?: string;
  raw_data?: string;
  scanner_guid?: string;
}

class Emitter extends EventEmitter { }

class SocketController {
  private machineRequestTopic: string = process.env.MACHINE_REQUEST_TOPIC!;
  private machineResponseTopic: string = process.env.MACHINE_RESPONSE_TOPIC!;
  private lockersRequestTopic: string = process.env.LOCKERS_REQUEST_TOPIC!;
  private lockersResponseTopic: string = process.env.LOCKERS_RESPONSE_TOPIC!;
  private barcodeRequestTopic: string = process.env.BARCODE_REQUEST_TOPIC!;
  private host: string = process.env.MQTT_HOST!;
  private listener: Emitter = new Emitter();
  public barCode: BarCodeMessage = {};

  public onConnect = async (socket: ws): Promise<void> => {
    console.log("user connected");
    socket.on("message", (data) => this.onMessage(socket, data));
    socket.on("close", () => this.onDisconnectedUser(socket));
  };

  private onMessage = async (socket: ws, data: ws.Data): Promise<void> => {
    const message: IMessage = JSON.parse(data.toString());

    this.saveUser(socket, message);

    const user = socketUsers.getUserById(message.data.user_id)!;

    if (!user.mqtt?.connected) {
      user.mqtt = this.createMQTTConnection(message.data.user_id);
      this.saveUser(socket, message);
    }

    switch (message.type) {
      // Vendings
      case MachineTypes.List:
        this.machineList(user, message);
        break;
      case MachineTypes.GetProducts:
        this.getMachineProducts(user, message);
        break;
      case MachineTypes.GetMachine:
        this.consultMachine(user, message);
        break;
      case MachineTypes.Dispense:
        this.dispense(user, message);
        break;

      // Lockers
      case LockersTypes.List:
        this.consultAllLockers(socket, message);
        break;
      case LockersTypes.GetLocker:
        this.consultLocker(user, message);
        break;
      case LockersTypes.OpenLocker:
        this.openBox(user, message);
        break;
      case BarCodeTypes.Listen:
        this.listenBarCodeEvent(message);
        break;
      default:
        socket.send(
          JSON.stringify({
            type: Types.Error,
            data: {
              message: "Type not found",
            },
          })
        );
        break;
    }
  };

  public machineList = async (
    user: ISocketUser,
    message: IMessage
  ): Promise<void> => {
    user.mqtt!.subscribe(this.machineResponseTopic);
    user.mqtt!.publish(
      this.machineRequestTopic,
      JSON.stringify({
        action: "machine.list",
      })
    );

    user.mqtt!.on("message", (_, message) => {
      const response = JSON.parse(message.toString());

      console.log(response);

      switch (response.action) {
        case "machine.list":
          user.socket!.send(
            JSON.stringify({
              type: 0,
              data: {
                machines: response.machines,
              },
            })
          );
          break;
      }
    });
  };

  private getMachineProducts = async (
    user: ISocketUser,
    message: IMessage,
    responseToUser: boolean = true
  ): Promise<void> => {
    const machine_id: string = (message.data.machine_id as string).replace(
      "VM",
      ""
    );
    const topic: string = "infomedia/vmachines/" + machine_id;

    user.mqtt!.subscribe(topic.toLocaleLowerCase());
    user.mqtt!.publish(
      this.machineRequestTopic,
      JSON.stringify({
        action: "product.list.request",
        device_id: message.data.machine_id,
      })
    );

    user.mqtt!.on("message", (_, message) => {
      const response = JSON.parse(message.toString());

      switch (response.action) {
        case "product.list.response":
          if (responseToUser) {
            user.socket!.send(
              JSON.stringify({
                type: MachineTypes.GetProducts,
                data: {
                  products: response.products,
                },
              })
            );
          } else {
            this.listener.emit("products_list", response.products);
          }
          break;
      }
    });
  };

  private consultMachine = async (
    user: ISocketUser,
    message: IMessage
  ): Promise<void> => {
    const machine_id: string = message.data.machine_id;

    user.mqtt!.subscribe(this.machineResponseTopic);
    user.mqtt!.publish(
      this.machineRequestTopic,
      JSON.stringify({
        action: "machine.status",
        device_id: machine_id,
      })
    );

    user.mqtt!.on("message", (_, message) => {
      const response = JSON.parse(message.toString());

      switch (response.action) {
        case "machine.status":
          if (response.status < 0) {
            user.socket!.send(
              JSON.stringify({
                type: -1,
                data: {
                  message: response.message,
                },
              })
            );
            return;
          }
          user.socket!.send(
            JSON.stringify({
              type: 2,
              data: response,
            })
          );
          break;
      }
    });
  };

  public dispense = async (
    user: ISocketUser,
    message: IMessage
  ): Promise<void> => {
    this.getMachineProducts(user, message, false);

    this.listener.on("products_list", (data) => {
      this.listener.removeAllListeners("products_list");
      this.dispenseExecution(user, message, data);
    });
  };

  public dispenseExecution = async (
    user: ISocketUser,
    message: IMessage,
    data: any
  ): Promise<void> => {
    const allProducts: IProduct[] = data;
    const machine_id: string = message.data.machine_id;
    const user_id: string = message.data.user_id;

    const products: IProduct[] = message.data.products;

    var serviceProducts: IProduct[] = [];

    if (!products) {
      return user.socket!.send(
        JSON.stringify({
          type: Types.Error,
          data: {
            message: `products are required`,
          },
        })
      );
    }

    for (const product of products) {
      const index: number = allProducts.findIndex((p: IProduct): boolean => {
        return product.key === p.key;
      });

      if (index === -1) {
        const productIndex: number = products.findIndex(
          (p: IProduct): boolean => {
            return product.key === p.key;
          }
        );

        products.splice(productIndex, 1);
        return user.socket!.send(
          JSON.stringify({
            type: Types.Error,
            data: {
              message: `product ${product.key} does'nt exists`,
            },
          })
        );
      }

      product.value = allProducts[index].value;
    }

    let value: number = 0;

    products.forEach((p) => {
      return (value += p.value! * p.quantity!);
    });

    user.mqtt!.subscribe(`${this.machineResponseTopic}`);

    const params = {
      action: "vend.request",
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

    user.mqtt!.publish(`${this.machineRequestTopic}`, JSON.stringify(params));

    user.mqtt!.on("message", (_, message) => {
      const response = JSON.parse(message.toString());

      switch (response.action) {
        case "machine.vend.start":
          user.socket!.send(
            JSON.stringify({
              type: MachineTypes.Dispense,
              action: MachineActions.StartingVend,
              data: {
                message: "starting vend",
              },
            })
          );
          break;
        case "vend.request":
          user.socket!.send(
            JSON.stringify({
              type: MachineTypes.Dispense,
              action: MachineActions.RequestingVend,
              data: {
                message: "requesting vend",
              },
            })
          );
          break;
        case "vend.dispensing":
          delete response.action;

          serviceProducts.push({
            key: response.item,
            dispensed: response.sucess === "true",
            quantity: response.pcount,
            value: response.value,
          });

          user.socket!.send(
            JSON.stringify({
              type: MachineTypes.Dispense,
              action: MachineActions.Dispensing,
              data: {
                success: response.sucess === "true",
                products_dispensed: response.pcount,
                key: response.item,
              },
            })
          );
          break;

        case "vend.closed":
          console.log(JSON.stringify(serviceProducts));

          const service: IService = {
            machine_id,
            user_id: user_id,
            products: serviceProducts,
            value,
            success:
              serviceProducts.findIndex(
                (p: IProduct): boolean => p.dispensed || false
              ) !== -1,
          };

          user.socket!.send(
            JSON.stringify({
              type: MachineTypes.Dispense,
              action: MachineActions.VendFinished,
              data: {
                message: "sale finished",
              },
            })
          );

          servicesController.createNoRequest(service);

          break;
      }
    });
  };

  private saveUser = async (socket: ws, message: IMessage): Promise<void> => {
    const user: ISocketUser = {
      socket,
      user_id: message.data.user_id,
      device_id: message.data.device_id,
    };

    (socket as any).id = message.data.user_id;

    socketUsers.addUser(user);
  };

  private consultAllLockers = async (
    socket: ws,
    message: IMessage
  ): Promise<void> => {
    const user_id: string = message.data.user_id;

    const options: mqtt.IClientOptions = {
      clientId: user_id,
      username: process.env.MQTT_USERNAME,
      //   password: process.env.MQTT_PASSWORD,
      port: parseInt(process.env.MQTT_PORT || "10110") || 10110,
    };

    console.log(user_id);

    let client: mqtt.MqttClient = mqtt.connect(this.host, options);

    client.subscribe(this.lockersResponseTopic);

    client.publish(
      this.lockersRequestTopic,
      JSON.stringify({
        action: "get.lockers",
      })
    );

    client.on("message", (_, message) => {
      const response = JSON.parse(message.toString());

      console.log(response);

      switch (response.action) {
        case "locker.list":
          socket.send(
            JSON.stringify({
              type: LockersTypes.List,
              data: {
                lockers: response.lockers,
              },
            })
          );
          break;
      }
    });
  };

  private openBox = async (
    user: ISocketUser,
    message: IMessage
  ): Promise<void> => {
    const locker_name: string = message.data.locker_name;
    const box_name: string = message.data.box_name;
    const user_id: string = message.data.user_id;

    const options: mqtt.IClientOptions = {
      clientId: user_id,
      username: process.env.MQTT_USERNAME,
      password: "****",
      port: parseInt(process.env.MQTT_PORT!),
    };

    let client: mqtt.MqttClient = mqtt.connect(this.host, options);

    const action = {
      action: "box.open",
      "locker-name": locker_name.toLocaleLowerCase(),
      "box-name": box_name.toLocaleLowerCase(),
      "sender-id": user_id,
    };

    client.subscribe(`${this.lockersResponseTopic}`);

    client.publish(this.lockersRequestTopic, JSON.stringify(action));

    client.on("message", (_, message) => {
      const response = JSON.parse(message.toString());

      switch (response.action) {
        case "locker-box-change":
          user.socket!.send(
            JSON.stringify({
              type: LockersTypes.OpenLocker,
              data: {
                locker_name: response["locker-name"],
                box_name: response["box-name"],
                is_open: response.state !== 0,
              },
            })
          );
          break;
        case "box.open.error":
          user.socket!.send(
            JSON.stringify({
              type: Types.Error,
              data: {
                message: response.error,
              },
            })
          );
          break;
      }
    });
  };

  private consultLocker = async (
    user: ISocketUser,
    message: IMessage
  ): Promise<void> => {
    const locker_name: string = message.data.locker_name;

    user.mqtt!.subscribe(this.lockersResponseTopic);

    user.mqtt!.publish(
      this.lockersRequestTopic,
      JSON.stringify({
        action: "get.status",
        "locker-name": `${locker_name}`,
      })
    );

    user.mqtt!.on("message", (_, message) => {
      const response = JSON.parse(message.toString());

      console.log(response);

      response.boxes = response.boxes?.map((box: any) => {
        box.is_open = box.state !== 0;
        delete box.state;
        return box;
      });

      switch (response.action) {
        case "locker.status":
          user.socket!.send(
            JSON.stringify({
              type: LockersTypes.GetLocker,
              data: {
                locker_name: response["locker-name"],
                boxes: response.boxes,
              },
            })
          );
          break;
      }
    });
  };

  public listenBarCode = async (): Promise<void> => {
    const options: mqtt.IClientOptions = {
      clientId: "reader.for.barcode.110",
      username: process.env.MQTT_USERNAME,
      password: "****",
      port: parseInt(process.env.MQTT_PORT!),
    };

    let client: mqtt.MqttClient = mqtt.connect(this.host, options);

    client.subscribe(`${this.lockersResponseTopic}`);

    client.on("message", (_, message) => {
      const response = JSON.parse(message.toString());

      console.log(response);

      const device_id = response.device_id;

      const user = socketUsers.getUserByDeviceId(device_id);

      user?.socket?.send(
        JSON.stringify({
          type: BarCodeTypes.Listen,
          data: {
            barCode: response,
          }
        })
      );
    });
  };

  public listenBarCodeEvent = (message: IMessage) => {
    const user = socketUsers.getUserByDeviceId(message.data.device_id);

    user?.socket?.send(
      JSON.stringify({
        status: 'connected',
      })
    );
  };

  private createMQTTConnection = (clientId: string): mqtt.MqttClient => {
    const options: mqtt.IClientOptions = {
      clientId: clientId,
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
      port: parseInt(process.env.MQTT_PORT || "") || 10110,
    };

    return mqtt.connect(this.host, options);
  };

  private onDisconnectedUser = async (socket: ws): Promise<void> => {
    socketUsers.disconnectUser(socket);
  };
}

export const socketController = new SocketController();
