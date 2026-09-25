import type { APIRoute } from 'astro';
import { insertContact } from '../../lib/db';

export const prerender = false;

/**
 * POST /api/contact
 * Lab 05: validate JSON {name,email,message}, persist with insertContact, return 201.
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    // Honeypot (D6): hidden "website" field filled → pretend success, save nothing.
    if (typeof body?.website === 'string' && body.website.trim() !== '') {
      return new Response(JSON.stringify({ ok: true }), {
        status: 201,
        headers: { 'content-type': 'application/json' },
      });
    }
    const row = insertContact(body);
    // Do not echo `email` back in the 201 response (D5) — FE never reads the body.
    return new Response(
      JSON.stringify({ id: row.id, name: row.name, created_at: row.created_at }),
      {
        status: 201,
        headers: { 'content-type': 'application/json' },
      }
    );
  } catch (err) {
    // Never leak raw validation/SQL errors to the public (AGENTS.md guardrail).
    console.error('[api/contact POST]', err);
    const message = err instanceof Error ? err.message : 'error';
    const status = message.startsWith('NOT_IMPLEMENTED') ? 501 : 400;
    return new Response(JSON.stringify({ error: 'bad request' }), {
      status,
      headers: { 'content-type': 'application/json' },
    });
  }
};
