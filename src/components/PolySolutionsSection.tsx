import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { useCMS } from '../context/CMSContext';
import { defaultStoryThemes } from '../data/defaultContent';
import type { StoryTheme } from '../types';
import { EightSystemsSection } from './EightSystemsSection';
import { MethodologyTranslationSection } from './MethodologyTranslationSection';
import { ProjectsSection } from './ProjectsSection';
import { FourFrontsSection } from './FourFrontsSection';
import { ConveningSection } from './ConveningSection';
import ConveningModalitiesCard from './ConveningModalitiesCard';
import { TrustMatrixMarquee } from './TrustMatrixMarquee';
import { TestimonialCard } from './TestimonialCard';

export type { StoryTheme };
export const STORY_THEMES = defaultStoryThemes;

export const STATIC_STORY_THEMES: StoryTheme[] = [
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
    category: 'Statutory & Implementation Architecture',
    headline: 'Translation, Not Theory',
    quote:
      '"Bridging the chasm between visionary global treaties and operational municipal & national enforcement."',
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
        title: 'Trusted Safe Harbors',
        description:
          'Chatham House rule deliberation spaces resolving long-standing deadlocks between regulators, innovators, and market makers.',
      },
      {
        tag: '02 / SYNTHESIS',
        tagColor: 'text-[#f59e0b]',
        title: 'Cross-Sector Compacts',
        description:
          'Binding mutual-aid pacts and joint accountability mechanisms across public, private, and philanthropic partners.',
      },
      {
        tag: '03 / ACCOUNTABILITY',
        tagColor: 'text-[#ff7e67]',
        title: 'Independent Impact Audits',
        description:
          'Verifiable cryptographic and institutional monitoring protocols that guarantee multi-year delivery of shared mandates.',
      },
    ],
  },
];

interface PolySolutionsSectionProps {
  activeThemeIndex?: number;
  onThemeChange?: (index: number) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const PolySolutionsSection: React.FC<PolySolutionsSectionProps> = ({
  activeThemeIndex: controlledThemeIndex,
  onThemeChange,
  isOpen = false,
  onClose,
}) => {
  const { data } = useCMS();
  const themes = data.storyThemes && data.storyThemes.length > 0 ? data.storyThemes : defaultStoryThemes;

  const [internalThemeIndex, setInternalThemeIndex] = useState<number>(0);

  const sectionRef = useRef<HTMLElement>(null);
  const masterCardRef = useRef<HTMLDivElement>(null);

  // Passive sync with external controlled index (without scroll hijacking or checkpoints)
  useEffect(() => {
    if (controlledThemeIndex !== undefined) {
      setInternalThemeIndex(controlledThemeIndex);
    }
  }, [controlledThemeIndex]);

  // Observer to track which theme is currently in the viewport as user scrolls the page naturally
  useEffect(() => {
    const horizonElements = themes
      .map((_, idx) => document.getElementById(`theme-horizon-${idx + 1}`))
      .filter(Boolean) as HTMLElement[];

    if (horizonElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const indexAttr = entry.target.getAttribute('data-theme-index');
            if (indexAttr !== null) {
              const idx = parseInt(indexAttr, 10);
              setInternalThemeIndex(idx);
              if (onThemeChange) {
                onThemeChange(idx);
              }
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '-15% 0px -55% 0px',
        threshold: 0.05,
      }
    );

    horizonElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [themes, onThemeChange]);

  const handleSelectTheme = useCallback(
    (index: number) => {
      setInternalThemeIndex(index);
      if (onThemeChange) {
        onThemeChange(index);
      }
      const targetEl = document.getElementById(`theme-horizon-${index + 1}`);
      if (targetEl) {
        const topOffset = 85;
        const elementPosition = targetEl.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementPosition - topOffset,
          behavior: 'smooth',
        });
      }
    },
    [onThemeChange]
  );

