import type { Sector } from '../types';

/**
 * Eight sectors: where IP3's work lands. They are lenses, not silos, so each one lists the
 * sectors it is tied to; the home page draws those ties as lines.
 *
 * `work` lists capabilities. It makes no claim about past results.
 */
export const sectors: Sector[] = [
  {
    slug: 'macroeconomic-fiscal',
    name: 'Macroeconomic and Fiscal Policy',
    summary: 'How much can the state afford, and how should it raise and spend public money?',
    questions: [
      'What does a change in tax, subsidy or debt policy do to the budget and to households?',
      'How well could public finances withstand shocks such as commodity prices, climate events or interest rates?',
      'Which spending choices deliver the most public value for each unit of money?',
    ],
    connects: ['private-sector', 'cities-municipal-finance', 'social-protection', 'public-governance', 'climate-energy', 'education-skills'],
    work: [
      'Fiscal and public-finance analysis for ministries and agencies',
      'Options papers on tax, subsidy and expenditure reform',
      'Macro and sector policy reviews, including trade and graduation from least-developed-country status',
      'Economic modelling to test how a reform plays out',
    ],
    domains: ['institutions-data-digital'],
    services: ['macro-sector-policy', 'economic-assessment'],
  },
  {
    slug: 'education-skills',
    name: 'Education and Skills',
    summary: 'Are children learning, and are people leaving school or training with skills that employers and communities need?',
    questions: [
      'Where are access and learning outcomes weakest, and why?',
      'Which reforms to teaching, curriculum or financing are affordable at scale?',
      'How well do skills programmes match the jobs that exist?',
    ],
    connects: ['social-protection', 'private-sector', 'public-governance', 'macroeconomic-fiscal'],
    work: [
      'Feasibility and costing of education reforms',
      'Diagnostics of access, learning outcomes and system capacity',
      'Design and evaluation of digital-learning and skills programmes',
      'Policy advice for education ministries and development partners',
    ],
    domains: ['education-capacity'],
    services: ['program-survey-design', 'merla', 'economic-assessment'],
  },
  {
    slug: 'climate-energy',
    name: 'Climate, Energy and Green Transition',
    summary: 'How can a country cut risk and emissions without stalling growth or leaving people behind?',
    questions: [
      'What do climate and energy policies cost, and who bears the cost?',
      'Which investments in clean energy, efficiency or adaptation pass a rigorous economic test?',
      'What regulation, finance and institutions does a credible transition plan need?',
    ],
    connects: ['macroeconomic-fiscal', 'cities-municipal-finance', 'private-sector', 'public-governance'],
    work: [
      'Green-transition research and policy advice for industry and government',
      'Clean-energy financing and market-development frameworks',
      'Climate risk, adaptation and early-warning programmes',
      'ESG strategy, reporting and circular-economy pathways',
    ],
    domains: ['climate-esg-circular'],
    services: ['climate-esg', 'economic-assessment', 'merla'],
  },
  {
    slug: 'private-sector',
    name: 'Private Sector Development and SMEs',
    summary: 'What stops firms from starting, growing and creating jobs, and what can public policy do about it?',
    questions: [
      'Which constraints bind hardest for small firms: finance, regulation, skills or markets?',
      'Do support programmes reach the firms they target, and do they work?',
      'How can public and private finance be combined responsibly?',
    ],
    connects: ['macroeconomic-fiscal', 'education-skills', 'climate-energy', 'public-governance'],
    work: [
      'Firm-level surveys on technology adoption, digitalisation and informality',
      'Investment and special-economic-zone advisory',
      'Blended-finance and public-private partnership structuring',
      'Evidence for industrial and enterprise policy',
    ],
    domains: ['climate-esg-circular'],
    services: ['economic-assessment', 'program-survey-design'],
  },
  {
    slug: 'cities-municipal-finance',
    name: 'Cities and Municipal Finance',
    summary: 'How can cities pay for the services and infrastructure their growing populations need?',
    questions: [
      'How much can a city raise from its own revenues, and how much does it depend on transfers?',
      'Which infrastructure projects are financially and economically viable?',
      'How should responsibility and money be shared between city and national government?',
    ],
    connects: ['macroeconomic-fiscal', 'climate-energy', 'public-governance', 'social-protection'],
    work: [
      'Municipal finance and institutional transformation advice',
      'Feasibility studies for urban infrastructure, ports and housing',
      'Financial models and financing plans for city projects',
      'Monitoring and results frameworks for urban services such as sanitation',
    ],
    domains: ['climate-esg-circular'],
    services: ['economic-assessment', 'merla', 'macro-sector-policy'],
  },
  {
    slug: 'social-protection',
    name: 'Social Protection, Health and Inclusion',
    summary: 'Who is being missed by public programmes, and what would reach them at a cost the state can carry?',
    questions: [
      'How well do cash transfers, insurance and assistance programmes target and reach people in need?',
      'What combination of programmes best reduces vulnerability?',
      'How do design choices affect the inclusion of women, young people and marginalised groups?',
    ],
    connects: ['macroeconomic-fiscal', 'education-skills', 'public-governance', 'cities-municipal-finance'],
    work: [
      'Household surveys and targeting diagnostics',
      'Design and evaluation of transfer and assistance programmes',
      'Health financing and economic evaluation of health programmes',
      'Gender and inclusion analysis in programme design',
    ],
    domains: ['education-capacity'],
    services: ['program-survey-design', 'merla'],
  },
  {
    slug: 'public-governance',
    name: 'Public Sector Governance, Data and Digital',
    summary: 'Do public institutions have the mandates, systems and capacity to do what policy asks of them?',
    questions: [
      'Where do planning, budgeting, procurement or delivery systems break down?',
      'How can transparency, accountability and digital systems be strengthened in practice?',
      'Which reforms are realistic given an institution’s capacity and constraints?',
    ],
    connects: [
      'macroeconomic-fiscal',
      'education-skills',
      'climate-energy',
      'private-sector',
      'cities-municipal-finance',
      'social-protection',
    ],
    work: [
      'Institutional diagnostics and governance frameworks',
      'Public financial management and delivery-model design',
      'Digital-government strategy, data governance and interoperability',
      'Responsible-AI readiness for public services',
    ],
    domains: ['institutions-data-digital'],
    services: ['macro-sector-policy', 'merla'],
  },
  {
    slug: 'monitoring-evaluation',
    name: 'Monitoring, Evaluation and Learning',
    summary: 'How will we know what is working, for whom, and what to change?',
    questions: [
      'What indicators and data systems should a programme track from its first day?',
      'Did the intervention cause the change we see, and at what cost?',
      'How can findings reach decision-makers while a programme is still running?',
    ],
    connects: [
      'macroeconomic-fiscal',
      'education-skills',
      'climate-energy',
      'private-sector',
      'cities-municipal-finance',
      'social-protection',
      'public-governance',
    ],
    work: [
      'Results frameworks, baselines and indicator systems',
      'Process, outcome and impact evaluations',
      'Programme and portfolio evaluations for international partners',
      'Learning reviews and adaptive-management routines',
    ],
    domains: ['institutions-data-digital'],
    services: ['merla', 'program-survey-design'],
  },
];

/** Undirected edges between sectors, derived once from `connects`. */
export function sectorEdges(list: Sector[]): [string, string][] {
  const seen = new Set<string>();
  const out: [string, string][] = [];
  for (const s of list) {
    for (const c of s.connects) {
      const key = [s.slug, c].sort().join('|');
      if (!seen.has(key)) {
        seen.add(key);
        out.push([s.slug, c]);
      }
    }
  }
  return out;
}
