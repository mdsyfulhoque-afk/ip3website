/**
 * The content contract for the public site.
 *
 * One object, `SiteContent`, is stored in the CMS under the key `content`
 * (see `ContentContext`). The site always renders from the bundled defaults in
 * `./defaults` first and swaps in the published copy when the API answers, so
 * there is never a blank screen and an empty or stale database can never leak
 * old copy back in.
 *
 * Rules for everything stored here:
 *  - No invented clients, results, statistics, testimonials, awards or people.
 *  - Anything that is not yet confirmed carries `status: 'verify'` or
 *    `'placeholder'`. Only `'published'` entries are shown to the public.
 *  - Images are optional. When `image` is empty the site draws a monogram or a
 *    plain typographic block instead of a stock photo.
 */

export type Status = 'published' | 'verify' | 'placeholder';

export interface Link {
  label: string;
  href: string;
}

/* -------------------------------- identity -------------------------------- */

export interface Identity {
  /** Legal name, used in the header, footer, titles and structured data. */
  name: string;
  /** Short mark used where space is tight. */
  shortName: string;
  descriptor: string;
  /** One sentence for search results and link previews. */
  description: string;
  url: string;
}

/* --------------------------------- contact -------------------------------- */

export interface ContactInfo {
  heading: string;
  sub: string;
  email: string;
  /** One or more numbers separated by commas, e.g. "+880 1974 011329, +880 1914 011329". Leave empty to hide. */
  phone: string;
  address: string[];
  hours: string;
  /** Used for the "open in maps" link. */
  mapQuery: string;
  social: Link[];
  consultation: {
    enabled: boolean;
    heading: string;
    sub: string;
    durationMinutes: number;
    /** Local times in Dhaka (GMT+6), e.g. "10:00 AM". */
    slots: string[];
    timezoneLabel: string;
    /** Choices offered in the "what is it about" field. */
    topics: string[];
  };
}

/* ---------------------------------- home ---------------------------------- */

export interface SceneText {
  rail: string;
  title: string;
  body: string[];
}

export interface HomeContent {
  hero: {
    headline: string;
    support: string;
    audience: string;
    primary: Link;
    secondary: Link;
  };
  scenes: {
    complexity: SceneText;
    evidence: SceneText;
    insight: SceneText;
    policy: SceneText;
    practice: SceneText;
    impact: SceneText;
  };
  /** One-line hypothetical used under the policy diagram. Must stay labelled as hypothetical. */
  policyExample: string;
  capabilitiesHeading: string;
  capabilitiesSub: string;
  sectorsHeading: string;
  sectorsSub: string;
  workHeading: string;
  workSub: string;
  closing: { heading: string; sub: string; cta: Link };
}

/* ------------------------------ domains (3) ------------------------------- */

export interface Domain {
  slug: string;
  title: string;
  /** One sentence for cards and the menu. */
  short: string;
  /** Opening paragraph(s) of the domain page. */
  intro: string[];
  /** The questions clients bring to this domain. */
  questions: string[];
  /** Named areas of work with one plain sentence each. */
  areas: { title: string; text: string }[];
  /** Slugs of sectors that sit under this domain. */
  sectors: string[];
  /** Slugs of service lines that deliver it. */
  services: string[];
  /** Optional real video hosted on ip3-bd.org. Empty = none. */
  video: string;
}

/* ------------------------------- sectors (8) ------------------------------ */

export interface Sector {
  slug: string;
  name: string;
  /** One plain sentence: the kind of question IP3 helps answer. */
  summary: string;
  questions: string[];
  /** Slugs of the sectors this one is tied to (drawn as lines on the map). */
  connects: string[];
  /** Concrete things IP3 does in this sector. Capabilities, not claims about results. */
  work: string[];
  domains: string[];
  services: string[];
}

/* --------------------------- capabilities (6 spine) ----------------------- */

