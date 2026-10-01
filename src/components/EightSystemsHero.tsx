import React from 'react';
import { motion } from 'motion/react';
import { SystemItem } from '../types';

interface EightSystemsHeroProps {
  systems: SystemItem[];
  selectedSystemId: string | null;
  onSelectSystem: (system: SystemItem) => void;
  fontFamily?: 'newsreader' | 'playfair' | 'cormorant' | 'instrument';
  glowIntensity?: number; // 0 to 1
  hoveredSystemId: string | null;
  setHoveredSystemId: (id: string | null) => void;
  titleMain?: string;
  titleHighlight?: string;
}

const SYSTEM_FLAGSHIPS: Record<
  string,
  {
    category: string;
    title: string;
    summary: string;
    imageUrl?: string;
  }
> = {
  'climate-sustainability': {
    category: 'CLIMATE & SUSTAINABILITY',
    title: 'Green Industrial Transition',
    summary:
      'Research and policy engagement on the barriers to industrial green transition, including technology adoption, renewable energy, regulation and access to green finance.',
    imageUrl:
      'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80',
  },
  'economic-transition': {
    category: 'ECONOMIC TRANSITION',
    title: 'Technology Adoption & Firm-Level Evidence',
    summary:
      'Survey design and field implementation to understand technology adoption, digitalisation and informality, supported by economic analysis and policy reporting.',
    imageUrl:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
  },
  'education-human-capital': {
    category: 'EDUCATION & HUMAN CAPITAL',
    title: 'Education Systems Transformation & Digital Learning',
    summary:
      'Feasibility and investment analysis across primary, secondary, madrasah and technical and vocational education. The work connects curriculum, digital learning, teacher development and institutional capacity.',
    imageUrl:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
  },
  'health-social-protection': {
    category: 'HEALTH & SOCIAL PROTECTION',
    title: 'Climate-Informed Health Systems & Safety Nets',
    summary:
      'Multi-hazard diagnostics, preventive community primary care, dynamic social registries, and parametric cash transfers for climate resilience.',
    imageUrl:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
  },
  'data-digital-governance': {
    category: 'DATA & DIGITAL GOVERNANCE',
    title: 'Digital Public Infrastructure & Data Sovereignty',
    summary:
      'Sovereign digital identity, open data protocols, citizen privacy charters, and modular digital public goods.',
    imageUrl:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
  },
  'institutional-effectiveness': {
    category: 'INSTITUTIONAL EFFECTIVENESS',
    title: 'Municipal Finance & Institutional Transformation',
    summary:
      'Strategic planning, automation, fiscal decentralization, and agile civil-service capability building across key public agencies.',
    imageUrl:
      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
  },
  'esg-circular-economy': {
    category: 'ESG & CIRCULAR ECONOMY',
    title: 'Circular Industrial Economy & Waste Elimination',
    summary:
      'Closed-loop industrial resource loops, virgin material reduction, extended producer responsibility, and supply chain decarbonization.',
    imageUrl:
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
  },
  'ai-public-systems': {
    category: 'AI FOR PUBLIC SYSTEMS',
    title: 'Predictive Public Systems & Sovereign AI',
    summary:
      'Dynamic public grid balancing, ethical algorithmic assessment, and mission-critical decision workflows for sovereign institutions.',
    imageUrl:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  },
};

