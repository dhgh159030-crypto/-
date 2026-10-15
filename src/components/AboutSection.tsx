import React from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface AboutSectionProps {
  currentLang: Language;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  const stories = [
    {
      num: '01',
      heading: t.about.intro1_heading,
      body: t.about.intro1_body,
    },
    {
      num: '02',
      heading: t.about.intro2_heading,
      body: t.about.intro2_body,
    },
    {
      num: '03',
      heading: t.about.intro3_heading,
      body: t.about.intro3_body,
    },
    {
      num: '04',
      heading: t.about.intro4_heading,
      body: t.about.intro4_body,
    },
  ];

  return (
    <section id="about" className="py-20 md:py-28 border-b border-[#EDE8DF]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-14 sm:mb-18">
          <p className="text-xs tracking-[0.2em] text-[#8F887C] uppercase font-sans-jp mb-2">
            About Me
          </p>
          <h2 className="text-2xl sm:text-3xl font-serif-jp text-[#1C1A19] font-normal tracking-wide">
            {t.about.title}
          </h2>
          <div className="w-12 h-[1px] bg-[#B0A799] mt-4" />
        </div>

        {/* Narrative Flow: 4 Chapters */}
        <div className="space-y-12 sm:space-y-16">
          {stories.map((story) => (
            <article key={story.num} className="group">
              <div className="flex items-baseline gap-4 mb-3">
                <span className="text-xs text-[#9E978C] font-mono tracking-widest">
                  {story.num}
                </span>
                <h3 className="text-lg sm:text-xl font-serif-jp text-[#2E2B27] font-medium leading-snug">
                  {story.heading}
                </h3>
              </div>
              <p className="text-sm sm:text-[15px] text-[#544E45] leading-relaxed sm:leading-loose pl-8 border-l border-[#EBE5DB]">
                {story.body}
              </p>
            </article>
          ))}
        </div>

        {/* Closing Thought */}
        <div className="mt-16 sm:mt-20 pt-10 border-t border-[#EDE7DD] text-center">
          <p className="font-serif-jp text-base sm:text-lg text-[#3B362F] italic tracking-wide leading-relaxed">
            「{t.about.closing}」
          </p>
        </div>
      </div>
    </section>
  );
};
