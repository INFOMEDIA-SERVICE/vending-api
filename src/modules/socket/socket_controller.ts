import ws from 'ws';
import { Request } from 'express';
import { ISocketUser, socketUsers } from './socket_model';

interface IMessage {
    type?: number
    data?: any
}

class SocketController {

    public onConnect = async(socket:ws, req:Request):Promise<void> => {

        console.log('User connected');
        socket.on('message', (data) => this.onMessage(socket, data, req));

    };

    private onMessage = async(socket:ws, data:ws.Data, req:Request):Promise<void> => {
        const message:IMessage = JSON.parse(data.toString());
        switch (message.type) {
            case 0: this.saveUser(socket, message); break;
            default:
                socket.send(JSON.stringify({
                    type: -1,
                    message: 'Type not found'
                }));
            break;
        }
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
