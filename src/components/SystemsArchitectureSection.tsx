import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Layers, RotateCw, RotateCcw } from 'lucide-react';
import { OrbitalSystem } from './OrbitalSystem';
import { NodeInspectorModal } from './NodeInspectorModal';
import { ConsultationModal } from './ConsultationModal';
import { PolySolutionsSection } from './PolySolutionsSection';
import { OrbitalSystemCloneSection } from './OrbitalSystemCloneSection';
import { SystemNodeId } from '../data/systemsData';
import { useCMS } from '../context/CMSContext';
import { defaultSystemsHero } from '../data/defaultContent';

export const SystemsArchitectureSection: React.FC = () => {
  const { data } = useCMS();
  const heroConfig = data.systemsHero || defaultSystemsHero;
  const heroImageUrl = heroConfig.imageUrl || '/images/boardroom_meeting.jpg';
  const heroImageAlt = heroConfig.imageAlt || 'IP3 High-Level Advisory & Boardroom Deliberation Session';

  const [selectedStoryNodeId, setSelectedStoryNodeId] = useState<SystemNodeId | null>(null);
  const [inspectedNodeId, setInspectedNodeId] = useState<SystemNodeId | null>(null);
  const [activeStoryThemeIndex, setActiveStoryThemeIndex] = useState<number>(0);
  const [isStoryOpen, setIsStoryOpen] = useState<boolean>(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState<boolean>(false);
  const [consultationDomain, setConsultationDomain] = useState<SystemNodeId | null>(null);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleCardFlip = (cardKey: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [cardKey]: !prev[cardKey],
    }));
  };

  const themeNodeMap: Record<number, SystemNodeId> = {
    0: 'institutions',
    1: 'policy',
    2: 'technology',
    3: 'evidence',
    4: 'finance',
    5: 'delivery',
  };

  const handleSelectNode = (nodeId: SystemNodeId) => {
    setSelectedStoryNodeId(nodeId);
    setInspectedNodeId(nodeId);
  };

  const handleThemeChange = (index: number) => {
    setActiveStoryThemeIndex(index);
    if (themeNodeMap[index]) {
      setSelectedStoryNodeId(themeNodeMap[index]);
    }
  };

  const handleCloseStory = () => {
    setIsStoryOpen(false);
    setSelectedStoryNodeId(null);
  };

  const handleOpenConsultation = (domain?: SystemNodeId) => {
    setConsultationDomain(domain || 'core');
    setIsConsultationOpen(true);
  };

  return (
    <div className="relative w-full bg-[#FFFFFF] text-[#1C1917] selection:bg-[#8B3A2A]/20 selection:text-[#8B3A2A]">
      
      {/* ========================================================================= */}
      {/* TOP SECTION: White Background (#FFFFFF) */}
      {/* ========================================================================= */}
      <section
        id="systems-hero"
        className="relative w-full min-h-[85vh] flex flex-col justify-center pt-16 sm:pt-20 pb-12 px-4 sm:px-6 lg:px-10 z-10 bg-[#FFFFFF] text-[#1C1917]"
      >
        <div className="flex flex-col items-start w-full my-auto py-4 max-w-7xl mx-auto">
          {/* Header Block: Headline, Narrative & Top-Right Body Paragraph */}
          <div
            id="systems-hero-header-block"
            className="flex flex-col items-start text-left w-full space-y-8 mb-8 sm:mb-10"
          >
            {/* Top Eyebrow Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2"
            >
              <span
                id="systems-hero-badge"
                className="font-mono text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-[#1C1917] uppercase"
              >
                BUILT FOR COMPLEX <span className="text-[#8B3A2A] font-bold">MANDATES</span>
              </span>
            </motion.div>

            {/* Two-column layout: Left (Headlines, Description & CTAs) & Right (Boardroom Visual) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start w-full">
              {/* Left Column: Main Headings, Description and Action Buttons */}
              <div className="lg:col-span-7 flex flex-col justify-start items-start text-left space-y-6">
                <div className="space-y-4 w-full">
                  <motion.h2
                    id="systems-hero-headline"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="font-serif font-normal text-[#1C1917] tracking-[-0.03em] py-1 overflow-visible w-full text-left max-w-full leading-[1.08] sm:leading-[1.05]"
                    style={{ fontSize: 'clamp(2rem, 4.4vw, 4.75rem)' }}
                  >
                    <span className="block whitespace-nowrap text-[#1C1917]">
                      From evidence to
                    </span>
                    <span className="block whitespace-nowrap text-[#1C1917]">
                      decisions.
                    </span>
                    <span className="block italic whitespace-nowrap text-[#1C1917]">
                      From decisions to
                    </span>
                    <span className="block italic whitespace-nowrap text-[#8B3A2A]">
                      delivery.
                    </span>
                  </motion.h2>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="space-y-3 text-left pt-1"
                  >
                    <p
                      id="systems-hero-description"
                      className="font-sans text-[#7A6B63] text-[26px] leading-snug sm:leading-relaxed font-normal text-left max-w-2xl"
                      style={{ fontFamily: 'var(--font-body)', fontSize: '26px' }}
                    >
                      Turning complex policy challenges into{' '}
                      <span className="text-[#8B3A2A] font-semibold">implementable</span>, investable solutions.
                    </p>
                  </motion.div>
                </div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="flex flex-wrap sm:flex-nowrap items-center justify-start gap-3.5 w-auto pt-2"
                >
                  <button
                    id="btn-discuss-assignment"
                    onClick={() => handleOpenConsultation('core')}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#8B3A2A] hover:bg-[#722f22] text-white font-bold text-sm sm:text-base tracking-wide transition-all shadow-md shadow-[#8B3A2A]/20 hover:shadow-lg hover:shadow-[#8B3A2A]/30 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer whitespace-nowrap"
                  >
                    <span>Discuss an Assignment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    id="btn-explore-capabilities"
                    onClick={() => {
                      setIsStoryOpen(true);
                      const diagram = document.querySelector('#systems-bottom-section') || document.querySelector('#client-deliverables-section');
                      if (diagram) {
                        diagram.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#F0EBE4] hover:bg-[#e4ded5] text-[#1C1917] border border-[#D5C8BC] hover:border-[#8B3A2A] font-semibold text-sm sm:text-base tracking-wide transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer whitespace-nowrap"
                  >
                    <span>Explore Our Capabilities</span>
                    <Layers className="w-4 h-4 text-[#8B3A2A]" />
                  </button>
                </motion.div>
              </div>

              {/* Right Column: Boardroom Visual */}
              <div className="lg:col-span-5 flex flex-col justify-start space-y-6 pt-1">
                {/* Boardroom Conference Image with light border & clean frame */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.25 }}
                  className="relative rounded-2xl overflow-hidden border border-[#D5C8BC] shadow-lg bg-[#F0EBE4] group w-full h-[320px] sm:h-[380px] lg:h-full lg:min-h-[360px]"
                >
                  <img
                    src={heroImageUrl}
                    alt={heroImageAlt}
                    className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/5 pointer-events-none rounded-2xl" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* BOTTOM SECTION: Warm Beige Background (#F0EBE4) */}
      {/* ========================================================================= */}
      <section
        id="systems-bottom-section"
        className="relative w-full pt-16 pb-20 px-4 sm:px-6 lg:px-10 z-10 bg-[#F0EBE4] text-[#1C1917] border-t border-[#D5C8BC]/80"
      >
        <div className="max-w-7xl mx-auto w-full space-y-16">
          {/* Full-width Diagram: IP3 Center Hub + Connected Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full flex items-center justify-center relative"
          >
            <OrbitalSystem
              onSelectNode={handleSelectNode}
              selectedNodeId={selectedStoryNodeId}
              onExploreCapabilities={() => {
                setIsStoryOpen(true);
                const diagram = document.querySelector('#client-deliverables-section') || document.querySelector('#systems-hero');
                if (diagram) {
                  diagram.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
          </motion.div>

          {/* What Clients Hire IP3 to Deliver Section */}
          <div
            id="client-deliverables-section"
            className="w-full pt-8 border-t border-[#D5C8BC]/70"
          >
            <div className="flex flex-col items-start text-left w-full space-y-4 mb-10">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-2"
              >
                <span className="font-mono text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-[#1C1917] uppercase">
                  WHAT WE DO
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-serif font-normal text-[#1C1917] tracking-[-0.03em] py-1 overflow-visible w-full text-left max-w-full leading-[1.08] sm:leading-[1.05]"
                style={{ fontSize: 'clamp(2rem, 3.8vw, 3.75rem)' }}
              >
                <span className="block whitespace-normal sm:whitespace-nowrap text-[#1C1917]">
                  What clients hire IP3
                </span>
                <span className="block italic whitespace-normal sm:whitespace-nowrap text-[#1C1917]">
                  to <span className="text-[#8B3A2A]">deliver.</span>
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="font-sans text-[#7A6B63] text-base sm:text-lg leading-relaxed font-normal text-left max-w-2xl"
              >
                Six foundational practice areas translating complex policy and research insight into grounded institutional <span className="text-[#8B3A2A] font-semibold">implementation</span> and lasting results.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {/* Card 01 (Flappable Card) */}
              <motion.div
                id="policy-strategy-advisory-paragraph"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="group relative [perspective:1200px] h-full min-h-[440px] cursor-pointer"
                onClick={() => toggleCardFlip('card1')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleCardFlip('card1');
                  }
                }}
                aria-label={flippedCards['card1'] ? "Flip to Client Problem" : "Flip to Key Deliverables"}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
                    flippedCards['card1'] ? '[transform:rotateY(180deg)]' : ''
                  }`}
                >
                  {/* FRONT SIDE: Problem & Need */}
                  <div className="absolute inset-0 flex flex-col justify-between rounded-2xl bg-[#FFFFFF] border border-[#D5C8BC] p-6 sm:p-7 group-hover:border-[#8B3A2A] transition-all duration-300 shadow-sm group-hover:shadow-xl group-hover:shadow-[#1C1917]/5 [backface-visibility:hidden]">
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#F0EBE4] text-[#1C1917] border border-[#D5C8BC] tracking-wider">
                          01
                        </span>
                        <span className="font-mono text-[11px] uppercase tracking-wider text-[#7A6B63] font-semibold">
                          Strategy &amp; Advisory
                        </span>
                      </div>
                      <h3 className="font-serif text-[29px] font-bold text-[#1C1917] tracking-tight leading-[1.12] mb-3 transition-colors" style={{ fontSize: '29px' }}>
                        Policy, Economics &amp; Strategy Advisory
                      </h3>
                      <div className="mb-5 bg-transparent border-0 p-0">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-[#8B3A2A] font-semibold mb-1 flex items-center gap-1.5">
                          Client Problem / Need
                        </div>
                        <p className="text-[24px] text-[#7A6B63] italic font-normal leading-snug" style={{ fontSize: '24px' }}>
                          &ldquo;We need to understand the problem and choose a defensible course of action.&rdquo;
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-[#D5C8BC]/60 flex items-center justify-end">
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#8B3A2A] bg-[#8B3A2A]/5 px-2.5 py-1 rounded-lg border border-[#8B3A2A]/20 transition-all duration-200 group-hover:bg-[#8B3A2A] group-hover:text-white">
                        <span>Key Deliverables</span>
                        <RotateCw className="w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-180" />
                      </span>
                    </div>
                  </div>

                  {/* BACK SIDE: Key Deliverables */}
                  <div className="absolute inset-0 flex flex-col justify-between rounded-2xl bg-[#FBF9F5] border-2 border-[#8B3A2A] p-6 sm:p-7 shadow-xl shadow-[#1C1917]/10 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#8B3A2A] text-white tracking-wider">
                          01
                        </span>
                        <span className="font-mono text-[11px] uppercase tracking-wider text-[#8B3A2A] font-semibold">
                          Strategy &amp; Advisory
                        </span>
                      </div>
                      <h3 className="font-serif text-[20px] font-bold text-[#1C1917] tracking-tight leading-[1.2] mb-3" style={{ fontSize: '20px' }}>
                        Policy, Economics &amp; Strategy Advisory
                      </h3>

                      <div className="mt-4 pt-4 border-t border-[#D5C8BC]/60">
                        <div className="text-[18px] font-mono uppercase tracking-wider text-[#1C1917] font-semibold mb-3" style={{ fontSize: '18px' }}>
                          Key Deliverables
                        </div>
                        <ul className="space-y-2.5 text-[17px] text-[#1C1917] leading-relaxed" style={{ fontSize: '17px' }}>
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8B3A2A] mt-2 shrink-0" />
                            <span style={{ fontSize: '17px' }}>Diagnostics, modeling, political-economy analysis, and regulatory reviews</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8B3A2A] mt-2 shrink-0" />
                            <span style={{ fontSize: '17px' }}>Actionable policy papers with <span className="underline decoration-[#D5C8BC] underline-offset-4 font-medium">measurable implementation metrics</span></span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-[#D5C8BC]/60 flex items-center justify-end">
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#1C1917] bg-[#F0EBE4] px-2.5 py-1 rounded-lg border border-[#D5C8BC] transition-colors hover:bg-[#8B3A2A] hover:text-white hover:border-[#8B3A2A]">
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Flip to Overview</span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Card 02 (Flappable Card) */}
              <motion.div
                id="program-design-facility-paragraph"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="group relative [perspective:1200px] h-full min-h-[440px] cursor-pointer"
                onClick={() => toggleCardFlip('card2')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleCardFlip('card2');
                  }
                }}
                aria-label={flippedCards['card2'] ? "Flip to Client Problem" : "Flip to Key Deliverables"}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
                    flippedCards['card2'] ? '[transform:rotateY(180deg)]' : ''
                  }`}
                >
                  {/* FRONT SIDE: Problem & Need */}
                  <div className="absolute inset-0 flex flex-col justify-between rounded-2xl bg-[#FFFFFF] border border-[#D5C8BC] p-6 sm:p-7 group-hover:border-[#8B3A2A] transition-all duration-300 shadow-sm group-hover:shadow-xl group-hover:shadow-[#1C1917]/5 [backface-visibility:hidden]">
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#F0EBE4] text-[#1C1917] border border-[#D5C8BC] tracking-wider">
                          02
                        </span>
                        <span className="font-mono text-[11px] uppercase tracking-wider text-[#7A6B63] font-semibold">
                          Design &amp; Structuring
                        </span>
                      </div>
                      <h3 className="font-serif text-[29px] font-bold text-[#1C1917] tracking-tight leading-[1.12] mb-3 transition-colors" style={{ fontSize: '29px' }}>
                        Program Design &amp; Facility Structuring
                      </h3>
                      <div className="mb-5 bg-transparent border-0 p-0">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-[#8B3A2A] font-semibold mb-1 flex items-center gap-1.5">
                          Client Problem / Need
                        </div>
                        <p className="text-[24px] text-[#7A6B63] italic font-normal leading-snug" style={{ fontSize: '24px' }}>
                          &ldquo;We have a mandate or funding window but need an implementable program.&rdquo;
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-[#D5C8BC]/60 flex items-center justify-end">
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#8B3A2A] bg-[#8B3A2A]/5 px-2.5 py-1 rounded-lg border border-[#8B3A2A]/20 transition-all duration-200 group-hover:bg-[#8B3A2A] group-hover:text-white">
                        <span>Key Deliverables</span>
                        <RotateCw className="w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-180" />
                      </span>
                    </div>
                  </div>

                  {/* BACK SIDE: Key Deliverables */}
                  <div className="absolute inset-0 flex flex-col justify-between rounded-2xl bg-[#FBF9F5] border-2 border-[#8B3A2A] p-6 sm:p-7 shadow-xl shadow-[#1C1917]/10 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#8B3A2A] text-white tracking-wider">
                          02
                        </span>
                        <span className="font-mono text-[11px] uppercase tracking-wider text-[#8B3A2A] font-semibold">
                          Design &amp; Structuring
                        </span>
                      </div>
                      <h3 className="font-serif text-[20px] font-bold text-[#1C1917] tracking-tight leading-[1.2] mb-3" style={{ fontSize: '20px' }}>
                        Program Design &amp; Facility Structuring
                      </h3>

                      <div className="mt-4 pt-4 border-t border-[#D5C8BC]/60">
                        <div className="text-[18px] font-mono uppercase tracking-wider text-[#1C1917] font-semibold mb-3" style={{ fontSize: '18px' }}>
                          Key Deliverables
                        </div>
                        <ul className="space-y-2.5 text-[17px] text-[#1C1917] leading-relaxed" style={{ fontSize: '17px' }}>
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8B3A2A] mt-2 shrink-0" />
                            <span style={{ fontSize: '17px' }}>Feasibility studies, theories of change, concept notes, and results frameworks</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8B3A2A] mt-2 shrink-0" />
                            <span style={{ fontSize: '17px' }}><span className="underline decoration-[#D5C8BC] underline-offset-4 font-medium">Implementation</span> and financing plans, risk registers, and project-preparation support</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-[#D5C8BC]/60 flex items-center justify-end">
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#1C1917] bg-[#F0EBE4] px-2.5 py-1 rounded-lg border border-[#D5C8BC] transition-colors hover:bg-[#8B3A2A] hover:text-white hover:border-[#8B3A2A]">
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Flip to Overview</span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Card 03 (Flappable Card) */}
              <motion.div
                id="finance-capital-mobilization-paragraph"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="group relative [perspective:1200px] h-full min-h-[440px] cursor-pointer"
                onClick={() => toggleCardFlip('card3')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleCardFlip('card3');
                  }
                }}
                aria-label={flippedCards['card3'] ? "Flip to Client Problem" : "Flip to Key Deliverables"}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
                    flippedCards['card3'] ? '[transform:rotateY(180deg)]' : ''
                  }`}
                >
                  {/* FRONT SIDE: Problem & Need */}
                  <div className="absolute inset-0 flex flex-col justify-between rounded-2xl bg-[#FFFFFF] border border-[#D5C8BC] p-6 sm:p-7 group-hover:border-[#8B3A2A] transition-all duration-300 shadow-sm group-hover:shadow-xl group-hover:shadow-[#1C1917]/5 [backface-visibility:hidden]">
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#F0EBE4] text-[#1C1917] border border-[#D5C8BC] tracking-wider">
                          03
                        </span>
                        <span className="font-mono text-[11px] uppercase tracking-wider text-[#7A6B63] font-semibold">
                          Capital Mobilization
                        </span>
                      </div>
                      <h3 className="font-serif text-[29px] font-bold text-[#1C1917] tracking-tight leading-[1.12] mb-3 transition-colors" style={{ fontSize: '29px' }}>
                        Development Finance &amp; Private Capital Mobilization
                      </h3>
                      <div className="mb-5 bg-transparent border-0 p-0">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-[#8B3A2A] font-semibold mb-1 flex items-center gap-1.5">
                          Client Problem / Need
                        </div>
                        <p className="text-[24px] text-[#7A6B63] italic font-normal leading-snug" style={{ fontSize: '24px' }}>
                          &ldquo;Public funding is insufficient; how do we make this investable?&rdquo;
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-[#D5C8BC]/60 flex items-center justify-end">
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#8B3A2A] bg-[#8B3A2A]/5 px-2.5 py-1 rounded-lg border border-[#8B3A2A]/20 transition-all duration-200 group-hover:bg-[#8B3A2A] group-hover:text-white">
                        <span>Key Deliverables</span>
                        <RotateCw className="w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-180" />
                      </span>
                    </div>
                  </div>

                  {/* BACK SIDE: Key Deliverables */}
                  <div className="absolute inset-0 flex flex-col justify-between rounded-2xl bg-[#FBF9F5] border-2 border-[#8B3A2A] p-6 sm:p-7 shadow-xl shadow-[#1C1917]/10 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#8B3A2A] text-white tracking-wider">
                          03
                        </span>
                        <span className="font-mono text-[11px] uppercase tracking-wider text-[#8B3A2A] font-semibold">
                          Capital Mobilization
                        </span>
                      </div>
                      <h3 className="font-serif text-[20px] font-bold text-[#1C1917] tracking-tight leading-[1.2] mb-3" style={{ fontSize: '20px' }}>
                        Development Finance &amp; Private Capital Mobilization
                      </h3>

                      <div className="mt-4 pt-4 border-t border-[#D5C8BC]/60">
                        <div className="text-[18px] font-mono uppercase tracking-wider text-[#1C1917] font-semibold mb-3" style={{ fontSize: '18px' }}>
                          Key Deliverables
                        </div>
                        <ul className="space-y-2.5 text-[17px] text-[#1C1917] leading-relaxed" style={{ fontSize: '17px' }}>
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8B3A2A] mt-2 shrink-0" />
                            <span style={{ fontSize: '17px' }}>Investment cases, blended-finance strategies, PPP advisory, and financial models</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8B3A2A] mt-2 shrink-0" />
                            <span style={{ fontSize: '17px' }}>Bankability assessments, climate-finance pipelines, and <span className="underline decoration-[#D5C8BC] underline-offset-4 font-medium">risk mitigation structures</span></span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-[#D5C8BC]/60 flex items-center justify-end">
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#1C1917] bg-[#F0EBE4] px-2.5 py-1 rounded-lg border border-[#D5C8BC] transition-colors hover:bg-[#8B3A2A] hover:text-white hover:border-[#8B3A2A]">
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Flip to Overview</span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Card 04 (Flappable Card) */}
              <motion.div
                id="institutions-governance-delivery-paragraph"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="group relative [perspective:1200px] h-full min-h-[440px] cursor-pointer"
                onClick={() => toggleCardFlip('card4')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleCardFlip('card4');
                  }
                }}
                aria-label={flippedCards['card4'] ? "Flip to Client Problem" : "Flip to Key Deliverables"}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
                    flippedCards['card4'] ? '[transform:rotateY(180deg)]' : ''
                  }`}
                >
                  {/* FRONT SIDE: Problem & Need */}
                  <div className="absolute inset-0 flex flex-col justify-between rounded-2xl bg-[#FFFFFF] border border-[#D5C8BC] p-6 sm:p-7 group-hover:border-[#8B3A2A] transition-all duration-300 shadow-sm group-hover:shadow-xl group-hover:shadow-[#1C1917]/5 [backface-visibility:hidden]">
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#F0EBE4] text-[#1C1917] border border-[#D5C8BC] tracking-wider">
                          04
                        </span>
                        <span className="font-mono text-[11px] uppercase tracking-wider text-[#7A6B63] font-semibold">
                          Governance &amp; Delivery
                        </span>
                      </div>
                      <h3 className="font-serif text-[29px] font-bold text-[#1C1917] tracking-tight leading-[1.12] mb-3 transition-colors" style={{ fontSize: '29px' }}>
                        Institutions, Governance &amp; Delivery
                      </h3>
                      <div className="mb-5 bg-transparent border-0 p-0">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-[#8B3A2A] font-semibold mb-1 flex items-center gap-1.5">
                          Client Problem / Need
                        </div>
                        <p className="text-[24px] text-[#7A6B63] italic font-normal leading-snug" style={{ fontSize: '24px' }}>
                          &ldquo;A policy exists, but institutions cannot <span className="text-[#8B3A2A] font-semibold">implement</span> it consistently.&rdquo;
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-[#D5C8BC]/60 flex items-center justify-end">
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#8B3A2A] bg-[#8B3A2A]/5 px-2.5 py-1 rounded-lg border border-[#8B3A2A]/20 transition-all duration-200 group-hover:bg-[#8B3A2A] group-hover:text-white">
                        <span>Key Deliverables</span>
                        <RotateCw className="w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-180" />
                      </span>
                    </div>
                  </div>

                  {/* BACK SIDE: Key Deliverables */}
                  <div className="absolute inset-0 flex flex-col justify-between rounded-2xl bg-[#FBF9F5] border-2 border-[#8B3A2A] p-6 sm:p-7 shadow-xl shadow-[#1C1917]/10 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#8B3A2A] text-white tracking-wider">
                          04
                        </span>
                        <span className="font-mono text-[11px] uppercase tracking-wider text-[#8B3A2A] font-semibold">
                          Governance &amp; Delivery
                        </span>
                      </div>
                      <h3 className="font-serif text-[20px] font-bold text-[#1C1917] tracking-tight leading-[1.2] mb-3" style={{ fontSize: '20px' }}>
                        Institutions, Governance &amp; Delivery
                      </h3>

                      <div className="mt-4 pt-4 border-t border-[#D5C8BC]/60">
                        <div className="text-[18px] font-mono uppercase tracking-wider text-[#1C1917] font-semibold mb-3" style={{ fontSize: '18px' }}>
                          Key Deliverables
                        </div>
                        <ul className="space-y-2.5 text-[17px] text-[#1C1917] leading-relaxed" style={{ fontSize: '17px' }}>
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8B3A2A] mt-2 shrink-0" />
                            <span style={{ fontSize: '17px' }}>Institutional diagnostics, governance frameworks, and PFM reform</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8B3A2A] mt-2 shrink-0" />
                            <span style={{ fontSize: '17px' }}>Delivery models, process redesign, and sustained <span className="underline decoration-[#D5C8BC] underline-offset-4 font-medium">implementation capacity building</span></span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-[#D5C8BC]/60 flex items-center justify-end">
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#1C1917] bg-[#F0EBE4] px-2.5 py-1 rounded-lg border border-[#D5C8BC] transition-colors hover:bg-[#8B3A2A] hover:text-white hover:border-[#8B3A2A]">
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Flip to Overview</span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Card 05 (Flappable Card) */}
              <motion.div
                id="mel-impact-paragraph"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="group relative [perspective:1200px] h-full min-h-[440px] cursor-pointer"
                onClick={() => toggleCardFlip('card5')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleCardFlip('card5');
                  }
                }}
                aria-label={flippedCards['card5'] ? "Flip to Client Problem" : "Flip to Key Deliverables"}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
                    flippedCards['card5'] ? '[transform:rotateY(180deg)]' : ''
                  }`}
                >
                  {/* FRONT SIDE: Problem & Need */}
                  <div className="absolute inset-0 flex flex-col justify-between rounded-2xl bg-[#FFFFFF] border border-[#D5C8BC] p-6 sm:p-7 group-hover:border-[#8B3A2A] transition-all duration-300 shadow-sm group-hover:shadow-xl group-hover:shadow-[#1C1917]/5 [backface-visibility:hidden]">
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#F0EBE4] text-[#1C1917] border border-[#D5C8BC] tracking-wider">
                          05
                        </span>
                        <span className="font-mono text-[11px] uppercase tracking-wider text-[#7A6B63] font-semibold">
                          MEL &amp; Impact
                        </span>
                      </div>
                      <h3 className="font-serif text-[29px] font-bold text-[#1C1917] tracking-tight leading-[1.12] mb-3 transition-colors" style={{ fontSize: '29px' }}>
                        Monitoring, Evaluation, Learning &amp; Impact
                      </h3>
                      <div className="mb-5 bg-transparent border-0 p-0">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-[#8B3A2A] font-semibold mb-1 flex items-center gap-1.5">
                          Client Problem / Need
                        </div>
                        <p className="text-[24px] text-[#7A6B63] italic font-normal leading-snug" style={{ fontSize: '24px' }}>
                          &ldquo;We need to know what is working, why, for whom, and whether it can scale.&rdquo;
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-[#D5C8BC]/60 flex items-center justify-end">
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#8B3A2A] bg-[#8B3A2A]/5 px-2.5 py-1 rounded-lg border border-[#8B3A2A]/20 transition-all duration-200 group-hover:bg-[#8B3A2A] group-hover:text-white">
                        <span>Key Deliverables</span>
                        <RotateCw className="w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-180" />
                      </span>
                    </div>
                  </div>

                  {/* BACK SIDE: Key Deliverables */}
                  <div className="absolute inset-0 flex flex-col justify-between rounded-2xl bg-[#FBF9F5] border-2 border-[#8B3A2A] p-6 sm:p-7 shadow-xl shadow-[#1C1917]/10 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#8B3A2A] text-white tracking-wider">
                          05
                        </span>
                        <span className="font-mono text-[11px] uppercase tracking-wider text-[#8B3A2A] font-semibold">
                          MEL &amp; Impact
                        </span>
                      </div>
                      <h3 className="font-serif text-[20px] font-bold text-[#1C1917] tracking-tight leading-[1.2] mb-3" style={{ fontSize: '20px' }}>
                        Monitoring, Evaluation, Learning &amp; Impact
                      </h3>

                      <div className="mt-4 pt-4 border-t border-[#D5C8BC]/60">
                        <div className="text-[18px] font-mono uppercase tracking-wider text-[#1C1917] font-semibold mb-3" style={{ fontSize: '18px' }}>
                          Key Deliverables
                        </div>
                        <ul className="space-y-2.5 text-[17px] text-[#1C1917] leading-relaxed" style={{ fontSize: '17px' }}>
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8B3A2A] mt-2 shrink-0" />
                            <span style={{ fontSize: '17px' }}>MEL frameworks, baselines, process and impact evaluations, and learning agendas</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8B3A2A] mt-2 shrink-0" />
                            <span style={{ fontSize: '17px' }}>Outcome harvesting, real-time dashboards, and <span className="underline decoration-[#D5C8BC] underline-offset-4 font-medium">adaptive management loops</span></span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-[#D5C8BC]/60 flex items-center justify-end">
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#1C1917] bg-[#F0EBE4] px-2.5 py-1 rounded-lg border border-[#D5C8BC] transition-colors hover:bg-[#8B3A2A] hover:text-white hover:border-[#8B3A2A]">
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Flip to Overview</span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Card 06 (Flappable Card) */}
              <motion.div
                id="data-digital-ai-paragraph"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="group relative [perspective:1200px] h-full min-h-[440px] cursor-pointer"
                onClick={() => toggleCardFlip('card6')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleCardFlip('card6');
                  }
                }}
                aria-label={flippedCards['card6'] ? "Flip to Client Problem" : "Flip to Key Deliverables"}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
                    flippedCards['card6'] ? '[transform:rotateY(180deg)]' : ''
                  }`}
                >
                  {/* FRONT SIDE: Problem & Need */}
                  <div className="absolute inset-0 flex flex-col justify-between rounded-2xl bg-[#FFFFFF] border border-[#D5C8BC] p-6 sm:p-7 group-hover:border-[#8B3A2A] transition-all duration-300 shadow-sm group-hover:shadow-xl group-hover:shadow-[#1C1917]/5 [backface-visibility:hidden]">
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#F0EBE4] text-[#1C1917] border border-[#D5C8BC] tracking-wider">
                          06
                        </span>
                        <span className="font-mono text-[11px] uppercase tracking-wider text-[#7A6B63] font-semibold">
                          Data &amp; Responsible AI
                        </span>
                      </div>
                      <h3 className="font-serif text-[29px] font-bold text-[#1C1917] tracking-tight leading-[1.12] mb-3 transition-colors" style={{ fontSize: '29px' }}>
                        Data, Digital &amp; Responsible AI
                      </h3>
                      <div className="mb-5 bg-transparent border-0 p-0">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-[#8B3A2A] font-semibold mb-1 flex items-center gap-1.5">
                          Client Problem / Need
                        </div>
                        <p className="text-[24px] text-[#7A6B63] italic font-normal leading-snug" style={{ fontSize: '24px' }}>
                          &ldquo;We need to modernize systems without creating new governance, exclusion or accountability risks.&rdquo;
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-[#D5C8BC]/60 flex items-center justify-end">
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#8B3A2A] bg-[#8B3A2A]/5 px-2.5 py-1 rounded-lg border border-[#8B3A2A]/20 transition-all duration-200 group-hover:bg-[#8B3A2A] group-hover:text-white">
                        <span>Key Deliverables</span>
                        <RotateCw className="w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-180" />
                      </span>
                    </div>
                  </div>

                  {/* BACK SIDE: Key Deliverables */}
                  <div className="absolute inset-0 flex flex-col justify-between rounded-2xl bg-[#FBF9F5] border-2 border-[#8B3A2A] p-6 sm:p-7 shadow-xl shadow-[#1C1917]/10 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#8B3A2A] text-white tracking-wider">
                          06
                        </span>
                        <span className="font-mono text-[11px] uppercase tracking-wider text-[#8B3A2A] font-semibold">
                          Data &amp; Responsible AI
                        </span>
                      </div>
                      <h3 className="font-serif text-[20px] font-bold text-[#1C1917] tracking-tight leading-[1.2] mb-3" style={{ fontSize: '20px' }}>
                        Data, Digital &amp; Responsible AI
                      </h3>

                      <div className="mt-4 pt-4 border-t border-[#D5C8BC]/60">
                        <div className="text-[18px] font-mono uppercase tracking-wider text-[#1C1917] font-semibold mb-3" style={{ fontSize: '18px' }}>
                          Key Deliverables
                        </div>
                        <ul className="space-y-2.5 text-[17px] text-[#1C1917] leading-relaxed" style={{ fontSize: '17px' }}>
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8B3A2A] mt-2 shrink-0" />
                            <span style={{ fontSize: '17px' }}>DPI diagnostics, digital-government strategies, and data governance frameworks</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8B3A2A] mt-2 shrink-0" />
                            <span style={{ fontSize: '17px' }}>Interoperability standards, AI readiness, and <span className="underline decoration-[#D5C8BC] underline-offset-4 font-medium">responsible service deployment</span></span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-[#D5C8BC]/60 flex items-center justify-end">
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#1C1917] bg-[#F0EBE4] px-2.5 py-1 rounded-lg border border-[#D5C8BC] transition-colors hover:bg-[#8B3A2A] hover:text-white hover:border-[#8B3A2A]">
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Flip to Overview</span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Orbital System (Built for Complexity) Section */}
      <OrbitalSystemCloneSection />

      {/* Unified Poly-Solutions Architecture & Eight Systems Master Section */}
      <PolySolutionsSection
        isOpen={isStoryOpen}
        onClose={handleCloseStory}
        activeThemeIndex={activeStoryThemeIndex}
        onThemeChange={handleThemeChange}
      />

      {/* Node Inspector Modal */}
      <NodeInspectorModal
        nodeId={inspectedNodeId}
        onClose={() => setInspectedNodeId(null)}
        onSelectAnotherNode={(nodeId) => setInspectedNodeId(nodeId)}
        onConsultDomain={(nodeId) => handleOpenConsultation(nodeId)}
      />

      {/* Strategic Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        initialDomain={consultationDomain}
      />
    </div>
  );
};
