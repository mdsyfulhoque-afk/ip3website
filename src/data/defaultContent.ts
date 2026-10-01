/**
 * The site's bundled default content — the payload that seeds MongoDB.
 *
 * Lifted out of CMSContext.tsx so `npm run db:seed` can import it in Node.
 * This module must stay free of React, of browser APIs, and of any import
 * that reaches a .tsx file, or the seed script cannot load it.
 */
import {
  SlideItem,
  Movie,
  OfficeInfo,
  ServiceOption,
  StatItem,
  FaqItem,
  ExecutiveProfile,
  ImpactPillar,
  TeamMember,
  ResearchSectionData,
  OperationalFront,
  ParallaxCardItem,
  FocusAreaItem,
  ProjectItemData,
  ServiceSolutionItem,
  TreeBranchNode,
  TreeFrameworkData,
  PartnerBrandItem,
  TrustMatrixData,
  TestimonialItem,
  TestimonialSectionData,
  SiteThemeConfig,
  StoryTheme,
  SystemsHeroSectionData,
  WhyIp3Config,
  EightSystemsConfig,
  CorridorHeroConfig,
  CorridorImage,
  PodcastCardItem,
  PodcastCarouselConfig,
  FacultyMember,
} from '../types';

import { defaultSlides } from './slides';
import { defaultMovie } from './movieData';
import { SYSTEMS_DATA } from './systems';
import { FACULTY_MEMBERS } from './peopleData';
import {
  ip3OfficeInfo,
  consultingServices as defaultServices,
  trustStats as defaultStats,
  faqItems as defaultFaqs,
  availableTimeSlots as defaultTimeSlots,
  clientTestimonials as defaultClientTestimonials,
} from './consultingData';
import { executiveData as defaultExecutive, impactPillars as defaultPillars } from './profileData';
import { primaryNav as defaultNavigation, defaultNavbarConfig } from './navigationData';
import type { PrimaryNavItem, NavbarConfig } from './navigationData';
import {
  FOCUS_AREAS as defaultFocusAreas,
  PROJECTS as defaultProjects,
  SERVICES as defaultServiceSolutions,
} from './policyData';

export interface WebsiteData {
  slides: SlideItem[];
  movie: Movie;
  officeInfo: OfficeInfo;
  services: ServiceOption[];
  trustStats: StatItem[];
  faqItems: FaqItem[];
  executive: ExecutiveProfile;
  impactPillars: ImpactPillar[];
  teamMembers: TeamMember[];
  facultyMembers?: FacultyMember[];
  researchSection: ResearchSectionData;
  operationalFronts: OperationalFront[];
  parallaxCards: ParallaxCardItem[];
  focusAreas: FocusAreaItem[];
  projects: ProjectItemData[];
  serviceSolutions?: ServiceSolutionItem[];
  treeFramework?: TreeFrameworkData;
  testimonialsSection?: TestimonialSectionData;
  trustMatrix?: TrustMatrixData;
  themeConfig: SiteThemeConfig;
  storyThemes?: StoryTheme[];
  systemsHero?: SystemsHeroSectionData;
  whyIp3?: WhyIp3Config;
  eightSystems?: EightSystemsConfig;
  corridorHero?: CorridorHeroConfig;
  podcastCarousel?: PodcastCarouselConfig;
  /** Site navigation: mega-menu columns, links and promos. */
  navigation: PrimaryNavItem[];
  /** Navbar chrome: brand, CTA, top bar, search. */
  navbar: NavbarConfig;
  /** Bookable consultation slots, e.g. "11:00 AM". */
  timeSlots: string[];
  /** Short quotes used by the trust bar. */
  clientTestimonials: typeof defaultClientTestimonials;
}

export const defaultTreeFramework: TreeFrameworkData = {
  badge: "Institute for Public Policy & Practice (IP3)",
  headline: "Advancing Public Policy Through Empirical Rigor & Action",
  highlightWord: "Public Policy",
  subtitle: "We provide strategic consultations, empirical research, and impact solutions for Green Transitions, Educational Innovation, and Future-Ready Digital Governance.",
  rootNodeTitle: "IP3 Policy Architecture Framework",
  branches: [
    {
      id: "branch-01",
      branchNumber: "Branch 01",
      badge: "Green Transition Engine",
      title: "Climate Action & ESG",
      desc: "Green economics, firm-level tech adoption, circular economy, and industrial decarbonization.",
      imageUrl: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=800",
      iconName: "Leaf"
    },
    {
      id: "branch-02",
      branchNumber: "Branch 02",
      badge: "Human Capital & Pedagogy",
      title: "Educational Innovation",
      desc: "Human developmental science, datafication of learning, ADB secondary education feasibility.",
      imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
      iconName: "GraduationCap"
    },
    {
      id: "branch-03",
      branchNumber: "Branch 03",
      badge: "Institutional Ecosystems",
      title: "Data & Digital Governance",
      desc: "Future-ready governance, municipal capacity (BMDF), data ecosystems, and regulatory compliance.",
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
      iconName: "ShieldCheck"
    }
  ]
};

