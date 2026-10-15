import React from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface ExperienceSectionProps {
  currentLang: Language;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  currentLang,
}) => {
  const t = translations[currentLang];

  return (
    <section id="experience" className="py-20 md:py-28 border-b border-[#EDE8DF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-14 sm:mb-18">
          <p className="text-xs tracking-[0.2em] text-[#8F887C] uppercase font-sans-jp mb-2">
            Experience & Career
          </p>
          <h2 className="text-2xl sm:text-3xl font-serif-jp text-[#1C1A19] font-normal tracking-wide">
            {t.experience.title}
          </h2>
          <p className="text-sm text-[#736D64] mt-2 max-w-xl">
            {t.experience.subtitle}
          </p>
          <div className="w-12 h-[1px] bg-[#B0A799] mt-4" />
        </div>

        {/* Timeline */}
        <div className="relative pl-6 sm:pl-8 border-l border-[#DED7CB] space-y-12 sm:space-y-14 ml-2 sm:ml-4">
          {t.experience.roles.map((item, idx) => {
            const isCurrent = idx === 0;
            return (
              <div key={item.company} className="relative group">
                {/* Timeline node marker */}
                <div
                  className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full border-2 ${
                    isCurrent
                      ? 'bg-[#634832] border-[#FAF8F5] ring-2 ring-[#634832]/30'
                      : 'bg-[#B0A89C] border-[#FAF8F5]'
                  }`}
                />

                {/* Role Header */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg sm:text-xl font-serif-jp text-[#1F1E1D] font-medium">
                      {item.company}
                    </h3>
                    <span className="text-xs text-[#80796E] font-sans-jp">
                      {item.role}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#8C8476] tracking-wider">
                    {item.period} · {item.part}
                  </span>
                </div>

                {/* Role Description */}
                <p className="text-sm text-[#544E45] leading-relaxed mb-3.5">
                  {item.description}
                </p>

                {/* Practical duties list */}
                <div className="bg-[#FAF8F5] border border-[#E8E2D8] rounded p-4 text-xs text-[#635D53]">
                  <span className="block font-medium text-[#38332C] mb-2 font-serif-jp">
                    {currentLang === 'ja'
                      ? '実際の担当実務：'
                      : currentLang === 'ko'
                      ? '실제 담당 업무:'
                      : 'Hands-on Responsibilities:'}
                  </span>
                  <div className="flex flex-wrap gap-y-1.5 gap-x-3 text-xs text-[#5E584F]">
                    {item.highlights.map((duty, dIdx) => (
                      <React.Fragment key={duty}>
                        <span className="hover:text-[#1F1E1D] transition-colors">
                          {duty}
                        </span>
                        {dIdx < item.highlights.length - 1 && (
                          <span className="text-[#CCC4B6] select-none">·</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
