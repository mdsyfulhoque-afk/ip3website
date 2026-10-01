import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronRight } from 'lucide-react';
import { PodcastFlowCarousel } from './PodcastFlowCarousel';
import { useCMS, defaultPodcastCarousel } from '../context/CMSContext';

export interface ApproachPageProps {
  initialSection?: string;
  onNavigateHome?: () => void;
  onNavigateContact?: () => void;
  onNavigateAbout?: () => void;
  onNavigateFocus?: (sectionId?: string) => void;
  onNavigateServices?: (serviceId?: string) => void;
  onNavigatePeople?: () => void;
  onOpenTalk?: () => void;
}

// ---------------------------------------------------------------------------
// DATA DEFINITIONS
// ---------------------------------------------------------------------------

const SPINE_ITEMS = [
  { id: 'journey', label: 'Current → Desired', hue: 18 },
  { id: 'pathway', label: 'The Pathway', hue: 42 },
  { id: 'principles', label: 'How We Work', hue: 110 },
  { id: 'people', label: 'Human-Centered', hue: 150 },
  { id: 'frameworks', label: 'Frameworks', hue: 176 },
  { id: 'outcomes', label: 'What Changes', hue: 192 },
];

const HERO_DATA = {
  eyebrow: 'About Us Sub-Page · Our Approach · Policy to Implementation',
  titleBefore: 'Reform is a ',
  titleEmphasis: 'movement',
  titleAfter: ', not a moment.',
  lede: 'Complex challenges rarely fail for want of another recommendation. They fail when evidence is disconnected from decisions, strategy from financing, technology from users, and reform from the institutions that must own it.',
  throughLine: ['Complexity', 'Intelligence', 'Architecture', 'Implementation', 'Impact'],
};

const CURRENT_STATE_ITEMS = [
  'Fragmented evidence',
  'Unclear root causes',
  'Disconnected actors',
  'Weak user adoption',
  'Policy–implementation gaps',
  'Financing constraints',
  'Siloed data',
  'Unclear accountability',
];

const DESIRED_STATE_ITEMS = [
  'Decision-grade evidence',
  'Clear priorities',
  'An owned solution architecture',
  'Viable financing and resources',
  'An implementable operating model',
  'Inclusive services and systems',
  'Measurable outcomes',
  'Capability to sustain change',
];

const FRAMING_QUESTIONS = [
  {
    number: '01',
    question: 'Where are you now?',
    body: 'What is actually happening across policy, institutions, people, processes, finance, markets, data, technology and service delivery?',
  },
  {
    number: '02',
    question: 'Where do you need to be?',
    body: 'What would a credible target state look like for users, decision-makers, institutions, funders and implementing teams?',
  },
  {
    number: '03',
    question: 'What has to change to get there?',
    body: 'Which policies, incentives, capabilities, operating arrangements, technologies, investments and behaviours must move — and in what sequence?',
  },
];

const ENGAGEMENT_CLARIFICATION = [
  'The problem or opportunity',
  'The decision that must be enabled',
  'The people affected by that decision',
  'The intended outcomes',
  'Institutional and political constraints',
  'Implementation responsibilities',
  'Available evidence and data',
  'Financing and resource constraints',
  'Risks and dependencies',
  'The time horizon',
  'What success would look like',
  'What the client must be able to manage independently when the assignment ends',
];

interface SectorInfo {
  id: string;
  label: string;
  blurb: string;
  questions: string[];
  tools: string[];
  examples: Record<string, string>;
}

const SECTORS: SectorInfo[] = [
  {
    id: 'climate',
    label: 'Climate & ESG',
    blurb: 'Climate action, ESG and sustainability — where transition ambition meets financing, regulation and operational reality.',
    questions: [
      'What prevents investment in a green transition?',
      'Which climate investments generate the greatest economic and social value?',
      'How can ESG move from reporting to operational strategy?',
      'How should climate, transition and financial risks change investment priorities?',
      'What financing mechanisms make the transition viable?',
    ],
    tools: [
      'Climate-risk diagnostics',
      'Green-transition roadmaps',
      'ESG materiality',
      'Circular-economy analysis',
      'Economic and financial CBA',
      'Climate finance and blended finance',
      'Investment pipelines',
      'Green business models',
      'Policy and regulatory analysis',
      'Stakeholder engagement',
      'MERLA',
    ],
    examples: {
      'movement-01': 'Climate-risk and transition diagnostic across firms, regulation and finance',
      'movement-02': 'Economic evidence on abatement cost, exposure and investment returns',
      'movement-03': 'Resilience and green-transition architecture, tested with industry',
      'movement-04': 'Climate finance, blended structures and an investment pipeline',
      'movement-05': 'Rollout with regulators, industry bodies and financing institutions',
      'movement-06': 'Adaptive monitoring of emissions, adoption and financial sustainability',
    },
  },
  {
    id: 'education',
    label: 'Education & Human Capital',
    blurb: 'Education and human capacity development — learning outcomes, inclusion, teacher capability and digital learning systems.',
    questions: [
      'Why are learning outcomes not improving?',
      'Where are students, teachers or institutions being excluded?',
      'Which investments in curriculum, infrastructure, EdTech or teacher development are viable?',
      'How should real-time assessment data improve decisions?',
      'How can digital transformation strengthen rather than fragment the education system?',
    ],
    tools: [
      'Learning-system diagnostics',
      'Curriculum and institutional analysis',
      'Teacher and leadership capability assessment',
      'TVET labour-market analysis',
      'Education financing',
      'EdTech and digital-learning strategies',
      'LMS design',
      'Competency-based assessment',
      'User research and digital inclusion',
      'Gender and accessibility assessment',
      'Feasibility and CBA',
      'Data and monitoring systems',
    ],
    examples: {
      'movement-01': 'Learning gaps, institutional readiness and exclusion mapped together',
      'movement-02': 'Assessment, teacher and user data turned into an investment case',
      'movement-03': 'Competency-based assessment, LMS and EdTech architecture, tested in schools',
      'movement-04': 'Institutions, ICT infrastructure and education financing aligned',
      'movement-05': 'Rollout with continuing professional development and adoption support',
      'movement-06': 'Real-time assessment data driving adaptation, then scale',
    },
  },
  {
    id: 'institutions',
    label: 'Institutions, Data & Digital',
    blurb: 'Institutional effectiveness, data and digital governance — turning policy into service delivery people can actually use.',
    questions: [
      'Why is the institution struggling to turn policy into service delivery?',
      'What operating model will improve accountability and performance?',
      'How can administrative data become a strategic asset?',
      'Which services should be redesigned around users?',
      'Where can AI, automation, GIS or GovTech create real public value?',
      'What governance is needed for trustworthy digital transformation?',
    ],
    tools: [
      'Institutional diagnostics',
      'Target operating models',
      'Process redesign',
      'Digital maturity assessment',
      'Data governance and interoperability',
      'Digital Public Infrastructure',
      'Digital service design and service journeys',
      'GovTech and AI readiness',
      'GIS',
      'Real-time dashboards',
      'Change management',
      'Capability development',
    ],
    examples: {
      'movement-01': 'Institutional mandate, process and digital-maturity diagnostic',
      'movement-02': 'Administrative data and service analytics turned into decision intelligence',
      'movement-03': 'Target operating model, service blueprint and data architecture, prototyped',
      'movement-04': 'Decision rights, interoperability standards and financing aligned',
      'movement-05': 'Process redesign, platform rollout and civil-service capability building',
      'movement-06': 'Live dashboards and performance triggers driving iteration and scale',
    },
  },
];

interface ProofCard {
  id: string;
  title: string;
  context: string;
  blurb: string;
  targetFocusArea?: string;
  targetService?: string;
}

