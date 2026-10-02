# IP3 Consulting: website and content studio

Public site for IP3 Consulting Limited (Institute for Public Policy and Practice, Dhaka), with a password-protected
admin console, an Express API and MongoDB storage. It deploys to Vercel as static pages plus one serverless function.

The home page is a scroll-driven 3D journey (Complexity, Evidence, Insight, Policy, Practice, Impact) that ends in the
promise "From polycrisis to polysolution." Every other page is a fast, prerendered page that reads without JavaScript.

What visitors find:

- **Our work** (`/work`): 24 assignments from 2018 to date, each a case story (`/work/<id>`: the challenge, what IP3
  did, client, role, period), impact figures counted from those entries, and an interactive **Impact Map** of
  Bangladesh (eight divisions, marked sites) and the wider region.
- **People** (`/people`): 17 team members with portraits, profiles, affiliations and degrees from their CVs.
- **Insights** (`/insights`): the team's reports, journal articles and commentary, linked to the publishers.
- **বাংলা** (`/bn`): the core story in Bangla, with the map and figures; a header switch moves between languages.
- **Ask IP3**: an optional AI assistant (Claude) that answers questions from the site's own content.
- **On the home page**, after the 3D story: an IP3 brand film that grows to full width as it scrolls in, and a pinned
  GSAP walkthrough of the **Policy Intelligence Terminal** (signals, merged discussions, IP3 modules, the brief factory).
- **Contact**: enquiries and consultation requests that the team confirms from the admin console.

## Quick start

```bash
npm install
cp .env.example .env          # see "Environment" below; nothing is required for local work
npm run dev                   # http://localhost:3000   admin at /admin
```

With no `.env` the site runs from its bundled content and an in-memory store. In development only, the admin
passphrase is `admin`. In production the admin refuses to sign anyone in until `JWT_SECRET` and an admin passphrase
are set (see below), and every content write requires an admin session.

| Script | What it does |
| --- | --- |
| `npm run dev` | Express API plus Vite in one process, one origin |
| `npm run build` | Type-check, build the site and admin, then prerender every page to `dist/` |
| `npm start` | Serves `dist/` and the API from Node (non-Vercel hosting) |
| `npm test` | Unit tests (content rules, merge behaviour, 3D scene driver) |
| `npm run check:placeholders` | Lists facts the owner still has to confirm (exits 1 while any remain) |
| `npm run db:seed` / `db:seed:force` | Writes the bundled content to MongoDB (only if empty / always) |
| `npm run hash:password "pass"` | Prints an `ADMIN_PASSWORD_HASH` |
| `npm run assets` | Regenerates `public/contours.svg` and the favicon set (from `public/brand/ip3-logo-reversed.png`) |
| `npm run map` | Rebuilds the Impact Map geometry (`src/site/impact/map-data.json`) after adding a place to `src/content/places.ts` |
| `npm run knowledge` | Writes the bundled content for the Ask IP3 route (`server/generated/site-content.json`; also part of `build`) |

## How the content works

All words on the site live in one typed tree, `SiteContent` (`src/content/types.ts`), with the shipped copy in
`src/content/defaults/`. The site always paints the bundled copy first, then lays the published copy from the database
over it (`src/content/merge.ts`). So there is never a blank screen, a missing field cannot break a page, and a database
that still holds an older version of the site cannot bring old copy back, because the site only reads the `content` key.

- **Edit**: sign in at `/admin`, open "Edit content". Changes are a draft held in your browser.
- **Publish**: the Publish tab checks the draft (repeated slugs, broken cross-references, empty required fields),
  writes it to the database and keeps a version. Any earlier version can be restored. Backups can be downloaded and loaded.
- **Status**: portfolio entries, people and insights carry `published`, `verify` or `placeholder`. Only `published` is shown.
  Any field that reads "to be confirmed" is left out of the page rather than shown.
- **New pages**: adding a sector, service, focus area or person in the editor creates its page at once. Until the next
  deploy it renders in the browser; the next build also writes it as static HTML.
- **Structure is code**: navigation, routes, the 3D scene's geometry (`src/content/journey.ts`), the map gazetteer
  (`src/content/places.ts`) and the photo list (`src/content/photos.ts`) are not editable in the admin. Their words are.
