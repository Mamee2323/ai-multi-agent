import { describe, it, expect } from 'vitest';
import { rmSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Lab 05 BE safeguards (issues #5, #6 · D5/D6):
 * server-side length limits, guestbook LIMIT, honeypot, no email echo, generic error body.
 */
process.env.DATA_DIR = join(process.cwd(), 'data', 'vitest-safeguards');
rmSync(process.env.DATA_DIR, { recursive: true, force: true });
mkdirSync(process.env.DATA_DIR, { recursive: true });

import { insertContact, insertGuestbook, listGuestbook, getDb } from '../src/lib/db';
import { POST as guestbookPost } from '../src/pages/api/guestbook';
import { POST as contactPost } from '../src/pages/api/contact';

function jsonRequest(url: string, body: unknown): Request {
  return new Request(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function contactCount(): number {
  const row = getDb().prepare('SELECT COUNT(*) AS n FROM contact_messages').get() as { n: number };
  return row.n;
}

describe('lab05 db length limits (server-side, M2)', () => {
  it('rejects guestbook name > 40 and message > 500', () => {
    expect(() => insertGuestbook({ name: 'x'.repeat(41), message: 'ok' })).toThrow(/at most 40/);
    expect(() => insertGuestbook({ name: 'ok', message: 'x'.repeat(501) })).toThrow(/at most 500/);
  });

  it('rejects contact name > 80, email > 120, message > 2000', () => {
    const base = { name: 'ok', email: 'a@b.co', message: 'ok' };
    expect(() => insertContact({ ...base, name: 'x'.repeat(81) })).toThrow(/at most 80/);
    expect(() => insertContact({ ...base, email: `${'x'.repeat(116)}@b.co` })).toThrow(/at most 120/);
    expect(() => insertContact({ ...base, message: 'x'.repeat(2001) })).toThrow(/at most 2000/);
  });

  it('accepts values exactly at the limits', () => {
    const row = insertGuestbook({ name: 'x'.repeat(40), message: 'x'.repeat(500) });
    expect(row.id).toBeGreaterThan(0);
  });
});

describe('lab05 listGuestbook LIMIT 50 (M3)', () => {
  it('returns at most 50 newest rows', () => {
    getDb(); // ensure init with DATA_DIR set
    for (let i = 0; i < 55; i++) {
      insertGuestbook({ name: `bulk-${i}`, message: 'limit test' });
    }
    const rows = listGuestbook();
    expect(rows.length).toBe(50);
    // newest first
    expect(rows[0].name).toBe('bulk-54');
  });
});

describe('lab05 honeypot + response shaping (M1, M4, M5)', () => {
  it('guestbook: honeypot filled → 201 {ok:true}, nothing persisted', async () => {
    const res = await guestbookPost({
      request: jsonRequest('http://localhost/api/guestbook', {
        name: 'bot',
        message: 'spam',
        website: 'http://spam.example',
      }),
    });
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ ok: true });
    expect(listGuestbook().some((r) => r.name === 'bot')).toBe(false);
  });

  it('contact: honeypot filled → 201 {ok:true}, nothing persisted', async () => {
    const before = contactCount();
    const res = await contactPost({
      request: jsonRequest('http://localhost:4321/api/contact', {
        name: 'bot',
        email: 'bot@spam.example',
        message: 'spam',
        website: 'x',
      }),
    });
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ ok: true });
    expect(contactCount()).toBe(before);
  });

  it('contact: valid post → 201 without echoing email (M4)', async () => {
    const res = await contactPost({
      request: jsonRequest('http://localhost:4321/api/contact', {
        name: 'Ada',
        email: 'ada@example.com',
        message: 'hello',
      }),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.id).toBeGreaterThan(0);
    expect(body.name).toBe('Ada');
    expect(body).not.toHaveProperty('email');
    expect(JSON.stringify(body)).not.toContain('ada@example.com');
  });

  it('guestbook: over-limit post → 400 generic error body, no raw message (M5)', async () => {
    const res = await guestbookPost({
      request: jsonRequest('http://localhost/api/guestbook', { name: 'x'.repeat(41), message: 'ok' }),
    });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'bad request' });
  });

  it('contact: invalid email → 400 generic error body', async () => {
    const res = await contactPost({
      request: jsonRequest('http://localhost:4321/api/contact', {
        name: 'Ada',
        email: 'not-an-email',
        message: 'hello',
      }),
    });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'bad request' });
  });
});
