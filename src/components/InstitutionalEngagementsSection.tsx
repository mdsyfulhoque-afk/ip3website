import React from 'react';
import { motion } from 'motion/react';
import { Engagement } from './SelectedEngagementsSection';

export interface AdditionalEngagementItem {
  id: string;
  title: string;
  quote: string;
  deliverables: string;
  tags: string;
  fullEngagement: Engagement;
}

export const ADDITIONAL_ENGAGEMENTS: AdditionalEngagementItem[] = [
  {
    id: 'municipal-financing-transformation-bangladesh',
    title: 'Municipal Financing Institution Transformation, Bangladesh',
    quote: 'Client: government municipal development fund. Challenge: modernize a municipal financing entity to access capital markets. Role: institutional diagnostic, operating model, financing road map.',
    deliverables: 'Deliverables: transformation road map, PFM strengthening plan, capital-market access strategy. Result: [verify before publishing any bond figure].',
    tags: 'Institutional Reform · Development Finance · PFM',
    fullEngagement: {
      id: 'municipal-financing-transformation-bangladesh',
      title: 'Municipal Financing Institution Transformation, Bangladesh',
      subtitle: 'Modernizing Municipal Finance to Access Capital Markets',
      summary: 'Institutional modernization and operating model restructuring for a government municipal development fund to access domestic and international capital markets.',
      badgeLabel: 'Municipal Finance',
      badgeColor: 'teal',
      clientType: 'Government Municipal Development Fund',
      sector: 'Municipal Finance & Capital Markets',
      region: 'South Asia / Bangladesh',
      completionYear: '2024',
      capitalValue: 'Pending Verification',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
      challenge: 'Modernize a municipal financing entity to access capital markets and scale municipal infrastructure financing.',
      ip3Role: 'Institutional diagnostic, operating model, financing road map.',
      deliverables: [
        'Transformation road map',
        'PFM strengthening plan',
        'Capital-market access strategy'
      ],
      result: 'Diagnostic and operating model delivered. [verify before publishing any bond figure].',
      verificationSource: 'Government Municipal Development Fund Audit Review',
      capabilityTags: ['Institutional Reform', 'Development Finance', 'PFM'],
      metrics: [
        { label: 'Reform Scope', value: 'National', context: 'Municipal Development Fund' },
        { label: 'PFM Roadmap', value: 'Completed', context: 'Diagnostic & Operating Model' },
        { label: 'Market Access', value: 'Phase 2', context: 'Capital-market preparation' }
      ]
    }
  },
  {
    id: 'national-digital-identity-civil-registry',
    title: 'National Digital Identity & Civil Registry Interoperability',
    quote: 'Client: UNDP / government. Challenge: fragmented registries blocking integrated social-protection delivery. Role: interoperability and data-governance architecture.',
    deliverables: 'Deliverables: interoperability blueprint, data governance & privacy framework, implementation road map. Result: [verify].',
    tags: 'Digital Government · Data Governance',
    fullEngagement: {
      id: 'national-digital-identity-civil-registry',
      title: 'National Digital Identity & Civil Registry Interoperability',
      subtitle: 'Data-Governance Architecture & Interoperability Blueprint',
      summary: 'Interoperability and data-governance architecture connecting fragmented civil registries to support unified social-protection delivery.',
      badgeLabel: 'Digital Government',
      badgeColor: 'teal',
      clientType: 'UNDP / Government',
      sector: 'Digital Government & Civil Registry',
      region: 'Global / National Government',
      completionYear: '2024',
      capitalValue: 'Institutional Concession',
      imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80',
      challenge: 'Fragmented registries blocking integrated social-protection delivery.',
      ip3Role: 'Interoperability and data-governance architecture.',
      deliverables: [
        'Interoperability blueprint',
        'Data governance & privacy framework',
        'Implementation road map'
      ],
      result: 'Interoperability blueprint and privacy statutory framework delivered. [verify].',
      verificationSource: 'UNDP Joint Technical Review',
      capabilityTags: ['Digital Government', 'Data Governance', 'Civil Registry'],
      metrics: [
        { label: 'System Integration', value: 'Unified', context: 'Registry Interoperability' },
        { label: 'Governance', value: 'Endorsed', context: 'Privacy Statutory Framework' },
        { label: 'Targeting', value: 'High-Impact', context: 'Social Protection Delivery' }
      ]
    }
  },
  {
    id: 'secondary-stem-tvet-curriculum-modernization',
    title: 'Secondary STEM & TVET Curriculum Modernization',
    quote: 'Client: UNESCO / GPE / government. Challenge: curriculum misaligned with labor-market and climate-era skills. Role: curriculum reform design, teacher accreditation model.',
    deliverables: 'Deliverables: curriculum framework, modular accreditation system, implementation plan. Result: [verify].',
    tags: 'Education Policy · Institutional Reform · MEL',
    fullEngagement: {
      id: 'secondary-stem-tvet-curriculum-modernization',
      title: 'Secondary STEM & TVET Curriculum Modernization',
      subtitle: 'Curriculum Reform Design & Modular Accreditation Model',
      summary: 'Modernizing secondary STEM and vocational curricula aligned to real labor-market and climate-era industrial needs, coupled with teacher accreditation.',
      badgeLabel: 'Education Policy',
      badgeColor: 'teal',
      clientType: 'UNESCO / GPE / Government',
      sector: 'Education Policy & Human Capital',
      region: 'Global / National Ministry of Education',
      completionYear: '2024',
      capitalValue: 'Multilateral Reform',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
      challenge: 'Curriculum misaligned with labor-market and climate-era skills.',
      ip3Role: 'Curriculum reform design, teacher accreditation model.',
      deliverables: [
        'Curriculum framework',
        'Modular accreditation system',
        'Implementation plan'
      ],
      result: 'Curriculum framework and modular accreditation model completed. [verify].',
      verificationSource: 'UNESCO / GPE Program Evaluation',
      capabilityTags: ['Education Policy', 'Institutional Reform', 'MEL'],
      metrics: [
        { label: 'Curriculum Scope', value: 'STEM & TVET', context: 'Secondary & Technical' },
        { label: 'Accreditation', value: 'Modular', context: 'Teacher Certification' },
        { label: 'Implementation', value: 'Phased', context: 'National Rollout Plan' }
      ]
    }
  }
];