- **Photos**: `public/media` holds photographs from the team's archive, only those recorded as cleared for consent.
  Portraits are in `public/people`. Upload others in the editor (Cloudinary) and paste the URL into a `portrait` field.

## Structure

```
src/content/      types, bundled defaults, merge, validation, journey structure
src/site/         layout, SEO, routes, pages (about, approach, focus, sectors, services, work, people, insights, contact, bn)
src/site/work/    impact figures, Impact Map, work list
src/site/home/    the 3D journey and the home sections
src/webgl/        the scene (react-three-fiber)
src/admin/        sign-in, content editor, publish, enquiries, consultations
server/           Express API (auth, content, leads, bookings, media, health, ask)
scripts/          prerender, seed, asset, map and knowledge generation, placeholder report
```

Build output: `dist/<route>/index.html` for every page, `dist/200.html` (empty shell for routes created later),
`dist/404.html`, `sitemap.xml`, `robots.txt`. Each page has its own title, description, canonical URL and structured data.

## Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `JWT_SECRET` | production | Signs admin sessions. Without it, sign-in is refused in production. |
| `ADMIN_PASSWORD_HASH` or `ADMIN_PASSWORD` | production | Admin passphrase (hash preferred). Without either, nobody can sign in in production. |
| `ADMIN_EMAIL` | no | Shown as the author of published versions |
| `MONGODB_URI`, `MONGODB_DB` | for persistence | Without them, enquiries and bookings live in memory and are lost on restart or cold start |
| `CLOUDINARY_*` | for uploads | Signed direct image and video uploads from the editor |
| `MEETING_LINK` | no | One standing meeting room for every confirmed booking. If empty, confirming creates a private Jitsi Meet room per booking. |
| `MEETING_BASE_URL` | no | Your own Jitsi server instead of meet.jit.si |
| `ALLOW_MEMORY_STORE` | no | `true` lets a production server accept enquiries and bookings without a database (demonstrations only: they are lost on restart). Otherwise the forms ask visitors to email until `MONGODB_URI` is set. |
| `RETENTION_DAYS` | no | Days enquiries and bookings are kept (default 60; bookings count from the meeting date) |
| `ANTHROPIC_API_KEY` | for Ask IP3 | Turns the assistant on. Without it the button never appears. |
| `ASK_DAILY_LIMIT`, `ASK_PER_15_MIN` | no | Questions per day per server instance (default 500) and per visitor per 15 minutes (default 15) |
| `VITE_SITE_URL` | build | Public origin for canonical URLs, sitemap and structured data |
| `CORS_ORIGIN`, `COOKIE_SAMESITE`, `VITE_API_BASE_URL` | only if the API is on another site | The default is same-origin with a Lax cookie |

First deploy: set the variables, run `npm run db:seed` once, then sign in and publish. If the database already holds
content from an older version of the site, publish once (or run `npm run db:seed:force`) so the new content tree replaces it.

## Deploying to Vercel

Import the repository. `vercel.json` already sets the build command, the `/api` function, the `/admin` rewrite, a
fallback to `200.html` for routes that were not prerendered, security headers and long caching for hashed assets.
Unknown addresses return the app shell with the not-found page (HTTP 200) so that routes created in the editor work
without a redeploy.

## Motion, accessibility and fallbacks

- `?view=simple` (or the "3D scene" switch in the header) shows the same story without WebGL. It is chosen
  automatically for reduced-motion, low-power and no-WebGL visitors, and if the 3D scene fails to start.
- Every page is checked in a real browser at desktop and mobile widths for console errors, horizontal overflow and
  axe-core violations. Keyboard focus is always visible; forms have labels and announced errors.
- The pages carry their content in the HTML, so they read without JavaScript.

## Motion and films

