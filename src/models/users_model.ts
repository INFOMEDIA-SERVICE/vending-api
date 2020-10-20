import Sequelize from 'sequelize';
import { sequelize } from '../database/database';

export interface IUser {
    id: number
    username: string
    email: string
    status?: boolean
    createdAt?: Date;
    updatedAt?: Date;
}

const User = sequelize.define('products', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    username: {
        allowNull: false,
        type: Sequelize.TEXT,
        unique: true
    },
    email: {
        allowNull: false,
        type: Sequelize.TEXT,
        unique: true
    },
    password: {
        allowNull: false,
        type: Sequelize.TEXT,
        unique: true
    },
    status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }
    
}, {
    timestamps: false
});

export default User;
