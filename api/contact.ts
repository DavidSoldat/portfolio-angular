import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';
import { handleContact, type ContactMessage } from '../src/shared/contact';

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env['SMTP_EMAIL'], pass: process.env['SMTP_PASSWORD'] },
});

async function send(m: ContactMessage): Promise<void> {
  await transport.sendMail({
    from: process.env['SMTP_EMAIL'],
    to: process.env['SMTP_EMAIL'],
    replyTo: m.email,
    subject: `Portfolio message from ${m.name}`,
    text: `${m.message}\n\n--\n${m.name} <${m.email}>`,
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const result = await handleContact(req.method ?? '', req.body, send);
  res.status(result.status).json(result.body);
}
