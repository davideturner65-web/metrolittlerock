import Link from 'next/link';
import Image from 'next/image';

interface NeighborhoodCardProps {
  slug: string;
  name: string;
  median_price: string;
  vibe_tags: string[];
  hero_image?: { src: string; alt: string };
}

export default function NeighborhoodCard({ slug, name, median_price, vibe_tags, hero_image }: NeighborhoodCardProps) {
  return (
    <Link href={`/neighborhoods/${slug}`} className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="relative h-40 bg-[#F0F4F8]">
        {hero_image ? (
          <Image
            src={hero_image.src}
            alt={hero_image.alt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[#2E86C1] text-4xl font-bold opacity-20">
            {name.charAt(0)}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-[#1C1C1C] group-hover:text-[#1B4F72] transition-colors">{name}</h3>
        <p className="text-sm text-[#555555] mt-1">Median: {median_price}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {vibe_tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs bg-[#F0F4F8] text-[#555555] px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
