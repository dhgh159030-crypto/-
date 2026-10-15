export type Language = 'ja' | 'ko' | 'en';

export interface LatteArtPhoto {
  id: string;
  title: string;
  description: string;
  date?: string;
  type?: string;
  imageUrl: string;
  mediaType?: 'image' | 'video';
}

export interface CafeVisit {
  id: string;
  name: string;
  location: string;
  coffee: string;
  notes: string;
  date?: string;
}

export interface FoodPhoto {
  id: string;
  title: string;
  description: string;
  category: string;
  date?: string;
  imageUrl?: string;
  mediaType?: 'image' | 'video';
}

export interface CoffeeSectionContent {
  sectionTitle?: string;
  sectionSubtitle?: string;
  espresso: {
    title: string;
    tag: string;
    body: string;
    points: string[];
    note?: string;
  };
  sensory: {
    title: string;
    tag: string;
    body: string;
    points: string[];
  };
  handDrip: {
    title: string;
    tag: string;
    body: string;
    points: string[];
    photoNote?: string;
  };
  cafeVisitsIntro: {
    title: string;
    tag: string;
    body: string;
  };
}

export interface FoodOverviewContent {
  title: string;
  subtitle: string;
  roleBadge: string;
  roleTitle: string;
  roleDesc: string;
  pastNote: string;
}

export interface ProfileInfo {
  name: string;
  email: string;
  instagram: string;
  location: string;
}

export interface HeroPhotoInfo {
  imageUrl: string;
  title: string;
  type?: string;
  description?: string;
  mediaType?: 'image' | 'video';
}

export const isVideoMedia = (url?: string, mediaType?: 'image' | 'video'): boolean => {
  if (mediaType === 'video') return true;
  if (!url) return false;
  return (
    url.startsWith('data:video/') ||
    url.endsWith('.mp4') ||
    url.endsWith('.webm') ||
    url.endsWith('.mov') ||
    url.endsWith('.ogg') ||
    url.includes('blob:')
  );
};
