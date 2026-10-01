# IP3 Consulting: website and content studio

Public site for IP3 Consulting Limited (Institute for Public Policy and Practice, Dhaka), with a password-protected
admin console, an Express API and MongoDB storage. It deploys to Vercel as static pages plus one serverless function.

The home page is a scroll-driven 3D journey (Complexity, Evidence, Insight, Policy, Practice, Impact) that ends in the
promise "From polycrisis to polysolution." Every other page is a fast, prerendered page that reads without JavaScript.

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
| `npm run assets` | Regenerates `public/contours.svg` and the favicon set |

## How the content works

All words on the site live in one typed tree, `SiteContent` (`src/content/types.ts`), with the shipped copy in
`src/content/defaults/`. The site always paints the bundled copy first, then lays the published copy from the database
over it (`src/content/merge.ts`). So there is never a blank screen, a missing field cannot break a page, and a database
that still holds an older version of the site cannot bring old copy back, because the site only reads the `content` key.

- **Edit**: sign in at `/admin`, open "Edit content". Changes are a draft held in your browser.
- **Publish**: the Publish tab checks the draft (repeated slugs, broken cross-references, empty required fields),
  writes it to the database and keeps a version. Any earlier version can be restored. Backups can be downloaded and loaded.
- **Status**: portfolio entries and people carry `published`, `verify` or `placeholder`. Only `published` is shown.
  Any field that reads "to be confirmed" is left out of the page rather than shown.
- **New pages**: adding a sector, service, focus area or person in the editor creates its page at once. Until the next
  deploy it renders in the browser; the next build also writes it as static HTML.
- **Structure is code**: navigation, routes and the 3D scene's geometry (`src/content/journey.ts`) are not editable
  in the admin. Their words are.

## Structure

```
src/content/      types, bundled defaults, merge, validation, journey structure
src/site/         layout, SEO, routes, pages (about, approach, focus, sectors, services, people, contact, privacy)
src/site/home/    the 3D journey and the home sections
src/webgl/        the scene (react-three-fiber)
src/admin/        sign-in, content editor, publish, enquiries, consultations
server/           Express API (auth, content, leads, bookings, media, health)
scripts/          prerender, seed, asset generation, placeholder report
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
| `MEETING_LINK` | no | Returned with a booking confirmation only if set. If empty, the page says joining details will follow by email. |
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

## What the owner still needs to confirm

Run `npm run check:placeholders` for the live list. In short:

- One phone number (two different ones appeared on the old site; none is shown).
- Which clients may be named. The four institutions listed on the About page (World Bank, Asian Development Bank,
  European Commission, Sida) came from the old site's wording; confirm each, especially Sida.
- Client, place and year for portfolio entries marked "to be confirmed", and the two entries held back as `verify`.
- The Global LEAP year (the old site gave two different years) and the roles stated on entries that say "supported".
- People: roles and practice areas as listed, and whether portraits may be published (monograms are used until then).
- The privacy page wording: staff-only access, how long enquiries are kept, and that the server records the network
  address and browser details sent with an enquiry.
- Whether the videos hosted on ip3-bd.org should stay on the focus pages (they could not be played from the build
  environment) and whether they need captions or transcripts.
- The logo: the mark in the header is a placeholder drawn for this build, not IP3's registered logo.
- Booking: bookings are stored as confirmed immediately. Decide whether that wording suits the team's process, and set
  `MEETING_LINK` if a standing meeting room is used.
