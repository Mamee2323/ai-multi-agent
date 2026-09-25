#!/usr/bin/env node
/**
 * List / delete contact messages and purge entries older than 90 days (D10, L10).
 * Owner-side script only — there is no public admin endpoint.
 *
 * Usage:
 *   node scripts/contact-manage.mjs list
 *   node scripts/contact-manage.mjs delete <id>
 *   node scripts/contact-manage.mjs purge [--days 90]
 *
 * Uses the same DATA_DIR as the site (default ./data).
 */
import { DatabaseSync } from 'node:sqlite';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const [command, arg, flag] = process.argv.slice(2);
const dataDir = process.env.DATA_DIR || join(process.cwd(), 'data');
const dbPath = join(dataDir, 'site.sqlite');

if (!existsSync(dbPath)) {
  console.error(`Database not found: ${dbPath} (set DATA_DIR if it lives elsewhere)`);
  process.exit(1);
}

const db = new DatabaseSync(dbPath);

if (command === 'list') {
  const rows = db
    .prepare('SELECT id, name, email, message, created_at FROM contact_messages ORDER BY created_at DESC, id DESC')
    .all();
  if (rows.length === 0) {
    console.log('No contact messages.');
  } else {
    for (const row of rows) {
      console.log(`#${row.id} [${row.created_at}] ${row.name} <${row.email}>`);
      console.log(`  ${row.message.replaceAll('\n', '\n  ')}`);
    }
    console.log(`\n${rows.length} message(s).`);
  }
} else if (command === 'delete') {
  const id = Number(arg);
  if (!Number.isInteger(id) || id <= 0) {
    console.error('Usage: node scripts/contact-manage.mjs delete <id>');
    process.exit(1);
  }
  const result = db.prepare('DELETE FROM contact_messages WHERE id = ?').run(id);
  if (result.changes === 0) {
    console.error(`No contact message with id ${id}`);
    process.exit(1);
  }
  console.log(`Deleted contact message ${id}`);
} else if (command === 'purge') {
  // D10: retention 90 days by default. `--days` sits in the `arg` slot.
  let days = 90;
  if (arg === '--days') {
    const parsed = Number(flag);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      console.error('--days must be a positive number');
      process.exit(1);
    }
    days = parsed;
  } else if (arg !== undefined) {
    console.error('Usage: node scripts/contact-manage.mjs purge [--days 90]');
    process.exit(1);
  }
  const result = db
    .prepare(
      `DELETE FROM contact_messages WHERE created_at < datetime('now', ?)`
    )
    .run(`-${Math.floor(days)} days`);
  console.log(`Purged ${result.changes} contact message(s) older than ${days} days.`);
} else {
  console.error(
    'Usage:\n  node scripts/contact-manage.mjs list\n  node scripts/contact-manage.mjs delete <id>\n  node scripts/contact-manage.mjs purge [--days 90]'
  );
  process.exit(1);
}