  return (
    <>
      {/* Horizon 1: Separate Dedicated Section */}
      <section
        id="theme-horizon-1"
        data-theme-index={0}
        className="theme-horizon-block relative w-full bg-slate-50 sm:bg-white text-slate-900 py-16 sm:py-24 px-4 sm:px-6 lg:px-10 border-b border-slate-200 select-text scroll-smooth"
      >
        <div className="w-full max-w-7xl mx-auto flex flex-col space-y-8 sm:space-y-10">
          {/* Horizon Header */}
          <div className="flex flex-col items-start text-left space-y-6 w-full max-w-4xl mb-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-[#1C1917] uppercase">
                IP3 SECTOR <span className="text-[#8B3A2A] font-bold">EXPERTISE</span>
              </span>
            </div>

            <h2
              className="font-serif font-normal text-[#1C1917] tracking-[-0.03em] overflow-visible w-full text-left leading-[1.08] sm:leading-[1.05]"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.75rem)' }}
            >
              <span className="block text-[#1C1917]">
                From Polycrisis to
              </span>
              <span className="block italic text-[#8B3A2A]">
                Polysolutions.
              </span>
            </h2>

            <p
              className="font-sans text-[#7A6B63] text-lg sm:text-xl lg:text-[22px] leading-relaxed font-normal text-left max-w-4xl"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              IP3 works across eight interconnected sectors where economic, institutional, environmental and technological risks overlap. We combine specialist sector knowledge with cross-cutting capabilities in economics, finance, governance, data and implementation.
            </p>
          </div>

          {/* Eight Systems Architecture */}
          <div className="flex flex-col space-y-4 w-full">
            <EightSystemsSection />
          </div>
        </div>
      </section>

