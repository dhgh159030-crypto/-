import React, { useState, useEffect } from 'react';
import {
  Language,
  LatteArtPhoto,
  CafeVisit,
  FoodPhoto,
  ProfileInfo,
  HeroPhotoInfo,
  CoffeeSectionContent,
  FoodOverviewContent,
  isVideoMedia,
} from './types';
import { translations } from './i18n/translations';
import {
  initialLatteArtPhotos,
  initialCafeVisits,
  initialFoodPhotos,
  initialCoffeeContentJa,
  initialCoffeeContentKo,
  initialFoodOverviewJa,
  initialFoodOverviewKo,
} from './data/initialData';
import { Header } from './components/Header';
import { HomeSection } from './components/HomeSection';
import { AboutSection } from './components/AboutSection';
import { CoffeeSection } from './components/CoffeeSection';
import { LatteArtSection } from './components/LatteArtSection';
import { FoodSection } from './components/FoodSection';
import { ExperienceSection } from './components/ExperienceSection';
import { ValuesSection } from './components/ValuesSection';
import { ContactSection } from './components/ContactSection';
import { LightboxModal } from './components/LightboxModal';
import { PhotoManagerModal } from './components/PhotoManagerModal';
import { AdminModal } from './components/AdminModal';

const defaultProfileInfo: ProfileInfo = {
  name: 'HAN DAHOON',
  email: 'dhgh159030@gmail.com',
  instagram: '@dahoon_coffee_food (準備中)',
  location: '日本国内（東京 / 近郊 / 関西等、柔軟に対応可能です）',
};

