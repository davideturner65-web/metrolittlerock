import Link from 'next/link';
import Badge from './Badge';
import type { EventCategory } from '@/types/shared';

interface EventCardProps {
  slug: string;
  event_name: string;
  date_start: string;
  time: string;
  venue_name: string;
  category: EventCategory;
  price_range: 'free' | '$' | '$$' | '$$$';
  highlight?: boolean;
}

const categoryVariant: Record<EventCategory, 'primary' | 'accent' | 'warm' | 'success' | 'neutral'> = {
  music: 'primary',
  food: 'warm',
  family: 'success',
  arts: 'accent',
  sports: 'primary',
  markets: 'warm',
  community: 'success',
  nightlife: 'accent',
};

export default function EventCard({ slug, event_name, date_start, time, venue_name, category, price_range, highlight }: EventCardProps) {
  const dateObj = new Date(date_start);
  const formatted = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <Link href={`/events/${slug}`} className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border-l-4 border-[#2E86C1]">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-[#1C1C1C] group-hover:text-[#1B4F72] transition-colors leading-snug">
            {event_name}
          </h3>
          <p className="text-sm text-[#555555] mt-1">{formatted} · {time}</p>
          <p className="text-sm text-[#555555]">{venue_name}</p>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <Badge label={category} variant={categoryVariant[category]} />
          <span className="text-xs text-[#555555]">{price_range === 'free' ? 'Free' : price_range}</span>
        </div>
      </div>
      {highlight && (
        <div className="mt-2 text-xs font-medium text-[#D4740A]">★ Editor&apos;s Pick</div>
      )}
    </Link>
  );
}