const PROOF_CARDS: Record<string, ProofCard> = {
  'green-industrial-transition': {
    id: 'green-industrial-transition',
    title: 'Green Industrial Transition',
    context: 'Textile & RMG sector · Bangladesh',
    blurb: 'An 18-month multi-method research and advocacy programme on barriers to green transition, green technology, renewable energy, regulation and green finance — informed by a large firm survey, key informant interviews and focus-group research.',
    targetService: 'climate-sustainability',
  },
  'technology-adoption-research': {
    id: 'technology-adoption-research',
    title: 'Technology Adoption & Firm-Level Evidence',
    context: 'World Bank · firm-level research',
    blurb: 'Firm-level technology-adoption research with survey design and field implementation, digitalisation and informality research, data quality assurance, economic analysis, stakeholder engagement and policy reporting.',
    targetService: 'policy-innovation',
  },
  'education-systems-transformation': {
    id: 'education-systems-transformation',
    title: 'Education Systems Transformation & Digital Learning',
    context: 'ADB-supported feasibility and programme preparation · Bangladesh · 2023–2026',
    blurb: 'Feasibility and investment analysis for primary, secondary, madrasah and TVET transformation — covering demand assessment, curriculum and pedagogy, digital learning, ICT infrastructure, real-time competency-based assessment, LMS and teacher development, institutional capacity, gender and inclusive access, climate resilience and economic and financial cost-benefit analysis.',
    targetFocusArea: 'education',
  },
  'climate-early-warning': {
    id: 'climate-early-warning',
    title: 'Climate-Informed Early Warning Systems',
    context: 'ADB regional technical assistance · Asia and the Pacific · 2025–2026',
    blurb: 'Multi-hazard early-warning diagnostics, investment-pipeline design, economic and financial analysis, lifecycle O&M costing, institutional assessment, gender and inclusion, data standards and interoperability, multi-channel last-mile dissemination, results frameworks, procurement packaging and donor proposals.',
    targetFocusArea: 'climate',
  },
  'municipal-finance-transformation': {
    id: 'municipal-finance-transformation',
    title: 'Municipal Finance & Institutional Transformation',
    context: 'Bangladesh Municipal Development Fund',
    blurb: 'Municipal infrastructure investment planning, GIS-informed planning, business simplification and automation, economic and financial analysis, PPP and innovative finance, a long-term financial roadmap, regulatory and institutional reform, capacity development, and KPIs with performance monitoring.',
    targetService: 'economic-feasibility',
  },
  'policy-reform-trade': {
    id: 'policy-reform-trade',
    title: 'Policy Reform, Trade & LDC Graduation',
    context: 'European Commission and World Bank',
    blurb: 'Diagnostic gap analysis, productive-capacity analysis, market and trade assessment, investment and financing options, institutional mapping, vulnerability analysis, stakeholder coordination, and policy and reform priorities.',
    targetService: 'policy-innovation',
  },
};

interface Movement {
  id: string;
  number: string;
  title: string;
  conceptualLabel: string;
  headline: string;
  clientQuestion: string;
  ip3Work: string;
  output: string;
  proofKey: string;
  drawerGroups: { label: string; items: string[] }[];
}

