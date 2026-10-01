/**
 * Structure of the home journey. This is design, so it lives in code: the 3D scene draws exactly
 * these systems and layers. The prose beside each scene is editable content (home.scenes).
 */
export type SystemId = 'economy' | 'climate' | 'education' | 'cities' | 'energy' | 'institutions';

export interface System {
  id: SystemId;
  name: string;
  note: string;
  relates: SystemId[];
}

/** Order is top to bottom in the 3D scene and in the list. */
export const systems: System[] = [
  {
    id: 'economy',
    name: 'Economy',
    note: 'Growth, jobs and public revenue set what governments can afford to do about everything else.',
    relates: ['climate', 'education', 'energy', 'institutions'],
  },
  {
    id: 'climate',
    name: 'Climate',
    note: 'Heat, floods and drought hit harvests, grids and city budgets, and the transition reshapes the economy.',
    relates: ['economy', 'energy', 'cities'],
  },
  {
    id: 'education',
    name: 'Education',
    note: 'Skills decide who can take the jobs growth creates, and schools are only as good as the budget and management behind them.',
    relates: ['economy', 'institutions'],
  },
  {
    id: 'cities',
    name: 'Cities',
    note: 'Growing cities need energy, water and transport, and the revenue to provide them.',
    relates: ['climate', 'energy', 'institutions'],
  },
  {
    id: 'energy',
    name: 'Energy',
    note: 'Cost, reliability and emissions shape household welfare, business costs and climate targets at once.',
    relates: ['economy', 'climate', 'cities', 'institutions'],
  },
  {
    id: 'institutions',
    name: 'Institutions',
    note: 'Laws, budgets and agencies decide whether any policy in this list reaches the people it is meant for.',
    relates: ['economy', 'education', 'cities', 'energy'],
  },
];

export const systemLinks: [SystemId, SystemId][] = (() => {
  const seen = new Set<string>();
  const out: [SystemId, SystemId][] = [];
  for (const s of systems) {
    for (const r of s.relates) {
      const key = [s.id, r].sort().join('|');
      if (!seen.has(key)) {
        seen.add(key);
        out.push([s.id, r]);
      }
    }
  }
  return out;
})();

export interface EvidenceLayer {
  id: string;
  name: string;
  text: string;
}

/** Order is top to bottom in the 3D scene and in the list. */
export const evidenceLayers: EvidenceLayer[] = [
  { id: 'field', name: 'Field research', text: 'Interviews, site visits and focus groups that show how a policy works on the ground.' },
  { id: 'survey', name: 'Survey data', text: 'Household, firm and facility surveys, designed and sampled so the results can be generalised.' },
  { id: 'admin', name: 'Administrative data', text: 'Budgets, registries and service records the state already holds.' },
  { id: 'maps', name: 'Maps and spatial data', text: 'Where people, services and risks are, and how they relate to each other.' },
  { id: 'methods', name: 'Evaluation methods', text: 'Designs that separate what a programme caused from what would have happened anyway.' },
];

/** The six scenes of the home journey, in order. Their prose lives in the CMS under home.scenes. */
export const railOrder = ['complexity', 'evidence', 'insight', 'policy', 'practice', 'impact'] as const;
export type SceneId = (typeof railOrder)[number];

export const policyPath = {
  steps: [
    {
      id: 'findings',
      title: 'Findings',
      text: 'Where children are missing out, and the reasons behind it.',
    },
    {
      id: 'options',
      title: 'Options',
      text: 'Three routes compared on the same terms.',
      choices: ['Expand existing schools', 'Fund transport and stipends', 'Build new schools where demand is growing'],
    },
    {
      id: 'tradeoffs',
      title: 'Trade-offs',
      text: 'Each option tested for what it costs, who benefits, how fast it works and how likely it is to succeed.',
      choices: ['Fiscal cost', 'Equity', 'Speed', 'Feasibility'],
    },
    {
      id: 'implementation',
      title: 'Implementation choices',
      text: 'Who delivers, how it is financed, which rules must change and how results will be tracked.',
    },
    {
      id: 'decision',
      title: 'Institutional decision',
      text: 'A recommended option, the conditions attached to it and the indicators to watch after launch.',
    },
  ],
} as const;

export const practiceStages = [
  { id: 'institutions', title: 'Institutions', text: 'Mandates, structures and procedures are set so the right body owns the change.' },
  { id: 'programs', title: 'Programmes', text: 'Budgets, eligibility rules and delivery plans turn a policy into something a team can run.' },
  { id: 'services', title: 'Services', text: 'Schools, clinics, utilities and municipal offices receive the skills, tools and guidance to deliver.' },
  { id: 'communities', title: 'Communities', text: 'Households and firms are reached, and their experience is fed back to decision-makers.' },
] as const;

export const impactOutcomes = [
  {
    id: 'institutions',
    title: 'Stronger institutions',
    change: 'Clear mandates, budgets that are spent as planned, and decisions that can be traced to evidence.',
    shown: 'Budget execution, procurement and planning records, audit findings.',
  },
  {
    id: 'services',
    title: 'Better services',
    change: 'Services that reach more of the people entitled to them and work when they arrive.',
    shown: 'Coverage and quality measures from administrative data and user surveys.',
  },
  {
    id: 'systems',
    title: 'More resilient systems',
    change: 'Public finances, infrastructure and programmes that absorb shocks instead of breaking under them.',
    shown: 'Stress tests, risk registers and performance through disruptions.',
  },
  {
    id: 'lives',
    title: 'Improved lives',
    change: 'Households with better health, learning, income and security than they would otherwise have had.',
    shown: 'Evaluation designs that compare outcomes against a credible counterfactual.',
  },
] as const;
