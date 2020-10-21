// import {Table, Column, Model, DataType} from 'sequelize-typescript';
 
// @Table
// class User extends Model<User> {
 
//   @Column(DataType.TEXT)
//   username?: string;

//   @Column(DataType.TEXT)
//   email?: string;

//   @Column(DataType.TEXT)
//   password?: string;

//   @Column(DataType.BOOLEAN)
//   status?: boolean;

// }

// export default User;

export interface IUser {
    id?: number
    username: string
    email: string
    password: string
    status?: boolean
}