export const defaultTestimonialsSection: TestimonialSectionData = {
  sectionBadge: "Institutional Endorsements",
  sectionTitle: "Trusted by Global Leaders & Development Partners",
  sectionSubtitle: "See how our institutional advisory and systemic transformation strategies create lasting impact.",
  items: [
    {
      id: 'bmdf-tariq',
      quote: `"IP3 expert brought a depth of expertise and agility that fundamentally transformed how we approach to a Next Gen Institutional Transformation. His ability to align global best practices with local realities allowed us to transform present BMDF into a modern, dynamic, self-dependent and dependable municipal financing government entity. This wasn't just a consultancy—it was a true partnership in building resilient public institution for the future."`,
      authorName: 'Ahmmad Zaman Tariq, PMP',
      authorTitle: 'Urban Development Specialist (UDS) Bangladesh',
      organization: 'Municipal Development Fund (BMDF)',
      photoUrl: '/images/ahmmad_zaman_tariq.jpg',
    },
    {
      id: 'ip3-vance',
      quote: `"Working across cross-border public private partnership frameworks requires deep sector knowledge and unmatched execution speed. The institutional roadmap developed provided an actionable blueprint that unlocked $140M in green municipal bonds."`,
      authorName: 'Dr. Marcus Vance',
      authorTitle: 'Senior Infrastructure Advisor',
      organization: 'Global Public-Private Infrastructure Facility',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'eib-elena',
      quote: `"The strategic alignment between municipal priorities and private sector capital deployment was handled with exceptional clarity. A benchmark model for municipal financing entities across emerging markets."`,
      authorName: 'Elena Rostova',
      authorTitle: 'Director of Municipal Financing',
      organization: 'Eurasian Infrastructure & Development Bank',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
    }
  ]
};

export const defaultTrustMatrix: TrustMatrixData = {
  sectionBadge: "Strategic Partners & Client Ecosystem",
  sectionTitle: "Clients & Strategic Development Partners Who Trust Us",
  scrollSpeed: 35,
  brands: [
    {
      id: "payra-port",
      name: "Payra Port Authority",
      description: "Autonomous port authority under the Ministry of Shipping, Bangladesh",
      logoUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 70'><rect width='100%' height='100%' rx='8' fill='%230b1727'/><text x='120' y='36' font-family='system-ui, -apple-system, sans-serif' font-weight='800' font-size='15' fill='%23ffffff' text-anchor='middle' letter-spacing='1.5'>PAYRA PORT</text><text x='120' y='52' font-family='system-ui, -apple-system, sans-serif' font-weight='600' font-size='9' fill='%23ff7e67' text-anchor='middle' letter-spacing='2'>AUTHORITY</text></svg>"
    },
    {
      id: "pwc",
      name: "PwC",
      description: "PricewaterhouseCoopers Global Advisory & Professional Services",
      logoUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 70'><rect width='100%' height='100%' rx='8' fill='%230b1727'/><g transform='translate(45, 14)'><rect x='0' y='0' width='10' height='10' fill='%23e0301e'/><rect x='12' y='0' width='10' height='10' fill='%23eb8c00'/><rect x='24' y='0' width='10' height='10' fill='%23ffb600'/><rect x='0' y='12' width='10' height='10' fill='%23d85604'/><rect x='12' y='12' width='10' height='10' fill='%23eb8c00'/><text x='48' y='30' font-family='Georgia, serif' font-weight='900' font-size='32' fill='%23ffffff' letter-spacing='-1'>pwc</text></g></svg>"
    },
    {
      id: "adb",
      name: "Asian Development Bank (ADB)",
      description: "Regional development bank promoting social and economic development in Asia",
      logoUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 70'><rect width='100%' height='100%' rx='8' fill='%230b1727'/><text x='110' y='46' font-family='Georgia, serif' font-weight='bold' font-size='32' fill='%2338bdf8' text-anchor='middle' letter-spacing='2'>ADB</text><text x='110' y='58' font-family='system-ui, sans-serif' font-weight='600' font-size='7.5' fill='%2394a3b8' text-anchor='middle' letter-spacing='1.5'>ASIAN DEVELOPMENT BANK</text></svg>"
    },
    {
      id: "avs",
      name: "AVS Solutions",
      description: "Strategic Technology, Analytics & Valuation Solutions",
      logoUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 70'><rect width='100%' height='100%' rx='8' fill='%230b1727'/><text x='110' y='42' font-family='system-ui, -apple-system, sans-serif' font-weight='900' font-size='28' fill='%23f1f5f9' text-anchor='middle' letter-spacing='2'>AVS</text><text x='110' y='56' font-family='system-ui, sans-serif' font-weight='600' font-size='8' fill='%232dd4bf' text-anchor='middle' letter-spacing='1.5'>ANALYTICS &amp; VALUATION</text></svg>"
    },
    {
      id: "psl",
      name: "Prokaushali Sangsad Ltd. (PSL)",
      description: "Engineering consulting firm in Bangladesh dedicated to energy and sustainable development",
      logoUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 70'><rect width='100%' height='100%' rx='8' fill='%230b1727'/><text x='120' y='36' font-family='Georgia, serif' font-weight='bold' font-size='16' fill='%23f8fafc' text-anchor='middle' letter-spacing='1'>PROKAUSHALI SANGSAD</text><text x='120' y='52' font-family='system-ui, sans-serif' font-weight='600' font-size='9' fill='%234ade80' text-anchor='middle' letter-spacing='1.5'>ENERGY &amp; INFRASTRUCTURE</text></svg>"
    },
    {
      id: "build",
      name: "BUILD Bangladesh",
      description: "Business Initiative Leading Development - A Private Sector Think-Tank of Bangladesh",
      logoUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 70'><rect width='100%' height='100%' rx='8' fill='%230b1727'/><text x='120' y='38' font-family='system-ui, -apple-system, sans-serif' font-weight='900' font-size='24' fill='%23c084fc' text-anchor='middle' letter-spacing='3'>BUILD</text><text x='120' y='54' font-family='system-ui, sans-serif' font-weight='500' font-size='8.5' fill='%23cbd5e1' text-anchor='middle' letter-spacing='1'>PRIVATE SECTOR THINK-TANK</text></svg>"
    },
    {
      id: "bmdf",
      name: "Bangladesh Municipal Development Fund (BMDF)",
      description: "Government municipal development and infrastructure financing entity",
      logoUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 70'><rect width='100%' height='100%' rx='8' fill='%230b1727'/><text x='120' y='36' font-family='system-ui, -apple-system, sans-serif' font-weight='900' font-size='20' fill='%2322c55e' text-anchor='middle' letter-spacing='2'>BMDF</text><text x='120' y='52' font-family='system-ui, sans-serif' font-weight='600' font-size='8.5' fill='%2394a3b8' text-anchor='middle' letter-spacing='1.2'>MUNICIPAL DEVELOPMENT FUND</text></svg>"
    }
  ]
};

