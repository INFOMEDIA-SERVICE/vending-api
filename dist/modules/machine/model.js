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
            let index2 = this.users.findIndex((u) => {
                return u.device_id === user.device_id && user.device_id !== undefined;
            });
            let finalIndex = index === -1 ? index2 : index;
            if (finalIndex === -1) {
                this.users.push(user);
            }
            else {
                this.users[finalIndex].socket = user.socket;
                this.users[finalIndex].active = true;
            }
        };
        this.getUserById = (userId) => {
            let index = this.users.findIndex((u) => {
                return u.user_id === userId;
            });
            let index2 = this.users.findIndex((u) => {
                return u.device_id === userId;
            });
            let finalIndex = index === -1 ? index2 : index;
            if (finalIndex === -1)
                return;
            return this.users[finalIndex];
        };
        this.getUserByDeviceId = (deviceId) => {
            let index = this.users.findIndex((u) => {
                return u.device_id === deviceId && u.device_id !== undefined;
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
            let index = this.users.findIndex((u) => {
                return u.user_id === user.user_id;
            });
            let index2 = this.users.findIndex((u) => {
                return u.device_id === user.device_id && user.device_id !== undefined;
            });
            let finalIndex = index === -1 ? index2 : index;
            if (finalIndex === -1)
                return;
            const newUsers = [...this.users];
            newUsers[finalIndex].active = newUsers[finalIndex].active;
            newUsers[finalIndex].mqtt = undefined;
            return newUsers;
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
        this.disconnectUser = (client) => {
            let index = this.users.findIndex((u) => {
                if (!(u === null || u === void 0 ? void 0 : u.socket))
                    return false;
                return u.socket.id === client.id;
            });
            if (index === -1)
                return;
            const newUsers = this.editUserStatus(this.users[index]);
            if (!newUsers)
                return;
            console.log(`User disconnect ${this.users[index].user_id}`);
            this.users = newUsers;
        };
        this.users = [];
    }
}
exports.socketUsers = new SocketUsers();
//# sourceMappingURL=model.js.map