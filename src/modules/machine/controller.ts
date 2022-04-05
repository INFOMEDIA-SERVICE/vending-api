import ws from "ws";
import mqtt from "mqtt";
import { ISocketUser, socketUsers } from "./model";
import { EventEmitter } from "events";
import { servicesController } from "../services/controller";
import { IProduct } from "../../interfaces/postgres_responses";
import { IService } from "../../modules/services/model";
import { v1 } from 'uuid';

interface IMessage {
  type?: number;
  action?: MachineActions;
  data?: any;
}

interface ConnectionParams {
  clientId?: string;
  options?: mqtt.IClientOptions
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
  AddProduct = "product.list.request",
}

enum LockersTypes {
  GetLocker = 5,
  List = 6,
  OpenLocker = 7,
  CloseLocker = 9897,
}

enum BarCodeTypes {
  Listen = 8
}

enum Types {
  Error = -1,
}


class Emitter extends EventEmitter { }

class SocketController {
  private listener: Emitter = new Emitter();

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
      user.mqtt = this.createMQTTConnection({ clientId: user.user_id });
      this.saveUser(socket, message, user);
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
      case MachineTypes.AddProduct:
        this.addProduct(user, message);
        break;

      // Lockers
      case LockersTypes.List:
        this.consultAllLockers(user);
        break;
      case LockersTypes.GetLocker:
        this.consultLocker(user, message);
        break;
      case LockersTypes.OpenLocker:
        this.openBox(user, message);
        break;
      case LockersTypes.CloseLocker:
        this.closeLocker(user, message);
        break;
      case BarCodeTypes.Listen:
        this.listenBarCodeEvent(socket, message);
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

