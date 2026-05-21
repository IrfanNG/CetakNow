import fs from 'node:fs/promises';
import path from 'node:path';
import { databaseMode, nowIso, query, tx, withPgTransaction } from './db.js';

const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || 'storage/pdfs');

export async function cleanupExpiredFiles(now = new Date()) {
  if (databaseMode() === 'postgres') return pgCleanup(now);
  return jsonCleanup(now);
}

async function pgCleanup(now) {
  const nowStr = nowIso();
  let checked = 0;
  let deleted = 0;
  let errors = 0;

  await withPgTransaction(async (client) => {
    const result = await client.query(
      'SELECT id, file_path FROM order_files WHERE delete_at <= $1 AND deleted_at IS NULL',
      [nowStr]
    );
    checked = result.rows.length;

    for (const file of result.rows) {
      const filePath = file.file_path;
      const resolvedPath = filePath ? path.resolve(filePath) : '';

      let canMark = false;

      if (resolvedPath && resolvedPath.startsWith(UPLOAD_DIR + path.sep)) {
        try {
          await fs.unlink(resolvedPath);
          deleted++;
          canMark = true;
        } catch (err) {
          if (err.code === 'ENOENT') {
            deleted++;
            canMark = true;
          } else {
            errors++;
          }
        }
      } else {
        errors++;
        canMark = true;
      }

      if (canMark && file.id) {
        await client.query(
          'UPDATE order_files SET deleted_at = $1 WHERE id = $2 AND deleted_at IS NULL',
          [nowStr, file.id]
        );
      }
    }
  });

  console.log(`Cleanup: ${checked} checked, ${deleted} deleted, ${errors} errors`);
  return deleted;
}

async function jsonCleanup(now) {
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
