/**
 * SQLite helpers for contact + guestbook.
 * Persistence (Lab 00 template) + server-side safeguards (Lab 05):
 * length limits, guestbook list LIMIT. Honeypot / response shaping lives in api/*.ts.
 */
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

export type GuestbookEntry = {
  id: number;
  name: string;
  message: string;
  created_at: string;
};

let db: DatabaseSync | null = null;

function normalizeText(value: unknown, field: string, max?: number): string {
  if (typeof value !== 'string') {
    throw new Error(`${field} must be a string`);
  }
  const text = value.trim();
  if (!text) {
    throw new Error(`${field} is required`);
  }
  if (max !== undefined && text.length > max) {
    throw new Error(`${field} must be at most ${max} characters`);
  }
  return text;
}

export function getDb(): DatabaseSync {
  if (db) return db;
  const dir = process.env.DATA_DIR || join(process.cwd(), 'data');
  mkdirSync(dir, { recursive: true });
  db = new DatabaseSync(join(dir, 'site.sqlite'));
  db.exec(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS guestbook (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  return db;
}

export function insertContact(input: {
  name: string;
  email: string;
  message: string;
}): ContactMessage {
  const name = normalizeText(input?.name, 'name', 80);
  const email = normalizeText(input?.email, 'email', 120);
  const message = normalizeText(input?.message, 'message', 2000);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('email must be a valid email address');
  }

  const database = getDb();
  const result = database
    .prepare(
      `INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)`
    )
    .run(name, email, message);

  const row = database
    .prepare('SELECT * FROM contact_messages WHERE id = ?')
    .get(Number(result.lastInsertRowid)) as ContactMessage | undefined;

  if (!row) {
    throw new Error('could not create contact message');
  }

  return row;
}

export function listGuestbook(): GuestbookEntry[] {
  const database = getDb();
  // LIMIT 50 = newest rows only (D6) — response shape { entries: [...] } unchanged.
  const rows = database
    .prepare(
      'SELECT * FROM guestbook ORDER BY created_at DESC, id DESC LIMIT 50'
    )
    .all() as GuestbookEntry[];
  return rows;
}

export function insertGuestbook(input: {
  name: string;
  message: string;
}): GuestbookEntry {
  const name = normalizeText(input?.name, 'name', 40);
  const message = normalizeText(input?.message, 'message', 500);

  const database = getDb();
  const result = database
    .prepare(`INSERT INTO guestbook (name, message) VALUES (?, ?)`)
    .run(name, message);

  const row = database
    .prepare('SELECT * FROM guestbook WHERE id = ?')
    .get(Number(result.lastInsertRowid)) as GuestbookEntry | undefined;

  if (!row) {
    throw new Error('could not create guestbook entry');
  }

  return row;
}
