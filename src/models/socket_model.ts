import ws from 'ws';

export interface ISocketUser {
    client: ws
    userId: string
    userName: string
}

class SocketUsers {

    private users: ISocketUser[];

    constructor() {
        this.users = [];
    }

    public addUser = (user:ISocketUser):void => {
        this.users.push(user);
    };

    public getUserById = (userId:String) => {

        const user:ISocketUser = this.users.filter(user => {
            return user.userId === userId;
        })[0];

        return user;
    };

    public getUsers = () => {
        return this.users;
    };

    public deleteUser = (userId:String):void => {
        this.users = this.users.filter(user => user.userId !== userId);
    };

}

export const socketUsers:SocketUsers = new SocketUsers();