export const defaultThemeConfig: SiteThemeConfig = {
  primaryColor: '#ff7e67',
  accentColor: '#2dd4bf',
  heroTitleColor: '#f8fafc',
  heroSubtitleColor: '#94a3b8',
  heroTagColor: '#38d9c0',
  heroButtonBgColor: '#ff7e67',
  heroButtonTextColor: '#070d18',
  heroOverlayStyle: 'dark',
  defaultColorMode: 'dark',
  headerFont: 'Newsreader',
  bodyFont: 'Newsreader',
  headerScale: 1.0,
  bodyScale: 1.0,
  headerFontWeight: '400',
  headerLetterSpacing: '-0.015em',
  headerTransform: 'none',
  backgroundColor: '#050a12',
  cardBgColor: '#081220',
  borderColor: '#1e293b',
  textColor: '#f8fafc',
  textMutedColor: '#94a3b8',
  heroTitleFontSize: '36px',
  sectionTitleFontSize: '32px',
  importedFonts: [],
};

export const defaultResearchSection: ResearchSectionData = {
  sectionTitle: "Thinking that ships.",
  headline: "Turning Institutional Pressure Into Actionable Architecture",
  highlightWord: "Pressure",
  quote: "When overlapping systems are understood, pressure stops being only a threat. It becomes material for design.",
  bodyText: "IP3 translates complexity into strategies, policy models, financing pathways, implementation plans, monitoring systems, digital tools, and decision frameworks until crisis becomes architecture.",
};

export const defaultOperationalFronts: OperationalFront[] = [
  {
    id: "blog",
    tabLabel: "BLOG",
    title: "Policy Insights & Opinion Articles",
    focusVector: "Thought Leadership & Analytical Commentary",
    desc: "In-depth perspectives, critical policy analyses, and reform commentaries curated by IP3 domain experts and institutional researchers.",
    deliverable: "BI-WEEKLY PERSPECTIVES & EDITORIAL ESSAYS",
    status: "READY",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "event",
    tabLabel: "EVENT",
    title: "Roundtables, Summits & Dialogue",
    focusVector: "Stakeholder Convening & Governance Forums",
    desc: "Convening institutional leaders, policymakers, multilateral partners, and sector specialists for high-impact knowledge exchange and deliberations.",
    deliverable: "SUMMIT PROCEEDINGS & POLICY ROADMAPS",
    status: "READY",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "media",
    tabLabel: "MEDIA",
    title: "Press Briefs & Multimedia Coverage",
    focusVector: "Broadcast Features & Public Dissemination",
    desc: "Documentary insights, press briefings, televised panel sessions, and official institutional announcements detailing reform milestones.",
    deliverable: "BROADCAST ARCHIVE & MEDIA RELEASES",
    status: "READY",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "data-story",
    tabLabel: "DATA STORY",
    title: "Interactive Data Stories & Visual Analytics",
    focusVector: "Longitudinal Metrics & Geospatial Modeling",
    desc: "Visualizing complex socio-economic datasets, climate vulnerability indicators, and sovereign financial flows through interactive analytical stories.",
    deliverable: "INTERACTIVE DATA DASHBOARDS & VISUAL BRIEFS",
    status: "READY",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
  }
];

