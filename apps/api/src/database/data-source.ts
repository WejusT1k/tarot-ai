import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource, type DataSourceOptions } from 'typeorm';
import { Card } from '../modules/cards/card.entity';

// Load apps/api/.env for standalone runs (seed script, TypeORM CLI).
config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Card],
  // Schema sync from entities. ON in local dev for convenience; OFF in
  // production (serverless must NOT sync on every cold start). For the one-time
  // schema+seed against a managed DB (e.g. Neon), run with DB_SYNCHRONIZE=true.
  // (Proper migrations are still the eventual target — Decision #20.)
  synchronize:
    process.env.DB_SYNCHRONIZE === 'true' ||
    process.env.NODE_ENV !== 'production',
  // Managed serverless Postgres (Neon, etc.) requires TLS.
  ssl:
    process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  logging: process.env.NODE_ENV !== 'production' ? ['error', 'warn'] : false,
};

export const AppDataSource = new DataSource(dataSourceOptions);
