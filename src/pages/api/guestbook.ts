import type { APIRoute } from 'astro';
import { insertGuestbook, listGuestbook } from '../../lib/db';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const rows = listGuestbook();
    return new Response(JSON.stringify({ entries: rows }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    console.error('[api/guestbook GET]', err);
    const message = err instanceof Error ? err.message : 'error';
    const status = message.startsWith('NOT_IMPLEMENTED') ? 501 : 500;
    return new Response(JSON.stringify({ error: 'server error' }), {
      status,
      headers: { 'content-type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    // Honeypot (D6): bots fill the hidden "website" field — answer 201 silently
    // without persisting so they believe the submission succeeded.
    if (typeof body?.website === 'string' && body.website.trim() !== '') {
      return new Response(JSON.stringify({ ok: true }), {
        status: 201,
        headers: { 'content-type': 'application/json' },
      });
    }
    const row = insertGuestbook(body);
    return new Response(JSON.stringify(row), {
      status: 201,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    // Never leak raw validation/SQL errors to the public (AGENTS.md guardrail).
    console.error('[api/guestbook POST]', err);
    const message = err instanceof Error ? err.message : 'error';
    const status = message.startsWith('NOT_IMPLEMENTED') ? 501 : 400;
    return new Response(JSON.stringify({ error: 'bad request' }), {
      status,
      headers: { 'content-type': 'application/json' },
    });
  }
};
