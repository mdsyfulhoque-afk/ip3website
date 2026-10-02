import type { HomeContent } from '../types';

export const home: HomeContent = {
  hero: {
    headline: 'From polycrisis to polysolution.',
    support: 'IP3 turns complex development challenges into evidence, policy, and practical action.',
    audience:
      'Independent policy analysis, action research and management consulting for governments, development partners, multilateral development banks, universities, think tanks and private-sector institutions.',
    primary: { label: 'Explore our work', href: '/services' },
    secondary: { label: 'Discuss a challenge', href: '/contact' },
  },
  scenes: {
    complexity: {
      rail: 'Complexity',
      title: 'Every hard public problem is several problems at once.',
      body: [
        'A fiscal squeeze shows up in schools. A heatwave shows up in the power grid. A weak institution turns a good budget into a stalled project.',
        'The first job is to see how these pressures connect. Select a system to see what it is tied to.',
      ],
    },
    evidence: {
      rail: 'Evidence',
      title: 'Start with what can be checked.',
      body: [
        'We build the evidence base from five kinds of material and keep each one traceable to its source.',
        'Layering them lets us test one against another, so a finding does not rest on a single number or a single interview.',
      ],
    },
    insight: {
      rail: 'Insight',
      title: 'Patterns become findings when they survive scrutiny.',
      body: ['Two questions come up in almost every engagement: did it work, and is it worth it? These diagrams show how we frame each one.'],
    },
    policy: {
      rail: 'Policy',
      title: 'Findings become choices.',
      body: [
        'Evidence rarely points to a single answer. We set out the options, what each costs and risks, who has to act, and what implementation will take, so the decision is made with open eyes.',
      ],
    },
    practice: {
      rail: 'Practice',
      title: 'A decision only matters once it reaches a service.',
      body: [
        'Policy moves through ministries, agencies and municipalities into budgets, rules and front-line services. We help design the delivery arrangements, skills and monitoring that let a change hold.',
      ],
    },
    impact: {
      rail: 'Impact',
      title: 'Public value is something you can check later.',
      body: ['We agree how success will be recognised before the work starts, so results can be tracked, learned from and reported honestly.'],
    },
  },
  policyExample: 'Worked example, hypothetical: a ministry must widen access to secondary school on a fixed budget.',
  capabilitiesHeading: 'What clients hire IP3 to deliver',
  capabilitiesSub: 'Six kinds of help, each written as the problem a client brings to us.',
  sectorsHeading: 'Eight sectors that depend on each other',
  sectorsSub:
    'A policy choice in one sector lands in several. Select a sector to see what it is tied to and the questions we are asked about it.',
  workHeading: 'Selected work',
  workSub: 'Feasibility studies, policy analysis, surveys and evaluations for the World Bank, ADB, the European Commission, Sida and government. Each one opens as a short case story.',
  closing: {
    heading: 'Have a difficult policy or development challenge?',
    sub: 'Let’s define the question, build the evidence, and identify a practical path forward.',
    cta: { label: 'Start a conversation', href: '/contact' },
  },
};
