import React, { useState } from 'react';
import { Language, CafeVisit, isVideoMedia, CoffeeSectionContent } from '../types';
import { Plus, Coffee, MapPin, Upload, Edit3, Check } from 'lucide-react';
import { CoffeeEditModal } from './CoffeeEditModal';

interface CoffeeSectionProps {
  currentLang: Language;
  cafeVisits: CafeVisit[];
  onAddCafeVisit: (visit: Omit<CafeVisit, 'id'>) => void;
  handDripPhotoUrl: string | null;
  onUploadHandDripPhoto: (url: string) => void;
  coffeeContent: CoffeeSectionContent;
  onUpdateCoffeeContent: (content: CoffeeSectionContent) => void;
  onResetCoffeeContent: () => void;
  isAdmin: boolean;
  onOpenAdmin: () => void;
}

export const CoffeeSection: React.FC<CoffeeSectionProps> = ({
  currentLang,
  cafeVisits,
  onAddCafeVisit,
  handDripPhotoUrl,
  onUploadHandDripPhoto,
  coffeeContent,
  onUpdateCoffeeContent,
  onResetCoffeeContent,
  isAdmin,
  onOpenAdmin,
}) => {
  const [isAddVisitModalOpen, setIsAddVisitModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // New visit form
  const [shopName, setShopName] = useState('');
  const [location, setLocation] = useState('');
  const [coffeeHad, setCoffeeHad] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUploadHandDripPhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName.trim()) return;
    onAddCafeVisit({
      name: shopName.trim(),
      location: location.trim(),
      coffee: coffeeHad.trim(),
      notes: notes.trim(),
      date: date.trim() || undefined,
    });
    setShopName('');
    setLocation('');
    setCoffeeHad('');
    setNotes('');
    setDate('');
    setIsAddVisitModalOpen(false);
  };

  return (
    <section id="coffee" className="py-20 md:py-28 border-b border-[#EDE8DF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-14 sm:mb-18 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.2em] text-[#8F887C] uppercase font-sans-jp mb-2">
              Coffee
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif-jp text-[#1C1A19] font-normal tracking-wide">
              {coffeeContent.sectionTitle || (currentLang === 'ja' ? 'コーヒー' : '커피')}
            </h2>
            <p className="text-sm text-[#736D64] mt-2 max-w-xl">
              {coffeeContent.sectionSubtitle ||
                (currentLang === 'ja'
                  ? '現場で実際に学び、現在も探求を続けているコーヒー抽出の記録です。'
                  : '현장에서 직접 배우고 매일 꾸준히 이어가고 있는 실전 기록입니다.')}
            </p>
            <div className="w-12 h-[1px] bg-[#B0A799] mt-4" />
          </div>

          {/* Admin Edit Trigger */}
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-[#443E36] bg-[#ECE5DA] hover:bg-[#E2D9CB] rounded transition-colors cursor-pointer border border-[#DDD5C9] shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#6B533E]" />
                <span>
                  {currentLang === 'ja'
                    ? '説明文を編集 (1〜4番)'
                    : currentLang === 'ko'
                    ? '커피 설명글 수정 (1~4번)'
                    : 'Edit Explanations (1~4)'}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1 text-[11px] text-[#91897C] hover:text-[#423C34] transition-colors cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>{currentLang === 'ja' ? '管理者編集' : '관리자 수정'}</span>
              </button>
            )}
          </div>
        </div>

        {/* 01 Espresso & 02 Sensory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 mb-12">
          {/* 01 Espresso */}
          <div className="bg-[#FAF8F5] border border-[#E8E2D8] rounded-lg p-6 sm:p-8 flex flex-col justify-between relative group">
            {isAdmin && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-1.5 text-[#7A7165] hover:text-[#222] bg-[#F0EBE1] rounded cursor-pointer transition-opacity text-[11px] flex items-center gap-1"
                title="Edit 01 Espresso"
              >
                <Edit3 className="w-3 h-3" />
                <span>{currentLang === 'ja' ? '編集' : '수정'}</span>
              </button>
            )}
            <div>
              <span className="text-[11px] tracking-widest text-[#7E776E] block mb-2 font-mono">
                01 · {coffeeContent.espresso.tag}
              </span>
              <h3 className="text-lg sm:text-xl font-serif-jp text-[#262422] mb-3">
                {coffeeContent.espresso.title}
              </h3>
              <p className="text-sm text-[#544E45] leading-relaxed mb-4">
                {coffeeContent.espresso.body}
              </p>
            </div>

            <div className="pt-2">
              <div className="text-xs text-[#706A61] space-y-1.5 py-3 border-t border-[#ECE5DA]">
                {coffeeContent.espresso.points.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8E5A3C] shrink-0 mt-1.5" />
                    <span className="leading-relaxed">{pt}</span>
                  </div>
                ))}
              </div>
              {coffeeContent.espresso.note && (
                <p className="text-[11px] text-[#938C82] italic mt-1 leading-relaxed">
                  {coffeeContent.espresso.note}
                </p>
              )}
            </div>
          </div>

          {/* 02 Sensory / Cup Notes */}
          <div className="bg-[#FAF8F5] border border-[#E8E2D8] rounded-lg p-6 sm:p-8 flex flex-col justify-between relative group">
            {isAdmin && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-1.5 text-[#7A7165] hover:text-[#222] bg-[#F0EBE1] rounded cursor-pointer transition-opacity text-[11px] flex items-center gap-1"
                title="Edit 02 Sensory"
              >
                <Edit3 className="w-3 h-3" />
                <span>{currentLang === 'ja' ? '編集' : '수정'}</span>
              </button>
            )}
            <div>
              <span className="text-[11px] tracking-widest text-[#7E776E] block mb-2 font-mono">
                02 · {coffeeContent.sensory.tag}
              </span>
              <h3 className="text-lg sm:text-xl font-serif-jp text-[#262422] mb-3">
                {coffeeContent.sensory.title}
              </h3>
              <p className="text-sm text-[#544E45] leading-relaxed mb-4">
                {coffeeContent.sensory.body}
              </p>
            </div>

            <div className="text-xs text-[#706A61] space-y-1.5 py-3 border-t border-[#ECE5DA]">
              {coffeeContent.sensory.points.map((pt, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8E5A3C] shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 03 Hand Drip */}
        <div className="bg-[#FAF8F5] border border-[#E8E2D8] rounded-lg p-6 sm:p-8 mb-12 relative group">
          {isAdmin && (
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-1.5 text-[#7A7165] hover:text-[#222] bg-[#F0EBE1] rounded cursor-pointer transition-opacity text-[11px] flex items-center gap-1"
              title="Edit 03 Hand Drip"
            >
              <Edit3 className="w-3 h-3" />
              <span>{currentLang === 'ja' ? '編集' : '수정'}</span>
            </button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <div>
                <span className="text-[11px] tracking-widest text-[#7E776E] block mb-2 font-mono">
                  03 · {coffeeContent.handDrip.tag}
                </span>
                <h3 className="text-lg sm:text-xl font-serif-jp text-[#262422] mb-3">
                  {coffeeContent.handDrip.title}
                </h3>
                <p className="text-sm text-[#544E45] leading-relaxed">
                  {coffeeContent.handDrip.body}
                </p>
              </div>

              <div className="text-xs text-[#706A61] space-y-1.5 py-3 border-t border-[#ECE5DA]">
                {coffeeContent.handDrip.points.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8E5A3C] shrink-0 mt-1.5" />
                    <span className="leading-relaxed">{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hand Drip Photo / Video Area */}
            <div>
              {handDripPhotoUrl ? (
                <div className="relative rounded-md overflow-hidden border border-[#DDD6CB] aspect-video group">
                  {isVideoMedia(handDripPhotoUrl) ? (
                    <video
                      src={handDripPhotoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={handDripPhotoUrl}
                      alt="Hand drip coffee"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <label className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-white text-[11px] px-2.5 py-1 rounded cursor-pointer transition-colors z-10 flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    <span>
                      {currentLang === 'ja'
                        ? '写真・動画を変更'
                        : currentLang === 'ko'
                        ? '사진·영상 변경'
                        : 'Change Media'}
                    </span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#DDD7CC] hover:border-[#A89E90] rounded-md cursor-pointer transition-colors bg-[#F6F3EC]/50 text-center">
                  <Upload className="w-6 h-6 text-[#8A8377] mb-2" />
                  <span className="text-xs text-[#524C44] font-medium">
                    {currentLang === 'ja'
                      ? '実際のハンドドリップ写真・動画を追加'
                      : currentLang === 'ko'
                      ? '실제 핸드드립 사진·동영상 추가'
                      : 'Add Real Pour-Over Photo/Video'}
                  </span>
                  <span className="text-[11px] text-[#8C8579] mt-1">
                    {coffeeContent.handDrip.photoNote ||
                      (currentLang === 'ja'
                        ? '※ 自宅や店舗でのドリップ写真・動画を追加できます。'
                        : '※ 집이나 매장에서의 드립 추출 사진·영상을 등록할 수 있습니다.')}
                  </span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* 04 Cafe Visits Log */}
        <div className="bg-[#FAF8F5] border border-[#E8E2D8] rounded-lg p-6 sm:p-8 relative group">
          {isAdmin && (
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="absolute top-4 right-20 opacity-0 group-hover:opacity-100 p-1.5 text-[#7A7165] hover:text-[#222] bg-[#F0EBE1] rounded cursor-pointer transition-opacity text-[11px] flex items-center gap-1"
              title="Edit 04 Cafe Studies"
            >
              <Edit3 className="w-3 h-3" />
              <span>{currentLang === 'ja' ? '説明文編集' : '설명 수정'}</span>
            </button>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[11px] tracking-widest text-[#7E776E] block mb-1 font-mono">
                04 · {coffeeContent.cafeVisitsIntro.tag}
              </span>
              <h3 className="text-lg sm:text-xl font-serif-jp text-[#262422]">
                {coffeeContent.cafeVisitsIntro.title}
              </h3>
              <p className="text-xs text-[#706A61] mt-1 leading-relaxed">
                {coffeeContent.cafeVisitsIntro.body}
              </p>
            </div>
            <button
              onClick={() => setIsAddVisitModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#443E36] bg-[#ECE5DA] hover:bg-[#E2D9CB] rounded transition-colors self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{currentLang === 'ja' ? '訪問記録を追加' : '방문 기록 추가'}</span>
            </button>
          </div>

          {cafeVisits.length === 0 ? (
            <p className="text-xs text-[#8A847A] py-6 text-center italic border-t border-[#ECE5DA]">
              {currentLang === 'ja'
                ? '訪問した店舗の記録を追加できます。'
                : '방문한 카페의 기록을 등록할 수 있습니다.'}
            </p>
          ) : (
            <div className="divide-y divide-[#EDE7DC] border-t border-[#ECE5DA]">
              {cafeVisits.map((visit) => (
                <div key={visit.id} className="py-4 first:pt-4 last:pb-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <span className="text-sm font-serif-jp font-medium text-[#2C2926]">
                      {visit.name}
                    </span>
                    <span className="text-xs text-[#837D73] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#A89F90]" />
                      {visit.location}
                    </span>
                  </div>
                  {visit.coffee && (
                    <div className="text-xs text-[#634E3C] font-sans-jp mb-1 flex items-center gap-1.5">
                      <Coffee className="w-3 h-3" />
                      <span>{visit.coffee}</span>
                    </div>
                  )}
                  {visit.notes && (
                    <p className="text-xs text-[#666056] leading-relaxed">
                      {visit.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Coffee 01~04 Explanations Modal */}
      <CoffeeEditModal
        currentLang={currentLang}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        content={coffeeContent}
        onSave={onUpdateCoffeeContent}
        onReset={onResetCoffeeContent}
      />

      {/* Add Cafe Visit Modal */}
      {isAddVisitModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1C1A18]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] border border-[#DDD6CA] rounded-lg max-w-md w-full p-6 shadow-xl">
            <h4 className="text-base font-serif-jp text-[#1F1E1D] mb-4">
              {currentLang === 'ja'
                ? 'コーヒーショップ訪問の記録'
                : '커피숍 방문 기록 추가'}
            </h4>
            <form onSubmit={handleSaveVisit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#575148] mb-1 font-medium">
                  {currentLang === 'ja' ? '店名 *' : '카페 상호 *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="例: GLITCH COFFEE & ROASTERS"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#DDD6CB] rounded focus:outline-none focus:border-[#735A46] text-[#2C2926]"
                />
              </div>

              <div>
                <label className="block text-[#575148] mb-1 font-medium">
                  {currentLang === 'ja' ? '地域 / エリア' : '지역 / 위치'}
                </label>
                <input
                  type="text"
                  placeholder="例: 東京・神保町"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#DDD6CB] rounded focus:outline-none focus:border-[#735A46] text-[#2C2926]"
                />
              </div>

              <div>
                <label className="block text-[#575148] mb-1 font-medium">
                  {currentLang === 'ja' ? '飲んだコーヒー' : '마신 커피 / 메뉴'}
                </label>
                <input
                  type="text"
                  placeholder="例: 浅煎りエチオピア ドリップ"
                  value={coffeeHad}
                  onChange={(e) => setCoffeeHad(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#DDD6CB] rounded focus:outline-none focus:border-[#735A46] text-[#2C2926]"
                />
              </div>

              <div>
                <label className="block text-[#575148] mb-1 font-medium">
                  {currentLang === 'ja' ? 'メモ / 感じたこと' : '메모 / 느낀 점'}
                </label>
                <textarea
                  rows={3}
                  placeholder="店舗の雰囲気や抽出の印象など"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#DDD6CB] rounded focus:outline-none focus:border-[#735A46] text-[#2C2926]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EDE7DD]">
                <button
                  type="button"
                  onClick={() => setIsAddVisitModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-[#635E56] hover:text-[#262421] cursor-pointer"
                >
                  {currentLang === 'ja' ? 'キャンセル' : '취소'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs text-white bg-[#5E4735] hover:bg-[#4D3A2B] rounded cursor-pointer font-medium"
                >
                  {currentLang === 'ja' ? '保存する' : '저장하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