export interface Capability {
  slug: string;
  /** One-word label: Diagnose, Design, Finance, Deliver, Measure, Scale. */
  label: string;
  /** Written as the client's problem. */
  title: string;
  /** The client's own words. Not a testimonial: a framing of the need. */
  need: string;
  text: string;
  deliverables: string[];
}

/* --------------------------------- method --------------------------------- */

export interface Movement {
  slug: string;
  title: string;
  /** Plain-language description of what happens. */
  text: string;
  /** The named output of this stage. */
  output: string;
}

export interface Principle {
  title: string;
  text: string;
}

export interface MethodContent {
  heading: string;
  intro: string[];
  movements: Movement[];
  principles: Principle[];
}

/* ------------------------------- services (5) ----------------------------- */

export interface ServiceLine {
  slug: string;
  title: string;
  short: string;
  intro: string[];
  offers: { title: string; text: string }[];
  deliverables: string[];
  /** Slugs of sectors where this service is most often used. */
  sectors: string[];
  /** Ids of portfolio entries to show on the page. */
  portfolio: string[];
}

/* -------------------------------- portfolio ------------------------------- */

export interface Engagement {
  id: string;
  status: Status;
  /** Featured entries lead the home page and the work index. */
  featured: boolean;
  title: string;
  /** Named only where IP3 has confirmed it may be named. */
  client: string;
  /** Every institution involved (client, funder, lead firm, academic partner), one name each. Counted on the impact band. */
  institutions: string[];
  /** IP3's role on the assignment, as stated in the team's CVs. */
  role: string;
  /** Contract, TA or programme reference, if any. */
  reference: string;
  place: string;
  period: string;
  /** First year of the assignment, used for ordering and the impact band. */
  start: number;
  /** Last year; 0 while the work continues. */
  end: number;
  /** Keys from the map gazetteer (src/content/places.ts): "BD" for nationwide work, a site key, or a country code. */
  places: string[];
  summary: string;
  /** Case story: the problem the client faced. */
  challenge: string;
  /** Case story: what IP3 did, one step per line. */
  approach: string[];
  /** Public reports the work contributed to. */
  links: Link[];
  /** Optional photo key from src/content/photos.ts. */
  photo: string;
  services: string[];
  sectors: string[];
  /** Reviewer note shown only in the editor. */
  note: string;
}

/* --------------------------------- people --------------------------------- */

export interface Person {
  slug: string;
  name: string;
  role: string;
  /** leadership, economics, education, law, climate, data */
  group: string;
  /** Domains of practice as short labels. */
  practice: string[];
  /** Short factual line. No credentials unless confirmed. */
  summary: string;
  /** Optional portrait URL (Cloudinary). Empty = monogram. */
  portrait: string;
  status: Status;
}

/* -------------------------------- about etc. ------------------------------ */

export interface AboutContent {
  heading: string;
  lead: string;
  body: string[];
  /** The "through-line": Complexity → Intelligence → Architecture → Implementation → Impact. */
  throughLine: { label: string; text: string }[];
  principles: Principle[];
  audiences: { name: string; text: string }[];
  vision: string;
  mission: string;
  /** Short note for the chairman, shown on the About and People pages. */
  chairman: { name: string; role: string; quote: string; summary: string; partners: string[] };
  /** Organisations IP3 has confirmed it may name as having worked with. */
  worksWith: { heading: string; names: string[]; note: string };
}

export interface Pillar {
  title: string;
  text: string;
}

export interface LegalContent {
  privacy: { updated: string; sections: { title: string; text: string[] }[] };
}

/* ---------------------------------- root ---------------------------------- */

export interface SiteContent {
  schema: 2;
  identity: Identity;
  contact: ContactInfo;
  home: HomeContent;
  domains: Domain[];
  sectors: Sector[];
  capabilities: Capability[];
  method: MethodContent;
  services: ServiceLine[];
  portfolio: Engagement[];
  people: Person[];
  pillars: Pillar[];
  about: AboutContent;
  legal: LegalContent;
}

export type SectorSlug = string;
