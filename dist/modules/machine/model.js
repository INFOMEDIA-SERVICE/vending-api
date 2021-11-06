"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketUsers = void 0;
class SocketUsers {
    constructor() {
        this.users = [];
        this.addUser = (user) => {
            let index = this.users.findIndex((u) => {
                return u.user_id === user.user_id;
            });
            if (index === -1) {
                this.users.push(user);
            }
            else {
                this.users[index].socket = user.socket;
                this.users[index].active = true;
            }
        };
        this.getUserById = (userId) => {
            let index = this.users.findIndex((u) => {
                return u.user_id === userId;
            });
            if (index === -1)
                return;
            return this.users[index];
        };
        this.getActiveUsers = () => {
            return this.users.filter((u) => u.active);
        };
        this.getUsers = () => {
            return this.users;
        };
        this.editUserStatus = (user) => {
            let index = this.users.findIndex((u) => u.user_id === user.user_id);
            if (index === -1)
                return false;
            this.users[index].active = !this.users[index].active;
            this.users[index].mqtt = undefined;
            return true;
        };
        this.update = (user) => {
            let index = this.users.findIndex((u) => {
                return u.user_id === user.user_id;
            });
            if (index === -1)
                return false;
            this.users[index] = this.users[index];
            return true;
        };
        this.disconnectUser = (socket) => {
            let index = this.users.findIndex((u) => {
                if (!(u === null || u === void 0 ? void 0 : u.socket))
                    return false;
                return u.socket.id === socket.id;
            });
            if (index === -1)
                return;
            this.editUserStatus(this.users[index]);
            console.log(`User disconnect ${this.users[index].user_id}`);
            this.users = this.users;
        };
        this.users = [];
    }
}
exports.socketUsers = new SocketUsers();
//# sourceMappingURL=model.js.map