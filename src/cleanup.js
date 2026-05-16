import fs from 'node:fs/promises';
import { tx, nowIso } from './db.js';

export async function cleanupExpiredFiles(now = new Date()) {
  let deleted = 0;
  await tx(async (db) => {
    for (const order of db.orders) {
      if (!order.file_deleted_at && order.file_path && new Date(order.file_delete_at) <= now) {
        try { await fs.unlink(order.file_path); } catch {}
        order.file_deleted_at = nowIso();
        order.updated_at = nowIso();
        deleted += 1;
      }
    }
  });
  return deleted;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  cleanupExpiredFiles().then((count) => console.log(`Deleted ${count} expired files`));
}
