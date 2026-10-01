/**
 * Seeds MongoDB with the bundled default content (src/content/defaults).
 *
 * Run once after pointing MONGODB_URI at a fresh database:
 *   npm run db:seed          — only writes if the collection is empty
 *   npm run db:seed:force    — replaces the live content with the bundled defaults (the current
 *                              version is kept in the revision history first)
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../server/lib/db.js';
// The models are plain JS; the `models.X || model(...)` pattern widens their
// type to a union, so they are used untyped here.
import ContentModel from '../server/models/Content.js';
import RevisionModel from '../server/models/Revision.js';
import { DEFAULT_CONTENT } from '../src/content/defaults';

// The API stores one tree. The site reads `content` and ignores any other key, so a database that
// still holds an older version of the site can never put old copy back on the page.
const DEFAULT_WEBSITE_DATA = { content: DEFAULT_CONTENT };

const Content: any = ContentModel;
const Revision: any = RevisionModel;

const force = process.argv.includes('--force');

async function main() {
  await connectDB();

  const existing = await Content.findOne({ key: 'site' });

  if (existing && !force) {
    console.log(`[seed] Content already present (v${existing.version}). Re-run with --force to overwrite.`);
  } else {
    const version = (existing?.version || 0) + 1;

    await Content.findOneAndUpdate(
      { key: 'site' },
      { $set: { data: DEFAULT_WEBSITE_DATA, version, updatedBy: 'seed@ip3.org' } },
      { upsert: true, setDefaultsOnInsert: true }
    );

    await Revision.create({
      version,
      note: existing ? 'Reseeded from bundled defaults' : 'Initial production baseline',
      createdBy: 'seed@ip3.org',
      data: DEFAULT_WEBSITE_DATA,
    });

    console.log(`[seed] Content written as v${version}.`);
  }

  if (process.env.ADMIN_PASSWORD && !process.env.ADMIN_PASSWORD_HASH) {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    console.log('\n[seed] Bcrypt hash for your ADMIN_PASSWORD — set this as ADMIN_PASSWORD_HASH in production:');
    console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
  }

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error('[seed] Failed:', err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
