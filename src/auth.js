import crypto from 'node:crypto';
import { parseCookies } from './http-utils.js';

const sessions = new Map();

export function loginUser(res, user) {
  const token = crypto.randomBytes(24).toString('hex');
  sessions.set(token, { userId: user.id, createdAt: Date.now() });
  res.setHeader('Set-Cookie', `cn_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=28800`);
}

export function logoutUser(req, res) {
  const token = parseCookies(req).cn_session;
  if (token) sessions.delete(token);
  res.setHeader('Set-Cookie', 'cn_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0');
}

export function currentUser(req, db) {
  const token = parseCookies(req).cn_session;
  const session = token && sessions.get(token);
  if (!session) return null;
  return db.users.find((u) => u.id === session.userId) || null;
}

export function requireUser(req, db, role) {
  const user = currentUser(req, db);
  if (!user) return null;
  if (role && user.role !== role) return null;
  return user;
}
