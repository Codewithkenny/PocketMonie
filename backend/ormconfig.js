require('dotenv').config();

export const type = 'postgres';
export const host = process.env.DB_HOST || 'localhost';
export const port = parseInt(process.env.DB_PORT || '5432', 10);
export const username = process.env.DB_USERNAME || 'postgres';
export const password = process.env.DB_PASSWORD || 'postgres';
export const database = process.env.DB_DATABASE || 'pocketmoni';
export const synchronize = true;
export const logging = false;
export const entities = ['dist/**/*.entity{.ts,.js}', 'src/**/*.entity.ts'];
export const migrations = ['dist/migrations/*{.ts,.js}'];
