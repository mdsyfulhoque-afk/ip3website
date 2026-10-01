import type { Capability } from '../types';

/**
 * The six-part spine: what clients hire IP3 to deliver.
 *
 * One list replaces five older versions of the same six beats (the home practice
 * row, the client-problem cards, the output categories, the DR/PS/FB/DA/IS/LS
 * codes and the six movements).
 *
 *  - `title` and `need` come from the client-problem cards.
 *  - `text` comes from the home practice-area one-liners. The old sixth beat was
 *    "Scale"; Scale now belongs to the method (Learn & Scale), and the sixth
 *    capability is Data, Digital & Responsible AI, labelled "Modernise".
 *  - `deliverables`: the first two lines are from the client-problem card, the
 *    next four are the named outputs of the matching output category. The
 *    indicative timelines and typical-stakeholder lists from the old output
 *    categories are not carried over.
 *
 * Order follows the client cards: Finance is third and Deliver is fourth.
 */
export const capabilities: Capability[] = [
  {
    slug: 'diagnose',
    label: 'Diagnose',
    title: 'Policy, Economics & Strategy Advisory',
    need: 'We need to understand the problem and choose a defensible course of action.',
    text: 'Economic, institutional, market and political-economy analysis that clarifies the problem and identifies realistic options.',
    deliverables: [
      'Diagnostics, modelling, political-economy analysis and regulatory reviews',
      'Actionable policy papers with measurable implementation metrics',
      'National and sector strategic roadmaps',
      'Policy instruments and white papers',
      'Regulatory impact assessments (RIA)',
      'Multi-agency governance frameworks',
    ],
  },
  {
    slug: 'design',
    label: 'Design',
    title: 'Programme Design & Facility Structuring',
    need: 'We have a mandate or funding window but need an implementable programme.',
    text: 'Policies, programmes, investment concepts, theories of change, financing strategies and implementation arrangements.',
    deliverables: [
      'Feasibility studies, theories of change, concept notes and results frameworks',
      'Implementation and financing plans, risk registers and project-preparation support',
      'Techno-economic feasibility studies',
      'Bankable terms of reference (ToR) and scopes',
      'ESG screening',
      'Integrated risk mitigation matrix',
    ],
  },
  {
    slug: 'finance',
    label: 'Finance',
    title: 'Development Finance & Private Capital Mobilisation',
    need: 'Public funding is insufficient; how do we make this investable?',
    text: 'Bankability analysis, blended finance, climate finance, private-capital mobilisation and investment pipelines.',
    deliverables: [
      'Investment cases, blended-finance strategies, PPP advisory and financial models',
      'Bankability assessments, climate-finance pipelines and risk mitigation structures',
      'Dynamic financial and cashflow models',
      'Blended finance and de-risking instruments',
      'Public-private partnership (PPP) structures',
      'Investor and donor mobilisation prospectus',
    ],
  },
  {
    slug: 'deliver',
    label: 'Deliver',
    title: 'Institutions, Governance & Delivery',
    need: 'A policy exists, but institutions cannot implement it consistently.',
    text: 'Institutional strengthening, implementation support, capacity development and adaptive problem-solving.',
    deliverables: [
      'Governance frameworks and public financial management (PFM) reform',
      'Delivery models, process redesign and sustained implementation capacity building',
      'Institutional functional diagnostics and restructuring',
      'Standard operating procedures (SOP) compendium',
      'Change enablement and leadership programmes',
      'Performance accountability and appraisal systems',
    ],
  },
  {
    slug: 'measure',
    label: 'Measure',
    title: 'Monitoring, Evaluation, Learning & Impact',
    need: 'We need to know what is working, why, for whom, and whether it can scale.',
    text: 'MEL frameworks, evaluations, results systems, dashboards and learning processes.',
    deliverables: [
      'MEL frameworks, baselines, process and impact evaluations and learning agendas',
      'Outcome harvesting, real-time dashboards and adaptive management loops',
      'Theory of change and results logframe',
      'Representative baseline and household surveys',
      'Quasi-experimental impact evaluations',
      'Continuous monitoring and indicator dashboards',
    ],
  },
  {
    slug: 'modernise',
    label: 'Modernise',
    title: 'Data, Digital & Responsible AI',
    need: 'We need to modernise systems without creating new governance, exclusion or accountability risks.',
    text: 'Digital public infrastructure, data governance, service digitisation and responsible AI deployment.',
    deliverables: [
      'Digital public infrastructure (DPI) diagnostics, digital-government strategies and data governance frameworks',
      'Interoperability standards, AI readiness and responsible service deployment',
      'Enterprise AI strategy and governance architecture',
      'DPI blueprints',
      'Automated workflow and citizen service digitisation',
      'Data architecture, privacy and cyber hardening',
    ],
  },
];
