import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './lib/db.js';

import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';
import leadRoutes from './routes/leads.js';
import bookingRoutes from './routes/bookings.js';
import mediaRoutes from './routes/media.js';
import healthRoutes from './routes/health.js';

const app = express();

// Behind Vercel's proxy: required for correct req.ip and for secure cookies.
app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(
  helmet({
    contentSecurityPolicy: false, // the static frontend is served separately
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false,
    frameguard: { action: 'sameorigin' },
  })
);

/**
 * Same-origin in both dev (Vite proxy) and on Vercel, so CORS only matters when
 * the frontend is deployed apart from the API. CORS_ORIGIN accepts a
 * comma-separated allowlist.
 */
const allowList = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      if (!origin || allowList.length === 0 || allowList.includes(origin)) return cb(null, true);
      cb(new Error('Origin not allowed by CORS.'));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

/**
 * One lazy connection, reused across warm invocations. Applied per-router, so
 * routes still work gracefully using fallback when the database is offline or unconfigured.
 */
const withDB = async (_req, _res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.warn('[withDB] MongoDB connection check:', err?.message);
  }
  next();
};

app.use('/api/auth', authRoutes);
app.use('/api/content', withDB, contentRoutes);
app.use('/api/leads', withDB, leadRoutes);
app.use('/api/bookings', withDB, bookingRoutes);
app.use('/api/media', withDB, mediaRoutes);
app.use('/api/health', withDB, healthRoutes);

app.use('/api', (_req, res) => {
  res.status(404).json({ ok: false, error: 'Endpoint not found.', code: 'NOT_FOUND' });
});

// eslint-disable-next-line no-unused-vars
app.use('/api', (err, req, res, _next) => {
  // A database that is unreachable is handled gracefully
  const isDbDown =
    err?.name === 'MongooseServerSelectionError' ||
    err?.name === 'MongoNetworkError' ||
    err?.name === 'MongoTimeoutError' ||
    err?.name === 'MongooseError' ||
    err?.message?.includes('buffering timed out') ||
    err?.code === 'DB_NOT_CONFIGURED';

  if (isDbDown) {
    console.warn('[AI Studio] Database offline or unconfigured:', err.message);
    if (req.method === 'GET') {
      if (req.path === '/content' || req.path === '/content/') {
        return res.json({ data: null, version: 0, updatedAt: null, seeded: false });
      }
      return res.json(req.path.endsWith('s') || req.path.endsWith('s/') ? { items: [] } : {});
    }
    return res.status(503).json({
      ok: false,
      error: 'The database is unavailable. Please try again in a moment.',
      code: 'DB_UNAVAILABLE',
    });
  }

  if (err?.name === 'ValidationError') {
    return res.status(400).json({ ok: false, error: err.message, code: 'VALIDATION_ERROR' });
  }

  if (err?.code === 11000) {
    return res.status(409).json({ ok: false, error: 'That record already exists.', code: 'DUPLICATE' });
  }

  const status = err.status || 500;
  if (status >= 500) console.error('[api]', err);
  res.status(status).json({
    ok: false,
    error: status >= 500 ? 'Something went wrong on the server.' : err.message,
    code: err.code || 'SERVER_ERROR',
  });
});

export default app;
