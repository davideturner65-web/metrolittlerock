'use client';

import { useState } from 'react';
import FilterBar from '@/components/shared/FilterBar';
import PlaceCard from '@/components/shared/PlaceCard';
import type { BusinessSpotlight } from '@/types/content';
import type { PlaceType } from '@/types/shared';

const TYPE_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'restaurant', label: 'Restaurants' },
  { value: 'bar', label: 'Bars' },
  { value: 'brewery', label: 'Breweries' },
  { value: 'coffee', label: 'Coffee' },
  { value: 'bakery', label: 'Bakeries' },
  { value: 'shop', label: 'Shops' },
];

interface PlacesGridProps {
  places: BusinessSpotlight[];
}

export default function PlacesGrid({ places }: PlacesGridProps) {
  const [activeType, setActiveType] = useState('all');

  const filtered = activeType === 'all'
    ? places
    : places.filter((p) => p.type === (activeType as PlaceType));

  return (
    <div>
      <FilterBar
        filters={TYPE_FILTERS}
        active={activeType}
        onChange={setActiveType}
        label="Type"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filtered.map((place) => (
          <PlaceCard
            key={place.slug}
            slug={place.slug}
            name={place.name}
            type={place.type}
            vibe={place.vibe}
            price_range={place.price_range}
            one_liner={place.description.split('.')[0]}
          />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-[#555555] py-12">No places found in this category yet.</p>
      )}
    </div>
  );
}
