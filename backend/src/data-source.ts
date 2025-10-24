import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { Transaction } from './transactions/transaction.entity';
import { TargetSaving } from './target-savings/target-savings.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'Morayoluwa@2020',
  database: process.env.DB_DATABASE || 'PocketMoni',
  synchronize: false,
  logging: false,
  entities: [User, Transaction, TargetSaving],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});
