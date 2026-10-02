/**
 * Real photographs from the IP3 team's own archive (via mdsyfulhoque-afk/portfolio-web-claude, assets/media).
 *
 * Only photos recorded there with consent "clear" are used: public events, the team's own portraits and
 * scenes with no identifiable members of the public. Fieldwork photos showing survey respondents or
 * factory workers are left out until consent is recorded. Captions state only what each photo shows.
 *
 * Files live in public/media as <key>-<width>.avif and .webp.
 */

export interface Photo {
  key: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  widths: number[];
}

export const PHOTOS: Record<string, Photo> = {
  portrait: {
    key: 'portrait',
    alt: 'Portrait of Mohammad Syful Hoque, wearing glasses and a checked blazer',
    caption: 'Mohammad Syful Hoque, Dhaka',
    width: 1620,
    height: 1620,
    widths: [480, 960],
  },
  'rmg-floor': {
    key: 'rmg-floor',
    alt: 'Production floor of a ready-made garment factory in Bangladesh, long lines of sewing stations',
    caption: 'A garment factory floor, Bangladesh, 2018',
    width: 3264,
    height: 2448,
    widths: [480, 960, 1600],
  },
  'tech-adoption-slide': {
    key: 'tech-adoption-slide',
    alt: 'Briefing room with a projected slide titled "Structure of the Technology Adoption Survey"',
    caption: 'Briefing on the structure of the technology adoption survey, Dhaka',
    width: 960,
    height: 720,
    widths: [480, 960],
  },
  'roundtable-2019': {
    key: 'roundtable-2019',
    alt: 'Stakeholder consultation around a conference table with microphones',
    caption: 'Stakeholder consultation, Dhaka',
    width: 960,
    height: 720,
    widths: [480, 960],
  },
  'findings-2024': {
    key: 'findings-2024',
    alt: 'Mohammad Syful Hoque at a round-table session discussing findings',
    caption: 'Discussing findings at a round-table, Dhaka, 2024',
    width: 1599,
    height: 606,
    widths: [480, 960, 1599],
  },
  'mission-2021': {
    key: 'mission-2021',
    alt: 'Mohammad Syful Hoque standing outdoors with three counterparts',
    caption: 'On a consultation mission, Bangladesh',
    width: 960,
    height: 540,
    widths: [480, 960],
  },
  'workshop-wall': {
    key: 'workshop-wall',
    alt: 'Handwritten sticky notes clustered on a wall during a planning workshop',
    caption: 'A planning wall from a design workshop',
    width: 1200,
    height: 700,
    widths: [480, 960, 1200],
  },
  'fsi-lecture-2013': {
    key: 'fsi-lecture-2013',
    alt: 'Mohammad Syful Hoque presenting "What are Financial Soundness Indicators?" at an ADB training workshop in Dhaka',
    caption: 'Training government officials on financial soundness indicators, ADB workshop, Dhaka, 2013',
    width: 800,
    height: 608,
    widths: [480, 800],
  },
  'adb-conference-2014': {
    key: 'adb-conference-2014',
    alt: 'Head table and podium at the ADB Conference on Linking the Financial Sector to the Real Economy, Dhaka, November 2014',
    caption: 'ADB conference on linking the financial sector to the real economy, Dhaka, 2014',
    width: 960,
    height: 720,
    widths: [480, 960],
  },
  'terminal-lenses': {
    key: 'terminal-lenses',
    alt: 'Policy Intelligence Terminal screen: a ranked policy signal with its sources and their tiers, six decision lenses, and a drafted policy recommendation',
    caption: 'Signals, sources and decision lenses',
    width: 2000,
    height: 955,
    widths: [800, 1600],
  },
  'terminal-studio': {
    key: 'terminal-studio',
    alt: 'Policy Intelligence Terminal screen: the Merged Policy Discussion Studio, with perspective, topic, audience and ten selected discussions to merge',
    caption: 'Merged Policy Discussion Studio',
    width: 2000,
    height: 955,
    widths: [800, 1600],
  },
  'terminal-modules': {
    key: 'terminal-modules',
    alt: 'Policy Intelligence Terminal screen: MERLA, Climate and ESG, and GovTech modules, and the Brief Factory for story, daily and periodical briefs',
    caption: 'MERLA, Climate/ESG and GovTech modules',
    width: 2000,
    height: 955,
    widths: [800, 1600],
  },
  'terminal-briefs': {
    key: 'terminal-briefs',
    alt: 'Policy Intelligence Terminal screen: Brief Factory output with original brief, refined brief, evidence, claims, verification and export tabs',
    caption: 'Brief Factory: evidence, claims, verification, export',
    width: 2000,
    height: 955,
    widths: [800, 1600],
  },
};
