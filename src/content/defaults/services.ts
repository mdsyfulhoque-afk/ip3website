import type { ServiceLine } from '../types';

/**
 * The five service lines, in display order.
 *
 * Built from the real service pages (Economic, Climate, Design, MERLA), the
 * ApproachPage proof cards and the Public Policy Innovation focus page. The
 * "Digital Systems" and "Capacity Building" tabs of the old site are dropped
 * because their copy was invented. Titles keep the wording agreed for the
 * site; body copy uses British spelling.
 *
 * `portfolio` holds ids from `./portfolio`. The public site shows only the
 * ones whose status is 'published'.
 */
export const services: ServiceLine[] = [
  {
    slug: 'economic-assessment',
    title: 'Economic, Financial & Environmental Feasibility',
    short:
      'Tests whether a project, programme or investment is viable, economically, financially and environmentally, before money is committed.',
    intro: [
      'We develop and assess feasibility studies that bring economic, financial and environmental analysis together. The work draws on econometric and financial modelling and on environmental impact evaluation, and is used by ministries and development banks deciding where to invest.',
      'Our studies have covered education, ports, housing, special economic zones and clean energy, and we have evaluated World Bank energy programmes. The aim is a clear, defensible evidence base for a high-stakes investment decision.',
    ],
    offers: [
      {
        title: 'Economic and financial feasibility',
        text: 'Economic and financial modelling to test project viability, cash-flow risk and likely returns.',
      },
      {
        title: 'Cost-benefit analysis and scenario testing',
        text: 'Cost-benefit analysis and multi-scenario forecasting, including internal rate of return, sensitivity testing and Monte Carlo risk simulation.',
      },
      {
        title: 'Funding and financing plans',
        text: 'Financial planning that covers capital expenditure priorities, debt service sustainability and funding structures.',
      },
      {
        title: 'Environmental and social impact assessment',
        text: 'Assessment of environmental and social impacts against World Bank, ADB and IFC Performance Standards, including climate resilience and biodiversity.',
      },
      {
        title: 'Integrated feasibility frameworks',
        text: 'Frameworks that weigh institutional capacity, financial return and environmental effects together for large projects.',
      },
      {
        title: 'Performance tracking after commissioning',
        text: 'KPI dashboards that track how a project performs once it is operating.',
      },
    ],
    deliverables: [
      'Economic, social, financial and market feasibility studies',
      'Financial models and long-term projections',
      'Cost-benefit analyses, including internal rate of return',
      'Scenario, sensitivity and risk analysis',
      'Environmental and social impact assessments',
      'Investment strategies, pricing models and funding options',
      'Programme and project evaluation reports',
      'Performance dashboards for projects in operation',
    ],
    sectors: [
      'macroeconomic-fiscal',
      'private-sector',
      'climate-energy',
      'cities-municipal-finance',
      'education-skills',
    ],
    portfolio: [
      'climate-early-warning-adb',
      'education-feasibility-adb',
      'nextgen-madrasah-adb',
      'nextgen-tvet-adb',
      'payra-seaport-advisory',
      'jolshiri-aqua-green-city-feasibility',
      'bmdf-municipal-finance-transformation',
      'halow-plus-worker-health',
    ],
  },
  {
    slug: 'climate-esg',
    title: 'Climate Action, ESG & Circular Economy',
    short:
      'Helps governments, businesses and financial institutions manage climate risk, build circular practices and meet environmental, social and governance standards.',
    intro: [
      'We advise governments, businesses and financial institutions on climate risk, circular pathways and ESG compliance. Our work sits under three themes: green transition policy and governance, circularity and regenerative pathways, and sustainable market solutions and green finance.',
      'On ESG we cover all three dimensions. Environmental work looks at resources, waste, pollution, sourcing and biodiversity; social work at labour standards, communities and inclusion; governance work at reporting, boards, ethics and regulatory compliance. The aim is to build ESG principles into core operations.',
    ],
    offers: [
      {
        title: 'Green transition policy and governance',
        text: 'Policies and governance frameworks that support an inclusive, nature-positive and resilient transition.',
      },
      {
        title: 'Circularity and regenerative pathways',
        text: 'Circular and regenerative approaches that make industrial systems more resource-efficient.',
      },
      {
        title: 'Sustainable markets and green finance',
        text: 'Data-driven strategies that help businesses, governments and financial institutions align with global sustainability standards.',
      },
      {
        title: 'ESG strategy and impact assessment',
        text: 'ESG strategies tailored to the goals of the organisation, and impact assessments that show whether sustainability initiatives are working.',
      },
      {
        title: 'Environmental and social performance',
        text: 'Support on climate policy, resource efficiency, waste, pollution control, sustainable sourcing, biodiversity, labour standards, community relations and inclusion.',
      },
      {
        title: 'ESG reporting and governance',
        text: 'Reporting frameworks aligned with GRI, TCFD and ISSB, and advice on board practice, anti-corruption and regulatory compliance.',
      },
    ],
    deliverables: [
      'Green transition policy and governance frameworks',
      'ESG strategies',
      'ESG impact assessments',
      'ESG reporting frameworks aligned with GRI, TCFD and ISSB',
      'Resource-efficiency, waste-reduction and pollution-control recommendations',
      'Community and stakeholder engagement strategies',
      'Training programmes for staff and management on ESG',
      'Digital tools for ESG data collection and reporting',
    ],
    sectors: ['climate-energy', 'private-sector', 'public-governance'],
    portfolio: [
      'green-industrial-transition-rmg',
      'climate-early-warning-adb',
      'green-trade-policy-reform',
      'bmdf-municipal-finance-transformation',
    ],
  },
  {
    slug: 'program-survey-design',
    title: 'Program & Survey Design (including CAPI surveys)',
    short:
      'Designs programmes around a clear theory of change, and designs and manages the surveys, including CAPI fieldwork, that supply the evidence.',
    intro: [
      'We design programme frameworks that fit policy and development goals, using theory of change and logical frameworks to guide design and accountability. Sustainability, scalability and impact measurement are built into planning from the start, and we support pilots as they move to full-scale implementation.',
      'We also design and manage large-scale surveys, from bilingual questionnaires and field testing to computer-assisted personal interviewing (CAPI) on platforms such as ODK, SurveyCTO and KoboToolbox. Findings are analysed and written up as clear briefs for decision-makers.',
    ],
    offers: [
      {
        title: 'Programme design',
        text: 'Programme frameworks aligned with policy and development goals, built on theory of change and logical frameworks.',
      },
      {
        title: 'Piloting and scale-up',
        text: 'Support for pilot programmes and their transition to full-scale implementation.',
      },
      {
        title: 'Survey design',
        text: 'Survey tools, bilingual questionnaires and field-testing protocols, with probability-based and spatial sampling for large-scale data collection.',
      },
      {
        title: 'CAPI and digital data collection',
        text: 'Digital data collection on platforms such as ODK, SurveyCTO and KoboToolbox, including baseline, midline and endline surveys.',
      },
      {
        title: 'Fieldwork management and quality assurance',
        text: 'Field logistics and multi-tiered data validation to keep survey data reliable.',
      },
      {
        title: 'Data analysis and reporting',
        text: 'Econometric and statistical analysis, including difference-in-differences, turned into policy memos and briefs.',
      },
    ],
    deliverables: [
      'Programme design documents, including theory of change and logical framework',
      'Pilot designs and scale-up pathways',
      'Survey instruments and bilingual questionnaires',
      'Sampling plans',
      'Field-testing protocols and digital survey forms',
      'Baseline, midline and endline survey data and reports',
      'Validated datasets with data-quality checks',
      'Policy memos and briefs presenting the findings',
    ],
    sectors: ['private-sector', 'climate-energy', 'monitoring-evaluation'],
    portfolio: [
      'fat-survey-bangladesh',
      'green-industrial-transition-rmg',
      'digital-informality-survey-bangladesh',
      'covid-business-pulse-survey',
      'secondary-stem-tvet-curriculum-modernisation',
    ],
  },
  {
    slug: 'merla',
    title: 'Monitoring, Evaluation, Research, Learning & Adaptation (MERLA)',
    short:
      'Builds monitoring, evaluation and learning systems and carries out evaluations, so programme teams and funders can see what is working and adapt.',
    intro: [
      'MERLA stands for monitoring, evaluation, research, learning and adaptation. We combine social science expertise, digital tools and adaptive learning to help organisations decide on evidence, improve performance and test whether a programme is changing outcomes.',
      'Our evaluation work is benchmarked against World Bank, OECD-DAC and DFID practice. We use quasi-experimental and counterfactual designs, mixed methods and participatory action research, chosen to fit the programme and its context.',
    ],
    offers: [
      {
        title: 'Impact evaluation',
        text: 'Outcome and impact evaluations using quasi-experimental and counterfactual methods to measure effectiveness and causal attribution, including gender-inclusive analysis.',
      },
      {
        title: 'Mixed-method evaluation design',
        text: 'Evaluation frameworks that combine quantitative analysis with qualitative methods and are adapted to sectors such as climate resilience, health and education.',
      },
      {
        title: 'Monitoring and results measurement',
        text: 'Context-specific monitoring frameworks and data systems that support decisions, transparency and accountability.',
      },
      {
        title: 'Digital monitoring',
        text: 'Dashboards, geospatial tools and digital reporting tools for real-time programme tracking and data integrity.',
      },
      {
        title: 'Operational research',
        text: 'Real-time operational research that finds bottlenecks and improves how programmes are implemented.',
      },
      {
        title: 'Action research and learning',
        text: 'Participatory action research with local communities, pause-and-reflect workshops and continuous learning cycles.',
      },
    ],
    deliverables: [
      'MERLA frameworks, results frameworks and indicator sets',
      'Evaluation designs and impact or outcome evaluation reports',
      'Baseline and endline studies',
      'Monitoring dashboards and digital reporting tools',
      'Findings on implementation bottlenecks from operational research',
      'Learning reviews and pause-and-reflect workshops',
      'Capacity support for government and programme monitoring teams',
    ],
    sectors: [
      'monitoring-evaluation',
      'climate-energy',
      'education-skills',
      'social-protection',
      'cities-municipal-finance',
    ],
    portfolio: [
      'halow-plus-worker-health',
      'dsip-me-results-framework',
      'rct-energy-efficient-motors',
      'climate-early-warning-adb',
    ],
  },
  {
    slug: 'macro-sector-policy',
    title: 'Macro & Sector Policy Advisory',
    short:
      'Independent policy analysis and advice on the economy and on specific sectors, written for the people who must decide.',
    intro: [
      'We help ministries, regulators and development partners understand a policy problem, weigh the options and choose a course of action. The work covers economic analysis, policy development, regulation, and sector and trade strategy.',
      'This service line also carries our public policy innovation and action research. We test policy approaches through pilots, refine them from data and feedback, and build the skills of policymakers to carry the work on.',
    ],
    offers: [
      {
        title: 'Policy analysis and development',
        text: 'Research, root-cause analysis and options papers that lead to policies that are practical, inclusive and suited to local context.',
      },
      {
        title: 'Fiscal and economic modelling',
        text: 'Fiscal modelling, medium-term expenditure frameworks and scenario analysis to simulate the effects of policy choices.',
      },
      {
        title: 'Sector, trade and industrial strategy',
        text: 'Value-chain diagnostics, market and trade assessment, and productive-capacity analysis to support domestic value addition and investment.',
      },
      {
        title: 'Regulation and regulatory impact assessment',
        text: 'Regulatory design and reform, with impact assessments, that streamline processes while protecting consumers, the environment and equity.',
      },
      {
        title: 'Policy experimentation and adaptation',
        text: 'Pilot programmes to test policy approaches, then adaptive management that refines them using data and feedback.',
      },
      {
        title: 'Capacity building for policymakers',
        text: 'Training and tools for officials and institutional leaders in policy formulation and implementation.',
      },
    ],
    deliverables: [
      'Policy papers and options papers',
      'Diagnostic and gap analyses',
      'Reform roadmaps with milestones and risk mitigation',
      'Economic and fiscal models with scenario analysis',
      'Regulatory impact assessments',
      'Briefing notes for senior officials',
      'Facilitated consultations between ministries, civil society and other stakeholders',
      'Training and tools for policymakers',
    ],
    sectors: ['macroeconomic-fiscal', 'private-sector', 'public-governance'],
    portfolio: [
      'ldc-graduation-policy-reform',
      'unctad-productive-capacities',
      'cem-bangladesh-india',
      'services-trade-policy-index',
      'green-trade-policy-reform',
      'digital-identity-civil-registry-interoperability',
      'secondary-stem-tvet-curriculum-modernisation',
    ],
  },
];
