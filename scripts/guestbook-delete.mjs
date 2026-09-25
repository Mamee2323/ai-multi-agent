#!/usr/bin/env node
/**
 * Delete a guestbook entry by id (D6 — no public DELETE endpoint, owner-side script only).
 * Usage: node scripts/guestbook-delete.mjs <id>
 * Uses the same DATA_DIR as the site (default ./data).
 */
import { DatabaseSync } from 'node:sqlite';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const id = Number(process.argv[2]);
if (!Number.isInteger(id) || id <= 0) {
  console.error('Usage: node scripts/guestbook-delete.mjs <id>');
  process.exit(1);
}

const dataDir = process.env.DATA_DIR || join(process.cwd(), 'data');
const dbPath = join(dataDir, 'site.sqlite');
if (!existsSync(dbPath)) {
  console.error(`Database not found: ${dbPath} (set DATA_DIR if it lives elsewhere)`);
  process.exit(1);
}

const db = new DatabaseSync(dbPath);
const result = db.prepare('DELETE FROM guestbook WHERE id = ?').run(id);
if (result.changes === 0) {
  console.error(`No guestbook entry with id ${id}`);
  process.exit(1);
}
console.log(`Deleted guestbook entry ${id}`);
