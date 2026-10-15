import React, { useState, useEffect } from 'react';
import { FoodPhoto, Language, isVideoMedia } from '../types';
import { X, Upload, Check, Trash2 } from 'lucide-react';

interface FoodDishModalProps {
  currentLang: Language;
  isOpen: boolean;
  onClose: () => void;
  dishToEdit?: FoodPhoto | null;
  onSave: (dish: FoodPhoto) => void;
}

const commonCategories = [
  'Pizza',
  'Main Dish',
  'Pasta',
  'Meat',
  'Appetizer',
  'Dessert',
  'Prep / 仕込み',
];

export const FoodDishModal: React.FC<FoodDishModalProps> = ({
  currentLang,
  isOpen,
  onClose,
  dishToEdit,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Pizza');
  const [customCategory, setCustomCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [mediaType, setMediaType] = useState<'image' | 'video' | undefined>(undefined);

  useEffect(() => {
    if (dishToEdit) {
      setTitle(dishToEdit.title);
      if (commonCategories.includes(dishToEdit.category)) {
        setCategory(dishToEdit.category);
        setCustomCategory('');
      } else {
        setCategory('Other');
        setCustomCategory(dishToEdit.category);
      }
      setDescription(dishToEdit.description);
      setDate(dishToEdit.date || '');
      setImageUrl(dishToEdit.imageUrl);
      setMediaType(dishToEdit.mediaType);
    } else {
      setTitle('');
      setCategory('Pizza');
      setCustomCategory('');
      setDescription('');
      setDate('');
      setImageUrl(undefined);
      setMediaType(undefined);
    }
  }, [dishToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
          setMediaType(isVideo ? 'video' : 'image');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalCategory =
      category === 'Other' && customCategory.trim()
        ? customCategory.trim()
        : category;

    const finalDish: FoodPhoto = {
      id: dishToEdit ? dishToEdit.id : `dish-${Date.now()}`,
      title: title.trim(),
      category: finalCategory,
      description: description.trim(),
      date: date.trim() || undefined,
      imageUrl,
      mediaType: imageUrl
        ? mediaType || (isVideoMedia(imageUrl) ? 'video' : 'image')
        : undefined,
    };

    onSave(finalDish);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#161413]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#FAF8F5] border border-[#DDD6CB] rounded-lg max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#EBE5DB] flex items-center justify-between bg-[#F5EFE6]">
          <h3 className="text-sm sm:text-base font-serif-jp text-[#1C1A18] font-medium">
            {dishToEdit
              ? currentLang === 'ja'
                ? '料理メニューの編集'
                : '요리 정보 및 사진 수정'
              : currentLang === 'ja'
              ? '新しい料理・メニューの追加'
              : '새 요리 및 사진 등록'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-[#736C62] hover:text-[#1F1E1D] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
          {/* Photo / Video Upload Area */}
          <div>
            <label className="block font-medium text-[#443E36] mb-1.5">
              {currentLang === 'ja'
                ? '料理の写真・調理動画 (任意)'
                : '요리 사진 또는 조리 영상 (선택)'}
            </label>

            {imageUrl ? (
              <div className="relative rounded-md overflow-hidden border border-[#D5CEC2] aspect-video bg-[#ECE6DC] group">
                {isVideoMedia(imageUrl, mediaType) ? (
                  <video
                    src={imageUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity">
                  <label className="bg-white text-[#2C2926] px-3 py-1.5 rounded cursor-pointer text-xs font-medium hover:bg-[#FAF8F5]">
                    {currentLang === 'ja' ? 'ファイルを変更' : '파일 변경'}
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl(undefined);
                      setMediaType(undefined);
                    }}
                    className="bg-red-600 text-white px-3 py-1.5 rounded cursor-pointer text-xs font-medium hover:bg-red-700"
                  >
                    {currentLang === 'ja' ? '削除' : '삭제'}
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#DDD7CC] hover:border-[#968C7D] rounded-md cursor-pointer transition-colors bg-[#F7F4EE] text-center">
                <Upload className="w-6 h-6 text-[#7E776D] mb-2" />
                <span className="font-medium text-[#3E3831]">
                  {currentLang === 'ja'
                    ? '写真または動画ファイルを選択'
                    : '요리 사진이나 동영상 파일 선택'}
                </span>
                <span className="text-[11px] text-[#8A8377] mt-0.5">
                  JPG, PNG, WebP, MP4, MOV 등 지원
                </span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Dish Title */}
          <div>
            <label className="block font-medium text-[#443E36] mb-1">
              {currentLang === 'ja' ? '料理名・担当メニュー名 *' : '요리명 / 담당 메뉴명 *'}
            </label>
            <input
              type="text"
              required
              placeholder={
                currentLang === 'ja'
                  ? '例: 薪窯ピッツァ マルゲリータ'
                  : '예: 화덕 마르게리따 피자 / 수비드 살치살 스테이크'
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#DDD6CB] rounded text-[#222]"
            />
          </div>

          {/* Category & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#443E36] mb-1">
                {currentLang === 'ja' ? 'カテゴリー' : '카테고리'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DDD6CB] rounded text-[#222]"
              >
                {commonCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value="Other">
                  {currentLang === 'ja' ? 'その他 (直接入力)' : '기타 (직접 입력)'}
                </option>
              </select>
              {category === 'Other' && (
                <input
                  type="text"
                  placeholder="카테고리명 입력"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full mt-1.5 px-3 py-1.5 bg-white border border-[#DDD6CB] rounded text-[#222]"
                />
              )}
            </div>

            <div>
              <label className="block font-medium text-[#443E36] mb-1">
                {currentLang === 'ja' ? '時期・店舗名 (任意)' : '시기 또는 담당 매장 (선택)'}
              </label>
              <input
                type="text"
                placeholder={
                  currentLang === 'ja'
                    ? '例: GARB GREEN WALK / 2023 - 現在'
                    : '예: GARB GREEN WALK / 2023 - 현재'
                }
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DDD6CB] rounded text-[#222]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium text-[#443E36] mb-1">
              {currentLang === 'ja'
                ? '調理・担当内容の詳細説明 *'
                : '조리 및 담당 내용 상세 설명 *'}
            </label>
            <textarea
              rows={4}
              required
              placeholder={
                currentLang === 'ja'
                  ? '生地の発酵見極め、高温オーブンでの火入れ、盛り付けのスピード、ソースや下味のこだわりなど'
                  : '도우의 발효 상태 관리 및 오븐 베이킹, 불 조절 및 시어링, 담음새, 소스 배합, 위생 및 주문 신속 대응 등'
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#DDD6CB] rounded text-[#222] leading-relaxed"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-[#EDE7DD] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-[#635E56] hover:text-[#262421] cursor-pointer"
            >
              {currentLang === 'ja' ? 'キャンセル' : '취소'}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#5E4735] hover:bg-[#4D3A2B] text-white rounded cursor-pointer font-medium flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>
                {dishToEdit
                  ? currentLang === 'ja'
                    ? '変更を保存'
                    : '수정사항 저장'
                  : currentLang === 'ja'
                  ? '料理を登録'
                  : '요리 등록하기'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
