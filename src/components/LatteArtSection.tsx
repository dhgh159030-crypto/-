import React from 'react';
import { Language, LatteArtPhoto, isVideoMedia } from '../types';
import { translations } from '../i18n/translations';
import { Eye, Plus, Edit2, Play } from 'lucide-react';

interface LatteArtSectionProps {
  currentLang: Language;
  photos: LatteArtPhoto[];
  onOpenPhoto: (photo: LatteArtPhoto) => void;
  onOpenManager: () => void;
}

export const LatteArtSection: React.FC<LatteArtSectionProps> = ({
  currentLang,
  photos,
  onOpenPhoto,
  onOpenManager,
}) => {
  const t = translations[currentLang];

  return (
    <section id="latte-art" className="py-20 md:py-28 border-b border-[#EDE8DF]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <p className="text-xs tracking-[0.2em] text-[#8F887C] uppercase font-sans-jp mb-2">
              Latte Art
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif-jp text-[#1C1A19] font-normal tracking-wide">
              {t.latteArt.title}
            </h2>
            <p className="text-sm text-[#736D64] mt-2 max-w-xl">
              {t.latteArt.subtitle}
            </p>
            <div className="w-12 h-[1px] bg-[#B0A799] mt-4" />
          </div>

          <button
            onClick={onOpenManager}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#463F36] bg-[#ECE5DA] hover:bg-[#E2D8CA] rounded transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{t.latteArt.manageBtn}</span>
          </button>
        </div>

        {/* Narrative / Context (Swan focus) */}
        <div className="bg-[#FAF8F5] border border-[#E8E2D8] rounded-lg p-6 sm:p-8 mb-10">
          <p className="text-sm sm:text-[15px] text-[#4E483F] leading-relaxed max-w-3xl">
            {t.latteArt.body}
          </p>
          <p className="text-xs text-[#8A847A] mt-4 italic">
            {t.latteArt.note}
          </p>
        </div>

        {/* 5-Photo Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {photos.map((item, index) => (
            <div
              key={item.id}
              className="group bg-[#FAF8F5] border border-[#E8E2D8] rounded-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-sm"
            >
              {/* Photo / Video Area */}
              <div
                onClick={() => onOpenPhoto(item)}
                className="aspect-square bg-[#F1ECE3] overflow-hidden cursor-pointer relative"
              >
                {isVideoMedia(item.imageUrl, item.mediaType) ? (
                  <video
                    src={item.imageUrl}
                    muted
                    loop
                    playsInline
                    autoPlay
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                )}

                {/* Video Badge */}
                {isVideoMedia(item.imageUrl, item.mediaType) && (
                  <div className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-xs text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 font-mono">
                    <Play className="w-2.5 h-2.5 fill-current" />
                    <span>VIDEO</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-[#241E1A]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs tracking-wider font-sans-jp gap-1.5 z-10">
                  <Eye className="w-4 h-4" />
                  <span>
                    {isVideoMedia(item.imageUrl, item.mediaType)
                      ? currentLang === 'ja'
                        ? '再生'
                        : currentLang === 'ko'
                        ? '재생'
                        : 'Play'
                      : currentLang === 'ja'
                      ? '拡大'
                      : currentLang === 'ko'
                      ? '확대'
                      : 'View'}
                  </span>
                </div>
              </div>

              {/* Photo Caption & Info */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between gap-2 mb-1.5">
                    <h3 className="text-sm font-serif-jp text-[#23201D] font-medium leading-snug">
                      {item.title}
                    </h3>
                    {item.type && (
                      <span className="text-[11px] text-[#8C8477] shrink-0 font-sans-jp">
                        {item.type}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs text-[#635C52] leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>

                {item.date && (
                  <div className="text-[11px] text-[#9E978C] font-mono mt-3 pt-2 border-t border-[#EDE7DD]">
                    {item.date}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