const MOVEMENTS: Movement[] = [
  {
    id: 'movement-01',
    number: '01',
    title: 'Sense & Diagnose',
    conceptualLabel: 'Complexity',
    headline: 'Understand the system before treating the symptom.',
    clientQuestion: 'What is really preventing the organisation, programme, market or system from reaching the desired outcome?',
    ip3Work: 'A visible problem is rarely the whole problem. We run a current-state diagnostic that identifies how policies, institutions, incentives, markets, people, technology, finance, infrastructure, data and behaviours interact — separating what drives the problem from what is merely a symptom, and locating where intervention creates the greatest leverage.',
    output: 'Current-State Diagnostic & Transformation Baseline',
    proofKey: 'green-industrial-transition',
    drawerGroups: [
      {
        label: 'What we audit',
        items: [
          'Policy and regulatory environment',
          'Institutional mandates and accountability',
          'Organisational structure and operating model',
          'Service-delivery processes',
          'User and beneficiary experience',
          'Political economy and stakeholder incentives',
          'Market structure and demand',
          'Financial sustainability and investment constraints',
          'Human-resource and capability gaps',
          'Digital maturity and technology architecture',
          'Data availability, quality, governance and interoperability',
          'Inclusion and accessibility',
          'Climate and environmental risk',
          'Implementation bottlenecks',
          'Existing monitoring and performance systems',
        ],
      },
      {
        label: 'Methods',
        items: [
          'Systems thinking',
          'Institutional analysis',
          'Political economy analysis',
          'Stakeholder mapping',
          'Process mapping',
          'Market and demand assessment',
          'SWOT and gap analysis',
          'Digital maturity assessment',
          'Data audit',
          'Financial diagnostics',
          'Climate and risk assessment',
          'User research',
        ],
      },
      {
        label: 'User-centred discovery',
        items: [
          'Semi-structured and key informant interviews',
          'Focus groups and stakeholder workshops',
          'Field observation and service-user journeys',
          'Frontline staff interviews',
          'Accessibility and digital-inclusion assessment',
          'Qualitative research and quantitative surveys',
          'Administrative data and digital analytics',
        ],
      },
      {
        label: 'How client teams take part',
        items: [
          'Validate the system map',
          'Identify hidden constraints',
          'Challenge assumptions',
          'Locate usable data',
          'Interpret political and institutional realities',
          'Agree the priority problems to solve',
        ],
      },
      {
        label: 'Deliverable components',
        items: [
          'Systems map and institutional map',
          'User journey',
          'Bottleneck and root-cause analysis',
          'Problem tree',
          'Baseline indicators',
          'Stakeholder and incentive map',
          'Data maturity assessment',
          'Risk register',
          'Opportunity and leverage-point map',
        ],
      },
    ],
  },
  {
    id: 'movement-02',
    number: '02',
    title: 'Build Intelligence',
    conceptualLabel: 'Evidence',
    headline: 'Turn information into decision intelligence.',
    clientQuestion: 'What does the evidence tell us to do differently?',
    ip3Work: 'Not every evidence gap requires another large study. We identify what must be known to change a decision, combine existing evidence with new primary research where it is needed, and connect quantitative analysis to institutional, behavioural and user insight. Evidence is then translated into a practical target state.',
    output: 'Evidence & Target-State Blueprint',
    proofKey: 'technology-adoption-research',
    drawerGroups: [
      {
        label: 'Evidence architecture',
        items: [
          'Policy and literature review',
          'Administrative-data analysis',
          'Household, enterprise or institutional surveys',
          'Econometric analysis and forecasting',
          'Scenario modelling',
          'Economic and financial analysis',
          'Cost-benefit analysis and investment appraisal',
          'Market research',
          'Qualitative research, KII and FGD',
          'Spatial / GIS analysis',
          'Digital analytics',
          'Counterfactual or impact evaluation',
          'Rapid evidence assessment',
          'Benchmarking and comparative policy analysis',
        ],
      },
      {
        label: 'Mixed-methods principle',
        items: [
          'Quantitative evidence establishes the scale and distribution of a problem',
          'Qualitative evidence explains why it exists and how users experience it',
          'Together they show what institutions may realistically be able to change',
        ],
      },
      {
        label: 'Defining the future state',
        items: [
          'Desired policy outcome',
          'Improved service model',
          'New institutional capability',
          'Revised operating model',
          'Digital transformation outcome',
          'Investment programme and reform package',
          'Scalable programme architecture',
          'Improved learning or human-capital outcome',
          'Transition pathway',
        ],
      },
      {
        label: 'Proven frameworks',
        items: [
          'Theory of Change',
          'Logical Framework / LogFrame',
          'Results-Based Management and results frameworks',
          'Options appraisal and feasibility frameworks',
          'Value-for-money assessment',
          'Cost-benefit analysis',
          'ENPV / EIRR and FNPV / FIRR',
          'WACC',
          'Risk and sensitivity analysis',
          'Scenario planning',
          'Outcome mapping',
        ],
      },
      {
        label: 'How client teams take part',
        items: [
          'Agree which evidence is decision-critical',
          'Judge what evidence is sufficiently reliable',
          'Name the assumptions that remain uncertain',
          'Define what the future state should achieve',
          'Choose the outcomes and indicators that define success',
        ],
      },
    ],
  },
  {
    id: 'movement-03',
    number: '03',
    title: 'Co-Design & Test',
    conceptualLabel: 'Architecture',
    headline: 'Turn evidence into something that can operate.',
    clientQuestion: 'What solution can work within the real institutional, user, financial and political environment?',
    ip3Work: 'This is where analysis becomes actionable architecture. Policies, programmes, operating models, digital systems, regulations, financial mechanisms and services are designed together with the institutions and people who must use them — then prototyped and tested before anyone commits institutional resources.',
    output: 'Tested Solution Architecture',
    proofKey: 'education-systems-transformation',
    drawerGroups: [
      {
        label: 'Human-centered and service design',
        items: [
          'Listen — needs, behaviours, frustrations, incentives and barriers',
          'Map — journeys, service interactions, processes and failure points',
          'Co-design — ideas developed with users, client teams and technical stakeholders',
          'Prototype — the smallest useful representation of the policy, service, workflow or model',
          'Test — structured feedback and evidence',
          'Iterate — keep what works, change what does not',
        ],
      },
      {
        label: 'What can be prototyped',
        items: [
          'Policies and regulatory processes',
          'Service journeys and assessment systems',
          'Operating procedures and implementation workflows',
          'Digital interfaces, dashboards, data flows and forms',
          'Institutional arrangements',
          'Financing mechanisms and incentive structures',
          'Training programmes',
          'Monitoring systems',
        ],
      },
      {
        label: 'Testing approaches',
        items: [
          'Rapid prototyping',
          'Policy pilots and demonstration projects',
          'Service trials and sandbox approaches',
          'A/B and usability testing',
          'Field testing and staged rollout',
          'Proof of concept and implementation simulations',
          'Randomised or quasi-experimental approaches where appropriate',
        ],
      },
      {
        label: 'Deliverable components',
        items: [
          'Policy architecture',
          'Target operating model',
          'Service blueprint',
          'Implementation design',
          'Regulatory framework',
          'Digital architecture and data architecture',
          'Governance model',
          'Validated prototype',
          'Business model',
          'Theory of Change and results framework',
          'Implementation options',
        ],
      },
    ],
  },
  {
    id: 'movement-04',
    number: '04',
    title: 'Mobilise',
    conceptualLabel: 'Mobilisation',
    headline: 'A good design cannot implement itself.',
    clientQuestion: 'What must be aligned, funded, authorised and mobilised for implementation to succeed?',
    ip3Work: 'Mobilisation is broader than financing. It means aligning the mandate, leadership, stakeholders, people, capabilities, technology, data, financing and implementation resources needed to move from design into operating reality — worked jointly with client finance, policy, IT, programme and leadership teams rather than handed to a downstream consultant.',
    output: 'Mobilisation & Implementation Readiness Plan',
    proofKey: 'climate-early-warning',
    drawerGroups: [
      {
        label: 'Governance',
        items: [
          'Executive sponsorship',
          'Institutional ownership',
          'Decision rights',
          'Inter-agency coordination',
          'Steering arrangements',
          'Accountability mechanisms',
        ],
      },
      {
        label: 'People',
        items: [
          'Implementation teams',
          'Technical expertise',
          'Client capability',
          'Change champions',
          'Workforce planning',
        ],
      },
      {
        label: 'Finance',
        items: [
          'Public finance',
          'Development and concessional finance',
          'Private capital',
          'PPP structures',
          'Blended finance',
          'Green finance',
          'Lifecycle and O&M financing',
        ],
      },
      {
        label: 'Data & technology',
        items: [
          'Technology architecture',
          'Interoperability and data standards',
          'Data governance',
          'Digital public infrastructure',
          'Digital identity, data exchange and payment integration where relevant',
          'Digital safeguards, cybersecurity and privacy',
        ],
      },
      {
        label: 'Market & partnership',
        items: [
          'Suppliers and industry',
          'Development partners',
          'Academia',
          'Civil society',
          'Implementation partners',
          'Local communities',
        ],
      },
      {
        label: 'Business & investment case',
        items: [
          'Investment requirements and lifecycle costs',
          'Fiscal implications',
          'Financing structure',
          'Economic and financial returns',
          'Sustainability analysis',
          'Procurement strategy and risk allocation',
          'Funding proposal and investment pipeline',
        ],
      },
    ],
  },
  {
    id: 'movement-05',
    number: '05',
    title: 'Implement & Transfer',
    conceptualLabel: 'Delivery',
    headline: 'Implementation is part of consulting — not what happens after consulting.',
    clientQuestion: 'How do we make the new policy, programme, service or system work reliably in practice?',
    ip3Work: 'We work alongside clients as strategy becomes operating reality, treating change management and stakeholder engagement as implementation disciplines rather than communication exercises. The objective is not consultant dependency — it is institutional capability, transferred deliberately as the work proceeds.',
    output: 'Operational Delivery System & Capability Transfer Plan',
    proofKey: 'municipal-finance-transformation',
    drawerGroups: [
      {
        label: 'Delivery architecture',
        items: [
          'Programme and project management',
          'Implementation roadmaps and workstream management',
          'Delivery units and PMO / transformation office support',
          'Operating-model implementation and process redesign',
          'Digital-system rollout and data-platform implementation',
          'Monitoring dashboards',
          'Procurement support',
          'Implementation SOPs',
          'Service-delivery redesign',
          'Partner coordination',
          'Performance, risk and issue management',
        ],
      },
      {
        label: 'What transformation actually changes',
        items: [
          'Roles and authority',
          'Incentives and workflows',
          'Technology',
          'Behaviours',
          'Organisational relationships',
          'Performance expectations',
        ],
      },
      {
        label: 'Change workstreams',
        items: [
          'Leadership alignment',
          'Stakeholder analysis',
          'Change-impact assessment',
          'Internal communication and adoption planning',
          'Capability-gap assessment',
          'Training and coaching',
          'Change champions and user adoption',
          'Feedback channels and resistance management',
        ],
      },
      {
        label: 'Knowledge transfer — one delivery team',
        items: [
          'Joint diagnostics and co-analysis',
          'Co-design and paired technical work',
          'Implementation clinics and workshops',
          'Coaching',
          'Templates, manuals and SOPs',
          'Analytical models and data systems',
          'Train-the-trainer approaches',
          'Institutional knowledge repositories',
        ],
      },
    ],
  },
  {
    id: 'movement-06',
    number: '06',
    title: 'Learn & Scale',
    conceptualLabel: 'Learning',
    headline: 'Measure in time to change something.',
    clientQuestion: 'What evidence would tell us to continue, adapt, stop, institutionalise or scale?',
    ip3Work: 'Traditional evaluation asks what happened after an intervention ends. Our MERLA approach also asks what decision-makers need to know while implementation is still underway — with decision thresholds and feedback loops agreed before implementation starts, so evidence can change the programme rather than merely report on it.',
    output: 'MERLA, Adaptation & Scale Architecture',
    proofKey: 'policy-reform-trade',
    drawerGroups: [
      {
        label: 'MERLA',
        items: [
          'Monitoring — are activities, services and systems performing as expected?',
          'Evaluation — are outcomes changing, and why?',
          'Research — what questions need deeper investigation?',
          'Learning — what does the evidence mean for the next decision?',
          'Adaptation — what should change now?',
        ],
      },
      {
        label: 'Decision thresholds agreed in advance',
        items: [
          'Performance triggers',
          'Adoption thresholds',
          'Service-quality indicators',
          'Financial sustainability indicators',
          'Learning outcomes',
          'Inclusion indicators',
          'Climate resilience measures',
          'Operational KPIs and delivery milestones',
          'User satisfaction and data quality',
        ],
      },
      {
        label: 'Scale is earned, not assumed',
        items: [
          'Effectiveness',
          'User adoption',
          'Affordability',
          'Institutional capacity',
          'Implementation fidelity',
          'Operational feasibility',
          'Digital readiness',
          'Inclusion',
          'Financial sustainability',
          'Political and stakeholder ownership',
          'Replicability',
          'Unintended consequences',
        ],
      },
      {
        label: 'Scale pathways',
        items: [
          'Institutionalisation and policy adoption',
          'Geographic scale-up',
          'Service integration and system-wide rollout',
          'Financing at scale',
          'Capacity building and standardisation',
          'Digital interoperability',
          'Incorporation into government systems',
        ],
      },
    ],
  },
];

