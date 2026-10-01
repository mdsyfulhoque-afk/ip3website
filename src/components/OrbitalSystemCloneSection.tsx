import React from 'react';
import { motion } from 'framer-motion';
import { useCMS, defaultWhyIp3 } from '../context/CMSContext';

export interface OrbitalSystemCloneSectionProps {
  className?: string;
}

export const OrbitalSystemCloneSection: React.FC<OrbitalSystemCloneSectionProps> = ({
  className = '',
}) => {
  const { data } = useCMS();
  const whyIp3 = data?.whyIp3 || defaultWhyIp3;
  const reasons = whyIp3.reasons && whyIp3.reasons.length > 0 ? whyIp3.reasons : defaultWhyIp3.reasons;

  return (
    <section
      id="orbital-system-clone-section"
      className={`relative w-full bg-[#F6F1EA] text-[#1C1917] overflow-hidden border-t border-b border-[#E8DFC8]/60 ${className}`}
    >
      <div className="w-full flex flex-col lg:flex-row items-stretch min-h-[680px] lg:min-h-[760px]">
        {/* Left Column: Authentic Collaborative Image */}
        <div className="w-full lg:w-[40%] xl:w-[38%] relative min-h-[400px] sm:min-h-[480px] lg:min-h-full shrink-0 overflow-hidden bg-[#EAE2D5]">
          <img
            src={whyIp3.imageUrl || '/images/why_ip3_collaboration.jpg'}
            alt={whyIp3.imageAlt || 'Collaborative policy and digital implementation session'}
            loading="lazy"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle gradient vignette on small screens */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent lg:hidden pointer-events-none" />
        </div>

        {/* Right Column: Editorial 4 Reasons Content */}
        <div className="w-full lg:w-[60%] xl:w-[62%] flex flex-col justify-between p-8 sm:p-12 md:p-16 lg:p-16 xl:p-20 relative">
          <div>
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-4 sm:mb-6 flex items-center gap-2"
            >
              <span className="font-mono text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-[#1C1917] uppercase">
                {whyIp3.badge || '02 — WHY IP³'}
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif font-normal text-[#1C1917] tracking-[-0.03em] py-1 overflow-visible w-full text-left max-w-full leading-[1.08] sm:leading-[1.05] mb-10 sm:mb-14"
              style={{ fontSize: 'clamp(2rem, 3.8vw, 3.75rem)' }}
            >
              <span className="block whitespace-normal sm:whitespace-nowrap text-[#1C1917]">
                {whyIp3.titlePrefix === 'FOUR REASONS CLIENTS' || !whyIp3.titlePrefix
                  ? 'Four reasons clients'
                  : whyIp3.titlePrefix}
              </span>
              <span className="block italic whitespace-normal sm:whitespace-nowrap text-[#1C1917]">
                choose{' '}
                <span className="text-[#8B3A2A]">
                  {whyIp3.titleHighlight === 'choose us' || !whyIp3.titleHighlight
                    ? 'us.'
                    : whyIp3.titleHighlight}
                </span>
              </span>
            </motion.h2>

            {/* 2x2 Grid of Reasons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-8 sm:gap-y-10 lg:gap-y-12">
              {reasons.map((item, index) => (
                <motion.div
                  key={item.id}
                  id={`reason-item-${item.number}`}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 + index * 0.08 }}
                  className="flex items-start gap-4 sm:gap-4.5"
                >
                  {/* Terracotta Number Badge */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-md bg-[#C25337] text-white flex items-center justify-center font-mono text-xs sm:text-[13px] font-bold shrink-0 shadow-sm mt-0.5 select-none">
                    {item.number}
                  </div>

                  {/* Title & Description */}
                  <div className="flex-1">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1C1917] leading-snug tracking-tight">
                      {item.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-[13px] lg:text-[14px] text-[#5C524B] leading-relaxed mt-2 sm:mt-2.5 font-normal">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom Folio / Page Marker (as shown in reference image bottom right) */}
          <div className="pt-10 sm:pt-12 flex justify-end items-center">
            <span className="font-mono text-xs text-[#8A7E75] tracking-widest select-none">
              04
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrbitalSystemCloneSection;
