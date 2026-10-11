import { vi } from 'vitest';
import { handleContact, readBody, validateContact } from './contact';

const valid = { name: 'Ana', email: 'ana@example.com', message: 'Hello David, are you available?' };

describe('validateContact', () => {
  it('accepts a valid message and trims fields', () => {
    const r = validateContact({ name: '  Ana ', email: ' ana@example.com ', message: '  Hello David, hi  ' });
    expect(r).toEqual({ ok: true, bot: false, value: { name: 'Ana', email: 'ana@example.com', message: 'Hello David, hi' } });
  });

  it('requires every field', () => {
    const r = validateContact({});
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(['email', 'message', 'name']);
  });

  it('rejects a name with a line break (header injection)', () => {
    const r = validateContact({ ...valid, name: 'Ana\r\nBcc: spam@example.com' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.name).toBe('Enter your name on one line.');
  });

  it('rejects a name over 100 characters', () => {
    const r = validateContact({ ...valid, name: 'a'.repeat(101) });
    expect(r.ok).toBe(false);
  });

  it.each(['ana', 'ana@', 'ana@example', 'a b@example.com'])('rejects the email %s', (email) => {
    const r = validateContact({ ...valid, email });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.email).toBe('Enter a valid email address, like name@example.com.');
  });

  it('enforces message length 10 to 5000', () => {
    expect(validateContact({ ...valid, message: 'too short' }).ok).toBe(false);
    expect(validateContact({ ...valid, message: 'x'.repeat(5001) }).ok).toBe(false);
    expect(validateContact({ ...valid, message: 'x'.repeat(5000) }).ok).toBe(true);
  });

  it('flags a filled honeypot as a bot', () => {
    const r = validateContact({ ...valid, hp_trap: 'http://spam.example' });
    expect(r.ok && r.bot).toBe(true);
  });

  it('does not treat an autofilled website field as a bot', () => {
    const r = validateContact({ ...valid, website: 'https://ana.dev' });
    expect(r.ok && r.bot).toBe(false);
  });

  it('treats non-objects as empty input', () => {
    expect(validateContact(null).ok).toBe(false);
    expect(validateContact('hello').ok).toBe(false);
  });
});

describe('handleContact', () => {
  it('returns 405 for anything but POST', async () => {
    const send = vi.fn();
    expect((await handleContact('GET', valid, send)).status).toBe(405);
    expect(send).not.toHaveBeenCalled();
  });

  it('returns 400 with field errors for an invalid body', async () => {
    const r = await handleContact('POST', { ...valid, email: 'nope' }, vi.fn());
    expect(r.status).toBe(400);
    expect(r.body['errors']).toHaveProperty('email');
  });

  it('returns 400, not 500, for a malformed JSON string', async () => {
    const r = await handleContact('POST', '{not json', vi.fn());
    expect(r.status).toBe(400);
  });

  it('parses a JSON string body', async () => {
    const send = vi.fn().mockResolvedValue(undefined);
    const r = await handleContact('POST', JSON.stringify(valid), send);
    expect(r.status).toBe(200);
    expect(send).toHaveBeenCalledOnce();
  });

  it('sends once and returns 200 for a valid body', async () => {
    const send = vi.fn().mockResolvedValue(undefined);
    const r = await handleContact('POST', valid, send);
    expect(r).toEqual({ status: 200, body: { ok: true } });
    expect(send).toHaveBeenCalledWith({ name: 'Ana', email: 'ana@example.com', message: valid.message });
  });

  it('pretends success for bots without sending', async () => {
    const send = vi.fn();
    const r = await handleContact('POST', { ...valid, hp_trap: 'x' }, send);
    expect(r.status).toBe(200);
    expect(send).not.toHaveBeenCalled();
  });

  it('returns 502 without details when sending fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const r = await handleContact('POST', valid, vi.fn().mockRejectedValue(new Error('SMTP auth failed: secret')));
    expect(r.status).toBe(502);
    expect(JSON.stringify(r.body)).not.toContain('secret');
  });
});

describe('readBody', () => {
  it('returns the body when reading it works', () => {
    expect(readBody(() => ({ a: 1 }))).toEqual({ a: 1 });
  });

  it('returns null when the platform throws while parsing (malformed JSON)', async () => {
    const body = readBody(() => { throw new Error('Invalid JSON'); });
    expect(body).toBeNull();
    expect((await handleContact('POST', body, vi.fn())).status).toBe(400);
  });
});