const PRINCIPLES = [
  {
    number: '01',
    title: 'Evidence before assumption',
    brandTerm: 'Translation, not theory',
    body: 'We generate and use evidence to change decisions. Research is the beginning of the transformation process, not automatically its final product.',
  },
  {
    number: '02',
    title: 'Systems before symptoms',
    brandTerm: 'From poly-crisis to poly-solutions',
    body: 'Connected problems require connected responses. We examine relationships between policies, institutions, finance, markets, technology, users and implementation before defining the intervention.',
  },
  {
    number: '03',
    title: 'Co-creation, not prescription',
    brandTerm: 'A convenor between worlds',
    body: 'We bring together government, markets, development partners, researchers, implementers, technology teams and communities. Solutions are stronger when the people who must operate and experience them help shape them.',
  },
  {
    number: '04',
    title: 'Test before scale',
    brandTerm: 'Thinking that ships',
    body: 'Strategies become useful when they survive contact with reality. We prototype, pilot, test and iterate where uncertainty makes premature scale risky.',
  },
  {
    number: '05',
    title: 'Implementation alongside strategy',
    brandTerm: 'End-to-end expertise',
    body: 'Policy, research, finance, digital design, programme management and evaluation should not become disconnected workstreams. We work across the value chain from diagnosis to implementation and adaptation.',
  },
  {
    number: '06',
    title: 'Capability beyond the assignment',
    brandTerm: 'Build the institution, not consultant dependency',
    body: 'The strongest evidence of success is not that IP3 remains indispensable. It is that the client has stronger systems, people, data and capacity to keep improving after the engagement.',
  },
];

const RESOLUTION_LEVELS = [
  {
    level: 'Level 1',
    label: 'The institutional through-line',
    chain: ['Complexity', 'Intelligence', 'Architecture', 'Implementation', 'Impact'],
    body: 'The strategic story. We understand interconnected problems, translate them into decision-grade intelligence, turn that intelligence into actionable architecture, support implementation with institutions, and build the capability required for durable impact.',
  },
  {
    level: 'Level 2',
    label: 'The IP3 impact logic',
    chain: ['Sense', 'Design', 'Test', 'Implement', 'Learn & Scale'],
    body: 'The delivery logic behind engagements. Solutions are understood before they are designed, tested before they are scaled, implemented with the people who must operate them, and improved through evidence.',
  },
  {
    level: 'Level 3',
    label: 'The operational pathway',
    chain: ['Complexity', 'Evidence', 'Architecture', 'Mobilisation', 'Delivery', 'Learning'],
    body: 'The Six Movements of Reform — what teams actually do on the ground. The frameworks are nested, not competing.',
  },
];

const HCD_STAGES = [
  { label: 'Listen', body: 'Understand needs, behaviours, frustrations, incentives and barriers.' },
  { label: 'Map', body: 'Visualise journeys, service interactions, processes and failure points.' },
  { label: 'Co-Design', body: 'Develop ideas with users, client teams and technical stakeholders.' },
  { label: 'Prototype', body: 'Build the smallest useful representation of the policy, service or model.' },
  { label: 'Test', body: 'Collect structured feedback and evidence.' },
  { label: 'Iterate', body: 'Keep what works. Change what does not.' },
];

const HCD_PARTICIPANTS = [
  'Citizens', 'Students', 'Teachers', 'Officials', 'Firms', 'Workers', 'Service providers', 'Communities'
];

const HCD_FAILURE_MODES = [
  'Users cannot access it',
  'Frontline teams do not understand it',
  'Digital channels exclude people',
  'Forms are too complex',
  'Incentives work against adoption',
  'Data requirements are unrealistic',
  'Processes create friction',
  'Technology solves the wrong problem',
];

const FRAMEWORK_MODELS = [
  { name: 'Actionable Architecture', body: 'Turn complexity and evidence into something that can be implemented.' },
  { name: 'Poly-Solution Architecture', body: 'Design connected responses for connected problems.' },
  { name: 'Translational Policy Model', body: 'Diagnostics & Research → Policy & Strategy Design → Financing & Bankability → Delivery Architecture → Implementation Support → Learning & Scale' },
  { name: 'IP3 Impact Logic', body: 'Sense → Design → Test → Implement → Learn & Scale' },
  { name: 'Dynamic Network Model', body: 'Assemble interdisciplinary, cross-geographic expertise around the specific challenge while retaining the local and institutional intelligence that makes solutions workable.' },
];

const FRAMEWORK_CRITERIA = [
  'Decision type', 'Sector', 'Maturity', 'Available evidence', 'Risk',
  'Regulatory environment', 'Stakeholder complexity', 'Implementation capacity', 'Scale', 'Budget', 'Timeline'
];

const FRAMEWORK_GROUPS = [
  {
    label: 'Strategy & policy',
    items: [
      'Policy cycle analysis', 'Political economy analysis', 'Institutional analysis',
      'Regulatory impact analysis', 'Theory of Change', 'Scenario planning',
      'Results frameworks', 'RBM / LogFrame', 'Policy options analysis'
    ]
  },
  {
    label: 'Economics & investment',
    items: [
      'Economic cost-benefit analysis', 'Financial analysis', 'ENPV / EIRR', 'FNPV / FIRR',
      'WACC', 'Sensitivity and risk analysis', 'Market assessment', 'Financial modelling',
      'Value-for-money analysis', 'Investment appraisal'
    ]
  },
  {
    label: 'Management & transformation',
    items: [
      'Current-state assessment', 'Future-state design', 'Transformation roadmap',
      'Target operating model', 'Process redesign', 'Implementation readiness',
      'Change management', 'Programme management', 'Capability assessment', 'Performance management'
    ]
  },
  {
    label: 'Human-centered innovation',
    items: [
      'Design research', 'User journeys', 'Service design', 'Co-design', 'Prototyping',
      'Usability testing', 'Service blueprints', 'Behavioural insight', 'Experimentation'
    ]
  },
  {
    label: 'Data & digital',
    items: [
      'Digital maturity assessment', 'Data governance', 'Data architecture', 'Interoperability',
      'Digital public infrastructure', 'Digital inclusion', 'GovTech', 'Digital service design',
      'GIS', 'Dashboards', 'AI-enabled analytics where appropriate', 'Real-time monitoring'
    ]
  },
  {
    label: 'Evidence & learning',
    items: [
      'Mixed-method research', 'Survey design', 'KII and FGD', 'Econometric analysis',
      'RCT and quasi-experimental methods where appropriate', 'Monitoring and evaluation',
      'MERLA', 'Adaptive management', 'Outcome and impact evaluation'
    ]
  }
];

const COLLAB_DATA = {
  ip3: [
    'Interdisciplinary expertise', 'Independent analysis', 'Methods and frameworks',
    'Research and modelling', 'Facilitation', 'Technical design', 'Implementation support',
    'External benchmarking', 'Quality assurance'
  ],
  client: [
    'Institutional intelligence', 'Decision authority', 'Operational knowledge',
    'Internal data', 'Staff participation', 'Stakeholder access', 'Implementation ownership'
  ],
  together: [
    'Diagnose', 'Prioritise', 'Co-design', 'Test', 'Implement',
    'Monitor', 'Learn', 'Build capability', 'Institutionalise'
  ]
};

const DIGITAL_QUESTIONS = [
  'Should we?', 'For whom?', 'What problem will it solve?', 'What data will it require?',
  'Who governs that data?', 'Can different systems interoperate?', 'Who might be excluded?',
  'Can the institution maintain it?'
];

const DIGITAL_SCOPE = [
  'Digital government', 'Digital public services', 'Digital Public Infrastructure',
  'Data governance', 'Interoperability and data standards', 'Digital identity and data exchange where relevant',
  'GIS and spatial intelligence', 'Real-time monitoring and dashboards',
  'Digital assessment and learning platforms', 'GovTech', 'Responsible AI and automation',
  'Digital inclusion and accessibility', 'Institutional capability'
];

