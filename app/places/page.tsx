import type { Metadata } from 'next';
import { getAllSpotlights } from '@/lib/content';
import { breadcrumbSchema, toJsonLd } from '@/lib/schema';
import PlacesGrid from './_components/PlacesGrid';
import NewsletterSignup from '@/components/shared/NewsletterSignup';

export const metadata: Metadata = {
  title: 'Local Places — Restaurants, Bars & Shops in Metro Little Rock',
  description: 'Discover the best restaurants, bars, breweries, coffee shops, and local businesses in Little Rock and the surrounding metro. Curated spotlights on the places locals love.',
  alternates: { canonical: '/places' },
  openGraph: {
    title: 'Local Places — Restaurants, Bars & Shops in Metro Little Rock',
    description: 'Discover the best restaurants, bars, breweries, coffee shops, and local businesses in Little Rock and the surrounding metro.',
    url: '/places',
  },
};

const breadcrumb = breadcrumbSchema([
  { label: 'Home', href: '/' },
  { label: 'Local Places', href: '/places' },
]);

export default function PlacesHubPage() {
  const allPlaces = getAllSpotlights();
  const featured = allPlaces.filter((p) => p.featured);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumb) }}
      />

      {/* Hero */}
      <section className="bg-[#1B4F72] text-white py-14 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#AED6F1] mb-3">
            Metro Little Rock
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Local Places</h1>
          <p className="text-lg text-[#D6EAF8] max-w-2xl mx-auto">
            Restaurants, bars, breweries, coffee shops, and shops worth knowing — curated by people who actually live here.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* Featured Spotlights */}
        {featured.length > 0 && (
          <section className="mb-14">
            <h2 className="text-2xl font-bold text-[#1B4F72] mb-6">Editor&apos;s Picks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((place) => (
                <a
                  key={place.slug}
                  href={`/places/${place.slug}`}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-[#E5E5E5]"
                >
                  {place.image && (
                    <div className="h-44 bg-[#D6EAF8] relative overflow-hidden">
                      <img
                        src={place.image.src}
                        alt={place.image.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  {!place.image && (
                    <div className="h-44 bg-gradient-to-br from-[#1B4F72] to-[#2E86C1] flex items-center justify-center">
                      <span className="text-white text-4xl capitalize">
                        {place.type === 'restaurant' ? '🍽️'
                          : place.type === 'bar' || place.type === 'brewery' ? '🍺'
                          : place.type === 'coffee' ? '☕'
                          : place.type === 'bakery' ? '🥐'
                          : '🏪'}
                      </span>
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-[#1C1C1C] group-hover:text-[#1B4F72] transition-colors">
                        {place.name}
                      </h3>
                      <span className="text-sm font-medium text-[#555555] flex-shrink-0">
                        {place.price_range}
                      </span>
                    </div>
                    <p className="text-xs text-[#555555] mb-2 capitalize">
                      {place.type.replace('_', ' ')} · {place.vibe.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-[#333333] line-clamp-2">
                      {place.description.split('.')[0]}.
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* All Places with filter */}
        <section>
          <h2 className="text-2xl font-bold text-[#1B4F72] mb-6">Browse All Places</h2>
          <PlacesGrid places={allPlaces} />
        </section>

        {/* Newsletter */}
        <div className="mt-16">
          <NewsletterSignup />
        </div>
      </div>
    </>
  );
}
