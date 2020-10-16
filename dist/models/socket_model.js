"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketUsers = void 0;
class SocketUsers {
    constructor() {
        this.addUser = (user) => {
            this.users.push(user);
        };
        this.getUserById = (userId) => {
            const user = this.users.filter(user => {
                return user.userId === userId;
            })[0];
            return user;
        };
        this.getUsers = () => {
            return this.users;
        };
        this.deleteUser = (userId) => {
            this.users = this.users.filter(user => user.userId !== userId);
        };
        this.users = [];
    }
}
exports.socketUsers = new SocketUsers();
//# sourceMappingURL=socket_model.js.map