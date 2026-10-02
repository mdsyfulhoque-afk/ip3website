import type { Domain } from '../types';

/**
 * IP3's three domains of work, in site order.
 *
 * Titles and the one-line `short` text come from the live About page. Questions
 * are the client questions on the Approach page. Areas are tightened from the
 * old focus pages and climate pages. The farm and agriculture cards that sat in
 * the old Data focus page are deliberately gone.
 *
 * "Public policy innovation and action research" was a fourth focus page. It is
 * now a method note in the third domain's intro, not a fourth domain.
 *
 * Sector and service slugs must match the slugs in `sectors.ts` and `services.ts`.
 * No figures, clients or results are stated here.
 */
export const domains: Domain[] = [
  {
    slug: 'climate-esg-circular',
    title: 'Climate Action, ESG & Circular Economy',
    short: 'Green transition, ESG strategy and circular-economy policy and practice.',
    intro: [
      'IP3 helps governments, businesses and financial institutions move from climate and sustainability ambition to action. We work where transition ambition meets financing, regulation and day-to-day operations.',
      'The work covers green-transition policy and governance, ESG strategy and reporting, circular-economy pathways, biodiversity, and climate adaptation and resilience. We deliver it through feasibility studies, policy reviews, sector strategies and practical interventions fitted to local and global contexts.',
      'The aim is growth that takes environmental constraints and social equity into account. We align the work with the Sustainable Development Goals (SDGs) and the Paris Agreement targets.',
    ],
    questions: [
      'What prevents investment in a green transition?',
      'Which climate investments generate the greatest economic and social value?',
      'How can ESG move from reporting to operational strategy?',
      'How should climate, transition and financial risks change investment priorities?',
      'What financing mechanisms make the transition viable?',
    ],
    areas: [
      {
        title: 'Green transition policy and governance',
        text: 'Policy and governance frameworks for climate transitions that are inclusive, nature-positive and resilient.',
      },
      {
        title: 'ESG strategy and reporting',
        text: 'ESG roadmaps, materiality assessments and reporting frameworks aligned with standards such as GRI, TCFD and ISSB.',
      },
      {
        title: 'Circular economy and resource efficiency',
        text: 'Circular-economy strategy, waste-to-resource systems and water, energy and materials efficiency audits, including for textile manufacturers.',
      },
      {
        title: 'Biodiversity and nature-related risk',
        text: 'Biodiversity conservation and nature-related risk assessment built into strategic planning.',
      },
      {
        title: 'Climate adaptation and resilience',
        text: 'Climate risk and vulnerability assessment, adaptation planning and resilient infrastructure design for developing-country contexts.',
      },
      {
        title: 'Green finance and market solutions',
        text: 'Bankability analysis, blended and climate finance, and investment pipelines that make green investment viable.',
      },
      {
        title: 'Support for firms and financial institutions',
        text: 'Climate-risk analysis, ESG-integrated investment strategy and due diligence for manufacturers, banks, insurers, asset managers and private equity firms.',
      },
    ],
    sectors: ['climate-energy', 'private-sector', 'cities-municipal-finance'],
    services: ['climate-esg', 'economic-assessment'],
    // Climate, research, data and technology: wind, solar and climate data explored on a touchscreen.
    video: '/video/climate-data.mp4',
  },
  {
    slug: 'education-capacity',
    title: 'Education & Human Capacity Development',
    short: 'Learning systems, human capability and future-ready skills.',
    intro: [
      'IP3 helps governments, education institutions and development partners strengthen education systems. The work centres on learning outcomes, inclusion, teacher capability and digital learning.',
      'It covers curriculum and pedagogy, education data and digital platforms, teacher and leadership development, and the measurement of learning outcomes. Where money is at stake, we test the investment case through feasibility and cost-benefit analysis.',
      'Human capacity is treated as part of the system, not an add-on. The aim is to build the skills, knowledge and leadership that institutions need to keep improving after an assignment ends.',
    ],
    questions: [
      'Why are learning outcomes not improving?',
      'Where are students, teachers or institutions being excluded?',
      'Which investments in curriculum, infrastructure, EdTech or teacher development are viable?',
      'How should real-time assessment data improve decisions?',
      'How can digital transformation strengthen rather than fragment the education system?',
    ],
    areas: [
      {
        title: 'Educational innovation and pedagogy',
        text: 'Curriculum design and teaching approaches for the digital age, including distance and experiential learning for marginalised and vulnerable learners.',
      },
      {
        title: 'Digital education transformation',
        text: 'Data-driven tools, learning management systems and digital education policy, including protection of student data.',
      },
      {
        title: 'Human capacity development',
        text: 'Training for educators and institutional leaders, with modules on digital literacy and performance management.',
      },
      {
        title: 'Impact assessment and learning outcomes',
        text: 'Programme evaluation and learning-outcome metrics that show whether education investments are working.',
      },
      {
        title: 'Skills and TVET',
        text: 'Labour-market analysis for technical and vocational education and training (TVET) to inform skills programmes.',
      },
      {
        title: 'Education financing and feasibility',
        text: 'Feasibility studies, cost-benefit analysis and financing options for curriculum, infrastructure, EdTech and teacher development.',
      },
      {
        title: 'Inclusion and access',
        text: 'Gender, accessibility and digital-inclusion assessments that show where students, teachers or institutions are being excluded.',
      },
    ],
    sectors: ['education-skills', 'social-protection'],
    services: ['program-survey-design', 'merla'],
    // The old site's video cannot be carried over (the host is unreachable and the copy in the old repo is broken).
    // Upload it in the editor to show the video band again.
    video: '',
  },
  {
    slug: 'institutions-data-digital',
    title: 'Institutional Effectiveness, Data & Digital Governance',
    short: 'Institutions, regulation, data ecosystems and digital public infrastructure.',
    intro: [
      'IP3 helps governments and public agencies turn policy into services that people can use. We start with how the institution actually works: its mandate, processes, data and incentives.',
      'The work covers institutional diagnostics and operating models, regulatory design, data governance and interoperability, digital public infrastructure, and the capability needed to run them. We put the same questions to every digital tool: who owns it, who might be excluded, and whether the institution can maintain it.',
      'Public policy innovation and action research is a method that runs across IP3 work, not a separate domain. It combines policy research and analysis, stakeholder collaboration and policy experimentation, so that reforms are tested before they are scaled.',
    ],
    questions: [
      'Why is the institution struggling to turn policy into service delivery?',
      'What operating model will improve accountability and performance?',
      'How can administrative data become a strategic asset?',
      'Which services should be redesigned around users?',
      'Where can AI, automation, GIS or GovTech create real public value?',
      'What governance is needed for trustworthy digital transformation?',
    ],
    areas: [
      {
        title: 'Institutional diagnostics and operating models',
        text: 'Mandate, process and digital-maturity diagnostics, target operating models and process redesign.',
      },
      {
        title: 'Regulatory design and reform',
        text: 'Evidence-based regulatory frameworks that protect citizens and reduce bureaucratic burden, with governance models built on transparency and accountability.',
      },
      {
        title: 'Data governance and interoperability',
        text: 'Data governance, interoperability standards and decision-rights arrangements so that administrative data can inform decisions.',
      },
      {
        title: 'Digital public infrastructure and services',
        text: 'Digital public infrastructure diagnostics, digital-government strategies and public services redesigned around users.',
      },
      {
        title: 'GovTech, AI readiness and GIS',
        text: 'Assessment of where AI, automation, GIS and GovTech can add public value, with the governance needed to keep them trustworthy.',
      },
      {
        title: 'Municipal capacity',
        text: 'Local-government service delivery, municipal data management and citizen feedback, with training for local administrators.',
      },
      {
        title: 'Capability development for public officials',
        text: 'Training for government officials and institutional leaders in policy formulation and implementation.',
      },
    ],
    sectors: ['public-governance', 'monitoring-evaluation', 'macroeconomic-fiscal'],
    services: ['macro-sector-policy', 'merla'],
    // The IP3 brand reel: data and technology on screen, from evidence to practice.
    video: '/video/ip3-reel.mp4',
  },
];
