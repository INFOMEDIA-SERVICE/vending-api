"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketUsers = void 0;
class SocketUsers {
    constructor() {
        this.addUser = (user) => {
            this.users.push(user);
        };
        this.getUserById = (user_id) => {
            const user = this.users.filter(user => {
                return user.user_id === user_id;
            })[0];
            return user;
        };
        this.getUsers = () => {
            return this.users;
        };
        this.deleteUser = (user_id) => {
            this.users = this.users.filter(user => user.user_id !== user_id);
        };
        this.users = [];
    }
}
exports.socketUsers = new SocketUsers();
//# sourceMappingURL=machine_model.js.map