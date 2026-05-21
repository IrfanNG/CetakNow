import { checkPostgresConnection, closeDb, databaseModeLabel } from '../src/db.js';

if (!process.env.DATABASE_URL) {
  console.log(`Database mode: ${databaseModeLabel()}`);
  console.log('DATABASE_URL is not set. PostgreSQL check skipped; local JSON fallback is active.');
  process.exit(0);
}

try {
  const ok = await checkPostgresConnection();
  console.log(`Database mode: ${databaseModeLabel()}`);
  console.log(ok ? 'PostgreSQL connection check passed.' : 'PostgreSQL connection check returned an unexpected result.');
  process.exitCode = ok ? 0 : 1;
} catch (error) {
  console.error(`Database mode: ${databaseModeLabel()}`);
  console.error('PostgreSQL connection check failed.');
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await closeDb();
}
