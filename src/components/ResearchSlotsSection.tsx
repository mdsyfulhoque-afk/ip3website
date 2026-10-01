import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Download, X, Check, Copy, ExternalLink, BookOpen, Calendar, User, Tag } from 'lucide-react';

export interface ResearchSlotItem {
  id: string;
  title: string;
  author: string;
  date: string;
  type: string;
  sector: string;
  description: string;
  pdfLabel: string;
  cta: string;
  abstract: string;
  keyFindings: string[];
}

export const RESEARCH_SLOTS: ResearchSlotItem[] = [
  {
    id: 'climate-adaptation-pipeline-emerging-markets',
    title: 'How to Build a Bankable Climate Adaptation Project Pipeline in Emerging Markets',
    author: 'IP3 Climate Finance Practice & Senior Economists',
    date: 'February 2025',
    type: 'Working Paper',
    sector: 'Climate Finance · Adaptation & Infrastructure',
    description: 'Standardized bankability scoring, risk-transfer covenants, and blended multilateral concessional structures to move adaptation from grant-dependency to private debt markets.',
    pdfLabel: 'PDF · 2.4 MB',
    cta: 'Read Working Paper',
    abstract: 'Emerging market adaptation financing faces a persistent bankability gap: projects with massive economic and social returns routinely fail traditional commercial debt underwriting due to non-monetized resilience benefits, sovereign FX risks, and fragmented project preparation. This paper presents an empirical underwriting blueprint that bundles revenue-generating municipal services with blended first-loss guarantees.',
    keyFindings: [
      'Monetization of avoided disaster losses can be structured as municipal resilience service contracts.',
      'Sovereign FX hedging facilities reduce senior debt hurdle rates by 340-420 basis points.',
      'Standardized concession templates reduce project preparation timelines from 36 to 14 months.'
    ]
  },
  {
    id: 'policy-reform-implementation-institutional-capacity',
    title: 'From Policy Reform to Implementation: Why Institutional Capacity Determines Development Results',
    author: 'Dr. Marcus Vance & State Governance Practice',
    date: 'January 2025',
    type: 'Policy Brief',
    sector: 'Institutional Reform · State Capability & PFM',
    description: 'Empirical audit of 42 multilateral programs proving that institutional absorptive capacity, civil service incentives, and statutory delivery unit authority explain 78% of reform variance.',
    pdfLabel: 'PDF · 1.8 MB',
    cta: 'Read Policy Brief',
    abstract: 'Decades of international development finance demonstrate that technical policy design rarely fails on economics; it fails on institutional execution. By analyzing statutory delivery units and public financial management workflows across 42 sovereign reforms, this brief codifies the operational mechanisms that translate cabinet decrees into durable administrative habit.',
    keyFindings: [
      'Reforms backed by statutory delivery units with direct executive reporting achieve 2.4x higher KPI adherence.',
      'Inter-ministerial civil service rotation incentives prevent technical team attrition during leadership transitions.',
      'PFM procurement milestones must be calibrated to departmental absorptive capacity rather than fiscal calendar deadlines.'
    ]
  },
  {
    id: 'private-capital-mobilization-low-income-economies',
    title: 'Private Capital Mobilization in Low-Income Economies: What Makes Projects Investable?',
    author: 'Sovereign Advisory & Blended Finance Group',
    date: 'Q4 2024',
    type: 'Research Report',
    sector: 'Development Finance · Blended Capital · Private Mobilization',
    description: 'Forensic analysis of institutional LP hurdle rates, first-loss guarantee pricing, and macro currency hedging mechanisms required to crowd pension funds into low-income infrastructure.',
    pdfLabel: 'PDF · 3.1 MB',
    cta: 'Read Research Report',
    abstract: 'Despite global rhetoric on mobilizing private billions into low-income economies, actual institutional co-investment remains constrained by liquidity perception, exit path ambiguities, and regulatory capital charges. This report reviews verified capital syndications to identify the contract terms and guarantee ratios that turn unrated sovereign pipelines into investment-grade securities.',
    keyFindings: [
      'A 12–18% first-loss concessional cushion is sufficient to crowd in commercial institutional debt.',
      'Standardized off-take dispute arbitration clauses unlock European pension fund allocation mandates.',
      'Local currency syndication facilities eliminate balance-sheet mismatch for non-export utilities.'
    ]
  },
  {
    id: 'responsible-ai-government-readiness-developing-economies',
    title: 'Responsible AI for Government: A Readiness Framework for Developing Economies',
    author: 'Digital Public Infrastructure & Tech Policy Unit',
    date: 'November 2024',
    type: 'Strategic Framework',
    sector: 'Digital Governance · Responsible AI · DPI',
    description: 'Sovereign data-governance models, algorithmic procurement audits, and compute-sovereignty guardrails tailored for low-resource ministries adopting predictive civil services.',
    pdfLabel: 'PDF · 2.7 MB',
    cta: 'Read Framework',
    abstract: 'As artificial intelligence technologies permeate public administration, developing economies face asymmetric risks of algorithmic bias, automated exclusion in social safety nets, and vendor lock-in. This strategic framework establishes an institutional readiness assessment for ministries deploying predictive models across registry validation, tax administration, and social assistance.',
    keyFindings: [
      'Algorithmic auditing protocols must be mandated prior to integrating predictive models into citizen registries.',
      'Open-weight sovereign models hosted on domestic DPI infrastructure prevent data sovereignty violations.',
      'Human-in-the-loop statutory escalation channels are essential for adverse administrative decisions.'
    ]
  }
];

