'use client';

import { useState } from 'react';
import EventCard from '@/components/shared/EventCard';
import FilterBar from '@/components/shared/FilterBar';
import type { Event } from '@/types/content';

const CATEGORIES = [
  { value: 'all', label: 'All Events' },
  { value: 'music', label: 'Music' },
  { value: 'food', label: 'Food' },
  { value: 'family', label: 'Family' },
  { value: 'arts', label: 'Arts' },
  { value: 'sports', label: 'Sports' },
  { value: 'markets', label: 'Markets' },
  { value: 'community', label: 'Community' },
  { value: 'nightlife', label: 'Nightlife' },
];

interface EventsGridProps {
  events: Event[];
}

export default function EventsGrid({ events }: EventsGridProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered =
    activeCategory === 'all'
      ? events
      : events.filter((e) => e.category === activeCategory);

  return (
    <div>
      <FilterBar
        filters={CATEGORIES}
        active={activeCategory}
        onChange={setActiveCategory}
        label="Category"
      />
      {filtered.length === 0 ? (
        <p className="text-[#555555] text-center py-16 text-sm">
          No events in this category right now. Check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {filtered.map((event) => (
            <EventCard
              key={event.slug}
              slug={event.slug}
              event_name={event.event_name}
              date_start={event.date_start}
              time={event.time}
              venue_name={event.venue_name}
              category={event.category}
              price_range={event.price_range}
              highlight={event.highlight}
            />
          ))}
        </div>
      )}
    </div>
  );
}