export const defaultParallaxCards: ParallaxCardItem[] = [
  {
    id: 'cyber-samurai',
    title: 'Cyber Samurai',
    subtitle: 'Neon Sector 9',
    description: 'Master of the High-Frequency Blade roaming the electric glow of dystopian sector 9.',
    badge: 'LEGENDARY',
    backgroundUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop',
    shadowUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop',
    frameColor: '#dc2626',
  },
  {
    id: 'cosmic-voyager',
    title: 'Cosmic Voyager',
    subtitle: 'Event Horizon Ops',
    description: 'Pioneering beyond the Event Horizon into uncharted star nurseries and quantum anomalies.',
    badge: 'MYTHIC',
    backgroundUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    shadowUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    frameColor: '#2563eb',
  },
  {
    id: 'forest-guardian',
    title: 'Forest Guardian',
    subtitle: 'Ancient Druid Realm',
    description: 'Channeling ancient druid sigils to protect the sacred luminescent canopy from corruption.',
    badge: 'RARE',
    backgroundUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop',
    shadowUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop',
    frameColor: '#10b981',
  },
  {
    id: 'infernal-wyrm',
    title: 'Infernal Wyrm',
    subtitle: 'Volcanic Abyssal Drake',
    description: 'Awakened from subterranean obsidian chambers, breathing liquid solar fire.',
    badge: 'EXOTIC',
    backgroundUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    shadowUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    frameColor: '#f59e0b',
  },
  {
    id: 'neon-horizon',
    title: 'Neon Horizon',
    subtitle: 'Retrowave Grid Unit',
    description: 'Screaming down the 80s grid line at mach speed under a perpetual retro magenta sun.',
    badge: 'SPECIAL',
    backgroundUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=800&auto=format&fit=crop',
    shadowUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=800&auto=format&fit=crop',
    frameColor: '#eab308',
  },
  {
    id: 'void-sorcerer',
    title: 'Void Sorcerer',
    subtitle: 'Deep Space Galaxy',
    description: 'Bending black hole singularities to cast forbidden spatial transmutation magic.',
    badge: 'LEGENDARY',
    backgroundUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=800&auto=format&fit=crop',
    shadowUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=800&auto=format&fit=crop',
    frameColor: '#a855f7',
  },
  {
    id: 'quantum-vanguard',
    title: 'Quantum Vanguard',
    subtitle: 'Sub-Atomic Tech',
    description: 'Manipulating molecular matter streams to reconstruct sovereign physical infrastructure.',
    badge: 'MYTHIC',
    backgroundUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800&auto=format&fit=crop',
    shadowUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800&auto=format&fit=crop',
    frameColor: '#06b6d4',
  },
  {
    id: 'solar-aegis',
    title: 'Solar Aegis',
    subtitle: 'Orbital Defense',
    description: 'Deploying orbital photovoltaic grids to harness renewable energy for sovereign centers.',
    badge: 'RARE',
    backgroundUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=800&auto=format&fit=crop',
    shadowUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=800&auto=format&fit=crop',
    frameColor: '#f59e0b',
  },
  {
    id: 'deep-sea-nexus',
    title: 'Deep Sea Nexus',
    subtitle: 'Abyssal Data Link',
    description: 'Sub-oceanic fiber nodes securing resilient communication lines across island nations.',
    badge: 'EXOTIC',
    backgroundUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=800&auto=format&fit=crop',
    shadowUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=800&auto=format&fit=crop',
    frameColor: '#3b82f6',
  },
  {
    id: 'astral-weaver',
    title: 'Astral Weaver',
    subtitle: 'Celestial Loom Station',
    description: 'Knitting gravitational lensing corridors to stabilize planetary microclimate observation relays.',
    badge: 'SPECIAL',
    backgroundUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=800&auto=format&fit=crop',
    shadowUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=800&auto=format&fit=crop',
    frameColor: '#ec4899',
  },
  {
    id: 'chrono-drifter',
    title: 'Chrono Drifter',
    subtitle: 'Temporal Paradox Node',
    description: 'Navigating microsecond timeline variances to calibrate predictive policy simulations.',
    badge: 'LEGENDARY',
    backgroundUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    shadowUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    frameColor: '#10b981',
  },
  {
    id: 'hyperion-oracle',
    title: 'Hyperion Oracle',
    subtitle: 'Deep Silicon Substrate',
    description: 'High-dimensional probabilistic inference engine orchestrating sovereign risk countermeasures.',
    badge: 'MYTHIC',
    backgroundUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    shadowUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    frameColor: '#8b5cf6',
  },
];