export const EightSystemsHero: React.FC<EightSystemsHeroProps> = ({
  systems,
  selectedSystemId,
  onSelectSystem,
  fontFamily = 'newsreader',
  glowIntensity = 1,
  hoveredSystemId,
  setHoveredSystemId,
  titleMain,
  titleHighlight,
}) => {
  const hasActive = selectedSystemId !== null;

  const getFontClass = () => {
    switch (fontFamily) {
      case 'playfair':
        return 'font-serif-playfair';
      case 'cormorant':
        return 'font-serif-cormorant';
      case 'instrument':
        return 'font-serif-instrument';
      case 'newsreader':
      default:
        return 'font-serif-newsreader';
    }
  };

  const renderPill = (system: SystemItem) => {
    const isSelected = selectedSystemId === system.id;
    const isHovered = !hasActive && hoveredSystemId === system.id;
    const flagship = SYSTEM_FLAGSHIPS[system.id];

    const displayCategory = flagship?.category || system.name.toUpperCase();
    const displayTitle = flagship?.title || system.name;
    const displaySummary = flagship?.summary || system.summary;
    const displayImage = flagship?.imageUrl || system.imageUrl;

    return (
      <button
        key={system.id}
        id={`system-pill-${system.id}`}
        type="button"
        onClick={() => onSelectSystem(system)}
        onMouseEnter={() => {
          if (!hasActive) {
            setHoveredSystemId(system.id);
          }
        }}
        onMouseLeave={() => {
          if (!hasActive) {
            setHoveredSystemId(null);
          }
        }}
        className={`group relative w-full flex flex-col justify-between text-left rounded-xl transition-all duration-200 cursor-pointer select-none outline-none overflow-hidden border ${
          isSelected
            ? 'bg-white border-[#b84a32] ring-2 ring-[#b84a32]/60 shadow-lg text-slate-900 -translate-y-1'
            : hasActive
            ? 'bg-white/80 border-slate-200 opacity-60 hover:opacity-90 shadow-sm text-slate-700'
            : isHovered
            ? 'bg-white border-slate-300 shadow-md -translate-y-1 text-slate-900'
            : 'bg-white hover:bg-slate-50/80 border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-0.5 text-slate-800'
        }`}
        style={{
          boxShadow: isSelected
            ? '0 12px 28px -6px rgba(184, 74, 50, 0.22), 0 4px 12px rgba(0,0,0,0.06)'
            : (!hasActive && isHovered)
            ? '0 10px 24px -6px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.04)'
            : '0 2px 6px rgba(0,0,0,0.04)',
        }}
      >
        {/* Top Image */}
        {displayImage && (
          <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-slate-100 shrink-0 border-b border-slate-100">
            <img
              src={displayImage}
              alt={displayTitle}
              referrerPolicy="no-referrer"
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
            />
          </div>
        )}

        {/* Card Content Container */}
        <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between bg-white text-left w-full">
          <div>
            {/* Category Eyebrow with system color */}
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
                color: system.color || '#b84a32',
              }}
              className="text-[11px] font-bold tracking-[0.14em] uppercase mb-2.5"
            >
              {displayCategory}
            </p>

            {/* Card Title */}
            <h4
              style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
              className="text-lg sm:text-[20px] font-bold leading-[1.25] tracking-tight text-slate-900 group-hover:text-black mb-3"
            >
              {displayTitle}
            </h4>

            {/* Card Summary Description */}
            <p
              style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
              className="text-[13px] sm:text-[13.5px] font-normal leading-[1.6] text-slate-600 line-clamp-3 sm:line-clamp-4 mb-5"
            >
              {displaySummary}
            </p>
          </div>

          {/* Explore the work Link/Action */}
          <div className="pt-2 mt-auto">
            <span
              style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
              className="inline-flex items-center gap-1.5 text-[13px] font-bold text-slate-900 border-b border-slate-900 pb-0.5 group-hover:text-[#b84a32] group-hover:border-[#b84a32] transition-colors"
            >
              <span>Explore the work</span>
              <span className="text-[14px] leading-none select-none">↗</span>
            </span>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="relative w-full select-text transition-all duration-300">
      {/* Background ambient lighting subtle glow */}
      <div
        className="pointer-events-none absolute -left-20 top-24 w-72 h-72 rounded-full blur-3xl opacity-20"
        style={{
          background:
            'radial-gradient(circle, rgba(255,126,103,0.12) 0%, rgba(45,212,191,0.08) 70%, transparent 100%)',
        }}
      />

      {/* Main Section Container */}
      <div className="pt-2 pb-6 px-0 mx-0">
        {/* 8 Systems Pills Grid / Buttons - Hidden when detail panel is active */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={`w-full relative z-10 ${selectedSystemId ? 'hidden' : 'block'}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 w-full">
            {/* Header Slot - First Card (Static title block, not a button) */}
            <div
              id="system-pill-blank"
              style={{
                textAlign: 'start',
                paddingLeft: 0,
                paddingTop: 0,
                paddingRight: 0,
                paddingBottom: 0,
                backgroundColor: 'transparent',
              }}
              className="relative w-full h-full min-h-[360px] flex flex-col justify-start items-start text-left text-start select-text outline-none border-0 bg-transparent p-0 shadow-none"
            >
              <div className="w-full text-left text-start">
                <h1
                  style={{
                    fontSize: 'clamp(2.4rem, 4vw, 56px)',
                    textAlign: 'start',
                    fontFamily: "'Newsreader', Georgia, serif",
                  }}
                  className="font-serif-newsreader leading-[1.08] sm:leading-[1.02] tracking-[-0.03em] font-normal text-slate-900 text-left text-start"
                >
                  <span
                    className="block text-left text-start text-slate-900"
                    style={{
                      fontSize: 'inherit',
                      textAlign: 'start',
                      lineHeight: 'inherit',
                      fontFamily: "'Newsreader', Georgia, serif",
                      color: '#0f172a',
                    }}
                  >
                    Operationalized Across{' '}
                  </span>
                  <span
                    className="block text-slate-500 text-left text-start"
                    style={{
                      fontSize: 'inherit',
                      textAlign: 'start',
                      lineHeight: 'inherit',
                      fontFamily: "'Newsreader', Georgia, serif",
                      color: '#64748b',
                    }}
                  >
                    8 Interconnected Realities.
                  </span>
                </h1>
              </div>
            </div>

            {systems.map(renderPill)}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
