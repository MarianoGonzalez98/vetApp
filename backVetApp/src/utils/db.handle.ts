import { Pool } from 'pg';

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port : Number(process.env.DB_PORT),
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
}

const pool = new Pool(config);

export {pool}

