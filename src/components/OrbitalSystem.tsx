import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Layers } from 'lucide-react';
import { SystemNodeId } from '../data/systemsData';

interface OrbitalSystemProps {
  onSelectNode: (nodeId: SystemNodeId) => void;
  selectedNodeId?: SystemNodeId | null;
  onExploreCapabilities?: () => void;
  className?: string;
}

interface SpectrumCardData {
  id: SystemNodeId;
  themeIndex: number;
  number: string;
  topAccentColor: string;
  title: string;
  titleBreak?: string;
  description: string;
  hoverBorder: string;
  hoverGlow: string;
  lineColor: string;
}

export const OrbitalSystem: React.FC<OrbitalSystemProps> = ({
  onSelectNode,
  selectedNodeId,
  onExploreCapabilities,
  className = '',
}) => {
  const [hoveredNode, setHoveredNode] = useState<SystemNodeId | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const ip3Ref = useRef<HTMLButtonElement>(null);
  const card0Ref = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const card4Ref = useRef<HTMLDivElement>(null);
  const card5Ref = useRef<HTMLDivElement>(null);

  const cardRefs = [card0Ref, card1Ref, card2Ref, card3Ref, card4Ref, card5Ref];

  interface ConnectorPath {
    d: string;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  }
  const [connectors, setConnectors] = useState<ConnectorPath[]>([]);

  const cards: SpectrumCardData[] = [
    {
      id: 'institutions',
      themeIndex: 0,
      number: '01',
      topAccentColor: 'bg-[#ff7e67]',
      title: 'Diagnose',
      description: 'Economic, institutional, market and political-economy analysis that clarifies the problem and identifies realistic options.',
      hoverBorder: 'hover:border-[#ff7e67]/60',
      hoverGlow: 'hover:shadow-[0_12px_36px_rgba(255,126,103,0.14)]',
      lineColor: '#ff7e67',
    },
    {
      id: 'policy',
      themeIndex: 1,
      number: '02',
      topAccentColor: 'bg-[#2dd4bf]',
      title: 'Design',
      description: 'Policies, programs, investment concepts, theories of change, financing strategies, implementation arrangements.',
      hoverBorder: 'hover:border-[#2dd4bf]/60',
      hoverGlow: 'hover:shadow-[0_12px_36px_rgba(45,212,191,0.14)]',
      lineColor: '#2dd4bf',
    },
    {
      id: 'technology',
      themeIndex: 2,
      number: '03',
      topAccentColor: 'bg-[#f59e0b]',
      title: 'Finance',
      description: 'Bankability analysis, blended finance, climate finance, private-capital mobilization, investment pipelines.',
      hoverBorder: 'hover:border-[#f59e0b]/60',
      hoverGlow: 'hover:shadow-[0_12px_36px_rgba(245,158,11,0.14)]',
      lineColor: '#f59e0b',
    },
    {
      id: 'evidence',
      themeIndex: 3,
      number: '04',
      topAccentColor: 'bg-[#a855f7]',
      title: 'Deliver',
      description: 'Institutional strengthening, implementation support, capacity development, adaptive problem-solving.',
      hoverBorder: 'hover:border-[#a855f7]/60',
      hoverGlow: 'hover:shadow-[0_12px_36px_rgba(168,85,247,0.14)]',
      lineColor: '#a855f7',
    },
    {
      id: 'finance',
      themeIndex: 4,
      number: '05',
      topAccentColor: 'bg-[#38bdf8]',
      title: 'Measure',
      description: 'MEL frameworks, evaluations, results systems, dashboards, learning processes.',
      hoverBorder: 'hover:border-[#38bdf8]/60',
      hoverGlow: 'hover:shadow-[0_12px_36px_rgba(56,189,248,0.14)]',
      lineColor: '#38bdf8',
    },
    {
      id: 'delivery',
      themeIndex: 5,
      number: '06',
      topAccentColor: 'bg-[#10b981]',
      title: 'Scale',
      description: 'Evidence translation, replication strategies, policy uptake, institutionalization.',
      hoverBorder: 'hover:border-[#10b981]/60',
      hoverGlow: 'hover:shadow-[0_12px_36px_rgba(16,185,129,0.14)]',
      lineColor: '#10b981',
    },
  ];

  const handleNodeClick = (nodeId: SystemNodeId) => {
    onSelectNode(nodeId);
  };

  // Recalculate curved connector lines dynamically connecting to each card's button
  useEffect(() => {
    const updateCurves = () => {
      if (!containerRef.current || !ip3Ref.current) return;
      const cRect = containerRef.current.getBoundingClientRect();
      const iRect = ip3Ref.current.getBoundingClientRect();

      const startX = iRect.left - cRect.left + iRect.width / 2;
      const startY = iRect.bottom - cRect.top - 4;

      const newConnectors: ConnectorPath[] = [];

      cardRefs.forEach((ref, index) => {
        const cardEl = ref.current;
        if (!cardEl) return;

        const cardRect = cardEl.getBoundingClientRect();
        const cardLeft = cardRect.left - cRect.left;
        const cardTop = cardRect.top - cRect.top;
        const cardWidth = cardRect.width;

        // Custom entry X ratio along the card top edge
        let entryXRatio = 0.5;
        let endXRatio = 0.5;
        let endYOffset = 130;

        if (index === 0) {
          entryXRatio = 0.70;
          endXRatio = 0.30;
          endYOffset = 135;
        } else if (index === 1) {
          entryXRatio = 0.62;
          endXRatio = 0.34;
          endYOffset = 130;
        } else if (index === 2) {
          entryXRatio = 0.54;
          endXRatio = 0.38;
          endYOffset = 125;
        } else if (index === 3) {
          entryXRatio = 0.46;
          endXRatio = 0.62;
          endYOffset = 125;
        } else if (index === 4) {
          entryXRatio = 0.38;
          endXRatio = 0.66;
          endYOffset = 130;
        } else if (index === 5) {
          entryXRatio = 0.30;
          endXRatio = 0.70;
          endYOffset = 135;
        }

        const entryX = cardLeft + cardWidth * entryXRatio;
        const entryY = cardTop;
        const endX = cardLeft + cardWidth * endXRatio;
        const endY = cardTop + endYOffset;

        // 1. Bezier curve from bottom of IP3 hub down to card top edge
        const deltaX = entryX - startX;
        const cp1X = startX + deltaX * 0.35;
        const cp1Y = startY + 30;
        const cp2X = entryX - deltaX * 0.1;
        const cp2Y = entryY - 25;

        // 2. Continuation arc looping inside the card toward the title
        const innerCpX = entryX;
        const innerCpY = entryY + 40;

        const d = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${entryX} ${entryY} C ${innerCpX} ${innerCpY}, ${endX} ${endY - 25}, ${endX} ${endY}`;
        newConnectors.push({ d, startX, startY, endX, endY });
      });

      setConnectors(newConnectors);
    };

    updateCurves();

    // Recompute after quick layout paint
    const t = setTimeout(updateCurves, 50);

    const resizeObserver = new ResizeObserver(() => {
      updateCurves();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    window.addEventListener('resize', updateCurves);

    return () => {
      clearTimeout(t);
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateCurves);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="orbital-system-container"
      className={`relative w-full max-w-7xl mx-auto flex flex-col items-center select-none pt-2 pb-10 ${className}`}
    >
      {/* SVG Connector Rays to Buttons Overlay */}
      <svg
        className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-10 transition-opacity duration-500"
      >
        <defs>
          <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Origin connector ring at bottom of IP3 hub */}
        {connectors.length > 0 && (
          <circle
            cx={connectors[0].startX}
            cy={connectors[0].startY}
            r={hoveredNode === 'core' ? 5 : 3.5}
            fill="#8B3A2A"
            className="transition-all duration-300"
          />
        )}

        {connectors.map((conn, index) => {
          const card = cards[index];
          if (!card) return null;
          const isHighlighted =
            hoveredNode === card.id ||
            selectedNodeId === card.id ||
            hoveredNode === 'core' ||
            selectedNodeId === 'core';

          return (
            <g key={`connector-${card.id}`}>
              {/* Outer soft glow when highlighted */}
              {isHighlighted && (
                <path
                  d={conn.d}
                  fill="none"
                  stroke="#8B3A2A"
                  strokeWidth={4.5}
                  strokeOpacity={0.25}
                  strokeLinecap="round"
                />
              )}
              {/* Primary connector ray */}
              <path
                d={conn.d}
                fill="none"
                stroke={isHighlighted ? "#8B3A2A" : "#D5C8BC"}
                strokeWidth={isHighlighted ? 2.5 : 1.5}
                strokeOpacity={isHighlighted ? 0.95 : 0.75}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
              {/* Subtle terminal accent dot at curve endpoint */}
              {isHighlighted && (
                <circle
                  cx={conn.endX}
                  cy={conn.endY}
                  r={3.5}
                  fill="#8B3A2A"
                  className="transition-all duration-300"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Center Top: IP3 Circle Node */}
      <div className="relative z-20 flex flex-col items-center">
        <motion.button
          ref={ip3Ref}
          id="node-core-btn"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          onMouseEnter={() => setHoveredNode('core')}
          onMouseLeave={() => setHoveredNode(null)}
          onClick={() => handleNodeClick('core')}
          className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all duration-300 border-2 border-[#D5C8BC] hover:border-[#8B3A2A] bg-[#FFFFFF] shadow-md hover:shadow-xl hover:shadow-[#8B3A2A]/15 group"
        >
          {/* Interior subtle dotted ring */}
          <div className="absolute inset-1.5 rounded-full border border-[#D5C8BC]/70 border-dashed animate-spin [animation-duration:50s] pointer-events-none" />

          <span className="font-serif font-bold text-3xl sm:text-4xl text-[#1C1917] tracking-wide group-hover:text-[#8B3A2A] transition-colors">
            IP3
          </span>
          <div className="mt-1 px-2.5 py-0.5 rounded-full border border-[#D5C8BC] bg-[#F0EBE4] text-[#8B3A2A] font-mono text-[8.5px] sm:text-[9px] tracking-[0.18em] font-bold uppercase">
            BUILT FOR COMPLEXITY
          </div>
        </motion.button>
      </div>

      {/* 6 Cards Grid - Fully Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4 w-full mt-10 sm:mt-14 z-20">
        {cards.map((card, index) => {
          const isSelected = selectedNodeId === card.id;
          const isHovered = hoveredNode === card.id;
          const isConnectedToCore = hoveredNode === 'core' || selectedNodeId === 'core';

          return (
            <motion.div
              key={card.id}
              ref={cardRefs[index]}
              id={`spectrum-card-${card.id}`}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
              onClick={() => handleNodeClick(card.id)}
              onMouseEnter={() => setHoveredNode(card.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className={`relative flex flex-col justify-between p-5 sm:p-5.5 rounded-2xl bg-[#FFFFFF] border transition-all duration-300 cursor-pointer overflow-hidden min-h-[250px] sm:min-h-[270px] group shadow-sm ${
                isSelected || isHovered || isConnectedToCore
                  ? 'border-[#8B3A2A] shadow-md shadow-[#8B3A2A]/10'
                  : 'border-[#D5C8BC] hover:border-[#8B3A2A]'
              }`}
            >
              {/* Internal subtle arc for small viewports / visual continuity */}
              <div className="md:hidden absolute top-0 right-8 w-24 h-24 pointer-events-none opacity-30">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path
                    d={index < 3 ? "M 80 0 C 80 30, 60 50, 40 70" : "M 20 0 C 20 30, 40 50, 60 70"}
                    fill="none"
                    stroke="#D5C8BC"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Top Accent Pill Bar */}
              <div className="flex items-center justify-start mb-4">
                <div className="w-10 h-1 rounded-full bg-[#8B3A2A]" />
              </div>

              {/* Header: Number */}
              <div className="flex items-center justify-between w-full mb-3 relative z-10">
                <span className="font-mono text-xs font-bold text-[#7A6B63] tracking-wider">
                  {card.number}
                </span>
              </div>

              {/* Content: Title and Description */}
              <div className="space-y-2 relative z-10">
                <h3 className="text-lg sm:text-[19px] font-bold text-[#1C1917] tracking-tight leading-snug group-hover:text-[#8B3A2A] transition-colors">
                  {card.title}
                  {card.titleBreak && (
                    <span className="block">{card.titleBreak}</span>
                  )}
                </h3>
                <p className="text-[#7A6B63] text-xs sm:text-[13px] leading-relaxed font-normal">
                  {card.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Explore Our Capabilities Button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-8 sm:mt-10 flex flex-col items-center justify-center w-full relative z-20"
      >
        <button
          id="btn-explore-our-capabilities"
          onClick={() => {
            if (onExploreCapabilities) {
              onExploreCapabilities();
            } else {
              const target = document.querySelector('#client-deliverables-section') || document.querySelector('#poly-solutions-master-section') || document.querySelector('#systems-hero');
              if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
              }
            }
          }}
          className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-[#1C1917] hover:bg-[#8B3A2A] text-white font-semibold text-sm sm:text-base tracking-wide transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer group"
        >
          <span>Explore Our Capabilities</span>
          <Layers className="w-4 h-4 text-[#D5C8BC] group-hover:text-white group-hover:scale-110 transition-transform duration-200" />
        </button>
      </motion.div>
    </div>
  );
};

