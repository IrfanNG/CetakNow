import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const { Pool } = pg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.resolve(__dirname, '../db/schema.sql');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is required to run database migrations.');
  process.exit(1);
}

const poolOptions = { connectionString: process.env.DATABASE_URL };
if (process.env.PGSSLMODE === 'require') {
  poolOptions.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(poolOptions);

try {
  const schema = await fs.readFile(schemaPath, 'utf8');
  await pool.query(schema);
  console.log('Database migration completed.');
} catch (error) {
  console.error('Database migration failed.');
  console.error(error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
