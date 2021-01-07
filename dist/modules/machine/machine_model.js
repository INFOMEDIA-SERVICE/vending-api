"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=machine_model.js.map