      {/* Poly-Solutions Thematic Horizons Section (Horizons 2, 3, 4) */}
      <section
        id="polysolutions-section"
        ref={sectionRef}
        className="relative w-full bg-[#050a12] mt-0 pt-16 pb-20 sm:pb-32 px-4 sm:px-6 lg:px-10 border-t-0 select-text scroll-smooth"
      >
        {/* Background Ambient Glow Gradients */}
        <div className="absolute top-1/6 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-[#ff7e67]/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#2dd4bf]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 left-0 w-[500px] h-[500px] bg-[#ff7e67]/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full relative z-10">
          {/* Full-width Unified Poly-Solutions Section Container - Seamlessly Part of the Section */}
          <div
            id="polysolutions-master-card"
            ref={masterCardRef}
            className="container-fluid w-full max-w-full bg-transparent border-0 rounded-none p-0 flex flex-col relative shadow-none"
          >
            {/* Active Story Layout: Natural Page Content */}
            <div
              id="active-story-scene-card"
              className="w-full flex flex-col items-start"
            >
              {/* Thematic Horizons rendered naturally in page stream */}
              <div
                id="active-theme-scroll-pane"
                className="w-full min-w-0 flex flex-col space-y-20 sm:space-y-28"
              >
                {themes.slice(1).map((theme, sliceIdx) => {
                  const idx = sliceIdx + 1;
                  return (
                    <div
                      key={theme.id}
                      id={`theme-horizon-${idx + 1}`}
                      data-theme-index={idx}
                      className="theme-horizon-block w-full flex flex-col space-y-6 sm:space-y-8 pt-2 pb-14 sm:pb-20 border-b border-slate-800/60 last:border-b-0"
                    >
                  {/* Horizon Header */}
                  {idx === 1 ? (
                    <div
                      id="sector-systems-items-container"
                      className="w-full flex flex-col space-y-3 pt-2 pb-2 max-w-5xl"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-[#38d9c0] uppercase">
                          {(theme.category || 'From Analysis to Implementation').toUpperCase()}
                        </span>
                      </div>
                      <h2
                        id="climate-energy-resilience"
                        className="font-sans text-[38px] sm:text-[48px] lg:text-[58px] font-extrabold text-white tracking-tight leading-[1.08]"
                      >
                        Translation, Not Theory
                      </h2>
                      <p className="text-slate-300 text-base sm:text-lg lg:text-[19px] font-normal leading-relaxed max-w-4xl">
                        Our work is designed around the decisions institutions actually have to make: what to reform, what to finance, how to structure implementation, where risks sit, how results will be measured, and what evidence is needed to scale.
                      </p>
                    </div>
                  ) : (
                    <div className={`flex flex-col space-y-3 ${idx === 0 ? 'w-full max-w-none' : 'max-w-4xl'}`}>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase ${
                            idx === 0 ? 'text-teal-700' : 'text-[#38d9c0]'
                          }`}
                        >
                          {idx === 0
                            ? 'IP3 SECTOR EXPERTISE'
                            : idx === 2
                            ? 'EVIDENCE & INSIGHTS'
                            : idx === 3
                            ? 'CONNECTING POLICY, CAPITAL AND IMPLEMENTATION'
                            : (theme.category || 'Whole-Systems Architecture').toUpperCase()}
                        </span>
                      </div>

                      <h3
                        className={`font-serif font-bold tracking-tight leading-[1.08] ${
                          idx === 0
                            ? 'text-slate-900 whitespace-nowrap overflow-visible'
                            : 'text-slate-100'
                        }`}
                        style={{
                          ...(idx === 0
                            ? {
                                fontSize: 'clamp(22px, 3.4vw, 54px)',
                                whiteSpace: 'nowrap',
                                width: 'max-content',
                                maxWidth: '100%',
                              }
                            : {}),
                          ...(idx === 2 ? { fontSize: 'clamp(32px, 5vw, 65px)', maxWidth: '100%' } : {}),
                          ...(idx >= 3 ? { fontSize: '52px' } : {}),
                        }}
                      >
                        {idx === 2 ? 'Research that changes decisions.' : theme.headline}
                      </h3>

                      <p
                        className={`${
                          idx === 0
                            ? 'text-slate-600 text-base sm:text-lg lg:text-[19px]'
                            : idx <= 3
                            ? 'text-slate-300 text-base sm:text-lg lg:text-[19px]'
                            : 'font-serif italic text-slate-300/90 text-lg sm:text-xl lg:text-[22px]'
                        } font-normal leading-relaxed max-w-4xl`}
                      >
                        {idx === 0 &&
                        (theme.quote?.includes('world’s challenges') ||
                          theme.quote?.includes("world's challenges"))
                          ? 'IP3 works across eight interconnected sectors where economic, institutional, environmental and technological risks overlap. We combine specialist sector knowledge with cross-cutting capabilities in economics, finance, governance, data and implementation.'
                          : idx === 2
                          ? 'Thinking that ships how institutions diagnose, finance and deliver.'
                          : idx === 3
                          ? 'Complex reforms fail when ministries, development institutions, researchers, investors and implementers are solving different versions of the same problem. IP3 designs evidence-led dialogue and decision processes that bring those perspectives together around practical pathways to action.'
                          : theme.quote}
                      </p>
                    </div>
                  )}

                  {/* Theme 2 Specific: Translation Framework & Projects */}
                  {theme.id === 'translation' && (
                    <div className="w-full space-y-8">
                      <MethodologyTranslationSection embedded />
                      <ProjectsSection embedded />
                    </div>
                  )}

                  {/* Theme 3 Specific: Thinking that Shifts (Publications & Four Fronts) */}
                  {theme.id === 'thinking' && (
                    <div className="w-full space-y-8">
                      <FourFrontsSection embedded />
                    </div>
                  )}

                  {/* Theme 4 Specific: Multilateral Platform, Ecosystem & Testimonials */}
                  {theme.id === 'convener' && (
                    <div className="w-full space-y-10">
                      <ConveningSection embedded />

                      {/* Convening Formats & Dialogue Platforms Card (Added before Strategic Partners & Client Ecosystem) */}
                      <ConveningModalitiesCard />

                      <div className="w-full border-t border-slate-800/80 pt-8">
                        <TrustMatrixMarquee embedded />
                      </div>

                      <div className="w-full border-t border-slate-800/80 pt-8">
                        <TestimonialCard embedded />
                      </div>
                    </div>
                  )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PolySolutionsSection;

