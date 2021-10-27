import ws from 'ws';
import mqtt from 'mqtt';

export interface ISocketUser {
    user_id: string
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

        let index: number = this.users.findIndex((u: ISocketUser): boolean => u.user_id === user.user_id);

        if (index == -1) {
            this.users.push(user);
        } else {
            this.users[index].socket = user.socket!;
            this.users[index].active = true;
        }
    };

    public getUserById = (user_id: String): ISocketUser | undefined => {

        let index: number = this.users.findIndex((u: ISocketUser): boolean => u.user_id === user_id);

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

        return true;
    };

    public disconnectUser = (socket: ws): void => {

        let index: number = this.users.findIndex(
            (u: ISocketUser): boolean => {
                if (!u?.socket) return false;
                return (u.socket as any).id === (socket as any).id;
            },
        );

        if (index === -1) return;

        this.editUserStatus(this.users[index]);

        console.log(`User disconnect ${this.users[index].user_id}`);

        this.users = this.users;
    };

}

export const socketUsers: SocketUsers = new SocketUsers();