  public machineList = async (user: ISocketUser, message: IMessage): Promise<void> => {
    user.mqtt!.subscribe(process.env.MACHINE_RESPONSE_TOPIC!);
    user.mqtt!.publish(
      process.env.MACHINE_REQUEST_TOPIC!,
      JSON.stringify({
        action: "machine.list",
      }),
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
    // const topic: string = process.env.MACHINE_RESPONSE_TOPIC!;

    console.log(topic);

    user.mqtt!.subscribe(topic.toLocaleLowerCase());

    user.mqtt!.publish(
      process.env.MACHINE_REQUEST_TOPIC!,
      JSON.stringify({
        action: "product.list.request",
        device_id: message.data.machine_id,
      })
    );

    user.mqtt!.on("message", (_, message) => {

      if (!message.toString().includes('{')) {
        console.log('INVALID MESSAGE: ' + message);
        return;
      }

      const response = JSON.parse(message.toString());

      console.log('RESPONSE TYPE 1: ' + JSON.stringify(response));

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
    user.mqtt!.subscribe(process.env.MACHINE_RESPONSE_TOPIC!);
    user.mqtt!.publish(
      process.env.MACHINE_REQUEST_TOPIC!,
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

  private addProduct = async (
    user: ISocketUser,
    message: IMessage
  ): Promise<void> => {
    const device_id: string = message.data.machine_id;
    const products: string = message.data.products;

    user.mqtt!.subscribe(process.env.MACHINE_RESPONSE_TOPIC!);

    user.mqtt!.publish(
      process.env.MACHINE_REQUEST_TOPIC!,
      JSON.stringify({
        action: MachineActions.AddProduct,
        device_id,
        products,
      })
    );

    user.socket!.send(
      JSON.stringify({
        type: MachineTypes.AddProduct,
        data: {
          message: "Product added successfully",
        },
      })
    );

    user.mqtt!.on("message", (_, message) => {
      const response = JSON.parse(message.toString());

      console.log(response);

      switch (response.action) {
        case "product.list.response":
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
              type: MachineTypes.AddProduct,
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

    user.mqtt!.subscribe(process.env.MACHINE_RESPONSE_TOPIC!);

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

    user.mqtt!.publish(process.env.MACHINE_REQUEST_TOPIC!, JSON.stringify(params));

    user.mqtt!.on("message", (_, message) => {
      console.log(message.toString());

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

  private saveUser = async (socket: ws, message: IMessage, user?: ISocketUser): Promise<void> => {

    (socket as any).id = message.data.user_id || message.data.device_id;

    socketUsers.addUser(
      user || {
        socket,
        user_id: message.data.user_id,
        device_id: message.data.device_id,
      }
    );
  };

  private consultAllLockers = async (
    user: ISocketUser
  ): Promise<void> => {
    let client: mqtt.MqttClient = user.mqtt!;

    client.subscribe(process.env.LOCKERS_RESPONSE_TOPIC!);

    client.publish(
      process.env.LOCKERS_REQUEST_TOPIC!,
      JSON.stringify({
        action: "get.lockers",
      })
    );

    client.on("message", (_, message) => {
      const response = JSON.parse(message.toString());

      console.log(response);

      switch (response.action) {
        case "locker.list":
          user.socket!.send(
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
    message: IMessage,
  ): Promise<void> => {
    const locker_name: string = message.data.locker_name.toLocaleLowerCase();
    const box_name: string = message.data.box_name.toLocaleLowerCase();
    const user_id: string = message.data.user_id;
    const token: string = message.data.token;

    const options: mqtt.IClientOptions = {
      clientId: user_id,
      username: process.env.MQTT_USERNAME,
      password: token,
      port: parseInt(process.env.MQTT_PORT!),
    };

    let client: mqtt.MqttClient = this.createMQTTConnection({ options });

    await new Promise(f => setTimeout(f, 500));

    const requestTopic = process.env.LOCKERS_REQUEST_TOPIC!;
    const responseTopic = process.env.LOCKERS_RESPONSE_TOPIC!;

    client.subscribe(responseTopic);

    client.publish(
      requestTopic,
      JSON.stringify(
        {
          'action': 'box.open',
          'locker-name': locker_name,
          'box-name': box_name,
          'sender-id': user_id,
          'token': token,
        }
      )
    );

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

    user.mqtt!.subscribe(process.env.LOCKERS_RESPONSE_TOPIC!);

    user.mqtt!.publish(
      process.env.LOCKERS_REQUEST_TOPIC!,
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

  private closeLocker = async (
    user: ISocketUser,
    message: IMessage
  ): Promise<void> => {
    const locker_name: string = message.data.locker_name.toLocaleLowerCase();
    const box_name: string = message.data.box_name.toLocaleLowerCase();

    const topic = `devices/lockers/${locker_name}/${box_name}`;

    user.mqtt!.subscribe(topic);

    user.mqtt!.publish(topic, '0');

    user.mqtt!.on("message", (_, message) => {
      const response = JSON.parse(message.toString());

      console.log('RESPONSE: ' + response);

      user.socket!.send(
        JSON.stringify({
          type: LockersTypes.CloseLocker,
          data: {
            response,
          },
        })
      );
    });
  };

  public listenBarCode = async (): Promise<void> => {
    const options: mqtt.IClientOptions = {
      clientId: v1(),
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
      port: parseInt(process.env.MQTT_PORT || "") || 10110,
    };

    let client: mqtt.MqttClient = this.createMQTTConnection({ options });

    client.on("connect", () => {
      console.log('MQTT CONNECTED')
    })

    client.on("error", (e) => {
      console.log('ERROR:' + e.message)
    })

    client.subscribe(process.env.BARCODE_RESPONSE_TOPIC!);

    client.on("message", (_, message) => {
      const response = JSON.parse(message.toString());

      console.log(response);

      const device_id = response.device_id;

      const user = socketUsers.getUserByDeviceId(device_id);

      if (!user) {
        console.log(`USER WITH DEVICE ID: ${device_id} NOT FOUND`);
      }

      user?.socket?.send(
        JSON.stringify({
          type: BarCodeTypes.Listen,
          data: {
            barcode: response,
          }
        })
      );
    });
  };

  public listenBarCodeEvent = (socket: ws, message: IMessage) => {
    this.saveUser(socket, message);
    const user = socketUsers.getUserByDeviceId(message.data.device_id);

    user?.socket?.send(
      JSON.stringify({
        status: 'connected',
      })
    );
  };

  private createMQTTConnection = (params: ConnectionParams): mqtt.MqttClient => {
    const client = mqtt.connect(
      process.env.MQTT_HOST,
      params.options || {
        clientId: params.clientId,
        username: process.env.MQTT_USERNAME,
        password: process.env.MQTT_PASSWORD,
        port: parseInt(process.env.MQTT_PORT || "") || 10110,
      }
    );

    client.on("connect", () => {
      console.log('USER MQTT CONNECTED')
    })

    client.on("error", (e) => {
      console.log('ERROR:' + e.message)
    })

    return client;
  };

  private onDisconnectedUser = async (socket: ws): Promise<void> => {
    socketUsers.disconnectUser(socket);
  };
}

export const socketController = new SocketController();