// Initial default team members
export const defaultTeamMembers: TeamMember[] = [
  {
    id: 'm-1',
    name: 'Dr. Elena Rostova',
    role: 'Senior Director of Policy Strategy',
    division: 'Advisory & Strategy',
    expertise: ['Multilateral Governance', 'IP3 Policy Frameworks', 'Sovereign AI Ethics'],
    education: ['Ph.D. International Relations, Oxford University', 'M.Sc. Public Policy, LSE'],
    bio: 'Pioneered systemic frameworks for international data diplomacy and AI governance across OECD nations. Directs strategic advisory for multilateral bodies.',
    projects: ['Global AI Ethics Protocol', 'IP3 Institutional Blueprint'],
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
    socials: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'e.rostova@institution.org',
    },
    stats: {
      experienceYears: 18,
      projectsLed: 34,
      publications: 22,
    },
  },
  {
    id: 'm-2',
    name: 'Marcus Vance',
    role: 'Chief Policy Researcher',
    division: 'Research & Analysis',
    expertise: ['Action Research', 'Socio-Technical Modeling', 'Algorithmic Auditing'],
    education: ['Ph.D. Computational Social Science, MIT', 'B.S. Mathematics, Stanford'],
    bio: 'Lead architect behind empirical validation models for large-scale institutional transformation. Specializes in predictive policy simulation.',
    projects: ['Socio-Technical Risk Index', 'Public Sector AI Sandbox'],
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800',
    socials: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'm.vance@institution.org',
    },
    stats: {
      experienceYears: 14,
      projectsLed: 28,
      publications: 19,
    },
  },
  {
    id: 'm-3',
    name: 'Aisha Al-Hassan',
    role: 'Head of Public Health & Equity',
    division: 'Public Health & Social',
    expertise: ['Epidemiological Governance', 'Health Data Equity', 'Community Resilience'],
    education: ['M.D. / MPH, Johns Hopkins University', 'B.S. Bioethics, Yale'],
    bio: 'Dedicated to deploying equitable health systems and community-centered policy frameworks across developing and transitioning economies.',
    projects: ['Global Health Equity Tracker', 'Bio-Resilience Directive'],
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800',
    socials: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'a.alhassan@institution.org',
    },
    stats: {
      experienceYears: 16,
      projectsLed: 42,
      publications: 31,
    },
  },
  {
    id: 'm-4',
    name: 'David Chen',
    role: 'Director of Tech Operations',
    division: 'Operations & Tech',
    expertise: ['Secure Cloud Architecture', 'Zero-Trust Networks', 'Distributed Systems'],
    education: ['M.S. Computer Science, UC Berkeley', 'B.S. Software Engineering, CMU'],
    bio: 'Oversees technical architecture and high-assurance compute environments for secure policy simulation and real-time data streaming.',
    projects: ['Federated Policy Engine', 'Quantum-Safe Data Pipeline'],
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800',
    socials: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'd.chen@institution.org'
    },
    stats: {
      experienceYears: 15,
      projectsLed: 50,
      publications: 11
    }
  },
  {
    id: 'm-5',
    name: 'Sophia Sterling',
    role: 'Senior Institutional Advisor',
    division: 'Advisory & Strategy',
    expertise: ['Public-Private Partnerships', 'Regulatory Compliance', 'Strategic Foresight'],
    education: ['J.D. Harvard Law School', 'M.P.A. Harvard Kennedy School'],
    bio: 'Advises cabinet-level ministers and corporate executive boards on regulatory alignment for emerging computational capabilities.',
    projects: ['Transatlantic Data Pact', 'National AI Strategy Framework'],
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800',
    socials: {
      linkedin: 'https://linkedin.com',
      email: 's.sterling@institution.org'
    },
    stats: {
      experienceYears: 20,
      projectsLed: 39,
      publications: 15
    }
  },
  {
    id: 'm-6',
    name: 'Dr. Tariq Mahmood',
    role: 'Lead Data & Analytics Scientist',
    division: 'Research & Analysis',
    expertise: ['Machine Learning Systems', 'Causal Inference', 'Econometric Modeling'],
    education: ['Ph.D. Statistics, Columbia University', 'M.S. Applied Math, ETH Zurich'],
    bio: 'Develops mathematical models evaluating societal impacts of algorithmic decisioning in public administration.',
    projects: ['Algorithmic Fairness Benchmark', 'Macro-Economic Simulator'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    socials: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 't.mahmood@institution.org'
    },
    stats: {
      experienceYears: 12,
      projectsLed: 24,
      publications: 27
    }
  },
  {
    id: 'm-7',
    name: 'Dr. Miriam Osei',
    role: 'Lead Sovereign Debt Strategist',
    division: 'Advisory & Strategy',
    expertise: ['Sovereign Debt Structuring', 'Fiscal Governance', 'Brady Bond Mechanics'],
    education: ['Ph.D. Economics, Cambridge University', 'M.Phil Development Studies, Sussex'],
    bio: 'Advises finance ministries across sub-Saharan Africa and Southeast Asia on debt restructuring and sustainability frameworks.',
    projects: ['Sovereign Debt Restructuring Accord', 'Green Bond Verification Suite'],
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    socials: {
      linkedin: 'https://linkedin.com',
      email: 'm.osei@institution.org'
    },
    stats: {
      experienceYears: 17,
      projectsLed: 31,
      publications: 20
    }
  },
  {
    id: 'm-8',
    name: 'Carlos Mendez',
    role: 'Chief Architect of DPI Systems',
    division: 'Operations & Tech',
    expertise: ['Digital Public Infrastructure', 'Open Identity Protocols', 'Interoperable Rails'],
    education: ['M.Eng Software Systems, Cornell', 'B.S. Computer Engineering, UNAM'],
    bio: 'Specialist in national digital ID, public payments switches, and sovereign data exchange architecture with zero vendor lock-in.',
    projects: ['National Interoperable Switch', 'Consensual Data Exchange Stack'],
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800',
    socials: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'c.mendez@institution.org'
    },
    stats: {
      experienceYears: 13,
      projectsLed: 45,
      publications: 9
    }
  },
  {
    id: 'm-9',
    name: 'Helena Lindqvist',
    role: 'Director of Climate Transition',
    division: 'Research & Analysis',
    expertise: ['Blended Climate Finance', 'Article 6 Carbon Governance', 'Loss & Damage Facilities'],
    education: ['M.Sc. Environmental Economics, Stockholm School of Economics'],
    bio: 'Structures sovereign climate funds and carbon market mechanisms for vulnerable delta and coastal economies.',
    projects: ['Delta Resilience Facility', 'Sovereign Carbon Integrity Index'],
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
    socials: {
      linkedin: 'https://linkedin.com',
      email: 'h.lindqvist@institution.org'
    },
    stats: {
      experienceYears: 15,
      projectsLed: 37,
      publications: 18
    }
  },
  {
    id: 'm-10',
    name: 'Dr. Junichi Tanaka',
    role: 'Senior Governance Fellow',
    division: 'Advisory & Strategy',
    expertise: ['Cabinet Delivery Units', 'Institutional Performance', 'Administrative Law'],
    education: ['Ph.D. Public Administration, University of Tokyo', 'LL.M. Harvard Law School'],
    bio: 'Designs Prime Minister and Presidential delivery unit mechanisms to break ministerial silos and drive urgent national mandates.',
    projects: ['Executive Delivery Unit Protocol', 'Cross-Ministerial Key Performance Framework'],
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800',
    socials: {
      linkedin: 'https://linkedin.com',
      email: 'j.tanaka@institution.org'
    },
    stats: {
      experienceYears: 22,
      projectsLed: 53,
      publications: 35
    }
  },
  {
    id: 'm-11',
    name: 'Fatima Zahra',
    role: 'Head of Social Protection Architecture',
    division: 'Public Health & Social',
    expertise: ['Cash Transfer Systems', 'Dynamic Social Registries', 'Vulnerability Indexing'],
    education: ['M.P.P. Georgetown University', 'B.A. Economics, Mohammed V University'],
    bio: 'Designs end-to-end shock-responsive social protection safety nets with biometric registry and mobile wallet integration.',
    projects: ['Adaptive Social Safety Net', 'Urban Vulnerability Mapping'],
    image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=800',
    socials: {
      linkedin: 'https://linkedin.com',
      email: 'f.zahra@institution.org'
    },
    stats: {
      experienceYears: 11,
      projectsLed: 29,
      publications: 14
    }
  },
  {
    id: 'm-12',
    name: 'Vikramaditya Rao',
    role: 'Senior Quantitative Systems Engineer',
    division: 'Operations & Tech',
    expertise: ['Agent-Based Simulation', 'High-Performance Computing', 'Macro Econometrics'],
    education: ['Ph.D. Operations Research, IIT Bombay', 'M.S. Computer Science, Georgia Tech'],
    bio: 'Builds stochastic simulation engines for stress-testing sovereign fiscal budgets and supply chain interruptions.',
    projects: ['Sovereign Macro Simulator', 'Tariff Shock Analysis Tool'],
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800',
    socials: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'v.rao@institution.org'
    },
    stats: {
      experienceYears: 14,
      projectsLed: 33,
      publications: 21
    }
  },
  {
    id: 'm-13',
    name: 'Claire Beauchamp',
    role: 'Principal Evaluator & MERLA Lead',
    division: 'Research & Analysis',
    expertise: ['Real-Time Policy Evaluation', 'Counterfactual Analysis', 'MERLA Architecture'],
    education: ['Ph.D. Applied Economics, Sciences Po Paris'],
    bio: 'Leads randomized and quasi-experimental evaluation loops for sovereign reform programs to guarantee empirical traceability.',
    projects: ['Public Sector Performance MERLA', 'Evidence-Based Reform Index'],
    image: 'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&q=80&w=800',
    socials: {
      linkedin: 'https://linkedin.com',
      email: 'c.beauchamp@institution.org'
    },
    stats: {
      experienceYears: 16,
      projectsLed: 40,
      publications: 26
    }
  },
  {
    id: 'm-14',
    name: 'Kofi Mensah',
    role: 'Director of Blended Capital Structuring',
    division: 'Advisory & Strategy',
    expertise: ['Concessional Co-Investment', 'Guarantees & First-Loss Tranches', 'DFI Engagement'],
    education: ['M.B.A. INSEAD', 'B.Sc. Banking & Finance, University of Ghana'],
    bio: 'Structures multi-million dollar blended capital vehicles blending sovereign grant funding, multilateral loans, and private equity.',
    projects: ['National Infrastructure Blended Fund', 'Sovereign Guarantee Framework'],
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=800',
    socials: {
      linkedin: 'https://linkedin.com',
      email: 'k.mensah@institution.org'
    },
    stats: {
      experienceYears: 19,
      projectsLed: 46,
      publications: 12
    }
  },
  {
    id: 'm-15',
    name: 'Dr. Anya Petrova',
    role: 'Principal Epidemiologist',
    division: 'Public Health & Social',
    expertise: ['Syndromic Surveillance', 'Health System Resiliency', 'Vaccine Logistics'],
    education: ['Ph.D. Epidemiology, Karolinska Institute', 'M.D. Moscow State Medical'],
    bio: 'Architect of early-warning disease surveillance networks and cold-chain distribution models for low-resource environments.',
    projects: ['National Biosurveillance Mesh', 'Pandemic Surge Protocols'],
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800',
    socials: {
      linkedin: 'https://linkedin.com',
      email: 'a.petrova@institution.org'
    },
    stats: {
      experienceYears: 15,
      projectsLed: 38,
      publications: 29
    }
  }
];

