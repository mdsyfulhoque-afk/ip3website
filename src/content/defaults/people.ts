import type { Person } from '../types';

/**
 * People shown on the About and People pages.
 *
 * Source: the eleven faculty records in the old `peopleData.ts`, reconciled
 * with the leadership block on the old About page. Only names, roles and
 * domain-of-practice tags were carried over. Degrees, universities,
 * affiliations, statistics and the generated biographies were left out on
 * purpose because nothing in the source confirms them.
 *
 * Every portrait is empty: all of the old images were stock photographs.
 * The site draws a monogram until a real headshot is supplied.
 *
 * Owner to confirm before launch: that each person is correct and still
 * involved, that each role is worded as they want it, and that each person
 * agrees to be named on the site.
 */
export const people: Person[] = [
  {
    slug: 'mohammad-syful-hoque',
    name: 'Mohammad Syful Hoque',
    role: 'Executive Chairman & Lead Policy Architect',
    group: 'leadership',
    practice: ['Translational policy', 'Systems architecture', 'Green finance'],
    summary:
      'Executive Chairman of IP3 Consulting, working on translational policy, systems architecture and green finance.',
    portrait: '',
    status: 'published',
  },
  {
    slug: 'prof-dr-m-a-mannan',
    name: 'Prof. Dr. M A Mannan',
    role: 'Senior Consulting Advisor',
    group: 'education',
    practice: ['Education', 'Health', 'Demography', 'Social protection'],
    summary: 'Works on education, health, demography and social protection.',
    portrait: '',
    status: 'published',
  },
  {
    slug: 'prof-dr-niaz-asadullah',
    name: 'Prof. Dr. Niaz Asadullah',
    role: 'Chief Economic Advisor',
    group: 'economics',
    practice: ['Education', 'Institutions', 'Poverty', 'Labour', 'Gender'],
    summary: 'Works on education, institutions, poverty, labour and gender.',
    portrait: '',
    status: 'published',
  },
  {
    slug: 'barr-zareen-rahman',
    name: 'Barr. Zareen Rahman',
    role: 'Founding Director & Legal Architecture Lead',
    group: 'law',
    practice: ['Regulation', 'PPP formation', 'Legal compliance', 'Cross-border structuring'],
    summary: 'Works on regulation, PPP formation, legal compliance and cross-border structuring.',
    portrait: '',
    status: 'published',
  },
  {
    slug: 'prof-dr-shafiun-shimul',
    name: 'Prof. Dr. Shafiun Shimul',
    role: 'Policy Advisor / Lead Economist',
    group: 'economics',
    practice: ['Public health policy and practice', 'Health financing', 'Economic evaluation'],
    summary: 'Works on public health policy and practice, health financing and economic evaluation.',
    portrait: '',
    status: 'published',
  },
  {
    slug: 'adj-prof-harun-rashid',
    name: 'Adj. Prof. Harun Rashid',
    role: 'Founding Director & Senior Governance Fellow',
    group: 'leadership',
    practice: ['Comparative politics', 'Public policy', 'Conflict management'],
    summary: 'Works on comparative politics, public policy and conflict management.',
    portrait: '',
    status: 'published',
  },
  {
    slug: 'dr-md-abu-zafor-sadek',
    name: 'Dr. Md. Abu Zafor Sadek',
    role: 'Deputy Director / Practice Area Lead',
    group: 'economics',
    practice: ['Pharmaceutical industry dynamics', 'Market, product and biosimilars development'],
    summary: 'Works on pharmaceutical industry dynamics and market, product and biosimilars development.',
    portrait: '',
    status: 'published',
  },
  {
    slug: 'dr-tahmina-rahman',
    name: 'Dr. Tahmina Rahman',
    role: 'Senior Fellow, Environmental Economics & Climate',
    group: 'climate',
    practice: ['Climate economics', 'Carbon offsets', 'Circular industrial water'],
    summary: 'Works on climate economics, carbon offsets and circular industrial water.',
    portrait: '',
    status: 'published',
  },
  {
    slug: 'kazi-farhan-ahmed',
    name: 'Kazi Farhan Ahmed',
    role: 'Head of Data & Digital Governance',
    group: 'data',
    practice: ['Digital governance', 'Data ecosystems', 'Applied AI', 'Public IT'],
    summary: 'Works on digital governance, data ecosystems, applied AI and public IT.',
    portrait: '',
    status: 'published',
  },
  {
    slug: 'shirin-akhter-chowdhury',
    name: 'Shirin Akhter Chowdhury',
    role: 'Lead Specialist, Educational Innovation',
    group: 'education',
    practice: ['Pedagogical systems design', 'EdTech impact', 'Curriculum reform'],
    summary: 'Works on pedagogical systems design, EdTech impact and curriculum reform.',
    portrait: '',
    status: 'published',
  },
  {
    slug: 'barrister-ashique-rahman',
    name: 'Barrister Ashique Rahman',
    role: 'Senior Legal & Policy Counsel',
    group: 'law',
    practice: ['Administrative law', 'Sovereign procurement', 'Regulatory sandboxes'],
    summary: 'Works on administrative law, sovereign procurement and regulatory sandboxes.',
    portrait: '',
    status: 'published',
  },
];
