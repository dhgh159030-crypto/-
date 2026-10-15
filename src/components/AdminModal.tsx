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
} from '../types';
import {
  X,
  Lock,
  Unlock,
  Upload,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  Coffee,
  Utensils,
  Download,
  FileText,
  User,
  Image as ImageIcon,
  Edit3,
  Calendar,
  Flame,
  Video as VideoIcon,
} from 'lucide-react';

interface AdminModalProps {
  currentLang: Language;
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  onLogin: () => void;
  onLogout: () => void;
  heroPhoto: HeroPhotoInfo;
  onUpdateHeroPhoto: (photo: HeroPhotoInfo) => void;
  lattePhotos: LatteArtPhoto[];
  onUpdateLattePhotos: (photos: LatteArtPhoto[]) => void;
  cafeVisits: CafeVisit[];
  onUpdateCafeVisits: (visits: CafeVisit[]) => void;
  foodPhotos: FoodPhoto[];
  onUpdateFoodPhotos: (photos: FoodPhoto[]) => void;
  onAddFoodPhoto: (photo: FoodPhoto) => void;
  onDeleteFoodPhoto: (id: string) => void;
  handDripPhotoUrl: string | null;
  onUpdateHandDripPhoto: (url: string | null) => void;
  coffeeContent: CoffeeSectionContent;
  onUpdateCoffeeContent: (content: CoffeeSectionContent) => void;
  onResetCoffeeContent: () => void;
  foodOverview: FoodOverviewContent;
  onUpdateFoodOverview: (overview: FoodOverviewContent) => void;
  onResetFoodOverview: () => void;
  profileInfo: ProfileInfo;
  onUpdateProfileInfo: (info: ProfileInfo) => void;
  onResetAllData: () => void;
}

const foodCategories = [
  'Pizza',
  'Main Dish',
  'Pasta',
  'Meat',
  'Appetizer',
  'Dessert',
  'Prep / 仕込み',
  'Other',
];

