import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllBestOfLists, getBestOfList, getSpotlight } from '@/lib/content';
import { bestOfListSchema, breadcrumbSchema, toJsonLd } from '@/lib/schema';
import Badge from '@/components/shared/Badge';
import CTABlock from '@/components/shared/CTABlock';
import NewsletterSignup from '@/components/shared/NewsletterSignup';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import type { RelatedLink } from '@/types/shared';

interface Props {
  params: { category: string; area: string };
}

export async function generateStaticParams() {
  const lists = getAllBestOfLists();
  return lists.map((l) => ({ category: l.category, area: l.area }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const list = getBestOfList(`${params.category}-${params.area}`);
  if (!list) return {};
  return {
    title: list.seo.title,
    description: list.seo.description,
    alternates: { canonical: list.seo.canonical },
    openGraph: {
      title: list.seo.title,
      description: list.seo.description,
      url: list.seo.canonical,
    },
  };
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

const rankColors = ['#D4740A', '#555555', '#6B4423'];

export default function BestOfListPage({ params }: Props) {
  const list = getBestOfList(`${params.category}-${params.area}`);
  if (!list) notFound();

  const listSchema = bestOfListSchema({
    title: list.title,
    slug: `${list.category}-${list.area}`,
    category: list.category,
    area: list.area,
    items: list.items.map((item) => ({
      rank: item.rank,
      name: item.name,
      slug: item.place_slug,
    })),
  });

  const breadcrumb = breadcrumbSchema([
    { label: 'Home', href: '/' },
    { label: 'Best Of', href: '/best-of' },
    { label: list.title, href: list.seo.canonical },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(listSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumb) }}
      />

      {/* Hero */}
      <section className="bg-[#1B4F72] text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs
            crumbs={[
              { label: 'Best Of', href: '/best-of' },
              { label: list.title },
            ]}
          />
          <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-3">{list.title}</h1>
          <p className="text-[#D6EAF8] text-lg max-w-2xl">{list.intro}</p>
        </div>
      </section>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Ranked List */}
        <ol className="space-y-8 mb-14">
          {list.items.map((item) => {
            const place = getSpotlight(item.place_slug);
            const rankColor = rankColors[item.rank - 1] ?? '#1B4F72';

            return (
              <li key={item.rank} className="bg-white rounded-xl border border-[#E5E5E5] shadow-sm overflow-hidden">
                <div className="flex items-stretch">
                  {/* Rank */}
                  <div
                    className="flex items-center justify-center w-16 flex-shrink-0 text-white font-bold text-2xl"
                    style={{ backgroundColor: rankColor }}
                  >
                    {item.rank}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h2 className="text-xl font-bold text-[#1B4F72]">
                          <Link href={`/places/${item.place_slug}`} className="hover:underline">
                            {item.name}
                          </Link>
                        </h2>
                        <p className="text-sm text-[#555555] italic mt-0.5">{item.one_liner}</p>
                      </div>
                      {place && (
                        <div className="flex-shrink-0 flex items-center gap-2">
                          <span className="text-sm font-medium text-[#555555]">
                            {place.price_range}
                          </span>
                          <Badge
                            label={place.vibe.replace('_', ' ')}
                            variant="neutral"
                          />
                        </div>
                      )}
                    </div>

                    <p className="text-[#333333] leading-relaxed mb-4">{item.why_its_here}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#555555] uppercase tracking-wide font-semibold">
                          Best for:
                        </span>
                        <span className="text-sm text-[#1C1C1C]">{item.best_for}</span>
                      </div>
                      <Link
                        href={`/places/${item.place_slug}`}
                        className="text-sm text-[#2E86C1] font-semibold hover:underline"
                      >
                        Full Profile →
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Honorable Mentions */}
        {list.honorable_mentions && list.honorable_mentions.length > 0 && (
          <section className="mb-14 bg-[#F8F9FA] rounded-xl p-6">
            <h2 className="text-xl font-bold text-[#1B4F72] mb-4">Honorable Mentions</h2>
            <ul className="space-y-3">
              {list.honorable_mentions.map((mention) => (
                <li key={mention.name} className="flex items-start gap-3">
                  <span className="text-[#D4740A] font-bold mt-0.5">→</span>
                  <div>
                    <span className="font-semibold text-[#1C1C1C]">{mention.name}:</span>{' '}
                    <span className="text-[#333333]">{mention.note}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Related */}
        {list.related.length > 0 && (
          <section className="mb-14">
            <h2 className="text-xl font-bold text-[#1B4F72] mb-4">Related Guides</h2>
            <div className="flex flex-wrap gap-3">
              {list.related.map((r) => (
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

        <CTABlock
          heading="Find your next neighborhood"
          body="Explore schools, market data, and lifestyle guides for every area in the metro."
          button_text="Browse Neighborhoods"
          href="/neighborhoods"
        />

        <div className="mt-12">
          <NewsletterSignup />
        </div>
      </div>
    </>
  );
}