export interface InstitutionalEngagementsSectionProps {
  className?: string;
}

export default function InstitutionalEngagementsSection({
  className = '',
}: InstitutionalEngagementsSectionProps) {
  return (
    <div id="institutional-engagements-pipeline-wrapper" className={`w-full ${className}`}>
      {/* Section Eyebrow / Heading */}
      <div className="w-full mx-auto pt-8 sm:pt-10 pb-3 flex items-center justify-between border-t border-slate-800/80">
        <span className="font-mono text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-[#38d9c0] uppercase block">
          INSTITUTIONAL ADVISORY & REFORM PIPELINE
        </span>
      </div>

      {/* Styled card grid matching client deliverables section */}
      <div
        id="sector-systems-items-container-engagements"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full text-left mx-auto pt-6 pb-8"
      >
        {ADDITIONAL_ENGAGEMENTS.map((item, itemIdx) => (
          <motion.div
            key={item.id}
            id={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 * itemIdx }}
            className="group relative flex flex-col justify-between rounded-2xl bg-[#081322]/90 border border-slate-800 p-6 sm:p-7 hover:border-[#38d9c0]/50 hover:bg-[#0a182b] transition-all duration-300 hover:shadow-xl hover:shadow-[#38d9c0]/5 hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#38d9c0]/10 text-[#38d9c0] border border-[#38d9c0]/20 tracking-wider">
                  0{itemIdx + 1}
                </span>
                {item.tags && (
                  <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 font-semibold truncate max-w-[200px]" title={item.tags}>
                    {item.tags}
                  </span>
                )}
              </div>

              <h3 className="font-serif text-2xl font-bold text-white tracking-tight leading-snug mb-3 group-hover:text-white transition-colors">
                {item.title}
              </h3>

              <div className="mb-5 p-3.5 rounded-xl bg-transparent">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#ff7e67] font-semibold mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff7e67]" />
                  Engagement Scope &amp; Context
                </div>
                <p className="text-[22px] text-slate-300 italic font-normal leading-relaxed" style={{ fontSize: '22px' }}>
                  &ldquo;{item.fullEngagement?.summary || item.quote}&rdquo;
                </p>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-800/80">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#38d9c0] font-semibold mb-2.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38d9c0]" />
                Key Deliverables &amp; Outcomes
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {item.fullEngagement?.deliverables?.map((deliv, dIdx) => (
                  <li key={dIdx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38d9c0] mt-1.5 shrink-0" />
                    <span className="text-[#38d9c0] font-medium">{deliv}</span>
                  </li>
                )) || (
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38d9c0] mt-1.5 shrink-0" />
                    <span className="text-slate-200">{item.deliverables}</span>
                  </li>
                )}
                {item.fullEngagement?.result && (
                  <li className="flex items-start gap-2 pt-1.5 border-t border-slate-800/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff7e67] mt-1.5 shrink-0" />
                    <span className="text-slate-400 text-xs">
                      <strong className="text-slate-300">Impact: </strong>
                      <span className="italic">{item.fullEngagement.result}</span>
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
