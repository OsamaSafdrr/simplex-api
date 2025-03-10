import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Product } from './products/entities/product.entity';
import { Order } from './orders/entities/order.entity';
import { config } from 'dotenv';

config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'mysql',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER || 'nest',
  password: process.env.DB_PASSWORD || 'nest',
  database: process.env.DB_NAME || 'nest_perf',
  entities: [Product, Order],
  synchronize: true,
  logging: true,
});