import Link from 'next/link';
import Badge from './Badge';
import type { PlaceType, PlaceVibe, PriceRange } from '@/types/shared';

interface PlaceCardProps {
  slug: string;
  name: string;
  type: PlaceType;
  vibe: PlaceVibe;
  price_range: PriceRange;
  neighborhood?: string;
  one_liner?: string;
}

const vibeVariant: Record<PlaceVibe, 'primary' | 'accent' | 'warm' | 'success' | 'neutral'> = {
  casual: 'neutral',
  upscale: 'primary',
  family: 'success',
  date_night: 'accent',
  quick_bite: 'neutral',
  dive: 'neutral',
  trendy: 'warm',
};

export default function PlaceCard({ slug, name, type, vibe, price_range, neighborhood, one_liner }: PlaceCardProps) {
  return (
    <Link href={`/places/${slug}`} className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[#1C1C1C] group-hover:text-[#1B4F72] transition-colors truncate">
            {name}
          </h3>
          {neighborhood && <p className="text-xs text-[#555555] mt-0.5">{neighborhood}</p>}
          {one_liner && <p className="text-sm text-[#555555] mt-1 line-clamp-2">{one_liner}</p>}
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <Badge label={vibe.replace('_', ' ')} variant={vibeVariant[vibe]} />
          <span className="text-sm font-medium text-[#555555]">{price_range}</span>
        </div>
      </div>
      <p className="text-xs text-[#555555] mt-2 capitalize">{type.replace('_', ' ')}</p>
    </Link>
  );
}
