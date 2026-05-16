import fs from 'node:fs/promises';
import path from 'node:path';

const DATA_PATH = path.resolve('data/db.json');
const SEED_PATH = path.resolve('data/seed.json');

export async function ensureDb() {
  try {
    await fs.access(DATA_PATH);
  } catch {
    const seed = await fs.readFile(SEED_PATH, 'utf8');
    await fs.writeFile(DATA_PATH, seed);
  }
}

export async function readDb() {
  await ensureDb();
  return JSON.parse(await fs.readFile(DATA_PATH, 'utf8'));
}

export async function writeDb(db) {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(db, null, 2));
}

export async function tx(mutator) {
  const db = await readDb();
  const result = await mutator(db);
  await writeDb(db);
  return result;
}

export function nowIso() {
  return new Date().toISOString();
}

export function id(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}
