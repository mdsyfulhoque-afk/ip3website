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
  film: {
    kicker: 'IP3 in motion',
    heading: 'From the factory floor to the data room.',
    lead: 'Thirty seconds on how we work: start with the system, test what can be checked, and stay until policy works on the ground.',
    video: '/video/ip3-reel.mp4',
    poster: '/video/ip3-reel-poster.webp',
  },
  terminal: {
    kicker: 'Built by IP3',
    heading: 'Policy Intelligence Terminal',
    lead: 'A governed execution platform for policy intelligence work. It watches tiered sources, merges what matters into one policy question, and turns it into briefs that show their evidence before anything is published.',
    beats: [
      {
        title: 'Every signal carries its evidence',
        text: 'Live monitoring refreshes every five minutes. Each story arrives with its sources and their tier, the time it was fetched, and the ranking that put it on the board. Decision lenses re-read the same evidence for an executive, a macroeconomist, a development partner, a market analyst, a political economist or an academic.',
        points: ['Tiered, time-stamped sources', 'Transparent ranking explanation', 'Six decision lenses'],
        photo: 'terminal-lenses',
      },
      {
        title: 'Many discussions, one policy question',
        text: 'The Merged Policy Discussion Studio connects the day\'s discussions into a single piece of directed research. The analyst sets the perspective, the question and the audience, chooses the discussions to merge, and keeps every source link visible.',
        points: ['Perspective, topic and audience', 'Tensions and second-order effects', 'A sequenced decision agenda'],
        photo: 'terminal-studio',
      },
      {
        title: 'Modules built for IP3\'s missions',
        text: 'MERLA, climate and ESG, and GovTech are native modules, not add-ons: outcome and milestone tracking with adaptive learning memos, adaptation finance and transition-risk maps, and digital public service maturity with reform roadmaps.',
        points: ['MERLA board and scorecards', 'Climate finance and ESG notes', 'GovTech diagnostics and roadmaps'],
        photo: 'terminal-modules',
      },
      {
        title: 'Briefs that show their working',
        text: 'The Brief Factory turns a story, the daily top ten or a fortnightly period into a brief. The original model draft, the refined policy brief, the evidence, each claim and its verification sit side by side before export.',
        points: ['Story, daily and periodical briefs', 'Claims checked against evidence', 'Export only after verification'],
        photo: 'terminal-briefs',
      },
    ],
    pipeline: ['Signals', 'Discussions', 'Deep research', 'Decision lenses', 'Brief', 'Verify and export'],
    cta: { label: 'Ask for a demonstration', href: '/contact' },
  },
};
