import ws from 'ws';
import mqtt from 'mqtt';

export interface ISocketUser {
    user_id: string
    device_id?: string
    socket?: ws
    mqtt?: mqtt.MqttClient
    active?: boolean
    createdAt?: Date
    updatedAt?: Date
}

class SocketUsers {

    private users: ISocketUser[] = [];

    constructor() {
        this.users = [];
    }

    public addUser = (user: ISocketUser): void => {

        let index: number = this.users.findIndex((u: ISocketUser): boolean => {
            return u.user_id === user.user_id;
        });

        if (index === -1) {
            this.users.push(user);
        } else {
            this.users[index].socket = user.socket!;
            this.users[index].active = true;
        }
    };

    public getUserById = (userId: String): ISocketUser | undefined => {

        let index: number = this.users.findIndex((u: ISocketUser): boolean => {
            return u.user_id === userId;
        });

        if (index === -1) return;

        return this.users[index];
    };

    public getUserByDeviceId = (deviceId: String): ISocketUser | undefined => {

        let index: number = this.users.findIndex((u: ISocketUser): boolean => {
            return u.device_id === deviceId;
        });

        if (index === -1) return;

        return this.users[index];
    };

    public getActiveUsers = (): ISocketUser[] => {
        return this.users.filter((u: ISocketUser) => u.active);
    };

    public getUsers = (): ISocketUser[] => {
        return this.users;
    };

    public editUserStatus = (user: ISocketUser): boolean => {

        let index: number = this.users.findIndex((u: ISocketUser): boolean => u.user_id === user.user_id);

        if (index === -1) return false;

        this.users[index].active = !this.users[index].active;
        this.users[index].mqtt = undefined;

        return true;
    };

    public update = (user: ISocketUser): boolean => {

        let index: number = this.users.findIndex((u: ISocketUser): boolean => {
            return u.user_id === user.user_id;
        });

        if (index === -1) return false;

        this.users[index] = this.users[index];

        return true;
    };

    public disconnectUser = (client: ws): void => {

        let index: number = this.users.findIndex(
            (u: ISocketUser): boolean => {
                if (!u?.socket) return false;
                return (u.socket as any).id === (client as any).id;
            },
        );

        if (index === -1) return;

        this.editUserStatus(this.users[index]);

        console.log(`User disconnect ${this.users[index].user_id}`);

        this.users = this.users;
    };


}

export const socketUsers: SocketUsers = new SocketUsers();
