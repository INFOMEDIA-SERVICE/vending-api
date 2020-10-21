import { Pool } from 'pg';

export const database = new Pool({
    user: 'postgres',
    database: 'vendings',
    host: 'localhost',
    password: '37375930'
});