GSAP 3.15 with ScrollTrigger is loaded on demand in the browser (`src/lib/gsap.ts`), never during prerendering.
`src/site/motion/useSiteMotion.ts` applies the shared motion language from the IP3 storytelling homepage (`ippp`) on
every route: elements marked `gs-card` rise in batches with a slight tilt, `gs-reveal` headings rise, `gs-draw` diagrams
draw in, and inner-page heroes settle. The home film (`HomeFilm`) and the terminal (`HomeTerminal`, a pinned stage
driven by one scrubbed timeline, the same pattern as the portfolio site's film) run their own timelines. Content is
always visible without JavaScript; anything already on screen is never hidden; reduced-motion visitors get static
pages; a fail-safe clears any style a trigger fails to finish.

`public/video` holds the IP3 brand reel (cut from the supplied footage, with the site's own type for the captions)
and two loops, each as MP4 (H.264) and WebM (VP9) with a poster frame. Films play muted only while on screen, and always
have a pause button. The ESG and Circular Economy Principles clips supplied were not used: the first is a Canva
template with "Canva Stories" marks and purple cards outside the palette; the second is a mosaic of small clips that
includes a green-screen tile.

## Bookings and privacy

A consultation request holds its slot as *awaiting confirmation*. In the admin console, **Consultations** shows
**Confirm and create meeting link** (and **Decline**, which frees the slot). Confirming generates the meeting link and
offers **Email the client**, a ready-written message opened in your own mail program. Enquiries are deleted 60 days
after they arrive and bookings 60 days after the meeting: MongoDB removes them through a TTL index, and older records are
swept when an admin opens the inbox. Only signed-in administrators can read either.

## Ask IP3

`server/routes/ask.js` answers with Claude Opus 5.5 (`claude-opus-5-5`) at low effort, using only the published site
content (`server/lib/knowledge.js`), which goes in a cached system prompt so follow-up questions are cheap. Server-side
refusal fallback (`fallbacks: "default"`) is on: if the model declines a question, the API retries it on a suitable
fallback model in the same call. Questions are not stored; the privacy page says they are sent to Anthropic. Rate limits
and a daily cap are set by the variables above. Expect roughly 12,000 cached input tokens per question plus a short
answer; check usage in the Anthropic Console after launch.

## Launch checklist

1. **Preview**: on vercel.com choose *Add New → Project*, import `mdsyfulhoque-afk/ip3website`, pick the `redesign`
   branch, and deploy. Vercel builds every branch as its own preview URL; share it with the team for feedback.
2. **Variables** (Vercel → Settings → Environment Variables): `JWT_SECRET`, `ADMIN_PASSWORD_HASH`, `MONGODB_URI`,
   `MONGODB_DB`, `VITE_SITE_URL=https://ip3-bd.org`; optionally `CLOUDINARY_*`, `MEETING_LINK`, `ANTHROPIC_API_KEY`.
3. **Database**: run `npm run db:seed` once against the new database. If it already holds content from the old site,
   run `npm run db:seed:force` (or sign in and publish once): lists such as the portfolio and people are replaced
   whole, so an old published copy would otherwise hide the new entries.
4. **Domain**: add `ip3-bd.org` in Vercel → Domains and point the DNS records it shows at Vercel.
5. **Check**: send a test enquiry, request a consultation, confirm it in the console, and ask the assistant a question.

## What the owner still needs to confirm

Run `npm run check:placeholders` for the live list. In short:

- **Digital ID and STEM/TVET curriculum** assignments are published as instructed, but neither appears in the CVs
  supplied, so client, place, period and role are blank (hidden). Fill them in, or merge STEM/TVET into the ADB
  NextGen TVET entry if they are the same work.
- **Four portraits**: Prof. Asadullah (the pack's "Niaz.jpg" does not appear to be him), Prof. Mannan and
  Dr. Esraz-Ul-Zannat (no photo), and Dr. Abu Zafor Sadek (the file is named "ABU Bakar Sadek"). Monograms show until
  confirmed photos are uploaded.
- **Titles**: Siban Shahana appears as "Asst. Prof." in the matrix and Research Fellow (BIDS) in the CV.
- **Hidden people**: four names from the old site are not in the team pack and are hidden.
- **Earlier work** (before 2018, or through another firm) is kept but hidden: JICA/BEZA, Global LEAP, ESMAP/ASTAE.
- **Videos**: the chairman's video slot appears once a video is uploaded in the editor. The old site's focus-page
  videos could not be carried over: Climate now shows the climate-data film and Institutions the IP3 reel; Education's
  video band is hidden until a video is uploaded in the editor. Add captions to any film with speech.
- **Photos of fieldwork** that show survey respondents or factory workers are not used until consent is recorded.
