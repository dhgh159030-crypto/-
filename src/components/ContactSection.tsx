import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { Mail, Copy, Check, Instagram, Globe, MapPin } from 'lucide-react';

import { ProfileInfo } from '../types';

interface ContactSectionProps {
  currentLang: Language;
  profileInfo?: ProfileInfo;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  currentLang,
  profileInfo,
}) => {
  const t = translations[currentLang];
  const [copied, setCopied] = useState(false);

  const currentEmail = profileInfo?.email || t.contact.emailValue;
  const currentName = profileInfo?.name || t.contact.name;
  const currentLocation = profileInfo?.location || t.contact.locationValue;
  const currentInstagram = profileInfo?.instagram || t.contact.instagramPlaceholder;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(currentEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-xs tracking-[0.2em] text-[#8F887C] uppercase font-sans-jp mb-2">
            Contact
          </p>
          <h2 className="text-2xl sm:text-3xl font-serif-jp text-[#1C1A19] font-normal tracking-wide">
            {t.contact.title}
          </h2>
          <p className="text-sm text-[#736D64] mt-2">
            {t.contact.subtitle}
          </p>
          <div className="w-12 h-[1px] bg-[#B0A799] mx-auto mt-4" />
        </div>

        {/* Contact Card */}
        <div className="bg-[#FAF8F5] border border-[#E8E2D8] rounded-lg p-8 sm:p-10 mb-12">
          {/* Identity info */}
          <div className="text-center pb-8 border-b border-[#EAE3D6] space-y-2">
            <h3 className="text-2xl font-serif-jp text-[#1C1A19]">
              {currentName}
            </h3>
            <p className="text-sm text-[#665F55] font-serif-jp tracking-wider">
              {t.contact.titleText}
            </p>
            <p className="text-xs text-[#8C8477] tracking-widest font-sans-jp pt-1">
              {t.contact.skillsText}
            </p>
          </div>

          {/* Contact Details */}
          <div className="pt-8 space-y-6 text-sm">
            {/* Email */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 bg-white border border-[#DDD6CA] rounded">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#87664B] shrink-0" />
                <div>
                  <span className="block text-[11px] text-[#8F877B]">
                    {t.contact.emailLabel}
                  </span>
                  <a
                    href={`mailto:${currentEmail}`}
                    className="text-sm text-[#262421] font-mono hover:underline"
                  >
                    {currentEmail}
                  </a>
                </div>
              </div>
              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#524B43] hover:text-[#1F1E1D] bg-[#F2EDE4] hover:bg-[#E8E1D4] rounded cursor-pointer transition-colors self-start sm:self-auto"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.contact.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t.contact.copyEmail}</span>
                  </>
                )}
              </button>
            </div>

            {/* Location Preference */}
            <div className="flex items-start gap-3 p-3.5 bg-white border border-[#DDD6CA] rounded">
              <MapPin className="w-4 h-4 text-[#87664B] shrink-0 mt-0.5" />
              <div>
                <span className="block text-[11px] text-[#8F877B]">
                  {t.contact.locationLabel}
                </span>
                <span className="text-sm text-[#38332C]">
                  {currentLocation}
                </span>
              </div>
            </div>

            {/* Instagram */}
            <div className="flex items-center gap-3 p-3.5 bg-white border border-[#DDD6CA] rounded">
              <Instagram className="w-4 h-4 text-[#87664B] shrink-0" />
              <div>
                <span className="block text-[11px] text-[#8F877B]">
                  {t.contact.instagramLabel}
                </span>
                <span className="text-sm text-[#615B52] font-mono">
                  {currentInstagram}
                </span>
              </div>
            </div>
          </div>

          {/* Sincere note to employers */}
          <p className="text-xs text-[#70695E] leading-relaxed pt-8 mt-6 border-t border-[#EAE3D6] text-center">
            {t.contact.note}
          </p>
        </div>

        {/* Section 13 Final Sincere Statement */}
        <div className="text-center text-xs sm:text-sm text-[#666056] leading-relaxed font-serif-jp space-y-2 border-t border-[#EDE8DF] pt-12">
          {currentLang === 'ja' ? (
            <>
              <p>コーヒーが好きで始まり、実際にコーヒーを淹れる現場を経験しました。</p>
              <p>その歩みの中で、料理とサービスの現場での実践力も培ってきました。</p>
              <p>今も厨房の現場で学びながら、日々の暮らしの中でもコーヒーと向き合い続けています。</p>
              <p className="text-[#36312B] font-medium pt-2">
                まだ学ぶべきことは多くありますが、好きな仕事をより深めるため、誠実に学び成長し続けます。
              </p>
            </>
          ) : currentLang === 'ko' ? (
            <>
              <p>커피를 좋아해서 시작했고, 실제로 커피를 만드는 일을 경험했습니다.</p>
              <p>그 과정에서 음식과 서비스 현장의 경험도 함께 쌓았습니다.</p>
              <p>지금도 현장에서 일하며 배우고 있고, 일상에서도 커피를 계속 경험하고 있습니다.</p>
              <p className="text-[#36312B] font-medium pt-2">
                아직 배워야 할 것이 많지만, 좋아하는 일을 더 잘하기 위해 꾸준히 배우고 성장하고 싶습니다.
              </p>
            </>
          ) : (
            <>
              <p>Starting from a genuine love for coffee, I learned through hands-on barista practice.</p>
              <p>Along the way, I also built real culinary and hospitality skills on the floor.</p>
              <p>Currently working in the kitchen and continuing my coffee journey daily.</p>
              <p className="text-[#36312B] font-medium pt-2">
                With much still to learn, I am dedicated to growing steadily in what I love.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