export const defaultStoryThemes: StoryTheme[] = [
  {
    id: 'polysolutions',
    themeNumber: 'THEME 01',
    title: 'From Polycrisis to Polysolutions',
    icon: 'network',
    badge: 'THEME 01 • ACTIVE SCENE',
    category: 'IP3 Sector Expertise',
    headline: 'From Polycrisis to Polysolutions',
    quote:
      'IP3 works across eight interconnected sectors where economic, institutional, environmental and technological risks overlap. We combine specialist sector knowledge with cross-cutting capabilities in economics, finance, governance, data and implementation.',
    cards: [
      {
        tag: '01 / DIAGNOSIS',
        tagColor: 'text-[#ff7e67]',
        title: 'Cascading Failure Modes',
        description:
          'Supply shocks, climate volatility, and fiscal drag reinforce one another in compounding cycles.',
      },
      {
        tag: '02 / SYNTHESIS',
        tagColor: 'text-[#f59e0b]',
        title: 'Cross-System Levers',
        description:
          'Identifying singular institutional levers that unlock simultaneous gains across health, debt, and climate.',
      },
      {
        tag: '03 / EXECUTION',
        tagColor: 'text-[#ff7e67]',
        title: 'Polysolution Compacts',
        description:
          'Multi-stakeholder accords funded by blended capital and deployed with statutory safeguards.',
      },
    ],
  },
  {
    id: 'translation',
    themeNumber: 'THEME 02',
    title: 'Translation, Not Theory',
    icon: 'wrench',
    badge: 'THEME 02 • ACTIVE SCENE',
    category: 'From Analysis to Implementation',
    headline: 'Translation, Not Theory',
    quote:
      'Our work is designed around the decisions institutions actually have to make: what to reform, what to finance, how to structure implementation, where risks sit, how results will be measured, and what evidence is needed to scale.',
    cards: [
      {
        tag: '01 / CODIFICATION',
        tagColor: 'text-[#ff7e67]',
        title: 'Statutory Alignment',
        description:
          'Transforming multilateral declarations into binding legislative mandates, procurement codes, and fiscal appropriations.',
      },
      {
        tag: '02 / RISK SHARING',
        tagColor: 'text-[#f59e0b]',
        title: 'De-risking Frameworks',
        description:
          'Blended finance syndication with multilateral guarantee facilities that crowd in institutional private balance sheets.',
      },
      {
        tag: '03 / DEPLOYMENT',
        tagColor: 'text-[#ff7e67]',
        title: 'Delivery Task Forces',
        description:
          'Dedicated cross-agency operational task forces tracking real-time KPI metrics, supply chain milestones, and statutory deadlines.',
      },
    ],
  },
  {
    id: 'thinking',
    themeNumber: 'THEME 03',
    title: 'Research that changes decisions.',
    icon: 'sparkles',
    badge: 'THEME 03 • ACTIVE SCENE',
    category: 'Evidence & Insights',
    headline: 'Research that changes decisions.',
    quote:
      'Thinking that ships how institutions diagnose, finance and deliver.',
    cards: [
      {
        tag: '01 / DYNAMICS',
        tagColor: 'text-[#ff7e67]',
        title: 'Feedback Loop Forensics',
        description:
          'Identifying vicious cycles and hidden tail-risks before they tip into systemic breakdown across sovereign balance sheets.',
      },
      {
        tag: '02 / PARADIGMS',
        tagColor: 'text-[#f59e0b]',
        title: 'Regenerative Economics',
        description:
          'Moving from extractive remediation to self-reinforcing regenerative capital, circular materials, and human capacity growth.',
      },
      {
        tag: '03 / RESILIENCE',
        tagColor: 'text-[#ff7e67]',
        title: 'Antifragile Governance',
        description:
          'Engineering governance architectures that absorb systemic volatility and emerge stronger through stress and crisis.',
      },
    ],
  },
  {
    id: 'convener',
    themeNumber: 'THEME 04',
    title: 'A Convener Between Worlds',
    icon: 'users',
    badge: 'THEME 04 • ACTIVE SCENE',
    category: 'Connecting Policy, Capital and Implementation',
    headline: 'A Convener Between Worlds',
    quote:
      'Complex reforms fail when ministries, development institutions, researchers, investors and implementers are solving different versions of the same problem. IP3 designs evidence-led dialogue and decision processes that bring those perspectives together around practical pathways to action.',
    cards: [
      {
        tag: '01 / NEUTRALITY',
        tagColor: 'text-[#ff7e67]',
        title: 'Protected Problem Spaces',
        description:
          'Chatham House rule roundtables where sovereign ministers, central bankers, and indigenous leaders negotiate shared compacts.',
      },
      {
        tag: '02 / INTEROPERABILITY',
        tagColor: 'text-[#f59e0b]',
        title: 'Cross-Sector Taxonomy',
        description:
          'Translating ecological imperatives into institutional bond covenants and statutory public health priorities.',
      },
      {
        tag: '03 / ACCELERATION',
        tagColor: 'text-[#ff7e67]',
        title: 'Syndicated Action Labs',
        description:
          '90-day sprint cycles transitioning high-level diplomatic consensus into funded, field-ready deployment architectures.',
      },
    ],
  },
];

