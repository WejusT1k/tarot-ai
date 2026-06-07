import 'reflect-metadata';
import { join } from 'node:path';
import { config } from 'dotenv';
import { DataSource, type DataSourceOptions } from 'typeorm';
import { Card } from '../modules/cards/card.entity';

// Load apps/api/.env for standalone runs (seed script, TypeORM CLI).
config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Card],
  // Migrations own the schema in production: the deploy build runs
  // `migration:run` (see vercel.json), so the serverless runtime never syncs
  // or migrates on a cold start. Local dev keeps `synchronize` for zero-setup
  // convenience — migrations are the source of truth for anything deployed.
  synchronize: process.env.NODE_ENV !== 'production',
  // __dirname-relative so the glob resolves whether we run from compiled JS
  // (dist/database, used by the deploy build) or TS source (ts-node CLI).
  migrations: [join(__dirname, 'migrations', '*.{js,ts}')],
  // Managed serverless Postgres (Neon, etc.) requires TLS.
  ssl:
    process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  logging: process.env.NODE_ENV !== 'production' ? ['error', 'warn'] : false,
};

export const AppDataSource = new DataSource(dataSourceOptions);
