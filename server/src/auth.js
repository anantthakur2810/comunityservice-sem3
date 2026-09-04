import { createHash, timingSafeEqual } from 'node:crypto';

export function adminPassword() {
  return process.env.ADMIN_PASSWORD || 'admin123';
}

function secret() {
  return process.env.ADMIN_SECRET || 'dps-ngo-secret';
}

/** Stateless bearer token derived from the admin password + secret. */
export function adminToken() {
  return createHash('sha256').update(adminPassword() + secret()).digest('hex');
}

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const expected = adminToken();
  if (
    !token ||
    token.length !== expected.length ||
    !timingSafeEqual(Buffer.from(token), Buffer.from(expected))
  ) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}