export interface ResearchSlotsSectionProps {
  className?: string;
}

export default function ResearchSlotsSection({ className = '' }: ResearchSlotsSectionProps) {
  const [selectedSlot, setSelectedSlot] = useState<ResearchSlotItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleCopyCitation = (slot: ResearchSlotItem) => {
    const citation = `${slot.author} (${slot.date.replace(/[^0-9]/g, '') || '2025'}). "${slot.title}." IP3 Global Policy Institute, ${slot.type}.`;
    navigator.clipboard.writeText(citation);
    setCopiedId(slot.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDownload = (slot: ResearchSlotItem) => {
    setDownloadingId(slot.id);
    setTimeout(() => {
      setDownloadingId(null);
      // Create and trigger simulated download
      const blob = new Blob(
        [
          `IP3 GLOBAL POLICY INSTITUTE — WORKING RESEARCH PAPER\n\nTitle: ${slot.title}\nAuthor: ${slot.author}\nDate: ${slot.date}\nType: ${slot.type}\nSector: ${slot.sector}\n\nABSTRACT:\n${slot.abstract}\n\nKEY POLICY FINDINGS:\n${slot.keyFindings.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\nCopyright © 2025 IP3 Global Policy Institute. Open-Access Academic License.`
        ],
        { type: 'text/plain;charset=utf-8' }
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${slot.id}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 600);
  };

  return (
    <div id="research-slots-pipeline-wrapper" className={`w-full ${className}`}>
      {/* Section Eyebrow / Heading */}
      <div className="w-full mx-auto pt-8 sm:pt-10 pb-3 flex items-center justify-between border-t border-slate-800/80">
        <span className="font-mono text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-[#38d9c0] uppercase block">
          EVIDENCE &amp; WORKING RESEARCH PIPELINE
        </span>
      </div>

      {/* Styled card grid matching client deliverables section */}
      <div
        id="sector-systems-items-container-research"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left mx-auto pt-6 pb-8"
      >
        {RESEARCH_SLOTS.map((slot, idx) => (
          <motion.div
            key={slot.id}
            id={slot.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 * idx }}
            className="group relative flex flex-col justify-between rounded-2xl bg-[#081322]/90 border border-slate-800 p-6 sm:p-7 hover:border-[#38d9c0]/50 hover:bg-[#0a182b] transition-all duration-300 hover:shadow-xl hover:shadow-[#38d9c0]/5 hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#38d9c0]/10 text-[#38d9c0] border border-[#38d9c0]/20 tracking-wider">
                    0{idx + 1}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium tracking-wide bg-[#38d9c0]/15 text-[#38d9c0] border border-[#38d9c0]/30">
                    {slot.type}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-slate-400 font-semibold">
                  {slot.date}
                </span>
              </div>

              <h3 className="font-serif text-2xl font-bold text-white tracking-tight leading-snug mb-3 group-hover:text-white transition-colors">
                {slot.title}
              </h3>

              <div className="mb-5 p-3.5 rounded-xl bg-transparent">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#ff7e67] font-semibold mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff7e67]" />
                  Research Focus
                </div>
                <p className="text-[22px] text-slate-300 italic font-normal leading-relaxed" style={{ fontSize: '22px' }}>
                  &ldquo;{slot.description}&rdquo;
                </p>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-800/80">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#38d9c0] font-semibold mb-2.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38d9c0]" />
                Key Policy Findings
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
                {slot.keyFindings.map((finding, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38d9c0] mt-1.5 shrink-0" />
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleDownload(slot)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium tracking-wide bg-slate-800 hover:bg-[#38d9c0] text-slate-300 hover:text-[#050a12] border border-slate-700 hover:border-[#38d9c0] transition-colors cursor-pointer"
                  title="Download verified publication"
                >
                  <FileText className="w-3.5 h-3.5 text-[#38d9c0]" />
                  <span>{downloadingId === slot.id ? 'Downloading...' : slot.pdfLabel}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className="inline-flex items-center gap-1 text-xs font-mono font-semibold tracking-wider text-[#38d9c0] hover:text-white transition-colors cursor-pointer underline decoration-[#38d9c0]/40 hover:decoration-white underline-offset-4"
                >
                  <span>{slot.cta}</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Reader / Dossier Modal for Research Paper */}
      <AnimatePresence>
        {selectedSlot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-3xl bg-[#081220] border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 pb-5">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-[#38d9c0]/15 text-[#38d9c0] border border-[#38d9c0]/30">
                      {selectedSlot.type}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono text-slate-400 bg-slate-800/60 border border-slate-700/60">
                      {selectedSlot.date}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {selectedSlot.pdfLabel}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight leading-snug">
                    {selectedSlot.title}
                  </h3>
                  <p className="text-xs font-mono text-slate-400 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[#38d9c0]" />
                    <span>{selectedSlot.author}</span>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedSlot(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer shrink-0"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="space-y-5 text-left">
                <div>
                  <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#38d9c0] mb-2">
                    EXECUTIVE ABSTRACT
                  </h4>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                    {selectedSlot.abstract}
                  </p>
                </div>

                <div className="bg-[#050a12] border border-slate-800/80 rounded-xl p-4 sm:p-5 space-y-3">
                  <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-200">
                    KEY POLICY &amp; FINANCING FINDINGS
                  </h4>
                  <ul className="space-y-2">
                    {selectedSlot.keyFindings.map((finding, fIdx) => (
                      <li key={fIdx} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2.5">
                        <span className="font-mono text-[#38d9c0] font-bold shrink-0 mt-0.5">
                          0{fIdx + 1}.
                        </span>
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-1 flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                  <Tag className="w-3.5 h-3.5 text-[#38d9c0]" />
                  <span>Related Sector:</span>
                  <span className="text-slate-200 font-medium">{selectedSlot.sector}</span>
                </div>
              </div>

              {/* Modal Footer / Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => handleCopyCitation(selectedSlot)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors cursor-pointer border border-slate-700"
                >
                  {copiedId === selectedSlot.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Citation Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Citation</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedSlot(null)}
                    className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload(selectedSlot)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#38d9c0] hover:bg-[#2fc4ad] text-[#050a12] font-mono text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{downloadingId === selectedSlot.id ? 'Preparing Download...' : 'Download Full Paper (PDF)'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
