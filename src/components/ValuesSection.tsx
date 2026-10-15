import React from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface ValuesSectionProps {
  currentLang: Language;
}

export const ValuesSection: React.FC<ValuesSectionProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  return (
    <section id="values" className="py-20 md:py-28 border-b border-[#EDE8DF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-14 sm:mb-18">
          <p className="text-xs tracking-[0.2em] text-[#8F887C] uppercase font-sans-jp mb-2">
            Values & Mindset
          </p>
          <h2 className="text-2xl sm:text-3xl font-serif-jp text-[#1C1A19] font-normal tracking-wide">
            {t.values.title}
          </h2>
          <p className="text-sm text-[#736D64] mt-2 max-w-xl">
            {t.values.subtitle}
          </p>
          <div className="w-12 h-[1px] bg-[#B0A799] mt-4" />
        </div>

        {/* 4 Core Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
          {t.values.items.map((val, idx) => (
            <div
              key={val.title}
              className="bg-[#FAF8F5] border border-[#E8E2D8] rounded-lg p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs text-[#9E978C] font-mono tracking-widest block mb-2">
                  0{idx + 1}
                </span>
                <h3 className="text-lg sm:text-xl font-serif-jp text-[#24211E] font-medium mb-3">
                  {val.title}
                </h3>
                <p className="text-sm text-[#544E45] leading-relaxed">
                  {val.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Final Reflective Message */}
        <div className="mt-14 sm:mt-18 p-8 rounded-lg bg-[#F5F0E6] border border-[#E0D7C9] text-center max-w-2xl mx-auto">
          <p className="font-serif-jp text-base sm:text-lg text-[#2E2822] leading-relaxed">
            「{t.values.closing}」
          </p>
        </div>
      </div>
    </section>
  );
};
