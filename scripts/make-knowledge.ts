/**
 * Writes the bundled site content to server/generated/site-content.json so the Ask IP3 route (plain
 * JavaScript on the server) can read it. The route lays the published copy from the database over this,
 * exactly as the site does, so the assistant always answers from what the site shows.
 * Runs as part of `npm run build`; the output is committed so `npm run dev` works without a build.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { DEFAULT_CONTENT } from '../src/content/defaults/index.ts';

mkdirSync('server/generated', { recursive: true });
writeFileSync('server/generated/site-content.json', `${JSON.stringify(DEFAULT_CONTENT)}\n`);
console.log('server/generated/site-content.json written');
