export interface ContactMessage { name: string; email: string; message: string; }
export type ContactField = 'name' | 'email' | 'message';
export type ContactErrors = Partial<Record<ContactField, string>>;
export type ContactValidation =
  | { ok: true; value: ContactMessage; bot: boolean }
  | { ok: false; errors: ContactErrors };
export interface ContactResult { status: number; body: Record<string, unknown>; }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

export function validateContact(input: unknown): ContactValidation {
  const o = (typeof input === 'object' && input !== null ? input : {}) as Record<string, unknown>;
  const name = text(o['name']);
  const email = text(o['email']);
  const message = text(o['message']);
  const errors: ContactErrors = {};

  if (!name) errors.name = 'Enter your name.';
  else if (/[\r\n]/.test(name)) errors.name = 'Enter your name on one line.';
  else if (name.length > 100) errors.name = 'Keep your name under 100 characters.';

  if (!email) errors.email = 'Enter your email address.';
  else if (email.length > 254 || !EMAIL.test(email)) errors.email = 'Enter a valid email address, like name@example.com.';

  if (message.length < 10) errors.message = 'Write at least 10 characters.';
  else if (message.length > 5000) errors.message = 'Keep the message under 5000 characters.';

  if (Object.keys(errors).length) return { ok: false, errors };
  // Honeypot field name avoids anything browser autofill fills in (website, url, company...).
  return { ok: true, value: { name, email, message }, bot: text(o['hp_trap']) !== '' };
}

/** Reads a request body whose getter may throw (Vercel parses JSON lazily and throws on bad JSON). */
export function readBody(get: () => unknown): unknown {
  try {
    return get();
  } catch {
    return null;
  }
}

function parse(body: unknown): unknown {
  if (typeof body !== 'string') return body;
  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
}

export async function handleContact(
  method: string,
  body: unknown,
  send: (m: ContactMessage) => Promise<void>,
): Promise<ContactResult> {
  if (method !== 'POST') return { status: 405, body: { error: 'Method not allowed' } };
  const result = validateContact(parse(body));
  if (!result.ok) return { status: 400, body: { errors: result.errors } };
  if (result.bot) return { status: 200, body: { ok: true } };
  try {
    await send(result.value);
    return { status: 200, body: { ok: true } };
  } catch (err) {
    console.error('contact: send failed', err);
    return { status: 502, body: { error: 'Could not send the message.' } };
  }
}
