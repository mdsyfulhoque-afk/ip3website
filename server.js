/**
 * Local server — development and self-hosted production.
 *
 * It mounts the exact same Express app that Vercel deploys as a serverless
 * function, so there is no drift between environments. In development Vite runs
 * in middleware mode in front of it, giving one origin on
 * http://localhost:3000 — no CORS, no proxy. In production (`npm start`) the
 * built `dist/` is served statically instead.
 *
 * On Vercel neither branch runs: the static build is served by the CDN and
 * /api/* goes to api/index.js.
 */
import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import apiApp from './server/app.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

const app = express();

// /api/* is handled by the production app; everything else falls through.
app.use(apiApp);

if (isProd) {
  const distPath = path.resolve(__dirname, 'dist');
  if (!fs.existsSync(distPath)) {
    console.error('[IP3 Platform] dist/ is missing. Run `npm run build` first.');
    process.exit(1);
  }

  // Hashed bundles never change, so they are cached for a year. Everything else (pages, sitemap,
  // images without a hash in the name) is revalidated, so a new deploy shows up straight away.
  app.use(
    express.static(distPath, {
      index: 'index.html',
      redirect: false,
      setHeaders(res, file) {
        res.setHeader(
          'Cache-Control',
          file.includes(`${path.sep}assets${path.sep}`) ? 'public, max-age=31536000, immutable' : 'no-cache',
        );
      },
    }),
  );

  // Every public page is prerendered to dist/<route>/index.html. A route that was added later in the
  // CMS has no file yet, so it gets the empty app shell (200.html) and renders in the browser.
  app.use((req, res) => {
    if (req.path === '/admin' || req.path.startsWith('/admin/')) {
      return res.sendFile(path.join(distPath, 'admin.html'));
    }
    // A missing file (a stale script or image) must be a real 404, never the HTML shell.
    if (/\.[a-zA-Z0-9]{1,8}$/.test(req.path)) return res.status(404).type('text/plain').send('Not found');
    const route = req.path.replace(/\/+$/, '');
    const prerendered = /^[a-zA-Z0-9/_-]*$/.test(route) ? path.join(distPath, route, 'index.html') : null;
    if (prerendered && prerendered.startsWith(distPath) && fs.existsSync(prerendered)) {
      return res.sendFile(prerendered);
    }
    res.sendFile(path.join(distPath, '200.html'));
  });
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true, allowedHosts: true },
    appType: 'custom',
  });

  app.use(vite.middlewares);

  app.use(async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const isAdmin = url === '/admin' || url.startsWith('/admin?') || url.startsWith('/admin/');
      const template = fs.readFileSync(path.resolve(__dirname, isAdmin ? 'admin.html' : 'index.html'), 'utf-8');
      const html = await vite.transformIndexHtml(url, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (err) {
      vite.ssrFixStacktrace(err);
      next(err);
    }
  });
}

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  [IP3 Platform] ready (${isProd ? 'production' : 'development'})`);
  console.log(`  ➜  Site:   http://localhost:${PORT}/`);
  console.log(`  ➜  Admin:  http://localhost:${PORT}/admin`);
  console.log(`  ➜  API:    http://localhost:${PORT}/api/health\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n[IP3 Platform] Port ${PORT} is already in use.\n`);
  } else {
    console.error('\n[IP3 Platform] Server error:', err);
  }
});
