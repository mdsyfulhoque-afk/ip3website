import React, { useState } from 'react';

interface TerminalBeat {
  title: string;
  text: string;
  points: string[];
  photoKey: string;
}

interface PolicyIntelligenceTerminalProps {
  kicker?: string;
  heading?: string;
  lead?: string;
  beats?: TerminalBeat[];
  pipeline?: string[];
  onContact?: () => void;
}

const getImageSrc = (photoKey: string, width: number = 800): string => {
  // Use webp format, fallback for avif
  return `/media/${photoKey}-${width}.webp`;
};

export const PolicyIntelligenceTerminal: React.FC<PolicyIntelligenceTerminalProps> = ({
  kicker = 'Built by IP3',
  heading = 'Policy Intelligence Terminal',
  lead = 'A governed execution platform for policy intelligence work. It watches tiered sources, merges what matters into one policy question, and turns it into briefs that show their evidence before anything is published.',
  beats = [
    {
      title: 'Every signal carries its evidence',
      text: 'Live monitoring refreshes every five minutes. Each story arrives with its sources and their tier, the time it was fetched, and the ranking that put it on the board. Decision lenses re-read the same evidence for an executive, a macroeconomist, a development partner, a market analyst, a political economist or an academic.',
      points: ['Tiered, time-stamped sources', 'Transparent ranking explanation', 'Six decision lenses'],
      photoKey: 'terminal-lenses',
    },
    {
      title: 'Many discussions, one policy question',
      text: 'The Merged Policy Discussion Studio connects the day\'s discussions into a single piece of directed research. The analyst sets the perspective, the question and the audience, chooses the discussions to merge, and keeps every source link visible.',
      points: ['Perspective, topic and audience', 'Tensions and second-order effects', 'A sequenced decision agenda'],
      photoKey: 'terminal-studio',
    },
    {
      title: 'Modules built for IP3\'s missions',
      text: 'MERLA, climate and ESG, and GovTech are native modules, not add-ons: outcome and milestone tracking with adaptive learning memos, adaptation finance and transition-risk maps, and digital public service maturity with reform roadmaps.',
      points: ['MERLA board and scorecards', 'Climate finance and ESG notes', 'GovTech diagnostics and roadmaps'],
      photoKey: 'terminal-modules',
    },
    {
      title: 'Briefs that show their working',
      text: 'The Brief Factory turns a story, the daily top ten or a fortnightly period into a brief. The original model draft, the refined policy brief, the evidence, each claim and its verification sit side by side before export.',
      points: ['Story, daily and periodical briefs', 'Claims checked against evidence', 'Export only after verification'],
      photoKey: 'terminal-briefs',
    },
  ],
  pipeline = ['Signals', 'Discussions', 'Deep research', 'Decision lenses', 'Brief', 'Verify and export'],
  onContact = () => {},
}) => {
  const [activeBeat, setActiveBeat] = useState(0);

  return (
    <section className="relative py-16 lg:py-24 bg-[#050a12] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 lg:mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#ff7e67] mb-4">
            {kicker}
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 max-w-3xl">
            {heading}
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
            {lead}
          </p>
        </div>

        {/* Beats Navigation and Content */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          {/* Navigation */}
          <div className="lg:col-span-5">
            <nav className="space-y-3 sticky top-20">
              {beats.map((beat, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveBeat(idx)}
                  className={`block w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeBeat === idx
                      ? 'bg-[#ff7e67]/20 border-l-2 border-[#ff7e67] text-white'
                      : 'text-slate-400 hover:text-white border-l-2 border-transparent hover:border-slate-600'
                  }`}
                >
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#ff7e67] block mb-1">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="font-semibold text-sm">{beat.title}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Active Beat Content */}
          {beats[activeBeat] && (
            <div className="lg:col-span-7 animate-fadeIn">
              {/* Beat Text Content */}
              <div className="mb-8">
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                  {beats[activeBeat].title}
                </h3>
                <p className="text-slate-300 leading-relaxed mb-6">
                  {beats[activeBeat].text}
                </p>

                {/* Beat Points */}
                {beats[activeBeat].points.length > 0 && (
                  <ul className="space-y-3">
                    {beats[activeBeat].points.map((point, idx) => (
                      <li key={idx} className="flex gap-3 text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff7e67] mt-2 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Beat Image */}
              <div className="rounded-lg overflow-hidden bg-slate-900 aspect-video border border-slate-800">
                <img
                  src={getImageSrc(beats[activeBeat].photoKey, 800)}
                  srcSet={`${getImageSrc(beats[activeBeat].photoKey, 800)} 800w, ${getImageSrc(beats[activeBeat].photoKey, 1600)} 1600w`}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  alt={beats[activeBeat].title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Pipeline */}
        {pipeline.length > 0 && (
          <div className="mt-16 pt-16 border-t border-slate-800">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-8">
              From signal to verified brief:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {pipeline.map((step, idx) => (
                <div key={idx} className="flex flex-col items-start">
                  <div className="w-8 h-8 rounded-full border-2 border-[#ff7e67]/30 bg-[#ff7e67]/5 flex items-center justify-center mb-3">
                    <span className="text-xs font-semibold text-[#ff7e67]">{idx + 1}</span>
                  </div>
                  <p className="text-sm text-slate-300 font-medium">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 pt-12 flex items-center gap-4">
          <button
            onClick={onContact}
            className="px-6 py-3 bg-[#ff7e67] hover:bg-[#ff9d8c] text-[#050a12] font-semibold rounded-lg transition-colors"
          >
            Ask for a demonstration
          </button>
          <p className="text-sm text-slate-400">
            or email <a href="mailto:hello@ip3.global" className="text-[#ff7e67] hover:text-[#ff9d8c]">hello@ip3.global</a>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};
