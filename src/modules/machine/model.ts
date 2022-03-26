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

        let index2: number = this.users.findIndex((u: ISocketUser): boolean => {
            return u.device_id === user.device_id && user.device_id !== undefined;
        });

        let finalIndex = index === -1 ? index2 : index;

        if (finalIndex === -1) {
            this.users.push(user);
        } else {
            this.users[finalIndex].socket = user.socket!;
            this.users[finalIndex].active = true;
        }
    };

    public getUserById = (userId: String): ISocketUser | undefined => {
        let index: number = this.users.findIndex((u: ISocketUser): boolean => {
            return u.user_id === userId;
        });

        let index2: number = this.users.findIndex((u: ISocketUser): boolean => {
            return u.device_id === userId;
        });

        let finalIndex = index === -1 ? index2 : index;

        if (finalIndex === -1) return;

        return this.users[finalIndex];
    };

    public getUserByDeviceId = (deviceId: String): ISocketUser | undefined => {

        let index: number = this.users.findIndex((u: ISocketUser): boolean => {
            return u.device_id === deviceId && u.device_id !== undefined;
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

    public editUserStatus = (user: ISocketUser): ISocketUser[] | undefined => {

        let index: number = this.users.findIndex((u: ISocketUser): boolean => {
            return u.user_id === user.user_id;
        });

        let index2: number = this.users.findIndex((u: ISocketUser): boolean => {
            return u.device_id === user.device_id && user.device_id !== undefined;
        });

        let finalIndex = index === -1 ? index2 : index;

        if (finalIndex === -1) return;

        const newUsers = [...this.users];

        newUsers[finalIndex].active = newUsers[finalIndex].active;
        newUsers[finalIndex].mqtt = undefined;

        return newUsers;
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

        const newUsers = this.editUserStatus(this.users[index]);

        if (!newUsers) return;

        console.log(`User disconnect ${this.users[index].user_id}`);

        this.users = newUsers;
    };


}

export const socketUsers: SocketUsers = new SocketUsers();
