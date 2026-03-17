import {
  SEOMeta, FAQ, RelatedLink, ImageRef, Coordinates,
  NeighborhoodSlug, BuyerSegment, PriceRange,
  EventCategory, PlaceType, PlaceVibe, GoodFor
} from './shared';

// ═══════════════════════════════════════════
// REAL ESTATE CORE
// ═══════════════════════════════════════════

export interface NeighborhoodGuide {
  slug: NeighborhoodSlug;
  name: string;
  display_name: string;
  seo: SEOMeta;
  hero_image: ImageRef;

  hero_stats: {
    median_price: string;
    avg_days_on_market: number;
    price_trend: string;
    walkability_score?: number;
  };

  intro: string;
  real_estate_overview: string;
  schools_section: {
    overview: string;
    highlights: { name: string; note: string }[];
  };
  lifestyle_section: {
    overview: string;
    dining: string;
    outdoor: string;
    culture: string;
    family?: string;
  };
  commute_section: {
    overview: string;
    key_routes: { destination: string; time: string; notes: string }[];
  };
  buyer_profile: {
    ideal_for: string[];
    typical_buyer: string;
    budget_range: string;
  };
  faqs: FAQ[];
  related: RelatedLink[];
}

export interface MarketReport {
  slug: string;
  neighborhood_slug: NeighborhoodSlug;
  neighborhood_name: string;
  seo: SEOMeta;
  report_date: string;

  summary: string;

  stats: {
    median_price: number;
    median_price_change_yoy: string;
    avg_days_on_market: number;
    dom_change_yoy: string;
    active_listings: number;
    sold_last_30_days: number;
    price_per_sqft: number;
    list_to_sale_ratio: string;
  };

  price_trend_data: {
    month: string;
    median_price: number;
  }[];

  inventory_analysis: string;
  buyer_insights: string;
  seller_insights: string;
  forecast: string;
  related: RelatedLink[];
}

export interface ServicePage {
  slug: string;
  title: string;
  seo: SEOMeta;
  hero_image: ImageRef;
  intro: string;
  sections: {
    heading: string;
    body: string;
  }[];
  cta: {
    heading: string;
    body: string;
    button_text: string;
  };
  faqs: FAQ[];
  related: RelatedLink[];
}

export interface ResourceGuide {
  slug: string;
  title: string;
  seo: SEOMeta;
  hero_image: ImageRef;
  intro: string;
  sections: {
    id: string;
    heading: string;
    body: string;
    checklist?: string[];
  }[];
  faqs: FAQ[];
  related: RelatedLink[];
}

export interface NeighborhoodComparison {
  slug: string;
  neighborhood_a: NeighborhoodSlug;
  neighborhood_b: NeighborhoodSlug;
  seo: SEOMeta;
  intro: string;

  metrics: {
    category: string;
    a_value: string;
    b_value: string;
    winner: 'a' | 'b' | 'tie';
    notes: string;
  }[];

  summary: string;
  related: RelatedLink[];
}

// ═══════════════════════════════════════════
// LOCAL LIFESTYLE LAYER
// ═══════════════════════════════════════════

export interface Event {
  slug: string;
  event_name: string;
  seo: SEOMeta;
  date_start: string;
  date_end?: string;
  time: string;
  venue_name: string;
  venue_address: string;
  venue_coordinates: Coordinates;
  neighborhood_slug?: NeighborhoodSlug;
  category: EventCategory;
  price_range: 'free' | '$' | '$$' | '$$$';
  ticket_url?: string;
  description: string;
  highlight: boolean;
  image?: ImageRef;
  tags: string[];
  source_url?: string;
  recurring?: {
    pattern: 'weekly' | 'biweekly' | 'monthly' | 'annual';
    day_of_week?: string;
  };
}

export interface BusinessSpotlight {
  slug: string;
  name: string;
  seo: SEOMeta;
  type: PlaceType;
  cuisine_tags: string[];
  neighborhood_slug: NeighborhoodSlug;
  address: string;
  coordinates: Coordinates;
  phone?: string;
  website?: string;
  hours: { [day: string]: string };
  price_range: PriceRange;
  vibe: PlaceVibe;
  description: string;
  must_try_items: string[];
  good_for: GoodFor[];
  image?: ImageRef;
  google_place_id?: string;
  featured: boolean;
  related: RelatedLink[];
}

export interface BestOfList {
  slug: string;
  title: string;
  category: string;
  area: string;
  seo: SEOMeta;
  intro: string;
  items: {
    rank: number;
    place_slug: string;
    name: string;
    one_liner: string;
    why_its_here: string;
    best_for: string;
  }[];
  honorable_mentions?: {
    name: string;
    note: string;
  }[];
  related: RelatedLink[];
}

export interface SeasonalGuide {
  slug: string;
  title: string;
  seo: SEOMeta;
  hero_image: ImageRef;
  season: 'spring' | 'summer' | 'fall' | 'winter' | 'holiday';
  intro: string;
  sections: {
    heading: string;
    body: string;
    places?: {
      name: string;
      slug?: string;
      note: string;
    }[];
  }[];
  related: RelatedLink[];
}

export interface WeekendGuide {
  slug: string;
  title: string;
  seo: SEOMeta;
  date_range: { start: string; end: string };
  intro: string;
  picks: {
    event_slug: string;
    category_label: string;
    editorial_note: string;
  }[];
  also_happening: string[];
  related: RelatedLink[];
}

export interface NewsPost {
  slug: string;
  title: string;
  seo: SEOMeta;
  date_published: string;
  category: 'opening' | 'closing' | 'development' | 'renovation' | 'announcement';
  neighborhood_slugs: NeighborhoodSlug[];
  summary: string;
  body_sections: {
    heading?: string;
    body: string;
  }[];
  impact_note?: string;
  source_url?: string;
  image?: ImageRef;
  related: RelatedLink[];
}

export interface LifestyleArticle {
  slug: string;
  title: string;
  seo: SEOMeta;
  hero_image: ImageRef;
  category: 'outdoor' | 'family' | 'arts' | 'day-trip' | 'newcomer' | 'general';
  intro: string;
  sections: {
    id: string;
    heading: string;
    body: string;
    places?: {
      name: string;
      address?: string;
      note: string;
      link?: string;
    }[];
  }[];
  related: RelatedLink[];
}