const SHIFTS = [
  { from: 'A fragmented understanding of the problem', to: 'A decision-grade view of the system and its root causes' },
  { from: 'Recommendations without institutional ownership', to: 'A solution architecture with clear accountabilities' },
  { from: 'Technology-led digitisation', to: 'Human-centered, governed and inclusive digital transformation' },
  { from: 'A project plan', to: 'A sequenced implementation roadmap with resources, risks and decision gates' },
  { from: 'External expertise carrying the reform', to: 'Client capability able to operate and adapt it' },
  { from: 'Monitoring for reporting', to: 'Evidence for management, learning and course correction' },
  { from: 'A successful pilot', to: 'An evidence-based decision about whether and how to scale' },
];

const DIFFERENTIATORS = [
  'No strategy without a pathway to delivery.',
  'No digital tool without institutional ownership.',
  'No policy recommendation without an implementation question.',
  'No major investment without understanding costs, benefits and risk.',
  'No transformation without the people who must deliver it.',
  'No scale before evidence.',
  'No evaluation that arrives too late to improve the programme.',
];

const DELIVERABLES = [
  { number: '01', title: 'A decision-grade diagnostic', body: 'Clear evidence of the root problem, risks, constraints and leverage points.' },
  { number: '02', title: 'A target-state blueprint', body: 'A shared definition of what the future policy, service, programme, institution or system should achieve.' },
  { number: '03', title: 'A tested solution', body: 'A prototype, pilot, policy instrument, operating model or design exposed to real-world feedback.' },
  { number: '04', title: 'An implementation roadmap', body: 'Sequenced actions, responsibilities, milestones, dependencies and decision gates.' },
  { number: '05', title: 'A business & investment case', body: 'Costs, benefits, financial requirements, funding strategy, risks and economic rationale.' },
  { number: '06', title: 'An operating & governance model', body: 'Roles, decision rights, processes, coordination and accountability.' },
  { number: '07', title: 'A data & digital architecture', body: 'Where relevant: data governance, interoperability, platforms, dashboards, digital services and monitoring.' },
  { number: '08', title: 'A change & capability plan', body: 'The people, skills and organisational change required to sustain implementation.' },
  { number: '09', title: 'A MERLA & performance system', body: 'Indicators, feedback loops, learning routines and decision triggers.' },
  { number: '10', title: 'A pathway to scale', body: 'A realistic mechanism for taking what works beyond the pilot or consulting assignment.' },
];

const CLOSING_STARTERS = [
  'The reform that is stuck',
  'The programme that needs redesign',
  'The institution that needs to perform differently',
  'The investment that needs a stronger business case',
  'The data that is not driving decisions',
  'The digital system users are not adopting',
  'The policy that has not translated into implementation',
  'The service that needs to work better for people',
];

const POSITIONING_POINTS = [
  'Research that changes decisions.',
  'Architecture that can be implemented.',
  'Technology designed around people.',
  'Institutions equipped to sustain change.',
];

// ---------------------------------------------------------------------------
// HELPER SUB-COMPONENTS
// ---------------------------------------------------------------------------

const ArrowRightIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} aria-hidden="true" className="w-4 h-4 shrink-0">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const SearchIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" className="w-3.5 h-3.5 shrink-0">
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-4-4" />
  </svg>
);

const CheckCircleIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" className="w-3.5 h-3.5 shrink-0">
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12l3 3 5-6" />
  </svg>
);