export const defaultEightSystemsConfig: EightSystemsConfig = {
  badge: 'Operationalized Across 8 Interconnected Realities',
  titleMain: 'Operationalized Across ',
  titleHighlight: '8 Interconnected Realities.',
  fontFamily: 'newsreader',
  glowIntensity: 1,
  systems: SYSTEMS_DATA,
};

export const defaultSystemsHero: SystemsHeroSectionData = {
  badge: 'BUILT FOR COMPLEX MANDATES',
  titlePrefix: 'Turning complex policy challenges into',
  titleHighlight: 'implementable, investable solutions.',
  description:
    'IP3 Consulting Limited is a policy and development advisory firm helping multilateral institutions, development partners, governments, businesses and research organizations design better policies, mobilize investment, strengthen institutions and deliver measurable results.',
  exploreBtnText: 'Explore Whole Systems Architecture',
  consultBtnText: 'Request Advisory Briefing',
  imageUrl: '/images/boardroom_meeting.jpg',
  imageAlt: 'IP3 High-Level Advisory & Boardroom Deliberation Session',
};

export const defaultCorridorHero: CorridorHeroConfig = {
  enabled: true,
  title: "Corridor of Practice // 8 Key Intersections",
  badge: "Visual Corridor",
  speed: 20,
  cards: 8,
  axis: 55,
  perspective: 30,
  images: [
    {
      src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
      alt: "Institutional Systems & Modern Architecture",
      badge: "Architecture",
      tagline: "Translational Systems",
    },
    {
      src: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80",
      alt: "Climate Action & Ecological Transition",
      badge: "Climate",
      tagline: "Green Transitions",
    },
    {
      src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80",
      alt: "Digital Public Infrastructure & Data Networks",
      badge: "Digital",
      tagline: "Data Ecosystems",
    },
    {
      src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80",
      alt: "Collaborative Policy Co-Design & Strategic Advisory",
      badge: "Policy",
      tagline: "Multi-Stakeholder",
    },
    {
      src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80",
      alt: "Education & Human Capacity Development",
      badge: "Human Capital",
      tagline: "Future-Ready Skills",
    },
    {
      src: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=900&q=80",
      alt: "Clean Energy & Resilient Urban Infrastructure",
      badge: "Infrastructure",
      tagline: "Sustainable Energy",
    },
    {
      src: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80",
      alt: "Governance, Regulation & Public Sector Delivery",
      badge: "Governance",
      tagline: "Public Sector Impact",
    },
    {
      src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80",
      alt: "Systems Engineering & Grounded Implementation",
      badge: "Delivery",
      tagline: "Grounded Solutions",
    },
  ],
};

