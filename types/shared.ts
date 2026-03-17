export type PriceRange = '$' | '$$' | '$$$' | '$$$$';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface ImageRef {
  src: string;
  alt: string;
  credit?: string;
}

export interface SEOMeta {
  title: string;
  description: string;
  canonical: string;
  og_image?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface RelatedLink {
  title: string;
  slug: string;
  type: 'neighborhood' | 'market' | 'comparison' | 'guide' | 'service' | 'event' | 'place' | 'best-of' | 'news' | 'local' | 'eat-drink';
}

export type NeighborhoodSlug =
  | 'the-heights'
  | 'west-little-rock'
  | 'downtown'
  | 'maumelle'
  | 'cammack-village'
  | 'north-little-rock'
  | 'conway'
  | 'chenal-valley'
  | 'pleasant-valley'
  | 'sherwood'
  | 'jacksonville'
  | 'cabot'
  | 'bryant'
  | 'benton'
  | 'hot-springs-village'
  | 'soma'
  | 'riverdale'
  | 'midtown'
  | 'colony-west-otter-creek'
  | 'scott-landmark';

export type BuyerSegment =
  | 'relocating-physicians'
  | 'first-time-buyers'
  | 'move-up-families'
  | 'investors'
  | 'empty-nesters';

export type EventCategory =
  | 'music'
  | 'food'
  | 'family'
  | 'arts'
  | 'sports'
  | 'markets'
  | 'community'
  | 'nightlife';

export type PlaceType =
  | 'restaurant'
  | 'bar'
  | 'coffee'
  | 'bakery'
  | 'food_truck'
  | 'brewery'
  | 'shop';

export type PlaceVibe =
  | 'casual'
  | 'upscale'
  | 'family'
  | 'date_night'
  | 'quick_bite'
  | 'dive'
  | 'trendy';

export type GoodFor =
  | 'brunch'
  | 'lunch'
  | 'dinner'
  | 'drinks'
  | 'late_night'
  | 'outdoor_seating'
  | 'groups'
  | 'solo'
  | 'work_remote';
