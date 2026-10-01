/**
 * Writes every public page to disk as real HTML, so the content is in the document before any
 * JavaScript runs (search engines, link previews, slow phones, no-JS readers).
 *
 * Run after the client and SSR builds:  see `npm run build`.
 *  - dist/<route>/index.html  one file per route, with its own <title>, description and canonical URL
 *  - dist/200.html            the empty app shell, used by the server for routes added later in the CMS
 *  - dist/404.html            the not-found page
 *  - dist/sitemap.xml, dist/robots.txt
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const HTML_MARK = '<!--app-html-->';
const HEAD_MARK = '<!--head-tags-->';

const dist = resolve('dist');
const template = readFileSync(join(dist, 'index.html'), 'utf8');
if (!template.includes(HTML_MARK) || !template.includes(HEAD_MARK)) {
  throw new Error('dist/index.html is missing its markers; was it already prerendered?');
}

const { render, paths, siteOrigin } = await import(pathToFileURL(resolve('dist-ssr/entry-server.js')).href);

const fill = (head, html) => template.replace(HEAD_MARK, () => head).replace(HTML_MARK, () => html);
const write = (rel, body) => {
  const file = join(dist, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, body);
};

// The shell, before anything is rendered into it.
write('200.html', fill('', ''));

let total = 0;
for (const url of paths) {
  const { html, head } = render(url);
  if (!html || html.length < 1500) throw new Error(`Prerender of ${url} produced no meaningful markup.`);
  if (!head.includes('<title')) throw new Error(`Prerender of ${url} did not set a title.`);
  write(url === '/' ? 'index.html' : `${url.slice(1)}/index.html`, fill(head, html));
  total += html.length;
}

const notFound = render('/404');
write('404.html', fill(notFound.head, notFound.html));

const origin = siteOrigin;
const urls = paths.map((p) => `  <url><loc>${origin}${p === '/' ? '/' : p}</loc></url>`).join('\n');
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${origin}/sitemap.xml\n`);

console.log(`prerendered ${paths.length} pages (${(total / 1024).toFixed(0)} KB of markup) plus 200.html, 404.html, sitemap.xml, robots.txt`);
