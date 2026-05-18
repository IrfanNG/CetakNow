import fs from 'node:fs/promises';
import { tx, nowIso } from './db.js';

export async function cleanupExpiredFiles(now = new Date()) {
  let deleted = 0;
  await tx(async (db) => {
    for (const order of db.orders) {
      if (!order.file_deleted_at && order.file_path && new Date(order.file_delete_at) <= now) {
        const files = order.files?.length ? order.files : [{ file_path: order.file_path }];
        for (const file of files) {
          if (file.file_path) {
            try { await fs.unlink(file.file_path); } catch {}
          }
        }
        order.file_deleted_at = nowIso();
        order.updated_at = nowIso();
        deleted += files.length;
      }
    }
  });
  return deleted;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  cleanupExpiredFiles().then((count) => console.log(`Deleted ${count} expired files`));
}