export const AdminModal: React.FC<AdminModalProps> = ({
  currentLang,
  isOpen,
  onClose,
  isAdmin,
  onLogin,
  onLogout,
  heroPhoto,
  onUpdateHeroPhoto,
  lattePhotos,
  onUpdateLattePhotos,
  cafeVisits,
  onUpdateCafeVisits,
  foodPhotos,
  onUpdateFoodPhotos,
  onAddFoodPhoto,
  onDeleteFoodPhoto,
  handDripPhotoUrl,
  onUpdateHandDripPhoto,
  coffeeContent,
  onUpdateCoffeeContent,
  onResetCoffeeContent,
  foodOverview,
  onUpdateFoodOverview,
  onResetFoodOverview,
  profileInfo,
  onUpdateProfileInfo,
  onResetAllData,
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [activeTab, setActiveTab] = useState<
    'home' | 'latte' | 'coffee' | 'food' | 'profile' | 'backup'
  >('home');
  const [notification, setNotification] = useState<string | null>(null);

  // Coffee subtabs
  const [coffeeSubTab, setCoffeeSubTab] = useState<'text' | 'handdrip' | 'visits'>('text');
  const [coffeeForm, setCoffeeForm] = useState<CoffeeSectionContent>(coffeeContent);

  // Food subtabs
  const [foodSubTab, setFoodSubTab] = useState<'dishes' | 'add' | 'overview'>('dishes');
  const [foodOverviewForm, setFoodOverviewForm] = useState<FoodOverviewContent>(foodOverview);

  // New Latte state
  const [newLatteTitle, setNewLatteTitle] = useState('');
  const [newLatteDesc, setNewLatteDesc] = useState('');
  const [newLatteType, setNewLatteType] = useState('Swan');
  const [newLatteDate, setNewLatteDate] = useState('');
  const [newLatteImage, setNewLatteImage] = useState<string | null>(null);

  // New Cafe visit state
  const [newCafeName, setNewCafeName] = useState('');
  const [newCafeLoc, setNewCafeLoc] = useState('');
  const [newCafeCoffee, setNewCafeCoffee] = useState('');
  const [newCafeNotes, setNewCafeNotes] = useState('');

  // New Dish state
  const [newDishTitle, setNewDishTitle] = useState('');
  const [newDishCategory, setNewDishCategory] = useState('Pizza');
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishDate, setNewDishDate] = useState('');
  const [newDishImage, setNewDishImage] = useState<string | null>(null);
  const [newDishMediaType, setNewDishMediaType] = useState<'image' | 'video'>('image');

  useEffect(() => {
    setCoffeeForm(coffeeContent);
  }, [coffeeContent]);

  useEffect(() => {
    setFoodOverviewForm(foodOverview);
  }, [foodOverview]);

  if (!isOpen) return null;

  const showNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === '1590') {
      setPasswordError('');
      setPasswordInput('');
      onLogin();
      showNotify(
        currentLang === 'ja'
          ? '管理者としてログインしました'
          : currentLang === 'ko'
          ? '관리자로 로그인되었습니다'
          : 'Logged in as Admin'
      );
    } else {
      setPasswordError(
        currentLang === 'ja'
          ? 'パスワードが正しくありません (ヒント: 1590)'
          : currentLang === 'ko'
          ? '비밀번호가 일치하지 않습니다 (1590)'
          : 'Incorrect password (Hint: 1590)'
      );
    }
  };

  // Hero Upload
  const handleHeroFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string | undefined;
        if (imageUrl) {
          onUpdateHeroPhoto({
            ...heroPhoto,
            imageUrl,
            mediaType: isVideo ? 'video' : 'image',
          });
          showNotify(
            currentLang === 'ja'
              ? 'ホーム代表メディアを更新しました'
              : '홈 대표 사진·영상을 변경했습니다'
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectLatteForHero = (photo: LatteArtPhoto) => {
    onUpdateHeroPhoto({
      imageUrl: photo.imageUrl,
      title: photo.title,
      type: photo.type,
      description: photo.description,
      mediaType: photo.mediaType,
    });
    showNotify(
      currentLang === 'ja'
        ? `ホーム代表メディアを「${photo.title}」に設定しました`
        : `홈 대표 사진·영상을 「${photo.title}」로 설정했습니다`
    );
  };

  // Latte art
  const handleLatteFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string | undefined;
        if (imageUrl) {
          const updated = [...lattePhotos];
          updated[index] = {
            ...updated[index],
            imageUrl,
            mediaType: isVideo ? 'video' : 'image',
          };
          onUpdateLattePhotos(updated);
          showNotify(
            currentLang === 'ja' ? '写真・動画を更新しました' : '사진·영상을 업데이트했습니다'
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateLatteField = (
    index: number,
    field: keyof LatteArtPhoto,
    val: string
  ) => {
    const updated = [...lattePhotos];
    updated[index] = { ...updated[index], [field]: val };
    onUpdateLattePhotos(updated);
  };

  const handleDeleteLatte = (index: number) => {
    if (
      confirm(
        currentLang === 'ja'
          ? 'このラテアート写真を削除しますか？'
          : '이 라떼아트 사진을 삭제하시겠습니까?'
      )
    ) {
      const updated = lattePhotos.filter((_, idx) => idx !== index);
      onUpdateLattePhotos(updated);
      showNotify(currentLang === 'ja' ? '削除しました' : '삭제되었습니다');
    }
  };

  const handleAddLattePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLatteImage) {
      alert(currentLang === 'ja' ? '画像を選択してください' : '사진을 등록해주세요');
      return;
    }
    const isVideo = isVideoMedia(newLatteImage);
    const newItem: LatteArtPhoto = {
      id: `latte-custom-${Date.now()}`,
      title: newLatteTitle.trim() || 'スワン パターン',
      description: newLatteDesc.trim() || 'カップ内での対流と注ぎの練習。',
      type: newLatteType.trim() || 'Swan',
      date: newLatteDate.trim() || undefined,
      imageUrl: newLatteImage,
      mediaType: isVideo ? 'video' : 'image',
    };
    onUpdateLattePhotos([...lattePhotos, newItem]);
    setNewLatteTitle('');
    setNewLatteDesc('');
    setNewLatteDate('');
    setNewLatteImage(null);
    showNotify(currentLang === 'ja' ? '写真を追加しました' : '새 라떼아트 사진이 추가되었습니다');
  };

  // Cafe Visits
  const handleAddCafe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCafeName.trim()) return;
    const newVisit: CafeVisit = {
      id: `visit-${Date.now()}`,
      name: newCafeName.trim(),
      location: newCafeLoc.trim() || '日本',
      coffee: newCafeCoffee.trim() || '',
      notes: newCafeNotes.trim() || '',
    };
    onUpdateCafeVisits([...cafeVisits, newVisit]);
    setNewCafeName('');
    setNewCafeLoc('');
    setNewCafeCoffee('');
    setNewCafeNotes('');
    showNotify(currentLang === 'ja' ? '訪問記録を追加しました' : '카페 방문 기록이 추가되었습니다');
  };

  const handleDeleteCafe = (id: string) => {
    onUpdateCafeVisits(cafeVisits.filter((v) => v.id !== id));
    showNotify(currentLang === 'ja' ? '削除しました' : '삭제되었습니다');
  };

  // Hand Drip File
  const handleDripFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdateHandDripPhoto(event.target.result as string);
          showNotify(
            currentLang === 'ja'
              ? 'ハンドドリップメディアを更新しました'
              : '핸드드립 미디어를 업데이트했습니다'
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Food Dishes
  const handleAddDishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishTitle.trim()) {
      alert(currentLang === 'ja' ? '料理名を入力してください' : '요리명을 입력해주세요');
      return;
    }
    const newDish: FoodPhoto = {
      id: `food-${Date.now()}`,
      title: newDishTitle.trim(),
      category: newDishCategory.trim() || 'Main Dish',
      description: newDishDesc.trim(),
      date: newDishDate.trim() || undefined,
      imageUrl: newDishImage || undefined,
      mediaType: newDishImage ? newDishMediaType : undefined,
    };
    onAddFoodPhoto(newDish);
    setNewDishTitle('');
    setNewDishDesc('');
    setNewDishDate('');
    setNewDishImage(null);
    setFoodSubTab('dishes');
    showNotify(
      currentLang === 'ja'
        ? '新しい料理を登録しました'
        : '새 요리가 성공적으로 등록되었습니다'
    );
  };

  const handleUpdateDishField = (
    id: string,
    field: keyof FoodPhoto,
    val: any
  ) => {
    const updated = foodPhotos.map((f) => (f.id === id ? { ...f, [field]: val } : f));
    onUpdateFoodPhotos(updated);
  };

  const handleDishMediaUpload = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      const reader = new FileReader();
      reader.onload = (ev) => {
        const imageUrl = ev.target?.result as string | undefined;
        if (imageUrl) {
          const updated: FoodPhoto[] = foodPhotos.map((f) =>
            f.id === id
              ? {
                  ...f,
                  imageUrl,
                  mediaType: (isVideo ? 'video' : 'image') as 'video' | 'image',
                }
              : f
          );
          onUpdateFoodPhotos(updated);
          showNotify(
            currentLang === 'ja'
              ? '料理写真を更新しました'
              : '요리 사진을 업데이트했습니다'
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Export / Backup
  const handleExportData = () => {
    const data = {
      heroPhoto,
      profileInfo,
      lattePhotos,
      cafeVisits,
      foodPhotos,
      handDripPhotoUrl,
      coffeeContent,
      foodOverview,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dahoon_portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result;
          if (typeof content === 'string') {
            const parsed = JSON.parse(content);
            if (parsed.heroPhoto) onUpdateHeroPhoto(parsed.heroPhoto);
            if (parsed.lattePhotos) onUpdateLattePhotos(parsed.lattePhotos);
            if (parsed.cafeVisits) onUpdateCafeVisits(parsed.cafeVisits);
            if (parsed.foodPhotos) onUpdateFoodPhotos(parsed.foodPhotos);
            if (parsed.profileInfo) onUpdateProfileInfo(parsed.profileInfo);
            if (parsed.handDripPhotoUrl !== undefined)
              onUpdateHandDripPhoto(parsed.handDripPhotoUrl);
            if (parsed.coffeeContent) onUpdateCoffeeContent(parsed.coffeeContent);
            if (parsed.foodOverview) onUpdateFoodOverview(parsed.foodOverview);
            showNotify(
              currentLang === 'ja'
                ? 'データを正常に復元しました'
                : '데이터를 성공적으로 불러왔습니다'
            );
          }
        } catch {
          alert('Invalid backup JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#161413]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#FAF8F5] border border-[#DDD6CB] rounded-lg max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#EBE5DB] flex items-center justify-between bg-[#F5EFE6]">
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <Unlock className="w-4 h-4 text-[#7A583A]" />
            ) : (
              <Lock className="w-4 h-4 text-[#8C8477]" />
            )}
            <h3 className="text-sm sm:text-base font-serif-jp text-[#1C1A18] font-medium">
              {currentLang === 'ja'
                ? '管理者メニュー (Admin)'
                : currentLang === 'ko'
                ? '관리자 메뉴 (Admin)'
                : 'Administrator Settings'}
            </h3>
            {isAdmin && (
              <span className="text-[11px] bg-[#E3DACD] text-[#4A3D31] px-2 py-0.5 rounded font-mono">
                Active
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => {
                  onLogout();
                  showNotify(
                    currentLang === 'ja' ? 'ログアウトしました' : '로그아웃되었습니다'
                  );
                }}
                className="text-xs text-[#7A7266] hover:text-[#23201D] px-2.5 py-1 rounded border border-[#DDD5C9] bg-white cursor-pointer transition-colors"
              >
                {currentLang === 'ja' ? 'ログアウト' : '로그아웃'}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-[#736C62] hover:text-[#1F1E1D] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="bg-[#4E3B2C] text-white text-xs px-4 py-2 flex items-center gap-2 justify-center transition-all animate-fadeIn">
            <Check className="w-3.5 h-3.5 text-emerald-300" />
            <span>{notification}</span>
          </div>
        )}

        {/* Not Logged In */}
        {!isAdmin ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto w-full my-auto">
            <div className="w-12 h-12 rounded-full bg-[#EFE9DF] text-[#634832] flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="text-base font-serif-jp text-[#222] mb-1">
              {currentLang === 'ja'
                ? '管理者パスワードを入力してください'
                : '관리자 비밀번호를 입력해주세요'}
            </h4>
            <p className="text-xs text-[#7F786E] mb-6">
              {currentLang === 'ja'
                ? 'ホーム写真、コーヒー1〜4番説明、料理メニュー・写真、ラテアートを直接編集できます。'
                : '홈 대표 사진, 커피 1~4번 설명문, 요리 메뉴 및 사진, 라떼아트를 직접 수정할 수 있습니다.'}
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <div>
                <input
                  type="password"
                  autoFocus
                  placeholder={
                    currentLang === 'ja' ? 'パスワード (1590)' : '비밀번호 (1590)'
                  }
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError('');
                  }}
                  className="w-full text-center tracking-widest text-base px-3 py-2.5 bg-white border border-[#DDD6CB] rounded focus:outline-none focus:border-[#735A46] text-[#2C2926]"
                />
              </div>

              {passwordError && (
                <p className="text-xs text-red-600 font-medium">{passwordError}</p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 text-xs text-white bg-[#5E4735] hover:bg-[#4D3A2B] rounded cursor-pointer font-medium transition-colors"
              >
                {currentLang === 'ja' ? 'ログイン' : '로그인'}
              </button>
            </form>
          </div>
        ) : (
          /* Logged In Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-[#E8E1D5] bg-[#F3EDE3] px-4 text-xs shrink-0 gap-1">
              <button
                onClick={() => setActiveTab('home')}
                className={`py-2.5 px-3 font-medium whitespace-nowrap cursor-pointer border-b-2 -mb-[1px] transition-colors ${
                  activeTab === 'home'
                    ? 'border-[#614936] text-[#1F1E1D] bg-[#FAF8F5]'
                    : 'border-transparent text-[#736C62] hover:text-[#1F1E1D]'
                }`}
              >
                {currentLang === 'ja' ? 'ホーム代表写真' : '홈 대표 사진'}
              </button>

              <button
                onClick={() => setActiveTab('latte')}
                className={`py-2.5 px-3 font-medium whitespace-nowrap cursor-pointer border-b-2 -mb-[1px] transition-colors ${
                  activeTab === 'latte'
                    ? 'border-[#614936] text-[#1F1E1D] bg-[#FAF8F5]'
                    : 'border-transparent text-[#736C62] hover:text-[#1F1E1D]'
                }`}
              >
                {currentLang === 'ja' ? 'ラテアート' : '라떼아트'}
              </button>

              <button
                onClick={() => setActiveTab('coffee')}
                className={`py-2.5 px-3 font-medium whitespace-nowrap cursor-pointer border-b-2 -mb-[1px] transition-colors ${
                  activeTab === 'coffee'
                    ? 'border-[#614936] text-[#1F1E1D] bg-[#FAF8F5]'
                    : 'border-transparent text-[#736C62] hover:text-[#1F1E1D]'
                }`}
              >
                {currentLang === 'ja' ? 'コーヒー (1〜4番)' : '커피 (1~4번 설명)'}
              </button>

              <button
                onClick={() => setActiveTab('food')}
                className={`py-2.5 px-3 font-medium whitespace-nowrap cursor-pointer border-b-2 -mb-[1px] transition-colors ${
                  activeTab === 'food'
                    ? 'border-[#614936] text-[#1F1E1D] bg-[#FAF8F5]'
                    : 'border-transparent text-[#736C62] hover:text-[#1F1E1D]'
                }`}
              >
                {currentLang === 'ja' ? '料理 (メニュー・紹介)' : '요리 (메뉴·설명)'}
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`py-2.5 px-3 font-medium whitespace-nowrap cursor-pointer border-b-2 -mb-[1px] transition-colors ${
                  activeTab === 'profile'
                    ? 'border-[#614936] text-[#1F1E1D] bg-[#FAF8F5]'
                    : 'border-transparent text-[#736C62] hover:text-[#1F1E1D]'
                }`}
              >
                {currentLang === 'ja' ? 'プロフィール' : '프로필/연락처'}
              </button>

              <button
                onClick={() => setActiveTab('backup')}
                className={`py-2.5 px-3 font-medium whitespace-nowrap cursor-pointer border-b-2 -mb-[1px] transition-colors ${
                  activeTab === 'backup'
                    ? 'border-[#614936] text-[#1F1E1D] bg-[#FAF8F5]'
                    : 'border-transparent text-[#736C62] hover:text-[#1F1E1D]'
                }`}
              >
                {currentLang === 'ja' ? 'バックアップ' : '백업/초기화'}
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-xs">
              {/* TAB: HOME HERO */}
              {activeTab === 'home' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif-jp text-sm font-medium text-[#222] mb-1">
                      {currentLang === 'ja'
                        ? 'ホーム画面のメイン代表写真の変更'
                        : '홈 화면 첫 메인 대표 사진 변경'}
                    </h4>
                    <p className="text-[11px] text-[#7A7369]">
                      {currentLang === 'ja'
                        ? 'サイトの最初の画面に大きく表示される代表メディアです。写真または動画をアップロードできます。'
                        : '사이트 첫 화면에 크게 보이는 대표 미디어입니다. 사진이나 조리/라떼아트 영상을 업로드할 수 있습니다.'}
                    </p>
                  </div>

                  <div className="bg-white border border-[#E0D8CC] rounded-lg p-4 space-y-4">
                    <span className="font-medium text-[#38332B] block">
                      {currentLang === 'ja' ? '現在の代表メディア' : '현재 대표 미디어'}
                    </span>
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      <div className="w-36 h-36 bg-[#F3EFE8] rounded-md overflow-hidden border border-[#DCD5C9] shrink-0 relative group">
                        {isVideoMedia(heroPhoto.imageUrl, heroPhoto.mediaType) ? (
                          <video
                            src={heroPhoto.imageUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={heroPhoto.imageUrl}
                            alt={heroPhoto.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <label className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[10px] cursor-pointer transition-opacity">
                          <Upload className="w-5 h-5 mb-1" />
                          <span>変更</span>
                          <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleHeroFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="flex-1 space-y-2 w-full">
                        <div>
                          <label className="text-[#80776C] text-[11px] block mb-1">
                            {currentLang === 'ja' ? '作品タイトル' : '작품 제목'}
                          </label>
                          <input
                            type="text"
                            value={heroPhoto.title}
                            onChange={(e) =>
                              onUpdateHeroPhoto({ ...heroPhoto, title: e.target.value })
                            }
                            className="w-full px-2.5 py-1.5 border border-[#DDD6CB] rounded text-xs bg-[#FAF8F5] text-[#222]"
                          />
                        </div>
                        <div>
                          <label className="text-[#80776C] text-[11px] block mb-1">
                            {currentLang === 'ja' ? 'パターン / 種類' : '패턴 / 종류'}
                          </label>
                          <input
                            type="text"
                            value={heroPhoto.type || ''}
                            onChange={(e) =>
                              onUpdateHeroPhoto({ ...heroPhoto, type: e.target.value })
                            }
                            className="w-full px-2.5 py-1.5 border border-[#DDD6CB] rounded text-xs bg-[#FAF8F5] text-[#222]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pick from Latte Art */}
                  <div className="space-y-3">
                    <span className="font-medium text-[#38332B] block">
                      {currentLang === 'ja'
                        ? '登録済みのラテアートから選ぶ'
                        : '등록된 라떼아트 사진 중에서 선택하기'}
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {lattePhotos.map((photo) => (
                        <div
                          key={photo.id}
                          onClick={() => handleSelectLatteForHero(photo)}
                          className="bg-white border border-[#E0D8CC] hover:border-[#6B4E38] rounded p-2 text-center cursor-pointer transition-all hover:shadow-xs group"
                        >
                          <div className="aspect-square rounded overflow-hidden mb-1.5 bg-[#F6F2EC]">
                            {isVideoMedia(photo.imageUrl, photo.mediaType) ? (
                              <video
                                src={photo.imageUrl}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <img
                                src={photo.imageUrl}
                                alt={photo.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            )}
                          </div>
                          <p className="font-serif-jp text-[11px] text-[#222] truncate">
                            {photo.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: LATTE ART */}
              {activeTab === 'latte' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif-jp text-sm font-medium text-[#222] mb-1">
                      {currentLang === 'ja' ? 'ラテアート写真の管理' : '라떼아트 사진 관리'}
                    </h4>
                    <p className="text-[11px] text-[#7A7369]">
                      {currentLang === 'ja'
                        ? '練習記録の写真や動画を差し替え・追加できます。'
                        : '연습 기록 사진 및 영상을 교체하거나 새 사진을 추가할 수 있습니다.'}
                    </p>
                  </div>

                  {/* List of Photos */}
                  <div className="space-y-4">
                    {lattePhotos.map((photo, idx) => (
                      <div
                        key={photo.id}
                        className="bg-white border border-[#E0D8CC] rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row gap-4 items-start"
                      >
                        <div className="w-24 h-24 rounded overflow-hidden bg-[#F2EDE5] border border-[#DDD5C9] shrink-0 relative group">
                          {isVideoMedia(photo.imageUrl, photo.mediaType) ? (
                            <video
                              src={photo.imageUrl}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src={photo.imageUrl}
                              alt={photo.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                          <label className="absolute inset-0 bg-black/55 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[10px] cursor-pointer transition-opacity text-center p-1">
                            <Upload className="w-4 h-4 mb-0.5" />
                            <span>変更</span>
                            <input
                              type="file"
                              accept="image/*,video/*"
                              onChange={(e) => handleLatteFileChange(idx, e)}
                              className="hidden"
                            />
                          </label>
                        </div>

                        <div className="flex-1 space-y-2 w-full">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <span className="block text-[#827A70] text-[10px] mb-0.5">
                                タイトル (Title)
                              </span>
                              <input
                                type="text"
                                value={photo.title}
                                onChange={(e) =>
                                  handleUpdateLatteField(idx, 'title', e.target.value)
                                }
                                className="w-full px-2.5 py-1.5 border border-[#DDD6CB] rounded text-[#222] bg-[#FAF8F5]"
                              />
                            </div>
                            <div>
                              <span className="block text-[#827A70] text-[10px] mb-0.5">
                                種類 (Type)
                              </span>
                              <input
                                type="text"
                                value={photo.type || ''}
                                onChange={(e) =>
                                  handleUpdateLatteField(idx, 'type', e.target.value)
                                }
                                className="w-full px-2.5 py-1.5 border border-[#DDD6CB] rounded text-[#222] bg-[#FAF8F5]"
                              />
                            </div>
                          </div>

                          <div>
                            <span className="block text-[#827A70] text-[10px] mb-0.5">
                              説明文 (Description)
                            </span>
                            <input
                              type="text"
                              value={photo.description}
                              onChange={(e) =>
                                handleUpdateLatteField(idx, 'description', e.target.value)
                              }
                              className="w-full px-2.5 py-1.5 border border-[#DDD6CB] rounded text-[#222] bg-[#FAF8F5]"
                            />
                          </div>

                          <div className="flex items-center justify-end pt-1">
                            <button
                              type="button"
                              onClick={() => handleDeleteLatte(idx)}
                              className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>削除</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add New Latte Photo */}
                  <form
                    onSubmit={handleAddLattePhoto}
                    className="bg-white border border-[#E0D8CC] rounded-lg p-4 space-y-3"
                  >
                    <span className="font-medium text-[#38332B] block">
                      {currentLang === 'ja'
                        ? '＋ 新しいラテアート写真を追加'
                        : '＋ 새 라떼아트 사진 추가'}
                    </span>
                    <div>
                      {newLatteImage ? (
                        <div className="flex items-center gap-3">
                          {isVideoMedia(newLatteImage) ? (
                            <video
                              src={newLatteImage}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="w-16 h-16 object-cover rounded border"
                            />
                          ) : (
                            <img
                              src={newLatteImage}
                              alt="Preview"
                              className="w-16 h-16 object-cover rounded border"
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => setNewLatteImage(null)}
                            className="text-red-600 underline"
                          >
                            変更
                          </button>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center p-4 border border-dashed border-[#DDD7CC] rounded cursor-pointer bg-[#F8F5EE]">
                          <Upload className="w-4 h-4 mr-2 text-[#7E776D]" />
                          <span>사진/영상 파일 선택</span>
                          <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                const r = new FileReader();
                                r.onload = (ev) =>
                                  setNewLatteImage(ev.target?.result as string);
                                r.readAsDataURL(f);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="タイトル (例: スワン)"
                        value={newLatteTitle}
                        onChange={(e) => setNewLatteTitle(e.target.value)}
                        className="px-2.5 py-1.5 border rounded bg-[#FAF8F5]"
                      />
                      <input
                        type="text"
                        placeholder="種類 (例: Swan)"
                        value={newLatteType}
                        onChange={(e) => setNewLatteType(e.target.value)}
                        className="px-2.5 py-1.5 border rounded bg-[#FAF8F5]"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="簡単な説明"
                      value={newLatteDesc}
                      onChange={(e) => setNewLatteDesc(e.target.value)}
                      className="w-full px-2.5 py-1.5 border rounded bg-[#FAF8F5]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#5E4735] hover:bg-[#4D3A2B] text-white rounded cursor-pointer font-medium"
                    >
                      {currentLang === 'ja' ? '追加する' : '추가하기'}
                    </button>
                  </form>
                </div>
              )}

              {/* TAB: COFFEE (1~4 EXPLANATIONS & RECORDS) */}
              {activeTab === 'coffee' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif-jp text-sm font-medium text-[#222] mb-0.5">
                        {currentLang === 'ja'
                          ? 'コーヒー 1〜4番 説明文 & 記録の管理'
                          : '커피 1번~4번 설명글 및 기록 관리'}
                      </h4>
                      <p className="text-[11px] text-[#7A7369]">
                        {currentLang === 'ja'
                          ? '01エスプレッソ、02センサリー、03ハンドドリップ、04カフェ巡りの各説明文を編集できます。'
                          : '01 에스프레소, 02 센서리, 03 핸드드립, 04 카페 탐방의 설명글을 자유롭게 수정할 수 있습니다.'}
                      </p>
                    </div>
                  </div>

                  {/* Coffee Subtabs */}
                  <div className="flex gap-2 border-b border-[#E5DFD4] pb-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setCoffeeSubTab('text')}
                      className={`px-3 py-1 rounded cursor-pointer ${
                        coffeeSubTab === 'text'
                          ? 'bg-[#5E4735] text-white font-medium'
                          : 'bg-[#EDE7DE] text-[#554E45] hover:bg-[#E2DBCF]'
                      }`}
                    >
                      {currentLang === 'ja'
                        ? '1〜4番 説明文の編集'
                        : '1~4번 설명글 수정'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoffeeSubTab('handdrip')}
                      className={`px-3 py-1 rounded cursor-pointer ${
                        coffeeSubTab === 'handdrip'
                          ? 'bg-[#5E4735] text-white font-medium'
                          : 'bg-[#EDE7DE] text-[#554E45] hover:bg-[#E2DBCF]'
                      }`}
                    >
                      {currentLang === 'ja' ? 'ハンドドリップ写真' : '핸드드립 사진·영상'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoffeeSubTab('visits')}
                      className={`px-3 py-1 rounded cursor-pointer ${
                        coffeeSubTab === 'visits'
                          ? 'bg-[#5E4735] text-white font-medium'
                          : 'bg-[#EDE7DE] text-[#554E45] hover:bg-[#E2DBCF]'
                      }`}
                    >
                      {currentLang === 'ja'
                        ? `カフェ巡り記録 (${cafeVisits.length})`
                        : `카페 방문 기록 (${cafeVisits.length})`}
                    </button>
                  </div>

                  {/* SUBTAB: COFFEE TEXTS (1 to 4) */}
                  {coffeeSubTab === 'text' && (
                    <div className="space-y-4">
                      {/* 01 Espresso */}
                      <div className="bg-white border border-[#DDD6CB] rounded-lg p-4 space-y-3">
                        <span className="font-medium text-[#2E2822] block text-xs">
                          01 · エスプレッソ抽出 (Espresso)
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={coffeeForm.espresso.title}
                            placeholder="タイトル"
                            onChange={(e) =>
                              setCoffeeForm({
                                ...coffeeForm,
                                espresso: { ...coffeeForm.espresso, title: e.target.value },
                              })
                            }
                            className="px-2.5 py-1.5 border rounded bg-[#FAF8F5]"
                          />
                          <input
                            type="text"
                            value={coffeeForm.espresso.tag}
                            placeholder="タグ"
                            onChange={(e) =>
                              setCoffeeForm({
                                ...coffeeForm,
                                espresso: { ...coffeeForm.espresso, tag: e.target.value },
                              })
                            }
                            className="px-2.5 py-1.5 border rounded bg-[#FAF8F5]"
                          />
                        </div>
                        <textarea
                          rows={3}
                          value={coffeeForm.espresso.body}
                          placeholder="説明文"
                          onChange={(e) =>
                            setCoffeeForm({
                              ...coffeeForm,
                              espresso: { ...coffeeForm.espresso, body: e.target.value },
                            })
                          }
                          className="w-full px-2.5 py-1.5 border rounded bg-[#FAF8F5] leading-relaxed"
                        />
                      </div>

                      {/* 02 Sensory */}
                      <div className="bg-white border border-[#DDD6CB] rounded-lg p-4 space-y-3">
                        <span className="font-medium text-[#2E2822] block text-xs">
                          02 · センサリー / カップノート (Sensory)
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={coffeeForm.sensory.title}
                            placeholder="タイトル"
                            onChange={(e) =>
                              setCoffeeForm({
                                ...coffeeForm,
                                sensory: { ...coffeeForm.sensory, title: e.target.value },
                              })
                            }
                            className="px-2.5 py-1.5 border rounded bg-[#FAF8F5]"
                          />
                          <input
                            type="text"
                            value={coffeeForm.sensory.tag}
                            placeholder="タグ"
                            onChange={(e) =>
                              setCoffeeForm({
                                ...coffeeForm,
                                sensory: { ...coffeeForm.sensory, tag: e.target.value },
                              })
                            }
                            className="px-2.5 py-1.5 border rounded bg-[#FAF8F5]"
                          />
                        </div>
                        <textarea
                          rows={3}
                          value={coffeeForm.sensory.body}
                          placeholder="説明文"
                          onChange={(e) =>
                            setCoffeeForm({
                              ...coffeeForm,
                              sensory: { ...coffeeForm.sensory, body: e.target.value },
                            })
                          }
                          className="w-full px-2.5 py-1.5 border rounded bg-[#FAF8F5] leading-relaxed"
                        />
                      </div>

                      {/* 03 Hand Drip */}
                      <div className="bg-white border border-[#DDD6CB] rounded-lg p-4 space-y-3">
                        <span className="font-medium text-[#2E2822] block text-xs">
                          03 · ハンドドリップ (Hand Drip)
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={coffeeForm.handDrip.title}
                            placeholder="タイトル"
                            onChange={(e) =>
                              setCoffeeForm({
                                ...coffeeForm,
                                handDrip: { ...coffeeForm.handDrip, title: e.target.value },
                              })
                            }
                            className="px-2.5 py-1.5 border rounded bg-[#FAF8F5]"
                          />
                          <input
                            type="text"
                            value={coffeeForm.handDrip.tag}
                            placeholder="タグ"
                            onChange={(e) =>
                              setCoffeeForm({
                                ...coffeeForm,
                                handDrip: { ...coffeeForm.handDrip, tag: e.target.value },
                              })
                            }
                            className="px-2.5 py-1.5 border rounded bg-[#FAF8F5]"
                          />
                        </div>
                        <textarea
                          rows={3}
                          value={coffeeForm.handDrip.body}
                          placeholder="説明文"
                          onChange={(e) =>
                            setCoffeeForm({
                              ...coffeeForm,
                              handDrip: { ...coffeeForm.handDrip, body: e.target.value },
                            })
                          }
                          className="w-full px-2.5 py-1.5 border rounded bg-[#FAF8F5] leading-relaxed"
                        />
                      </div>

                      {/* 04 Cafe Studies */}
                      <div className="bg-white border border-[#DDD6CB] rounded-lg p-4 space-y-3">
                        <span className="font-medium text-[#2E2822] block text-xs">
                          04 · カフェ巡り紹介 (Cafe Studies Intro)
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={coffeeForm.cafeVisitsIntro.title}
                            placeholder="タイトル"
                            onChange={(e) =>
                              setCoffeeForm({
                                ...coffeeForm,
                                cafeVisitsIntro: {
                                  ...coffeeForm.cafeVisitsIntro,
                                  title: e.target.value,
                                },
                              })
                            }
                            className="px-2.5 py-1.5 border rounded bg-[#FAF8F5]"
                          />
                          <input
                            type="text"
                            value={coffeeForm.cafeVisitsIntro.tag}
                            placeholder="タグ"
                            onChange={(e) =>
                              setCoffeeForm({
                                ...coffeeForm,
                                cafeVisitsIntro: {
                                  ...coffeeForm.cafeVisitsIntro,
                                  tag: e.target.value,
                                },
                              })
                            }
                            className="px-2.5 py-1.5 border rounded bg-[#FAF8F5]"
                          />
                        </div>
                        <textarea
                          rows={2}
                          value={coffeeForm.cafeVisitsIntro.body}
                          placeholder="説明文"
                          onChange={(e) =>
                            setCoffeeForm({
                              ...coffeeForm,
                              cafeVisitsIntro: {
                                ...coffeeForm.cafeVisitsIntro,
                                body: e.target.value,
                              },
                            })
                          }
                          className="w-full px-2.5 py-1.5 border rounded bg-[#FAF8F5] leading-relaxed"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            onResetCoffeeContent();
                            showNotify(
                              currentLang === 'ja'
                                ? '初期状態に復元しました'
                                : '기본 내용으로 복원되었습니다'
                            );
                          }}
                          className="text-xs text-[#8A8276] hover:text-[#222] flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>초기 상태로 복원</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateCoffeeContent(coffeeForm);
                            showNotify(
                              currentLang === 'ja'
                                ? '説明文を保存しました'
                                : '커피 1~4번 설명글이 저장되었습니다'
                            );
                          }}
                          className="px-4 py-1.5 bg-[#5E4735] text-white rounded cursor-pointer font-medium hover:bg-[#4D3A2B] flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>
                            {currentLang === 'ja' ? '変更を保存' : '설명글 저장하기'}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SUBTAB: HAND DRIP MEDIA */}
                  {coffeeSubTab === 'handdrip' && (
                    <div className="bg-white border border-[#E0D8CC] rounded-lg p-4 space-y-3">
                      <span className="font-medium text-[#38332C] block">
                        ハンドドリップ写真・動画 (Pour-Over Photo / Video)
                      </span>
                      {handDripPhotoUrl ? (
                        <div className="flex items-center gap-4">
                          {isVideoMedia(handDripPhotoUrl) ? (
                            <video
                              src={handDripPhotoUrl}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="w-28 h-20 object-cover rounded border"
                            />
                          ) : (
                            <img
                              src={handDripPhotoUrl}
                              alt="Drip"
                              className="w-28 h-20 object-cover rounded border"
                            />
                          )}
                          <div className="space-y-1">
                            <label className="text-xs text-[#5E4735] hover:underline cursor-pointer block">
                              メディア変更
                              <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleDripFile}
                                className="hidden"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => onUpdateHandDripPhoto(null)}
                              className="text-xs text-red-600 hover:underline cursor-pointer"
                            >
                              削除
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center p-5 border border-dashed border-[#DDD7CC] rounded cursor-pointer bg-[#F8F5EE]">
                          <Upload className="w-4 h-4 mr-2 text-[#7E776D]" />
                          <span>핸드드립 사진·동영상 업로드 (Add Photo/Video)</span>
                          <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleDripFile}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  )}

                  {/* SUBTAB: CAFE VISITS LIST */}
                  {coffeeSubTab === 'visits' && (
                    <div className="space-y-4">
                      {/* Add Form */}
                      <form
                        onSubmit={handleAddCafe}
                        className="bg-white border border-[#E0D8CC] rounded-lg p-4 space-y-2.5"
                      >
                        <span className="block font-medium text-[#38332B] mb-1">
                          {currentLang === 'ja'
                            ? '新しい訪問記録を追加'
                            : '새 방문 기록 추가'}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            placeholder="店名 (例: FUGLEN TOKYO)"
                            value={newCafeName}
                            onChange={(e) => setNewCafeName(e.target.value)}
                            className="px-2.5 py-1.5 border rounded bg-[#FAF8F5]"
                          />
                          <input
                            type="text"
                            placeholder="地域 / エリア (例: 東京・代々木公園)"
                            value={newCafeLoc}
                            onChange={(e) => setNewCafeLoc(e.target.value)}
                            className="px-2.5 py-1.5 border rounded bg-[#FAF8F5]"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="飲んだコーヒー (例: ノルディックロースト / エチオピア)"
                          value={newCafeCoffee}
                          onChange={(e) => setNewCafeCoffee(e.target.value)}
                          className="w-full px-2.5 py-1.5 border rounded bg-[#FAF8F5]"
                        />
                        <textarea
                          rows={2}
                          placeholder="店舗の雰囲気や抽出の印象など"
                          value={newCafeNotes}
                          onChange={(e) => setNewCafeNotes(e.target.value)}
                          className="w-full px-2.5 py-1.5 border rounded bg-[#FAF8F5]"
                        />
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-[#5E4735] text-white rounded cursor-pointer font-medium hover:bg-[#4D3A2B]"
                        >
                          {currentLang === 'ja' ? '訪問記録を保存' : '방문 기록 저장'}
                        </button>
                      </form>

                      {/* List */}
                      <div className="space-y-2">
                        {cafeVisits.map((item) => (
                          <div
                            key={item.id}
                            className="p-3 bg-white border border-[#DDD5C9] rounded-lg flex items-start justify-between gap-3"
                          >
                            <div className="space-y-0.5">
                              <span className="font-serif-jp font-medium text-[#222]">
                                {item.name}
                              </span>
                              <span className="text-[11px] text-[#787166] ml-2">
                                ({item.location})
                              </span>
                              {item.coffee && (
                                <p className="text-[#614E3C] text-[11px]">
                                  {item.coffee}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => handleDeleteCafe(item.id)}
                              className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: FOOD (DISHES, ADD, OVERVIEW) */}
              {activeTab === 'food' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif-jp text-sm font-medium text-[#222] mb-0.5">
                        {currentLang === 'ja'
                          ? '料理メニュー & 写真・説明の管理'
                          : '요리 메뉴 및 사진·설명 관리'}
                      </h4>
                      <p className="text-[11px] text-[#7A7369]">
                        {currentLang === 'ja'
                          ? 'これまで作ってきた料理の写真・動画を登録し、タイトルや説明を自由に変更できます。'
                          : '지금까지 해온 요리 사진·영상을 등록하고 이름과 설명을 자유롭게 변경할 수 있습니다.'}
                      </p>
                    </div>
                  </div>

                  {/* Food Subtabs */}
                  <div className="flex gap-2 border-b border-[#E5DFD4] pb-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setFoodSubTab('dishes')}
                      className={`px-3 py-1 rounded cursor-pointer ${
                        foodSubTab === 'dishes'
                          ? 'bg-[#5E4735] text-white font-medium'
                          : 'bg-[#EDE7DE] text-[#554E45] hover:bg-[#E2DBCF]'
                      }`}
                    >
                      {currentLang === 'ja'
                        ? `登録済み料理一覧 (${foodPhotos.length})`
                        : `등록된 요리 목록 (${foodPhotos.length})`}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFoodSubTab('add')}
                      className={`px-3 py-1 rounded cursor-pointer ${
                        foodSubTab === 'add'
                          ? 'bg-[#5E4735] text-white font-medium'
                          : 'bg-[#EDE7DE] text-[#554E45] hover:bg-[#E2DBCF]'
                      }`}
                    >
                      {currentLang === 'ja' ? '＋ 新規料理の追加' : '＋ 새 요리 추가'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFoodSubTab('overview')}
                      className={`px-3 py-1 rounded cursor-pointer ${
                        foodSubTab === 'overview'
                          ? 'bg-[#5E4735] text-white font-medium'
                          : 'bg-[#EDE7DE] text-[#554E45] hover:bg-[#E2DBCF]'
                      }`}
                    >
                      {currentLang === 'ja' ? '料理カテゴリー紹介文' : '요리 소개글 편집'}
                    </button>
                  </div>

                  {/* SUBTAB: DISHES LIST */}
                  {foodSubTab === 'dishes' && (
                    <div className="space-y-4">
                      {foodPhotos.map((dish) => (
                        <div
                          key={dish.id}
                          className="bg-white border border-[#E0D8CC] rounded-lg p-4 flex flex-col sm:flex-row gap-4 items-start"
                        >
                          {/* Media Thumbnail */}
                          <div className="w-28 h-24 bg-[#F4EFE6] rounded border border-[#D5CDC0] overflow-hidden shrink-0 relative group">
                            {dish.imageUrl ? (
                              isVideoMedia(dish.imageUrl, dish.mediaType) ? (
                                <video
                                  src={dish.imageUrl}
                                  autoPlay
                                  loop
                                  muted
                                  playsInline
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <img
                                  src={dish.imageUrl}
                                  alt={dish.title}
                                  className="w-full h-full object-cover"
                                />
                              )
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#9E978C] text-[10px]">
                                未登録
                              </div>
                            )}
                            <label className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[10px] cursor-pointer transition-opacity">
                              <Upload className="w-4 h-4 mb-0.5" />
                              <span>{dish.imageUrl ? '変更' : '登録'}</span>
                              <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={(e) => handleDishMediaUpload(dish.id, e)}
                                className="hidden"
                              />
                            </label>
                          </div>

                          {/* Editable fields */}
                          <div className="flex-1 space-y-2 w-full">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <div className="sm:col-span-2">
                                <span className="block text-[#827A70] text-[10px] mb-0.5">
                                  {currentLang === 'ja' ? '料理名' : '요리명'}
                                </span>
                                <input
                                  type="text"
                                  value={dish.title}
                                  onChange={(e) =>
                                    handleUpdateDishField(dish.id, 'title', e.target.value)
                                  }
                                  className="w-full px-2.5 py-1.5 border border-[#DDD6CB] rounded text-[#222] bg-[#FAF8F5]"
                                />
                              </div>
                              <div>
                                <span className="block text-[#827A70] text-[10px] mb-0.5">
                                  {currentLang === 'ja' ? 'カテゴリー' : '카테고리'}
                                </span>
                                <input
                                  type="text"
                                  value={dish.category}
                                  onChange={(e) =>
                                    handleUpdateDishField(dish.id, 'category', e.target.value)
                                  }
                                  className="w-full px-2.5 py-1.5 border border-[#DDD6CB] rounded text-[#222] bg-[#FAF8F5]"
                                />
                              </div>
                            </div>

                            <div>
                              <span className="block text-[#827A70] text-[10px] mb-0.5">
                                {currentLang === 'ja' ? '詳細説明' : '상세 설명'}
                              </span>
                              <textarea
                                rows={2}
                                value={dish.description}
                                onChange={(e) =>
                                  handleUpdateDishField(dish.id, 'description', e.target.value)
                                }
                                className="w-full px-2.5 py-1.5 border border-[#DDD6CB] rounded text-[#222] bg-[#FAF8F5] leading-relaxed"
                              />
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <div className="w-44">
                                <input
                                  type="text"
                                  placeholder="時期 / 担当店舗 (任意)"
                                  value={dish.date || ''}
                                  onChange={(e) =>
                                    handleUpdateDishField(dish.id, 'date', e.target.value)
                                  }
                                  className="w-full px-2 py-1 text-[11px] border border-[#DDD6CB] rounded text-[#222] bg-[#FAF8F5]"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  if (
                                    confirm(
                                      currentLang === 'ja'
                                        ? `「${dish.title}」を削除しますか？`
                                        : `「${dish.title}」 요리를 삭제하시겠습니까?`
                                    )
                                  ) {
                                    onDeleteFoodPhoto(dish.id);
                                    showNotify(
                                      currentLang === 'ja' ? '削除しました' : '삭제되었습니다'
                                    );
                                  }
                                }}
                                className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>{currentLang === 'ja' ? '削除' : '삭제'}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* SUBTAB: ADD DISH */}
                  {foodSubTab === 'add' && (
                    <form
                      onSubmit={handleAddDishSubmit}
                      className="bg-white border border-[#E0D8CC] rounded-lg p-4 sm:p-5 space-y-3"
                    >
                      <span className="font-medium text-[#2E2822] block">
                        {currentLang === 'ja'
                          ? '新しい料理・メニューの登録'
                          : '새로운 요리 등록하기'}
                      </span>

                      {/* Photo / Video preview */}
                      <div>
                        {newDishImage ? (
                          <div className="flex items-center gap-3">
                            {newDishMediaType === 'video' ? (
                              <video
                                src={newDishImage}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-24 h-16 object-cover rounded border"
                              />
                            ) : (
                              <img
                                src={newDishImage}
                                alt="Preview"
                                className="w-24 h-16 object-cover rounded border"
                              />
                            )}
                            <button
                              type="button"
                              onClick={() => setNewDishImage(null)}
                              className="text-red-600 text-xs underline cursor-pointer"
                            >
                              変更
                            </button>
                          </div>
                        ) : (
                          <label className="flex items-center justify-center p-4 border border-dashed border-[#DDD7CC] rounded cursor-pointer bg-[#F8F5EE]">
                            <Upload className="w-4 h-4 mr-2 text-[#7E776D]" />
                            <span>요리 사진 또는 동영상 파일 선택 (선택 사항)</span>
                            <input
                              type="file"
                              accept="image/*,video/*"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) {
                                  const isVideo = f.type.startsWith('video/');
                                  const r = new FileReader();
                                  r.onload = (ev) => {
                                    setNewDishImage(ev.target?.result as string);
                                    setNewDishMediaType(isVideo ? 'video' : 'image');
                                  };
                                  r.readAsDataURL(f);
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-[11px] text-[#7A7369] block mb-0.5">
                            料理名 *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="例: 薪窯ピッツァ マルゲリータ"
                            value={newDishTitle}
                            onChange={(e) => setNewDishTitle(e.target.value)}
                            className="w-full px-2.5 py-1.5 border rounded bg-[#FAF8F5]"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-[#7A7369] block mb-0.5">
                            カテゴリー
                          </label>
                          <select
                            value={newDishCategory}
                            onChange={(e) => setNewDishCategory(e.target.value)}
                            className="w-full px-2.5 py-1.5 border rounded bg-[#FAF8F5]"
                          >
                            {foodCategories.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-[#7A7369] block mb-0.5">
                          時期・店舗名 (任意)
                        </label>
                        <input
                          type="text"
                          placeholder="例: GARB GREEN WALK / 2023 - 現在"
                          value={newDishDate}
                          onChange={(e) => setNewDishDate(e.target.value)}
                          className="w-full px-2.5 py-1.5 border rounded bg-[#FAF8F5]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-[#7A7369] block mb-0.5">
                          調理内容・詳細説明
                        </label>
                        <textarea
                          rows={3}
                          placeholder="生地の発酵状態、火入れのポイント、盛り付けの工夫など"
                          value={newDishDesc}
                          onChange={(e) => setNewDishDesc(e.target.value)}
                          className="w-full px-2.5 py-1.5 border rounded bg-[#FAF8F5] leading-relaxed"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#5E4735] hover:bg-[#4D3A2B] text-white rounded cursor-pointer font-medium"
                      >
                        {currentLang === 'ja' ? '料理を登録する' : '새 요리 등록하기'}
                      </button>
                    </form>
                  )}

                  {/* SUBTAB: FOOD OVERVIEW */}
                  {foodSubTab === 'overview' && (
                    <div className="bg-white border border-[#E0D8CC] rounded-lg p-4 space-y-3">
                      <span className="font-medium text-[#2E2822] block">
                        料理カテゴリー全体の紹介文 (Culinary Overview)
                      </span>
                      <div>
                        <label className="text-[11px] text-[#7A7369] block mb-0.5">
                          勤務状況バッジ
                        </label>
                        <input
                          type="text"
                          value={foodOverviewForm.roleBadge}
                          onChange={(e) =>
                            setFoodOverviewForm({
                              ...foodOverviewForm,
                              roleBadge: e.target.value,
                            })
                          }
                          className="w-full px-2.5 py-1.5 border rounded bg-[#FAF8F5]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#7A7369] block mb-0.5">
                          担当パート名
                        </label>
                        <input
                          type="text"
                          value={foodOverviewForm.roleTitle}
                          onChange={(e) =>
                            setFoodOverviewForm({
                              ...foodOverviewForm,
                              roleTitle: e.target.value,
                            })
                          }
                          className="w-full px-2.5 py-1.5 border rounded bg-[#FAF8F5]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#7A7369] block mb-0.5">
                          現在の主な業務・調理内容
                        </label>
                        <textarea
                          rows={3}
                          value={foodOverviewForm.roleDesc}
                          onChange={(e) =>
                            setFoodOverviewForm({
                              ...foodOverviewForm,
                              roleDesc: e.target.value,
                            })
                          }
                          className="w-full px-2.5 py-1.5 border rounded bg-[#FAF8F5] leading-relaxed"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#7A7369] block mb-0.5">
                          過去の経験・補足
                        </label>
                        <textarea
                          rows={2}
                          value={foodOverviewForm.pastNote}
                          onChange={(e) =>
                            setFoodOverviewForm({
                              ...foodOverviewForm,
                              pastNote: e.target.value,
                            })
                          }
                          className="w-full px-2.5 py-1.5 border rounded bg-[#FAF8F5] leading-relaxed"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            onResetFoodOverview();
                            showNotify(
                              currentLang === 'ja'
                                ? '初期状態に復元しました'
                                : '기본 내용으로 복원되었습니다'
                            );
                          }}
                          className="text-xs text-[#8A8276] hover:text-[#222] flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>초기화</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateFoodOverview(foodOverviewForm);
                            showNotify(
                              currentLang === 'ja'
                                ? '紹介文を保存しました'
                                : '요리 소개글이 저장되었습니다'
                            );
                          }}
                          className="px-4 py-1.5 bg-[#5E4735] text-white rounded cursor-pointer font-medium hover:bg-[#4D3A2B] flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>
                            {currentLang === 'ja' ? '変更を保存' : '소개글 저장'}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: PROFILE */}
              {activeTab === 'profile' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-serif-jp text-sm font-medium text-[#222] mb-1">
                      {currentLang === 'ja'
                        ? 'プロフィール & 連絡先情報'
                        : '프로필 & 연락처 정보'}
                    </h4>
                    <p className="text-[11px] text-[#7A7369]">
                      {currentLang === 'ja'
                        ? '名前、メールアドレス、勤務希望地域などの情報を更新できます。'
                        : '성명, 이메일, 근무 가능 지역 등의 정보를 수정할 수 있습니다.'}
                    </p>
                  </div>

                  <div className="bg-white border border-[#E0D8CC] rounded-lg p-4 space-y-3">
                    <div>
                      <span className="block text-[#827A70] text-[10px] mb-0.5">
                        お名前 (Name)
                      </span>
                      <input
                        type="text"
                        value={profileInfo.name}
                        onChange={(e) =>
                          onUpdateProfileInfo({ ...profileInfo, name: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 border border-[#DDD6CB] rounded text-[#222] bg-[#FAF8F5]"
                      />
                    </div>

                    <div>
                      <span className="block text-[#827A70] text-[10px] mb-0.5">
                        メールアドレス (Email)
                      </span>
                      <input
                        type="email"
                        value={profileInfo.email}
                        onChange={(e) =>
                          onUpdateProfileInfo({ ...profileInfo, email: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 border border-[#DDD6CB] rounded text-[#222] bg-[#FAF8F5]"
                      />
                    </div>

                    <div>
                      <span className="block text-[#827A70] text-[10px] mb-0.5">
                        Instagram
                      </span>
                      <input
                        type="text"
                        value={profileInfo.instagram}
                        onChange={(e) =>
                          onUpdateProfileInfo({
                            ...profileInfo,
                            instagram: e.target.value,
                          })
                        }
                        className="w-full px-2.5 py-1.5 border border-[#DDD6CB] rounded text-[#222] bg-[#FAF8F5]"
                      />
                    </div>

                    <div>
                      <span className="block text-[#827A70] text-[10px] mb-0.5">
                        勤務地 / 居住エリア (Location)
                      </span>
                      <input
                        type="text"
                        value={profileInfo.location}
                        onChange={(e) =>
                          onUpdateProfileInfo({
                            ...profileInfo,
                            location: e.target.value,
                          })
                        }
                        className="w-full px-2.5 py-1.5 border border-[#DDD6CB] rounded text-[#222] bg-[#FAF8F5]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: BACKUP & RESET */}
              {activeTab === 'backup' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-serif-jp text-sm font-medium text-[#222] mb-1">
                      {currentLang === 'ja'
                        ? 'データのバックアップ & 復元・初期化'
                        : '데이터 백업 & 복원·초기화'}
                    </h4>
                    <p className="text-[11px] text-[#7A7369]">
                      {currentLang === 'ja'
                        ? '登録した写真やコーヒー・料理の説明文をJSONファイルとしてダウンロードして保存したり、元に戻すことができます。'
                        : '등록한 사진과 커피·요리 설명문 등 모든 포트폴리오 데이터를 JSON 파일로 안전하게 백업 및 복원할 수 있습니다.'}
                    </p>
                  </div>

                  <div className="bg-white border border-[#E0D8CC] rounded-lg p-5 space-y-4">
                    {/* Export */}
                    <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D6]">
                      <div>
                        <span className="font-medium text-[#2E2822] block text-xs">
                          {currentLang === 'ja'
                            ? 'バックアップをダウンロード'
                            : '전체 데이터 백업 다운로드'}
                        </span>
                        <span className="text-[11px] text-[#7D766C]">
                          {currentLang === 'ja'
                            ? 'すべての登録データ（写真・文章・記録）をJSONファイルとして保存します。'
                            : '수정한 사진, 텍스트, 요리, 카페 기록 전체를 파일로 저장합니다.'}
                        </span>
                      </div>
                      <button
                        onClick={handleExportData}
                        className="px-3.5 py-1.5 bg-[#4A3B2E] hover:bg-[#3D2F23] text-white rounded cursor-pointer font-medium flex items-center gap-1.5 shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{currentLang === 'ja' ? 'ダウンロード' : '백업 받기'}</span>
                      </button>
                    </div>

                    {/* Import */}
                    <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D6]">
                      <div>
                        <span className="font-medium text-[#2E2822] block text-xs">
                          {currentLang === 'ja'
                            ? 'バックアップから復元'
                            : '백업 파일에서 불러오기 (복원)'}
                        </span>
                        <span className="text-[11px] text-[#7D766C]">
                          {currentLang === 'ja'
                            ? '以前保存したJSONファイルを読み込みます。'
                            : '이전에 저장해 둔 JSON 백업 파일을 선택하여 복원합니다.'}
                        </span>
                      </div>
                      <label className="px-3.5 py-1.5 border border-[#DDD5C9] bg-[#FAF8F5] hover:bg-white text-[#2C2926] rounded cursor-pointer font-medium flex items-center gap-1.5 shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{currentLang === 'ja' ? 'ファイル選択' : '파일 선택'}</span>
                        <input
                          type="file"
                          accept=".json,application/json"
                          onChange={handleImportData}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Reset All */}
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="font-medium text-red-700 block text-xs">
                          {currentLang === 'ja'
                            ? 'すべてのデータを初期状態に戻す'
                            : '모든 데이터를 최초 기본값으로 초기화'}
                        </span>
                        <span className="text-[11px] text-[#8C8477]">
                          {currentLang === 'ja'
                            ? 'ローカルストレージの保存データを削除し、初期ポートフォリオ状態に戻します。'
                            : '추가 또는 수정한 모든 데이터를 지우고 처음 상태로 되돌립니다.'}
                        </span>
                      </div>
                      <button
                        onClick={onResetAllData}
                        className="px-3.5 py-1.5 border border-red-300 text-red-700 hover:bg-red-50 rounded cursor-pointer font-medium flex items-center gap-1.5 shrink-0"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{currentLang === 'ja' ? '初期化' : '초기화'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
