import { Pool } from 'pg';

export const database: Pool = new Pool({
    user: process.env.POSTGRESS_USER,
    database: process.env.POSTGRESS_DATABASE,
    host: process.env.POSTGRESS_HOST,
    password: process.env.POSTGRESS_PASSWORD,
    port: parseInt(process.env.POSTGRESS_PORT || '')
});
