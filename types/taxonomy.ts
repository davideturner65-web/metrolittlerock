import { Coordinates, NeighborhoodSlug, BuyerSegment, PriceRange, PlaceType, PlaceVibe } from './shared';

export interface NeighborhoodContext {
  slug: NeighborhoodSlug;
  name: string;
  display_name: string;
  coordinates: Coordinates;

  audience: string;
  pain_points: string[];
  what_draws_people: string[];
  content_that_works: string[];
  key_subtopics: string[];
  vibe_tags: string[];
  best_for: string[];
  typical_weekend: string;

  market: {
    median_price: number;
    avg_days_on_market: number;
    price_trend_yoy: string;
    inventory_level: 'low' | 'moderate' | 'high';
    price_range: string;
    property_types: string[];
  };

  schools: {
    name: string;
    type: 'public' | 'private' | 'charter';
    grades: string;
    rating?: number;
  }[];

  commute: {
    to_downtown: string;
    to_airport: string;
    to_uams: string;
    to_major_employers: { name: string; time: string }[];
  };

  top_restaurants: {
    name: string;
    type: PlaceType;
    vibe: PlaceVibe;
    price_range: PriceRange;
    known_for: string;
  }[];

  top_bars_coffee: {
    name: string;
    type: 'bar' | 'coffee' | 'brewery';
    vibe: PlaceVibe;
    known_for: string;
  }[];

  parks_outdoor: {
    name: string;
    type: 'park' | 'trail' | 'water' | 'playground' | 'greenway';
    best_for: string;
  }[];

  landmarks: {
    name: string;
    description: string;
  }[];

  development_notes: string;
  proximity_to: { area: string; drive_time: string }[];
}

export interface BuyerSegmentContext {
  id: BuyerSegment;
  name: string;
  description: string;
  real_estate_priorities: string[];
  lifestyle_content_hooks: string[];
  pain_points: string[];
  recommended_neighborhoods: NeighborhoodSlug[];
  content_preferences: string[];
}

export interface NeighborhoodRelationship {
  slug: NeighborhoodSlug;
  adjacent_to: NeighborhoodSlug[];
  similar_to: NeighborhoodSlug[];
  contrast_to: NeighborhoodSlug[];
  feeder_from: NeighborhoodSlug[];
  feeder_to: NeighborhoodSlug[];
}
