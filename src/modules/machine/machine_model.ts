import ws from 'ws';

export interface ISocketUser {
    client: ws
    user_id: string
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

    public getUserById = (user_id:String) => {

        const user:ISocketUser = this.users.filter(user => {
            return user.user_id === user_id;
        })[0];

        return user;
    };

    public getUsers = () => {
        return this.users;
    };

    public deleteUser = (user_id:String):void => {
        this.users = this.users.filter(user => user.user_id !== user_id);
    };

}

export const socketUsers:SocketUsers = new SocketUsers();
