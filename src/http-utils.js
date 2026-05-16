import fs from 'node:fs/promises';
import path from 'node:path';

export async function readBody(req, limit = 60 * 1024 * 1024) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw Object.assign(new Error('Request too large'), { status: 413 });
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export function parseCookies(req) {
  return Object.fromEntries((req.headers.cookie || '').split(';').filter(Boolean).map((part) => {
    const [k, ...rest] = part.trim().split('=');
    return [decodeURIComponent(k), decodeURIComponent(rest.join('='))];
  }));
}

export async function parseForm(req) {
  const body = await readBody(req, 2 * 1024 * 1024);
  return Object.fromEntries(new URLSearchParams(body.toString('utf8')).entries());
}

export async function parseMultipart(req) {
  const contentType = req.headers['content-type'] || '';
  const boundary = contentType.match(/boundary=(.+)$/)?.[1];
  if (!boundary) throw Object.assign(new Error('Missing multipart boundary'), { status: 400 });
  const body = await readBody(req);
  const delimiter = Buffer.from(`--${boundary}`);
  const parts = [];
  let start = body.indexOf(delimiter) + delimiter.length + 2;
  while (start > delimiter.length) {
    const end = body.indexOf(delimiter, start);
    if (end === -1) break;
    const raw = body.subarray(start, end - 2);
    const headerEnd = raw.indexOf(Buffer.from('\r\n\r\n'));
    if (headerEnd !== -1) {
      const headerText = raw.subarray(0, headerEnd).toString('utf8');
      const value = raw.subarray(headerEnd + 4);
      const name = headerText.match(/name="([^"]+)"/)?.[1];
      const filename = headerText.match(/filename="([^"]*)"/)?.[1];
      const type = headerText.match(/Content-Type:\s*([^\r\n]+)/i)?.[1] || 'application/octet-stream';
      if (name) parts.push({ name, filename, type, value });
    }
    start = end + delimiter.length + 2;
  }
  const fields = {};
  const files = {};
  for (const part of parts) {
    if (part.filename !== undefined) files[part.name] = part;
    else fields[part.name] = part.value.toString('utf8');
  }
  return { fields, files };
}

export function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8', ...headers });
  res.end(body);
}

export function json(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

export function redirect(res, location) {
  res.writeHead(302, { Location: location });
  res.end();
}

export async function staticFile(req, res) {
  const safePath = path.normalize(new URL(req.url, 'http://x').pathname).replace(/^\/+/, '');
  const file = path.resolve(safePath);
  if (!file.startsWith(path.resolve('public'))) return false;
  try {
    const data = await fs.readFile(file);
    const type = file.endsWith('.css') ? 'text/css' : 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
    return true;
  } catch {
    return false;
  }
}

export function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
}
