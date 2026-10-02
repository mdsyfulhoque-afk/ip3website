/**
 * Lists every fact the owner still has to confirm. Exits with code 1 while any remain, so it can gate
 * a release.  Usage: npm run check:placeholders
 *
 * It reads the bundled defaults. Content already published through the admin console is not checked
 * here; the Publish tab warns about structural problems and the editor shows each entry's status.
 */
import { DEFAULT_CONTENT as c } from '../src/content/defaults/index.ts';
import { isTbc, phoneNumbers } from '../src/content/merge.ts';

const rows: string[] = [];

c.portfolio.forEach((e) => {
  if (e.status !== 'published') rows.push(`portfolio "${e.title}" is ${e.status}, so it is hidden`);
  (['client', 'place', 'period'] as const).forEach((k) => isTbc(e[k]) && rows.push(`portfolio "${e.title}": ${k} still to be confirmed`));
});
c.people.forEach((p) => p.status !== 'published' && rows.push(`people "${p.name}" is ${p.status}, so it is hidden`));
if (!phoneNumbers(c.contact.phone).length) rows.push('contact: no phone number set (the site hides the row until one is confirmed)');
if (!c.contact.social.length) rows.push('contact: no social links set (the footer hides the row until some are added)');
if (!c.about.worksWith.names.length) rows.push('about: no organisations named under "works with"');

console.log('Still to confirm with IP3:');
console.log(rows.length ? rows.map((r) => `  - ${r}`).join('\n') : '  nothing');
process.exit(rows.length ? 1 : 0);
