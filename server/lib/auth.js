import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const COOKIE_NAME = 'ip3_session';
const SESSION_DAYS = Number(process.env.SESSION_DAYS || 7);
const MAX_AGE_MS = SESSION_DAYS * 86400000;

/** True on Vercel and anywhere NODE_ENV=production. Development conveniences are off here. */
export function isProduction() {
  return process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
}

function jwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;
  // A well-known signing key would let anyone mint an admin session, so production refuses to start one.
  if (isProduction()) throw new Error('JWT_SECRET is not set. Set it in the environment before signing in.');
  return 'ip3-local-development-only-secret';
}

/** Constant-time comparison so a wrong passphrase leaks no timing information. */
function safeEqual(a = '', b = '') {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Verifies the administrator passphrase.
 * ADMIN_PASSWORD_HASH (a bcrypt hash) is preferred; ADMIN_PASSWORD is accepted
 * as a plain fallback for smaller deployments. In development only, 'admin' works when neither is
 * set. In production, with neither set, nobody can sign in.
 */
export async function verifyPassword(password) {
  if (!password) return false;

  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (hash) return bcrypt.compare(password, hash);

  const plain = process.env.ADMIN_PASSWORD || (isProduction() ? '' : 'admin');
  if (!plain) return false;
  return safeEqual(password, plain);
}

export function cookieOptions() {
  // The site and the API share one origin, so Lax is enough. Set COOKIE_SAMESITE=none only if the
  // API is deliberately served from a different site.
  const sameSite = process.env.COOKIE_SAMESITE || 'lax';
  return {
    httpOnly: true,
    secure: true,
    sameSite,
    maxAge: MAX_AGE_MS,
    path: '/',
  };
}

export function issueSession(res, user) {
  const expiresAt = new Date(Date.now() + MAX_AGE_MS);
  const token = jwt.sign({ sub: user.email, role: user.role }, jwtSecret(), {
    expiresIn: `${SESSION_DAYS}d`,
  });
  try {
    res.cookie(COOKIE_NAME, token, cookieOptions());
  } catch {
    // ignore if headers already sent
  }
  return { expiresAt: expiresAt.toISOString(), token };
}

export function clearSession(res) {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions(), maxAge: undefined });
}

export function readSession(req) {
  const cookieToken = req.cookies?.[COOKIE_NAME];
  const authHeader = req.headers?.authorization;
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
  const token = cookieToken || headerToken;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, jwtSecret());
    return {
      user: { email: payload.sub, role: payload.role || 'admin' },
      expiresAt: new Date(payload.exp * 1000).toISOString(),
    };
  } catch {
    return null;
  }
}

/** Gate for every write and every read of private data. */
export function requireAdmin(req, res, next) {
  const session = readSession(req);
  if (!session || session.user.role !== 'admin') {
    return res.status(401).json({ ok: false, error: 'Administrator session required.', code: 'UNAUTHENTICATED' });
  }
  req.admin = session.user;
  next();
}

/** Attaches the session when present but never rejects. */
export function optionalAdmin(req, _res, next) {
  const session = readSession(req);
  if (session) req.admin = session.user;
  next();
}
