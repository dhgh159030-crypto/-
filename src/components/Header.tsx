import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activeSection: string;
  isAdmin: boolean;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  activeSection,
  isAdmin,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[currentLang];

  const navItems = [
    { id: 'home', label: t.nav.home },
    { id: 'about', label: t.nav.about },
    { id: 'coffee', label: t.nav.coffee },
    { id: 'latte-art', label: t.nav.latteArt },
    { id: 'food', label: t.nav.food },
    { id: 'experience', label: t.nav.experience },
    { id: 'values', label: t.nav.values },
    { id: 'contact', label: t.nav.contact },
  ];

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/92 backdrop-blur-md border-b border-[#EBE6DD] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand / Name */}
        <button
          onClick={() => scrollToSection('home')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="font-serif-jp text-lg tracking-wider text-[#1F1E1D] group-hover:text-[#614E3C] transition-colors">
            HAN DAHOON
          </span>
          <span className="block text-[11px] text-[#7A746B] tracking-widest font-sans-jp -mt-0.5">
            {t.hero.title}
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-6 text-[13px] text-[#5C564E]">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`py-1 cursor-pointer transition-colors relative ${
                  isActive
                    ? 'text-[#1F1E1D] font-medium'
                    : 'hover:text-[#1F1E1D]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#634832] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Language Switcher and Admin Trigger */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Exact requested format: 日本語 | 한국어 | English */}
            <div className="flex items-center text-xs tracking-wider text-[#736D64]">
              <button
                onClick={() => onLanguageChange('ja')}
                className={`px-1.5 py-0.5 cursor-pointer transition-colors ${
                  currentLang === 'ja'
                    ? 'text-[#1F1E1D] font-semibold underline underline-offset-4 decoration-[#634832]'
                    : 'hover:text-[#1F1E1D]'
                }`}
              >
                日本語
              </button>
              <span className="text-[#C8C2B7] select-none">|</span>
              <button
                onClick={() => onLanguageChange('ko')}
                className={`px-1.5 py-0.5 cursor-pointer transition-colors ${
                  currentLang === 'ko'
                    ? 'text-[#1F1E1D] font-semibold underline underline-offset-4 decoration-[#634832]'
                    : 'hover:text-[#1F1E1D]'
                }`}
              >
                한국어
              </button>
              <span className="text-[#C8C2B7] select-none">|</span>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-1.5 py-0.5 cursor-pointer transition-colors ${
                  currentLang === 'en'
                    ? 'text-[#1F1E1D] font-semibold underline underline-offset-4 decoration-[#634832]'
                    : 'hover:text-[#1F1E1D]'
                }`}
              >
                English
              </button>
            </div>

            {/* Admin Menu Button */}
            <button
              onClick={onOpenAdmin}
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] rounded transition-colors cursor-pointer border ${
                isAdmin
                  ? 'bg-[#5E4735] text-white border-[#5E4735] shadow-xs'
                  : 'bg-[#F2ECE3] hover:bg-[#E6DEC6] text-[#524B43] border-[#DDD5C8]'
              }`}
              title="管理者メニュー (Admin / PW: 1590)"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {currentLang === 'ja'
                  ? '管理者'
                  : currentLang === 'ko'
                  ? '관리자'
                  : 'Admin'}
              </span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-[#4A453E] hover:text-[#1F1E1D] cursor-pointer"
              aria-label="Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] border-b border-[#E5DFD4] px-6 py-4 space-y-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`block w-full text-left py-2 text-sm transition-colors cursor-pointer ${
                activeSection === item.id
                  ? 'text-[#1F1E1D] font-medium'
                  : 'text-[#615B52]'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-[#EAE3D6]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full text-left py-2 text-xs text-[#5E4735] font-medium flex items-center justify-between"
            >
              <span>{currentLang === 'ja' ? '管理者メニュー (Admin)' : currentLang === 'ko' ? '관리자 메뉴 (Admin)' : 'Admin Settings'}</span>
              <span className="text-[10px] text-[#8C8477] font-mono">PW: 1590</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
