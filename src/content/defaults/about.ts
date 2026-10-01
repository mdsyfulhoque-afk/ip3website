import type { AboutContent } from '../types';

/**
 * The About page.
 *
 * The definition in `lead`, the through-line labels, the vision and mission, and
 * the chairman's quote are the real IP3 wording from the old About page, lightly
 * tightened. The five principles use the same titles as `pillars.ts`.
 *
 * Deliberately left out: "17 years of experience", "75+ projects", "30+ global
 * partners", the IFC and WTO partner badges, the invented executive and team
 * members, and every other figure that no source supports. `chairman.partners`
 * stays empty until IP3 confirms what may be said.
 */
export const about: AboutContent = {
  heading: 'Translating policy intelligence into systems that work',
  lead: 'IP3 Consulting — the Institute for Public Policy and Practice — is a translational policy studio and systems integrator helping governments, development partners, businesses and institutions turn complex policy ambitions into implementable, scalable solutions.',
  body: [
    'We work where policy, economics, climate, institutions, data, technology, education and implementation intersect. We combine rigorous research and policy intelligence with systems thinking, digital architecture, locally grounded expertise and hands-on implementation support, so that clients can move from understanding a problem to designing, testing, delivering and improving the solution.',
    'IP3 does not stop at diagnosis, recommendations or a report. We work across the policy and management advisory value chain: from market and institutional diagnostics, empirical research and policy co-design, through experimentation and implementation support, to monitoring, learning, adaptation and scale.',
    'Institutional challenges rarely arrive one at a time. Climate exposure interacts with financing constraints, digital transformation reshapes service delivery, and education outcomes depend on institutional capability. We combine global expertise with Global South intelligence, drawing on economists, policy specialists, systems thinkers, sector experts, data professionals and digital strategists, to build solutions that are globally informed, locally workable and designed for implementation.',
    'IP3 runs on what we call the Dynamic Network Model. It connects in-house capability with economists, academics, policy specialists, development practitioners, industry experts and data and technology professionals, assembled around the specific problem.',
    'We translate intelligence into architecture — and architecture into impact.',
  ],
  throughLine: [
    { label: 'Complexity', text: 'Interconnected systems' },
    { label: 'Intelligence', text: 'Research and policy insight' },
    { label: 'Architecture', text: 'Systems and digital design' },
    { label: 'Implementation', text: 'Delivery with institutions' },
    { label: 'Impact', text: 'Lasting capability' },
  ],
  principles: [
    {
      title: 'From poly-crisis to poly-solutions',
      text: 'Connected problems need connected solutions. We map the relationships between systems before deciding where intervention has the most leverage, then design integrated, evidence-led and co-created responses around how the problem actually behaves.',
    },
    {
      title: 'Translation, not theory',
      text: 'Evidence matters when it changes what institutions can do. Research is where an engagement begins: evidence becomes policy intelligence, then systems and delivery architecture, then implementation, and implementation experience feeds back into learning.',
    },
    {
      title: 'Thinking that ships',
      text: 'Policy architectures, diagnostics, research reports, implementation frameworks and digital solutions are built to help decision-makers act, not only understand. Insight should end in a decision, a design, a tested intervention or a clearer path to implementation.',
    },
    {
      title: 'End-to-end expertise',
      text: 'Strategy, research, implementation, data and evaluation are integrated, not split across disconnected advisory teams. Depending on the assignment, we work from diagnostics and policy research through data modelling, stakeholder engagement, co-design, pilots, implementation support, digital systems, MERLA and capability building, to learning and scale.',
    },
    {
      title: 'A convenor between worlds',
      text: 'We work between communities that often work separately: policy and practice, government and markets, research and implementation, technology and institutions, international standards and local realities. A Global South focus means starting with context and connecting it to global knowledge, not localising an imported framework.',
    },
  ],
  audiences: [
    {
      name: 'Governments and public agencies',
      text: 'We help them turn policy into services, regulation and institutions that work in practice.',
    },
    {
      name: 'Development partners and multilateral development banks',
      text: 'We help them design better policies, mobilise investment, strengthen institutions and measure results.',
    },
    {
      name: 'Universities and think tanks',
      text: 'We work with them on research-policy translation, so that evidence reaches the people who make decisions.',
    },
    {
      name: 'Private-sector institutions',
      text: 'We help businesses and financial institutions integrate ESG, manage climate risk and prepare investable projects.',
    },
  ],
  vision:
    'We envision a future in which governments, institutions, businesses and communities have the policies, capabilities, data, partnerships and institutional resilience needed to navigate complexity and create sustainable, equitable prosperity. Public policy should become more adaptive, more connected to implementation, and better at turning economic opportunity, technological change, social inclusion and environmental responsibility into durable improvements in institutions and in people\'s lives.',
  mission:
    'Our mission is to help governments, development partners, businesses, institutions and communities solve complex policy and management challenges by connecting rigorous evidence with practical implementation. We develop solutions that are grounded in context and built to last beyond the life of an assignment.',
  chairman: {
    name: 'Mohammad Syful Hoque',
    role: 'Executive Chairman & Lead Policy Architect',
    quote: 'Do not simplify the problem until you understand the system.',
    summary:
      'Economic policy and sustainability transformation expert, with a focus on climate solutions, ESG and the circular economy.',
    partners: [],
  },
  worksWith: {
    heading: 'Institutions we have worked with',
    names: ['World Bank', 'Asian Development Bank', 'European Commission', 'Sida'],
    note: "Named with IP3's approval. Other clients are not listed.",
  },
};
