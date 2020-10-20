import Sequelize from 'sequelize';
import { sequelize } from '../database/database';

export interface IProduct {
    id: number
    name: string
    price: number
    image: string
    item: number
    status?: boolean
    createdAt?: Date;
    updatedAt?: Date;
}

const Product = sequelize.define('products', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    name: {
        allowNull: false,
        type: Sequelize.TEXT,
        unique: true
    },
    price: {
        type: Sequelize.BIGINT,
    },
    image: {
        type: Sequelize.TEXT,
    },
    item: {
        type: Sequelize.INTEGER
    },
    status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: false
});

export default Product;
