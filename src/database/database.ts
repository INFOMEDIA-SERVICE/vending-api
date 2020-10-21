// import {Sequelize} from 'sequelize-typescript';
// import User from '../models/users_model';
// import Product from '../models/products_model';
import { Pool } from 'pg';

// const sequelize: Sequelize = new Sequelize({
//     database: 'vending',
//     host: 'localhost',
//     username: 'postgres',
//     password: '37375930',
//     dialect: 'postgres',
//     storage: ':memory:',
//     logging: false,
//     pool: {
//         max: 5,
//         min: 0,
//         idle: 10000
//     },
//     models: [
//         __dirname + '/models'
//     ]
// });

// export default sequelize;

export const database = new Pool({
    user: 'postgres',
    database: 'vending',
    host: 'localhost',
    password: '37375930'
});