interface DisclosureProps {
  label: string;
  labelOpen?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const Disclosure: React.FC<DisclosureProps> = ({ label, labelOpen, defaultOpen = false, children }) => {
  return (
    <details className="disclosure" open={defaultOpen}>
      <summary className="disclosure__btn">
        <span className="disclosure__sign" aria-hidden="true" />
        <span className="disclosure__label disclosure__label--closed">{label}</span>
        <span className="disclosure__label disclosure__label--open">{labelOpen || 'Close −'}</span>
      </summary>
      <div className="disclosure__panel">{children}</div>
    </details>
  );
};

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

export const ApproachPage: React.FC<ApproachPageProps> = ({
  initialSection,
  onNavigateHome,
  onNavigateContact,
  onNavigateAbout,
  onNavigateFocus,
  onNavigateServices,
  onNavigatePeople,
  onOpenTalk,
}) => {
  const { data } = useCMS();
  const podcastConfig = data.podcastCarousel ?? defaultPodcastCarousel;

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // States
  const [activeMovementIndex, setActiveMovementIndex] = useState<number>(0);
  const [activeSectorId, setActiveSectorId] = useState<string>('institutions');
  const [activeHcdIndex, setActiveHcdIndex] = useState<number>(0);

  // Scroll to section or top on mount
  useEffect(() => {
    if (initialSection) {
      const clean = initialSection.startsWith('#') ? initialSection : `#${initialSection}`;
      setTimeout(() => {
        const el = document.querySelector(clean);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [initialSection]);

  // Set up reveal animations
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reveals = container.querySelectorAll<HTMLElement>('.reveal');
    if ('IntersectionObserver' in window) {
      const ro = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('is-in');
              ro.unobserve(e.target);
            }
          });
        },
        { rootMargin: '0px 0px -10% 0px' }
      );
      reveals.forEach((el) => ro.observe(el));
      return () => ro.disconnect();
    } else {
      reveals.forEach((el) => el.classList.add('is-in'));
    }
  }, []);

  // Interactive ambient background canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Particle nodes
    const nodeCount = width < 768 ? 32 : 64;
    const nodes: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.5 + 1,
      });
    }

    let time = 0;
    const render = () => {
      time += 0.005;
      ctx.clearRect(0, 0, width, height);

      // Connect near particles with faint line
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);
          const maxDist = width < 768 ? 95 : 140;

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.14;
            ctx.strokeStyle = `rgba(219, 120, 80, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        ctx.fillStyle = 'rgba(219, 120, 80, 0.45)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Track progress
  useEffect(() => {
    const onScroll = () => {
      const st = window.pageYOffset || document.documentElement.scrollTop;
      const sh = document.documentElement.scrollHeight - window.innerHeight;
      const pct = Math.max(0, Math.min(1, sh > 0 ? st / sh : 0));

      if (progressBarRef.current) {
        progressBarRef.current.style.width = (pct * 100).toFixed(2) + '%';
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Section observation for dynamic ambient hue
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;

    const observers: IntersectionObserver[] = [];
    SPINE_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              if (containerRef.current) {
                containerRef.current.style.setProperty('--hue', String(item.hue));
              }
            }
          });
        },
        { rootMargin: '-40% 0px -40% 0px' }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Movement scroll tracking
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;

    const observers: IntersectionObserver[] = [];
    MOVEMENTS.forEach((m, idx) => {
      const el = document.getElementById(m.id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              setActiveMovementIndex(idx);
            }
          });
        },
        { rootMargin: '-40% 0px -40% 0px' }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Scroll to section helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Human Centred Design node positions (Orbit circle radius = 78, center = 110)
  const orbitRadius = 78;
  const orbitCenter = 110;
  const hcdNodePositions = HCD_STAGES.map((_, i) => {
    const angle = (i / HCD_STAGES.length) * Math.PI * 2 - Math.PI / 2;
    return {
      x: orbitCenter + Math.cos(angle) * orbitRadius,
      y: orbitCenter + Math.sin(angle) * orbitRadius,
    };
  });

  // Handle proof link clicks
  const handleProofClick = (proof: ProofCard) => {
    if (proof.targetFocusArea && onNavigateFocus) {
      onNavigateFocus(proof.targetFocusArea);
    } else if (proof.targetService && onNavigateServices) {
      onNavigateServices(proof.targetService);
    } else if (onNavigateHome) {
      onNavigateHome();
    }
  };

  return (
    <div className="approach-page min-h-screen selection:bg-[#8B3A2A]/20 selection:text-[#1C1917]" ref={containerRef}>
      {/* 1. Page Header & Institutional Breadcrumb */}
      <div className="border-b border-[#D5C8BC] bg-[#FFFFFF]/95 backdrop-blur-md relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#7A6B63]">
            <button
              onClick={onNavigateHome}
              className="hover:text-[#1C1917] transition-colors cursor-pointer font-medium"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 opacity-60 text-[#D5C8BC]" />
            <button
              onClick={onNavigateAbout}
              className="hover:text-[#1C1917] transition-colors cursor-pointer font-medium"
            >
              About Us
            </button>
            <ChevronRight className="w-3.5 h-3.5 opacity-60 text-[#D5C8BC]" />
            <span className="text-[#8B3A2A] font-bold">
              Our Approach
            </span>
            <span className="text-[10px] font-mono text-[#7A6B63] bg-[#F0EBE4] border border-[#D5C8BC] px-1.5 py-0.5 rounded ml-1 font-medium">
              Sub-Page
            </span>
          </div>
        </div>
      </div>

      {/* Ambient background canvas & gradient aura */}
      <div className="ambient" aria-hidden="true">
        <canvas ref={canvasRef} className="ambient__field" />
        <div className="ambient__glow" />
        <div className="ambient__grid" />
      </div>
      <div className="grain" aria-hidden="true" />

      {/* Mobile top scroll progress bar */}
      <div className="progress" aria-hidden="true">
        <div ref={progressBarRef} className="progress__bar" />
      </div>

      {/* Main Page Content */}
      <main className="page-main">
        {/* ===================== HERO SECTION ===================== */}
        <section className="hero wrap" aria-labelledby="approach-title">
          <div className="hero__inner">
            <p className="eyebrow reveal">
              About Us Sub-Page · Our Approach · Policy to <span className="accent-word text-[#8B3A2A] font-semibold">Implementation</span>
            </p>
            <h1 id="approach-title" className="reveal">
              {HERO_DATA.titleBefore}
              <em>{HERO_DATA.titleEmphasis}</em>
              {HERO_DATA.titleAfter}
            </h1>
            <p className="hero__lede reveal">{HERO_DATA.lede}</p>
            <div className="cta-row reveal">
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => (onOpenTalk ? onOpenTalk() : onNavigateContact?.())}
              >
                Start with a Current-State Diagnostic
                <ArrowRightIcon />
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => scrollToSection('pathway')}
              >
                Explore the IP3 Pathway
                <ArrowRightIcon />
              </button>
            </div>
          </div>

          <figure className="throughline reveal" style={{ margin: 0 }}>
            <svg
              viewBox="0 0 1000 60"
              role="img"
              aria-label="The IP3 through-line: complexity leads to intelligence, intelligence to architecture, architecture to implementation, and implementation to impact."
            >
              <path className="tl-track" d="M40,44 C160,40 260,36 300,34 C420,29 520,25 560,23 C680,18 780,14 960,10" />
              <path className="tl-live" d="M40,44 C160,40 260,36 300,34 C420,29 520,25 560,23 C680,18 780,14 960,10" />
              <circle className="tl-node" cx="40" cy="44" r="5.5" />
              <circle className="tl-node" cx="270" cy="36" r="5.5" />
              <circle className="tl-node" cx="500" cy="26" r="5.5" />
              <circle className="tl-node" cx="730" cy="17" r="5.5" />
              <circle className="tl-node tl-node--end" cx="960" cy="10" r="6.5" />
            </svg>
            <ol className="throughline__labels">
              {HERO_DATA.throughLine.map((label, idx) => {
                const isImpl = label.toLowerCase() === 'implementation';
                return (
                  <li
                    key={label}
                    className={isImpl ? 'accent-word' : undefined}
                    style={{
                      color: isImpl ? '#8B3A2A' : idx === HERO_DATA.throughLine.length - 1 ? 'var(--accent)' : undefined,
                      fontWeight: isImpl ? 700 : undefined,
                    }}
                  >
                    {label}
                  </li>
                );
              })}
            </ol>
          </figure>
        </section>

        {/* ===================== PODCAST FLOW CAROUSEL ===================== */}
        {podcastConfig.enabled !== false && (
          <PodcastFlowCarousel
            items={podcastConfig.items}
            speed={podcastConfig.speed}
            onItemClick={(item) => {
              console.log('Selected:', item.title);
            }}
          />
        )}

        {/* ===================== JOURNEY SECTION ===================== */}
        <section className="section" id="journey" aria-labelledby="journey-title">
          <div className="wrap">
            <div className="section__head reveal">
              <p className="eyebrow">From Current State to Desired State</p>
              <h2 id="journey-title">We begin with the problem as it exists — not with a pre-packaged solution.</h2>
              <p className="kicker">
                Every transformation starts somewhere different. A ministry may have strong policy but weak implementation capacity.
                A programme may have funding but an unclear delivery model. An education system may have technology but insufficient teacher adoption.
                A city may know what infrastructure it needs but lack an investable business model. A public institution may generate large volumes
                of data and still struggle to turn them into decisions.
              </p>
            </div>

            <div className="journey__grid">
              {/* Current State Panel */}
              <div className="state-panel state-panel--current reveal">
                <span className="state-panel__label">Current state</span>
                <ul>
                  {CURRENT_STATE_ITEMS.map((item) => (
                    <li key={item} data-current-item="true">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Connecting Bridge Motif */}
              <div className="journey__bridge reveal" aria-hidden="true">
                <svg viewBox="0 0 140 40" fill="none">
                  <path
                    data-bridge-path="true"
                    d="M4,20 C40,20 46,8 70,8 C94,8 100,32 136,32"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <circle cx="4" cy="20" r="3.5" fill="currentColor" />
                  <circle cx="136" cy="32" r="4.5" fill="currentColor" />
                </svg>
                <span className="journey__bridge-label">The IP3 pathway</span>
              </div>

              {/* Desired State Panel */}
              <div className="state-panel state-panel--desired reveal">
                <span className="state-panel__label">Desired state</span>
                <ul>
                  {DESIRED_STATE_ITEMS.map((item) => (
                    <li key={item} data-desired-item="true">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Framing 3 Questions */}
            <div className="framing">
              {FRAMING_QUESTIONS.map((fq) => (
                <article key={fq.number} className="reveal">
                  <span className="n">{fq.number}</span>
                  <h3>{fq.question}</h3>
                  <p>{fq.body}</p>
                </article>
              ))}
            </div>

            {/* What we clarify first */}
            <div className="reveal" style={{ marginTop: '2.4rem', maxWidth: '46rem' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '.7rem' }}>Define the decision before designing the work.</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '.93rem' }}>
                An engagement begins by defining the decision or transformation the client actually needs to make. This prevents a research
                question from becoming disconnected from an <span className="accent-word text-[#8B3A2A] font-semibold">implementation</span> problem, and lets us select the right level of analytical rigour rather
                than applying the same toolkit to every engagement.
              </p>
              <Disclosure label="What we clarify first +" labelOpen="Close −">
                <div className="disclosure__inner">
                  <div className="disclosure__group">
                    <h4>Before the Pathway</h4>
                    <ul>
                      {ENGAGEMENT_CLARIFICATION.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Disclosure>
            </div>
          </div>
        </section>

        {/* ===================== PATHWAY SECTION ===================== */}
        <section className="section--alt pathway" id="pathway" aria-labelledby="pathway-title">
          <div className="wrap">
            <div className="section__head reveal">
              <p className="eyebrow">The Pathway</p>
              <h2 id="pathway-title">Six Movements of Reform</h2>
              <p className="kicker">
                From diagnosis to durable institutional capability. The movements are shown in order because a roadmap must be understandable — but
                evidence can change the design, a pilot can invalidate an assumption, and <span className="accent-word text-[#8B3A2A] font-semibold">implementation</span> can expose an institutional constraint.
                Feedback and adaptation are built in from the start.
              </p>
            </div>
          </div>

          {/* Movements Timeline */}
          <div className="wrap">
            <ol className="movements">
              {MOVEMENTS.map((mov, idx) => {
                const proof = PROOF_CARDS[mov.proofKey];
                const activeSector = SECTORS.find((s) => s.id === activeSectorId) || SECTORS[2];
                const sectorExample = activeSector.examples[mov.id];

                return (
                  <React.Fragment key={mov.id}>
                    <li className={`movement${idx === activeMovementIndex ? ' is-on' : ''}`} id={mov.id}>
                      <div className="movement__lead">
                        <span className="movement__dot" aria-hidden="true" />
                        <span className="movement__num">{mov.number}</span>
                        <span className="movement__tag">{mov.conceptualLabel}</span>
                      </div>
                      <div className="movement__body">
                        <h3>{mov.title}</h3>
                        <p className="movement__headline">{mov.headline}</p>
                        <p className="movement__work">{mov.ip3Work}</p>

                        <div className="movement__slots">
                          <div className="slot slot--question">
                            <span className="slot__label">
                              <SearchIcon /> Client question
                            </span>
                            <p>{mov.clientQuestion}</p>
                          </div>
                          <div className="slot slot--output">
                            <span className="slot__label">
                              <CheckCircleIcon /> What you receive
                            </span>
                            <p>{mov.output}</p>
                          </div>
                        </div>

                        {/* Domain-specific example */}
                        {sectorExample && (
                          <p className="movement__sector">
                            <b>{activeSector.label}</b>
                            <span>{sectorExample}</span>
                          </p>
                        )}

                        {/* Evidence from practice proof card */}
                        {proof && (
                          <aside className="proof">
                            <span className="proof__label">Evidence from practice</span>
                            <h4>{proof.title}</h4>
                            <span className="proof__context">{proof.context}</span>
                            <p>{proof.blurb}</p>
                            <button
                              type="button"
                              className="proof__link"
                              onClick={() => handleProofClick(proof)}
                            >
                              View experience
                              <ArrowRightIcon />
                            </button>
                          </aside>
                        )}

                        {/* Expandable methods/audit disclosure */}
                        <Disclosure label="Explore methods, frameworks & collaboration +" labelOpen="Close −">
                          <div className="disclosure__inner">
                            {mov.drawerGroups.map((grp) => (
                              <div key={grp.label} className="disclosure__group">
                                <h4>{grp.label}</h4>
                                <ul>
                                  {grp.items.map((item) => (
                                    <li key={item}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </Disclosure>
                      </div>
                    </li>

                    {/* Test / Validation Gate between Movement 03 and Movement 04 */}
                    {idx === 2 && (
                      <li className="movement-gate">
                        <div className="gate" role="group" aria-labelledby="gate-title">
                          <p className="gate__label">Test / Validation Gate</p>
                          <h3 id="gate-title">Do we have sufficient evidence to commit institutional resources and move toward scale?</h3>
                          <p className="gate__note">
                            Testing is a visible decision point, not a paragraph at the end of a methodology. What evidence would give the client
                            confidence to proceed — and what evidence would require redesign?
                          </p>
                          <div className="gate__states">
                            <div className="gate__state">
                              <b>Proceed</b>
                              <span>Evidence supports commitment. Move to mobilisation.</span>
                            </div>
                            <div className="gate__state">
                              <b>Iterate</b>
                              <span>The design broadly works. Refine and retest.</span>
                            </div>
                            <div className="gate__state">
                              <b>Redesign</b>
                              <span>A core assumption failed. Return to architecture.</span>
                            </div>
                            <div className="gate__state">
                              <b>Stop</b>
                              <span>The intervention should not scale. Say so early.</span>
                            </div>
                          </div>
                        </div>
                      </li>
                    )}
                  </React.Fragment>
                );
              })}
            </ol>

            {/* Feedback Loop Diagram */}
            <figure className="loop reveal" style={{ marginBottom: 0 }}>
              <svg viewBox="0 0 140 140" role="img" aria-label="Diagram: a dashed circle running from Learning back into Evidence and Architecture.">
                <path className="loop-arm" d="M70,18 L70,44 M122,70 L96,70 M70,122 L70,96 M18,70 L44,70" />
                <circle className="loop-ring" cx="70" cy="70" r="52" />
                <circle cx="70" cy="18" r="4.5" fill="var(--cool)" />
                <circle cx="18" cy="70" r="4" fill="var(--ground)" stroke="var(--line-2)" />
                <circle cx="70" cy="122" r="4" fill="var(--ground)" stroke="var(--line-2)" />
                <circle cx="122" cy="70" r="4" fill="var(--ground)" stroke="var(--line-2)" />
              </svg>
              <div>
                <p className="eyebrow eyebrow--cool">Evidence changes the pathway</p>
                <h3 style={{ marginTop: '.9rem' }}>Presented in order so it can be explained. Not a claim about how reform behaves.</h3>
                <p>
                  Delivery reveals what the diagnostic missed. Learning shows that an instrument needs redrafting, or that the financing structure
                  has to change before the programme can scale. Movements 02 and 03 are revisited deliberately, with evidence, rather than defended.
                </p>
                <p>
                  What makes that possible is agreeing in advance — in movement 06 — which signals would justify changing the design. Adaptation is
                  planned for at the start, not improvised at the end.
                </p>
              </div>
            </figure>
          </div>
        </section>

        {/* ===================== PRINCIPLES SECTION ===================== */}
        <section className="section" id="principles" aria-labelledby="principles-title">
          <div className="wrap">
            <div className="section__head reveal">
              <p className="eyebrow">The Standard Inside Every Phase</p>
              <h2 id="principles-title">Six commitments that make the pathway IP3</h2>
              <p className="kicker">The pathway describes the sequence. These describe the standard we hold ourselves to inside it.</p>
            </div>

            <div className="principles reveal">
              {PRINCIPLES.map((pr) => (
                <article key={pr.number} className="principle">
                  <span className="n">Principle {pr.number}</span>
                  <h3>{pr.title}</h3>
                  <span className="brand">{pr.brandTerm}</span>
                  <p>{pr.body}</p>
                </article>
              ))}
            </div>

            {/* Architecture resolution drawer */}
            <div className="reveal" style={{ marginTop: '2.6rem' }}>
              <Disclosure label="One institutional logic, three levels of resolution +" labelOpen="Close −">
                <div style={{ paddingTop: '1.3rem' }}>
                  <div className="levels">
                    {RESOLUTION_LEVELS.map((rl) => (
                      <div key={rl.level} className="level">
                        <span className="level__tag">{rl.level}</span>
                        <div>
                          <h3>{rl.label}</h3>
                          <ol className="level__chain">
                            {rl.chain.map((c) => (
                              <li key={c}>{c}</li>
                            ))}
                          </ol>
                          <p>{rl.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p style={{ marginTop: '1.2rem', fontSize: '.9rem', color: 'var(--text-mute)' }}>The frameworks are nested, not competing.</p>
                </div>
              </Disclosure>
            </div>
          </div>
        </section>

        {/* ===================== HUMAN-CENTERED SECTION ===================== */}
        <section className="section" id="people" aria-labelledby="people-title">
          <div className="wrap">
            <div className="section__head reveal">
              <p className="eyebrow">Design With the People Who Live the System</p>
              <h2 id="people-title">Policy becomes real through people's experience</h2>
              <p className="kicker">We combine what the data measures with what people experience.</p>
            </div>

            <div className="hcd">
              {/* Orbiting SVG Graphic */}
              <div className="hcd__orbit reveal">
                <svg viewBox="0 0 220 220" role="img" aria-label="Diagram: an iterative cycle of Listen, Map, Co-Design, Prototype, Test and Iterate orbiting the people who live the system.">
                  <circle className="hcd-ring" cx={orbitCenter} cy={orbitCenter} r={orbitRadius} />
                  <circle className="hcd-hub" cx={orbitCenter} cy={orbitCenter} r={40} />
                  <text className="hcd-hub-label" x={orbitCenter} y={orbitCenter - 4}>
                    PEOPLE WHO
                  </text>
                  <text className="hcd-hub-label" x={orbitCenter} y={orbitCenter + 8}>
                    LIVE THE SYSTEM
                  </text>
                  {HCD_STAGES.map((stg, i) => (
                    <g key={stg.label} className={`hcd-node${i === activeHcdIndex ? ' is-on' : ''}`}>
                      <circle cx={hcdNodePositions[i].x} cy={hcdNodePositions[i].y} r={7} />
                      <text x={hcdNodePositions[i].x} y={hcdNodePositions[i].y - 13}>
                        {stg.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              {/* Interactive Stages list */}
              <div className="reveal">
                <div className="hcd__stages">
                  {HCD_STAGES.map((stg, i) => (
                    <button
                      key={stg.label}
                      type="button"
                      className="hcd__stage"
                      aria-current={i === activeHcdIndex ? 'true' : undefined}
                      onMouseEnter={() => setActiveHcdIndex(i)}
                      onFocus={() => setActiveHcdIndex(i)}
                      onClick={() => setActiveHcdIndex(i)}
                    >
                      <b>{stg.label}</b>
                      <span>{stg.body}</span>
                    </button>
                  ))}
                </div>

                <ul className="chips" style={{ marginTop: '1.4rem' }} aria-label="Who we design with">
                  {HCD_PARTICIPANTS.map((part) => (
                    <li key={part}>{part}</li>
                  ))}
                </ul>

                <Disclosure label="Why technically correct reforms still fail +" labelOpen="Close −">
                  <div className="disclosure__inner">
                    <div className="disclosure__group">
                      <h4>Common failure modes</h4>
                      <ul>
                        {HCD_FAILURE_MODES.map((fm) => (
                          <li key={fm}>{fm}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Disclosure>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== FRAMEWORKS SECTION ===================== */}
        <section className="section section--alt" id="frameworks" aria-labelledby="frameworks-title">
          <div className="wrap">
            <div className="section__head reveal">
              <p className="eyebrow">Disciplined Methods · Flexible Application</p>
              <h2 id="frameworks-title">The pathway is consistent. The toolkit changes.</h2>
              <p className="kicker">
                We do not force every problem into one template. Methods are selected and combined according to the decision, the sector, the
                evidence available and the capacity to implement.
              </p>
            </div>

            {/* Framework models */}
            <div className="models reveal">
              {FRAMEWORK_MODELS.map((mod) => (
                <article key={mod.name} className="model">
                  <h3>{mod.name}</h3>
                  <p>{mod.body}</p>
                </article>
              ))}
            </div>

            <div className="reveal" style={{ marginTop: '1.6rem' }}>
              <ul className="chips" aria-label="How methods are selected">
                {FRAMEWORK_CRITERIA.map((crit) => (
                  <li key={crit}>{crit}</li>
                ))}
              </ul>
              <Disclosure label="Proven analytical & delivery frameworks +" labelOpen="Close −">
                <div className="disclosure__inner">
                  {FRAMEWORK_GROUPS.map((grp) => (
                    <div key={grp.label} className="disclosure__group">
                      <h4>{grp.label}</h4>
                      <ul>
                        {grp.items.map((it) => (
                          <li key={it}>{it}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Disclosure>
            </div>

            {/* Collaboration Model */}
            <div className="reveal" style={{ marginTop: '3.4rem' }}>
              <p className="eyebrow eyebrow--cool">Working with you, not around you</p>
              <h3 style={{ margin: '1rem 0 1.4rem', maxWidth: '34rem' }}>Transformation cannot be outsourced.</h3>
              <div className="collab">
                <div className="collab__col">
                  <h3>IP3 provides</h3>
                  <ul>
                    {COLLAB_DATA.ip3.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
                <div className="collab__col">
                  <h3>Client teams provide</h3>
                  <ul>
                    {COLLAB_DATA.client.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
                <div className="collab__col collab__col--both">
                  <h3>Together we</h3>
                  <ul>
                    {COLLAB_DATA.together.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Digital Transformation */}
            <div className="reveal" style={{ marginTop: '3.4rem', maxWidth: '52rem' }}>
              <p className="eyebrow eyebrow--cool">Digital transformation that works for people</p>
              <h3 style={{ margin: '1rem 0 .8rem' }}>Technology is an enabler. Governance and inclusion determine whether it creates value.</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '.93rem' }}>
                Our approach asks not only whether something can be digitised, but whether it should be — and for whom.
              </p>
              <ul className="chips chips--cool" style={{ marginTop: '1.2rem' }} aria-label="Questions we ask before digitising">
                {DIGITAL_QUESTIONS.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
              <Disclosure label="What our digital work covers +" labelOpen="Close −">
                <div className="disclosure__inner">
                  <div className="disclosure__group">
                    <h4>Data & digital scope</h4>
                    <ul>
                      {DIGITAL_SCOPE.map((sc) => (
                        <li key={sc}>{sc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Disclosure>
            </div>
          </div>
        </section>

        {/* ===================== OUTCOMES SECTION ===================== */}
        <section className="section" id="outcomes" aria-labelledby="outcomes-title">
          <div className="wrap">
            <div className="section__head reveal">
              <p className="eyebrow">From Consulting Outputs to Client Capability</p>
              <h2 id="outcomes-title">The objective is not a better report. It is a system better able to act.</h2>
            </div>

            {/* Shifts list */}
            <div className="shifts reveal">
              {SHIFTS.map((sh, idx) => (
                <div key={idx} className="shift">
                  <p className="shift__from">{sh.from}</p>
                  <span className="shift__arrow" aria-hidden="true">
                    <svg viewBox="0 0 60 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
                      <path d="M0 12h52M44 5l8 7-8 7" />
                    </svg>
                  </span>
                  <p className="shift__to">{sh.to}</p>
                </div>
              ))}
            </div>

            {/* Differentiators */}
            <div className="reveal" style={{ marginTop: '3.2rem' }}>
              <p className="eyebrow">Why the IP3 approach is different</p>
              <ul className="differentiators" style={{ marginTop: '1.4rem' }}>
                {DIFFERENTIATORS.map((diff) => (
                  <li key={diff}>{diff}</li>
                ))}
              </ul>
              <p style={{ marginTop: '1.4rem', color: 'var(--text-dim)', maxWidth: '42rem' }}>
                This is the difference between producing analysis and building actionable architecture.
              </p>
            </div>

            {/* Deliverables */}
            <div className="reveal" style={{ marginTop: '3.2rem' }}>
              <p className="eyebrow eyebrow--cool">From advice to operating reality</p>
              <h3 style={{ margin: '1rem 0 1.2rem', maxWidth: '34rem' }}>A recommendation is only one possible output.</h3>
              <Disclosure label="What clients leave with +" labelOpen="Close −" defaultOpen={true}>
                <div style={{ paddingTop: '1.2rem' }}>
                  <div className="deliverables">
                    {DELIVERABLES.map((deliv) => (
                      <article key={deliv.number} className="deliverable">
                        <span className="n">{deliv.number}</span>
                        <h3>{deliv.title}</h3>
                        <p>{deliv.body}</p>
                      </article>
                    ))}
                  </div>
                </div>
              </Disclosure>
            </div>
          </div>
        </section>

        {/* ===================== CLOSING CTA SECTION ===================== */}
        <section className="closing wrap" aria-labelledby="closing-title">
          <div className="closing__dot reveal" aria-hidden="true" />
          <h2 id="closing-title" className="reveal">
            Bring us the problem before you have the answer.
          </h2>
          <p className="closing__body reveal">You do not need to arrive with a finished Terms of Reference or a predetermined solution.</p>

          <ul className="closing__starters chips reveal" aria-label="Where an engagement can start">
            {CLOSING_STARTERS.map((st) => (
              <li key={st}>{st}</li>
            ))}
          </ul>

          <p className="closing__body reveal" style={{ marginTop: '1.6rem' }}>
            We will help define the problem, build the evidence, design and test the pathway, mobilise what delivery requires, implement with your
            teams, and build the capability to sustain the change.
          </p>
          <p className="closing__support reveal">Tell us where you are now. We will help map the route to where you need to be.</p>

          <div className="cta-row reveal">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => (onOpenTalk ? onOpenTalk() : onNavigateContact?.())}
            >
              Start a Current-State Diagnostic
              <ArrowRightIcon />
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => onNavigateFocus?.()}
            >
              Explore IP3 Focus Areas
              <ArrowRightIcon />
            </button>
          </div>

          <ul className="positioning reveal">
            {POSITIONING_POINTS.map((pt) => (
              <li key={pt}>{pt}</li>
            ))}
          </ul>

          <p
            className="reveal"
            style={{
              marginTop: '2.4rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '.62rem',
              letterSpacing: '.12em',
              textTransform: 'uppercase',
              color: 'var(--text-mute)',
            }}
          >
            Selected IP3 Consulting and IP3 Leadership / Expert Experience
          </p>
        </section>
      </main>
    </div>
  );
};

export default ApproachPage;