export const defaultWhyIp3: WhyIp3Config = {
  badge: "02 — WHY IP³",
  titlePrefix: "FOUR REASONS CLIENTS",
  titleHighlight: "choose us",
  imageUrl: "/images/why_ip3_collaboration.jpg",
  imageAlt: "Two women collaborating over digital policy insights and tablet interface",
  reasons: [
    {
      id: "reason-1",
      number: "01",
      title: "From polycrisis to polysolutions",
      description:
        "Economic, institutional, environmental and technological risks overlap. We work across eight connected sectors with cross-cutting capability in economics, finance, governance, data and implementation.",
    },
    {
      id: "reason-2",
      number: "02",
      title: "Translation, not theory",
      description:
        "Evidence converted into delivery architecture: strategies, project preparation, institutional reform and results systems.",
    },
    {
      id: "reason-3",
      number: "03",
      title: "Research that changes decisions",
      description:
        "Decision-ready diagnostics, business cases and evaluations — not publications for their own sake.",
    },
    {
      id: "reason-4",
      number: "04",
      title: "A convenor between worlds",
      description:
        "Structured policy dialogue, investment forums and technical working groups that align governments, capital and implementers.",
    },
  ],
};

export const defaultPodcastCarousel: PodcastCarouselConfig = {
  enabled: true,
  speed: 40,
  items: [
    {
      id: 'ep-1',
      title: 'Problem Solving কি বাস্তব জীবনে প্রভাব ফেলে?',
      imageSrc: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80',
      youtubeUrl: 'https://www.youtube.com/watch?v=gT_uK0Y7oFw',
      badgeText: 'Problem Solving কি',
      headlinePrimary: 'বাস্তব জীবনে',
      headlineSecondary: 'প্রভাব ফেলে?',
      questionMark: true,
    },
    {
      id: 'ep-2',
      title: 'PHITRON এর STUDENT PODCAST স্ক্রিপ্টেড হয়?',
      imageSrc: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      youtubeUrl: 'https://www.youtube.com/watch?v=rWj_s5D_6hA',
      badgeText: 'PHITRON এর',
      headlinePrimary: 'STUDENT PODCAST',
      headlineSecondary: 'স্ক্রিপ্টেড হয়?',
      questionMark: true,
    },
    {
      id: 'ep-3',
      title: 'ডিপ্লোমা স্টুডেন্টদের ভবিষ্যৎ!',
      imageSrc: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80',
      youtubeUrl: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
      badgeText: 'ডিপ্লোমা স্টুডেন্টদের',
      headlinePrimary: 'ভবিষ্যৎ!',
      headlineSecondary: '',
    },
    {
      id: 'ep-4',
      title: 'প্রোগ্রামিং-এর জন্য স্বপ্নের পাবলিক ভার্সিটি ছেড়ে দিলাম!',
      imageSrc: 'https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?auto=format&fit=crop&w=800&q=80',
      youtubeUrl: 'https://www.youtube.com/watch?v=kYv_37v4k2o',
      badgeText: 'প্রোগ্রামিং-এর জন্য',
      headlinePrimary: 'স্বপ্নের পাবলিক ভার্সিটি',
      headlineSecondary: 'ছেড়ে দিলাম!',
    },
  ],
};

export const DEFAULT_WEBSITE_DATA: WebsiteData = {
  slides: defaultSlides,
  movie: defaultMovie,
  officeInfo: ip3OfficeInfo,
  services: defaultServices,
  trustStats: defaultStats,
  faqItems: defaultFaqs,
  executive: defaultExecutive,
  impactPillars: defaultPillars,
  teamMembers: defaultTeamMembers,
  facultyMembers: FACULTY_MEMBERS,
  researchSection: defaultResearchSection,
  operationalFronts: defaultOperationalFronts,
  parallaxCards: defaultParallaxCards,
  focusAreas: defaultFocusAreas as unknown as FocusAreaItem[],
  projects: defaultProjects as unknown as ProjectItemData[],
  serviceSolutions: defaultServiceSolutions as unknown as ServiceSolutionItem[],
  treeFramework: defaultTreeFramework,
  testimonialsSection: defaultTestimonialsSection,
  trustMatrix: defaultTrustMatrix,
  themeConfig: defaultThemeConfig,
  storyThemes: defaultStoryThemes,
  systemsHero: defaultSystemsHero,
  whyIp3: defaultWhyIp3,
  eightSystems: defaultEightSystemsConfig,
  corridorHero: defaultCorridorHero,
  podcastCarousel: defaultPodcastCarousel,
  navigation: defaultNavigation,
  navbar: defaultNavbarConfig,
  timeSlots: defaultTimeSlots,
  clientTestimonials: defaultClientTestimonials,
};