export default function App() {
  // Default language: Japanese ('ja')
  const [currentLang, setCurrentLang] = useState<Language>('ja');
  const [activeSection, setActiveSection] = useState<string>('home');

  // Admin authentication state (Password: 1590)
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('dahoon_is_admin') === 'true';
    } catch {
      return false;
    }
  });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Photo & Data states with LocalStorage persistence
  const [lattePhotos, setLattePhotos] = useState<LatteArtPhoto[]>(() => {
    try {
      const saved = localStorage.getItem('dahoon_latte_photos');
      return saved ? JSON.parse(saved) : initialLatteArtPhotos;
    } catch {
      return initialLatteArtPhotos;
    }
  });

  // Home Hero Photo state (customizable independently or synced from latte photos)
  const [heroPhoto, setHeroPhoto] = useState<HeroPhotoInfo>(() => {
    try {
      const saved = localStorage.getItem('dahoon_hero_photo');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    const defaultItem = initialLatteArtPhotos[0];
    return {
      imageUrl: defaultItem.imageUrl,
      title: defaultItem.title,
      type: defaultItem.type || 'Swan Free Pour',
      description: defaultItem.description,
    };
  });

  const [cafeVisits, setCafeVisits] = useState<CafeVisit[]>(() => {
    try {
      const saved = localStorage.getItem('dahoon_cafe_visits');
      return saved ? JSON.parse(saved) : initialCafeVisits;
    } catch {
      return initialCafeVisits;
    }
  });

  const [foodPhotos, setFoodPhotos] = useState<FoodPhoto[]>(() => {
    try {
      const saved = localStorage.getItem('dahoon_food_photos');
      return saved ? JSON.parse(saved) : initialFoodPhotos;
    } catch {
      return initialFoodPhotos;
    }
  });

  const [handDripPhotoUrl, setHandDripPhotoUrl] = useState<string | null>(() => {
    try {
      return localStorage.getItem('dahoon_hand_drip_photo');
    } catch {
      return null;
    }
  });

  const [profileInfo, setProfileInfo] = useState<ProfileInfo>(() => {
    try {
      const saved = localStorage.getItem('dahoon_profile_info');
      return saved ? JSON.parse(saved) : defaultProfileInfo;
    } catch {
      return defaultProfileInfo;
    }
  });

  // Coffee 1~4 Explanations content (with language support)
  const [coffeeContentJa, setCoffeeContentJa] = useState<CoffeeSectionContent>(() => {
    try {
      const saved = localStorage.getItem('dahoon_coffee_content_ja');
      return saved ? JSON.parse(saved) : initialCoffeeContentJa;
    } catch {
      return initialCoffeeContentJa;
    }
  });

  const [coffeeContentKo, setCoffeeContentKo] = useState<CoffeeSectionContent>(() => {
    try {
      const saved = localStorage.getItem('dahoon_coffee_content_ko');
      return saved ? JSON.parse(saved) : initialCoffeeContentKo;
    } catch {
      return initialCoffeeContentKo;
    }
  });

  const currentCoffeeContent =
    currentLang === 'ko' ? coffeeContentKo : coffeeContentJa;

  const handleUpdateCoffeeContent = (newContent: CoffeeSectionContent) => {
    if (currentLang === 'ko') {
      setCoffeeContentKo(newContent);
      try {
        localStorage.setItem('dahoon_coffee_content_ko', JSON.stringify(newContent));
      } catch {}
    } else {
      setCoffeeContentJa(newContent);
      try {
        localStorage.setItem('dahoon_coffee_content_ja', JSON.stringify(newContent));
      } catch {}
    }
  };

  const handleResetCoffeeContent = () => {
    if (currentLang === 'ko') {
      setCoffeeContentKo(initialCoffeeContentKo);
      try {
        localStorage.removeItem('dahoon_coffee_content_ko');
      } catch {}
    } else {
      setCoffeeContentJa(initialCoffeeContentJa);
      try {
        localStorage.removeItem('dahoon_coffee_content_ja');
      } catch {}
    }
  };

  // Food Overview content (with language support)
  const [foodOverviewJa, setFoodOverviewJa] = useState<FoodOverviewContent>(() => {
    try {
      const saved = localStorage.getItem('dahoon_food_overview_ja');
      return saved ? JSON.parse(saved) : initialFoodOverviewJa;
    } catch {
      return initialFoodOverviewJa;
    }
  });

  const [foodOverviewKo, setFoodOverviewKo] = useState<FoodOverviewContent>(() => {
    try {
      const saved = localStorage.getItem('dahoon_food_overview_ko');
      return saved ? JSON.parse(saved) : initialFoodOverviewKo;
    } catch {
      return initialFoodOverviewKo;
    }
  });

  const currentFoodOverview =
    currentLang === 'ko' ? foodOverviewKo : foodOverviewJa;

  const handleUpdateFoodOverview = (newOverview: FoodOverviewContent) => {
    if (currentLang === 'ko') {
      setFoodOverviewKo(newOverview);
      try {
        localStorage.setItem('dahoon_food_overview_ko', JSON.stringify(newOverview));
      } catch {}
    } else {
      setFoodOverviewJa(newOverview);
      try {
        localStorage.setItem('dahoon_food_overview_ja', JSON.stringify(newOverview));
      } catch {}
    }
  };

  const handleResetFoodOverview = () => {
    if (currentLang === 'ko') {
      setFoodOverviewKo(initialFoodOverviewKo);
      try {
        localStorage.removeItem('dahoon_food_overview_ko');
      } catch {}
    } else {
      setFoodOverviewJa(initialFoodOverviewJa);
      try {
        localStorage.removeItem('dahoon_food_overview_ja');
      } catch {}
    }
  };

  // Modals state
  const [selectedPhoto, setSelectedPhoto] = useState<LatteArtPhoto | null>(null);
  const [isPhotoManagerOpen, setIsPhotoManagerOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('dahoon_latte_photos', JSON.stringify(lattePhotos));
    } catch {}
  }, [lattePhotos]);

  useEffect(() => {
    try {
      localStorage.setItem('dahoon_hero_photo', JSON.stringify(heroPhoto));
    } catch {}
  }, [heroPhoto]);

  useEffect(() => {
    try {
      localStorage.setItem('dahoon_cafe_visits', JSON.stringify(cafeVisits));
    } catch {}
  }, [cafeVisits]);

  useEffect(() => {
    try {
      localStorage.setItem('dahoon_food_photos', JSON.stringify(foodPhotos));
    } catch {}
  }, [foodPhotos]);

  useEffect(() => {
    try {
      localStorage.setItem('dahoon_profile_info', JSON.stringify(profileInfo));
    } catch {}
  }, [profileInfo]);

  useEffect(() => {
    try {
      if (handDripPhotoUrl) {
        localStorage.setItem('dahoon_hand_drip_photo', handDripPhotoUrl);
      } else {
        localStorage.removeItem('dahoon_hand_drip_photo');
      }
    } catch {}
  }, [handDripPhotoUrl]);

  // Admin session handling
  const handleAdminLogin = () => {
    setIsAdmin(true);
    try {
      sessionStorage.setItem('dahoon_is_admin', 'true');
    } catch {}
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    try {
      sessionStorage.removeItem('dahoon_is_admin');
    } catch {}
  };

  const handleResetAllData = () => {
    if (
      confirm(
        currentLang === 'ja'
          ? 'すべての登録データ（写真・記録・説明文）を初期化しますか？'
          : '모든 등록 데이터(사진, 기록, 설명문)를 초기화하시겠습니까?'
      )
    ) {
      setLattePhotos(initialLatteArtPhotos);
      setHeroPhoto({
        imageUrl: initialLatteArtPhotos[0].imageUrl,
        title: initialLatteArtPhotos[0].title,
        type: initialLatteArtPhotos[0].type || 'Swan Free Pour',
        description: initialLatteArtPhotos[0].description,
      });
      setCafeVisits(initialCafeVisits);
      setFoodPhotos(initialFoodPhotos);
      setHandDripPhotoUrl(null);
      setProfileInfo(defaultProfileInfo);
      setCoffeeContentJa(initialCoffeeContentJa);
      setCoffeeContentKo(initialCoffeeContentKo);
      setFoodOverviewJa(initialFoodOverviewJa);
      setFoodOverviewKo(initialFoodOverviewKo);

      try {
        localStorage.removeItem('dahoon_latte_photos');
        localStorage.removeItem('dahoon_hero_photo');
        localStorage.removeItem('dahoon_cafe_visits');
        localStorage.removeItem('dahoon_food_photos');
        localStorage.removeItem('dahoon_hand_drip_photo');
        localStorage.removeItem('dahoon_profile_info');
        localStorage.removeItem('dahoon_coffee_content_ja');
        localStorage.removeItem('dahoon_coffee_content_ko');
        localStorage.removeItem('dahoon_food_overview_ja');
        localStorage.removeItem('dahoon_food_overview_ko');
      } catch {}
    }
  };

  // Scrollspy for navigation active item
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'home',
        'about',
        'coffee',
        'latte-art',
        'food',
        'experience',
        'values',
        'contact',
      ];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUpdateLattePhotos = (newPhotos: LatteArtPhoto[]) => {
    setLattePhotos(newPhotos);
  };

  const handleResetDefaultPhotos = () => {
    setLattePhotos(initialLatteArtPhotos);
    localStorage.removeItem('dahoon_latte_photos');
  };

  const handleAddCafeVisit = (newVisit: Omit<CafeVisit, 'id'>) => {
    const visit: CafeVisit = {
      ...newVisit,
      id: `visit-${Date.now()}`,
    };
    setCafeVisits([visit, ...cafeVisits]);
  };

  // Dishes handlers
  const handleUploadFoodPhoto = (
    id: string,
    url: string,
    mediaType?: 'image' | 'video'
  ) => {
    setFoodPhotos((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              imageUrl: url,
              mediaType: mediaType || (isVideoMedia(url) ? 'video' : 'image'),
            }
          : item
      )
    );
  };

  const handleAddFoodPhoto = (dish: FoodPhoto) => {
    setFoodPhotos((prev) => [dish, ...prev]);
  };

  const handleUpdateFoodPhoto = (updatedDish: FoodPhoto) => {
    setFoodPhotos((prev) =>
      prev.map((d) => (d.id === updatedDish.id ? updatedDish : d))
    );
  };

  const handleDeleteFoodPhoto = (id: string) => {
    setFoodPhotos((prev) => prev.filter((d) => d.id !== id));
  };

  const t = translations[currentLang];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2C2926] font-sans-jp flex flex-col selection:bg-[#E4DED4] selection:text-[#1F1E1D]">
      {/* Top Header with Language Switcher and Admin Trigger */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        activeSection={activeSection}
        isAdmin={isAdmin}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Home Section with customizable hero photo / video */}
        <HomeSection
          currentLang={currentLang}
          heroPhoto={heroPhoto}
          onOpenPhoto={setSelectedPhoto}
          isAdmin={isAdmin}
          onChangeHeroPhoto={(url, mediaType) =>
            setHeroPhoto((prev) => ({
              ...prev,
              imageUrl: url,
              mediaType: mediaType || (isVideoMedia(url) ? 'video' : 'image'),
            }))
          }
          onOpenAdmin={() => setIsAdminModalOpen(true)}
        />

        {/* 2. About Section */}
        <AboutSection currentLang={currentLang} />

        {/* 3. Coffee Section (with customizable 1~4 explanations) */}
        <CoffeeSection
          currentLang={currentLang}
          cafeVisits={cafeVisits}
          onAddCafeVisit={handleAddCafeVisit}
          handDripPhotoUrl={handDripPhotoUrl}
          onUploadHandDripPhoto={setHandDripPhotoUrl}
          coffeeContent={currentCoffeeContent}
          onUpdateCoffeeContent={handleUpdateCoffeeContent}
          onResetCoffeeContent={handleResetCoffeeContent}
          isAdmin={isAdmin}
          onOpenAdmin={() => setIsAdminModalOpen(true)}
        />

        {/* 4. Latte Art Section */}
        <LatteArtSection
          currentLang={currentLang}
          photos={lattePhotos}
          onOpenPhoto={setSelectedPhoto}
          onOpenManager={() => setIsAdminModalOpen(true)}
        />

        {/* 5. Food Section (with customizable dishes portfolio and role overview) */}
        <FoodSection
          currentLang={currentLang}
          foodPhotos={foodPhotos}
          onUploadFoodPhoto={handleUploadFoodPhoto}
          onAddFoodPhoto={handleAddFoodPhoto}
          onUpdateFoodPhoto={handleUpdateFoodPhoto}
          onDeleteFoodPhoto={handleDeleteFoodPhoto}
          foodOverview={currentFoodOverview}
          onUpdateFoodOverview={handleUpdateFoodOverview}
          onResetFoodOverview={handleResetFoodOverview}
          isAdmin={isAdmin}
          onOpenAdmin={() => setIsAdminModalOpen(true)}
          onOpenPhoto={setSelectedPhoto}
        />

        {/* 6. Experience Timeline */}
        <ExperienceSection currentLang={currentLang} />

        {/* 7. What I Value */}
        <ValuesSection currentLang={currentLang} />

        {/* 8. Contact Section */}
        <ContactSection
          currentLang={currentLang}
          profileInfo={profileInfo}
        />
      </main>

      {/* Lightbox Modal for enlarged view */}
      <LightboxModal
        currentLang={currentLang}
        photo={selectedPhoto}
        photos={lattePhotos}
        onClose={() => setSelectedPhoto(null)}
        onSelectPhoto={setSelectedPhoto}
      />

      {/* Legacy Photo Manager Modal */}
      <PhotoManagerModal
        currentLang={currentLang}
        photos={lattePhotos}
        isOpen={isPhotoManagerOpen}
        onClose={() => setIsPhotoManagerOpen(false)}
        onUpdatePhotos={handleUpdateLattePhotos}
        onResetDefault={handleResetDefaultPhotos}
      />

      {/* Admin Panel Modal (Password: 1590) */}
      <AdminModal
        currentLang={currentLang}
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        isAdmin={isAdmin}
        onLogin={handleAdminLogin}
        onLogout={handleAdminLogout}
        heroPhoto={heroPhoto}
        onUpdateHeroPhoto={setHeroPhoto}
        lattePhotos={lattePhotos}
        onUpdateLattePhotos={handleUpdateLattePhotos}
        cafeVisits={cafeVisits}
        onUpdateCafeVisits={setCafeVisits}
        foodPhotos={foodPhotos}
        onUpdateFoodPhotos={setFoodPhotos}
        onAddFoodPhoto={handleAddFoodPhoto}
        onDeleteFoodPhoto={handleDeleteFoodPhoto}
        handDripPhotoUrl={handDripPhotoUrl}
        onUpdateHandDripPhoto={setHandDripPhotoUrl}
        coffeeContent={currentCoffeeContent}
        onUpdateCoffeeContent={handleUpdateCoffeeContent}
        onResetCoffeeContent={handleResetCoffeeContent}
        foodOverview={currentFoodOverview}
        onUpdateFoodOverview={handleUpdateFoodOverview}
        onResetFoodOverview={handleResetFoodOverview}
        profileInfo={profileInfo}
        onUpdateProfileInfo={setProfileInfo}
        onResetAllData={handleResetAllData}
      />

      {/* Quiet, Respectful Footer */}
      <footer className="border-t border-[#EAE4D9] py-10 bg-[#FAF8F5] text-xs text-[#857F74]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-2">
          <p className="font-serif-jp text-sm text-[#4E483F]">
            {t.footer.text}
          </p>
          <p className="text-[11px] text-[#938C80] font-serif-jp italic">
            「{t.footer.quote}」
          </p>
          <div className="pt-2 flex items-center justify-center gap-3 text-[11px] text-[#A69F93]">
            <span>© {new Date().getFullYear()} {profileInfo.name}. All Rights Reserved.</span>
            <span>·</span>
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="hover:text-[#4A453E] underline cursor-pointer"
            >
              管理者メニュー (Admin)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
