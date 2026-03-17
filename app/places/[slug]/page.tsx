import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllSpotlights, getSpotlight, getSpotlightsByNeighborhood } from '@/lib/content';
import { localBusinessSchema, breadcrumbSchema, toJsonLd } from '@/lib/schema';
import Badge from '@/components/shared/Badge';
import PlaceCard from '@/components/shared/PlaceCard';
import CTABlock from '@/components/shared/CTABlock';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import type { NeighborhoodSlug, RelatedLink } from '@/types/shared';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const places = getAllSpotlights();
  return places.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const place = getSpotlight(params.slug);
  if (!place) return {};
  return {
    title: place.seo.title,
    description: place.seo.description,
    alternates: { canonical: place.seo.canonical },
    openGraph: {
      title: place.seo.title,
      description: place.seo.description,
      url: place.seo.canonical,
    },
  };
}

function mapsLink(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function formatHours(hours: { [day: string]: string }) {
  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return dayOrder.filter((d) => hours[d]).map((d) => ({ day: d, hours: hours[d] }));
}

function relatedUrl(r: RelatedLink): string {
  const prefixes: Record<string, string> = {
    neighborhood: '/neighborhoods',
    market: '/market-reports',
    comparison: '/compare',
    guide: '/guides',
    service: '/services',
    event: '/events',
    place: '/places',
    'best-of': '/best-of',
    news: '/news',
    local: '/local',
  };
  return `${prefixes[r.type] ?? ''}/${r.slug}`;
}

const typeColor: Record<string, string> = {
  restaurant: 'bg-[#1B4F72]',
  bar: 'bg-[#1C1C1C]',
  brewery: 'bg-[#D4740A]',
  coffee: 'bg-[#6B4423]',
  bakery: 'bg-[#D4740A]',
  food_truck: 'bg-[#1E8449]',
  shop: 'bg-[#2E86C1]',
};

export default function BusinessSpotlightPage({ params }: Props) {
  const place = getSpotlight(params.slug);
  if (!place) notFound();

  const neighborhoodPlaces = getSpotlightsByNeighborhood(place.neighborhood_slug as NeighborhoodSlug)
    .filter((p) => p.slug !== place.slug)
    .slice(0, 3);

  const businessSchema = localBusinessSchema({
    name: place.name,
    slug: place.slug,
    type: place.type,
    description: place.description,
    address: place.address,
    lat: place.coordinates.lat,
    lng: place.coordinates.lng,
    phone: place.phone,
    website: place.website,
    price_range: place.price_range,
  });

  const breadcrumb = breadcrumbSchema([
    { label: 'Home', href: '/' },
    { label: 'Local Places', href: '/places' },
    { label: place.name, href: place.seo.canonical },
  ]);

  const heroColor = typeColor[place.type] ?? 'bg-[#1B4F72]';
  const formattedHours = formatHours(place.hours);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(businessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumb) }}
      />

      {/* Hero */}
      <section className={`${heroColor} text-white`}>
        {place.image ? (
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img
              src={place.image.src}
              alt={place.image.alt}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 max-w-5xl mx-auto">
              <Breadcrumbs
                crumbs={[
                  { label: 'Local Places', href: '/places' },
                  { label: place.name },
                ]}
              />
              <h1 className="text-3xl md:text-4xl font-bold mt-3">{place.name}</h1>
              <p className="text-white/80 mt-1 capitalize">
                {place.type.replace('_', ' ')} · {place.vibe.replace('_', ' ')} · {place.price_range}
              </p>
            </div>
          </div>
        ) : (
          <div className="px-4 py-10 max-w-5xl mx-auto">
            <Breadcrumbs
              crumbs={[
                { label: 'Local Places', href: '/places' },
                { label: place.name },
              ]}
            />
            <h1 className="text-3xl md:text-4xl font-bold mt-4">{place.name}</h1>
            <p className="text-white/80 mt-2 capitalize">
              {place.type.replace('_', ' ')} · {place.vibe.replace('_', ' ')} · {place.price_range}
            </p>
          </div>
        )}
      </section>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main */}
          <article className="lg:col-span-2 space-y-10">

            {/* About */}
            <section>
              <h2 className="text-xl font-bold text-[#1B4F72] mb-3">About</h2>
              <p className="text-[#333333] leading-relaxed text-lg">{place.description}</p>
            </section>

            {/* Must Try */}
            {place.must_try_items.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-[#1B4F72] mb-4">Must Try</h2>
                <ul className="space-y-2">
                  {place.must_try_items.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 bg-white rounded-lg border border-[#E5E5E5] px-4 py-3">
                      <span className="text-[#D4740A] font-bold text-sm">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-[#1C1C1C] font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Good For */}
            {place.good_for.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-[#1B4F72] mb-4">Good For</h2>
                <div className="flex flex-wrap gap-2">
                  {place.good_for.map((tag) => (
                    <Badge key={tag} label={tag.replace('_', ' ')} variant="neutral" />
                  ))}
                </div>
              </section>
            )}

            {/* Tags */}
            {place.cuisine_tags.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-[#1B4F72] mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {place.cuisine_tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-[#EBF5FB] text-[#1B4F72] text-sm px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Related Places */}
            {neighborhoodPlaces.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-[#1B4F72] mb-4">
                  More in {place.neighborhood_slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </h2>
                <div className="space-y-3">
                  {neighborhoodPlaces.map((p) => (
                    <PlaceCard
                      key={p.slug}
                      slug={p.slug}
                      name={p.name}
                      type={p.type}
                      vibe={p.vibe}
                      price_range={p.price_range}
                      one_liner={p.description.split('.')[0]}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Related Links */}
            {place.related.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-[#1B4F72] mb-4">Related Guides</h2>
                <div className="flex flex-wrap gap-3">
                  {place.related.map((r) => (
                    <Link
                      key={r.slug}
                      href={relatedUrl(r)}
                      className="bg-white border border-[#E5E5E5] rounded-lg px-4 py-2 text-sm text-[#2E86C1] font-medium hover:bg-[#EBF5FB] transition-colors"
                    >
                      {r.title} →
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* CTA */}
            <CTABlock
              heading="Find your next neighborhood"
              body="Compare Little Rock-area neighborhoods by schools, commute, price, and lifestyle."
              button_text="Explore Neighborhoods"
              href="/neighborhoods"
            />
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">

            {/* Visit Box */}
            <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-sm p-5 space-y-4">
              <h3 className="font-bold text-[#1B4F72] text-lg">Visit</h3>

              <div>
                <p className="text-xs text-[#555555] uppercase tracking-wide font-semibold mb-1">Address</p>
                <a
                  href={mapsLink(place.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#2E86C1] hover:underline"
                >
                  {place.address}
                </a>
              </div>

              {place.phone && (
                <div>
                  <p className="text-xs text-[#555555] uppercase tracking-wide font-semibold mb-1">Phone</p>
                  <a href={`tel:${place.phone}`} className="text-sm text-[#2E86C1] hover:underline">
                    {place.phone}
                  </a>
                </div>
              )}

              {place.website && (
                <div>
                  <p className="text-xs text-[#555555] uppercase tracking-wide font-semibold mb-1">Website</p>
                  <a
                    href={place.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#2E86C1] hover:underline break-all"
                  >
                    {place.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}

              <div>
                <p className="text-xs text-[#555555] uppercase tracking-wide font-semibold mb-2">Hours</p>
                <div className="space-y-1">
                  {formattedHours.map(({ day, hours }) => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="text-[#555555]">{day.slice(0, 3)}</span>
                      <span className="text-[#1C1C1C] font-medium">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={mapsLink(place.address)}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-[#1B4F72] text-white font-semibold py-2.5 rounded-lg hover:bg-[#154360] transition-colors text-sm"
              >
                Get Directions
              </a>
            </div>

            {/* Neighborhood Link */}
            <div className="bg-[#EBF5FB] rounded-xl p-5">
              <p className="text-xs text-[#1B4F72] uppercase tracking-wide font-semibold mb-2">Neighborhood</p>
              <Link
                href={`/neighborhoods/${place.neighborhood_slug}`}
                className="font-bold text-[#1B4F72] hover:underline capitalize"
              >
                {place.neighborhood_slug.replace(/-/g, ' ')} →
              </Link>
              <p className="text-sm text-[#555555] mt-1">
                See schools, market data, and lifestyle for this area.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
