import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllWeekendGuides, getWeekendGuide, getAllLifestyleArticles, getLifestyleArticle, getEvent } from '@/lib/content';
import { breadcrumbSchema, toJsonLd } from '@/lib/schema';
import CTABlock from '@/components/shared/CTABlock';
import NewsletterSignup from '@/components/shared/NewsletterSignup';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import EventCard from '@/components/shared/EventCard';
import type { WeekendGuide, LifestyleArticle } from '@/types/content';
import type { RelatedLink } from '@/types/shared';

interface Props {
  params: { slug: string };
}

function relatedUrl(r: RelatedLink): string {
  const prefixes: Record<string, string> = {
    neighborhood: '/neighborhoods',
    event: '/events',
    place: '/places',
    'best-of': '/best-of',
    news: '/news',
    local: '/local',
    guide: '/guides',
    service: '/services',
    market: '/market-reports',
    comparison: '/compare',
  };
  return `${prefixes[r.type] ?? ''}/${r.slug}`;
}

// ─── Static params ─────────────────────────────────────

export async function generateStaticParams() {
  const weekendGuides = getAllWeekendGuides().map((g) => ({ slug: g.slug }));
  const lifestyleArticles = getAllLifestyleArticles().map((a) => ({ slug: a.slug }));
  return [...weekendGuides, ...lifestyleArticles];
}

// ─── Metadata ──────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const weekend = getWeekendGuide(params.slug);
  if (weekend) {
    return {
      title: weekend.seo.title,
      description: weekend.seo.description,
      alternates: { canonical: weekend.seo.canonical },
    };
  }
  const article = getLifestyleArticle(params.slug);
  if (article) {
    return {
      title: article.seo.title,
      description: article.seo.description,
      alternates: { canonical: article.seo.canonical },
    };
  }
  return {};
}

// ─── Weekend Guide Renderer ────────────────────────────

function WeekendGuideView({ guide }: { guide: WeekendGuide }) {
  const breadcrumb = breadcrumbSchema([
    { label: 'Home', href: '/' },
    { label: 'Local', href: '/local' },
    { label: guide.title, href: guide.seo.canonical },
  ]);

  const start = new Date(guide.date_range.start).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });
  const end = new Date(guide.date_range.end).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumb) }} />

      <section className="bg-[#1B4F72] text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs
            crumbs={[
              { label: 'Local', href: '/local' },
              { label: guide.title },
            ]}
          />
          <p className="text-sm font-semibold uppercase tracking-widest text-[#AED6F1] mt-4 mb-2">
            Weekend Guide · {start} – {end}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{guide.title}</h1>
          <p className="text-lg text-[#D6EAF8] max-w-2xl leading-relaxed">{guide.intro}</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Event Picks */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#1B4F72] mb-6">This Weekend&apos;s Picks</h2>
          <div className="space-y-6">
            {guide.picks.map((pick) => {
              const event = getEvent(pick.event_slug);
              return (
                <div key={pick.event_slug} className="bg-white rounded-xl border border-[#E5E5E5] shadow-sm overflow-hidden">
                  <div className="bg-[#EBF5FB] px-5 py-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#1B4F72]">
                      {pick.category_label}
                    </span>
                  </div>
                  <div className="p-5">
                    {event && (
                      <EventCard
                        slug={event.slug}
                        event_name={event.event_name}
                        date_start={event.date_start}
                        time={event.time}
                        venue_name={event.venue_name}
                        category={event.category}
                        price_range={event.price_range}
                        highlight={event.highlight}
                      />
                    )}
                    <p className="text-[#555555] text-sm mt-3 italic border-t border-[#F0F0F0] pt-3">
                      {pick.editorial_note}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Also Happening */}
        {guide.also_happening.length > 0 && (
          <section className="mb-12 bg-[#F8F9FA] rounded-xl p-6">
            <h2 className="text-xl font-bold text-[#1B4F72] mb-4">Also Happening</h2>
            <ul className="space-y-2">
              {guide.also_happening.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[#333333]">
                  <span className="text-[#D4740A] font-bold mt-0.5">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Related */}
        {guide.related.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-[#1B4F72] mb-4">Related</h2>
            <div className="flex flex-wrap gap-3">
              {guide.related.map((r) => (
                <Link key={r.slug} href={relatedUrl(r)}
                  className="bg-white border border-[#E5E5E5] rounded-lg px-4 py-2 text-sm text-[#2E86C1] font-medium hover:bg-[#EBF5FB] transition-colors">
                  {r.title} →
                </Link>
              ))}
            </div>
          </section>
        )}

        <NewsletterSignup />
      </div>
    </>
  );
}

// ─── Lifestyle Article Renderer ────────────────────────

const categoryColors: Record<LifestyleArticle['category'], string> = {
  outdoor: 'bg-[#1E8449]',
  family: 'bg-[#D4740A]',
  arts: 'bg-[#2E86C1]',
  'day-trip': 'bg-[#1B4F72]',
  newcomer: 'bg-[#1B4F72]',
  general: 'bg-[#1B4F72]',
};

function LifestyleArticleView({ article }: { article: LifestyleArticle }) {
  const breadcrumb = breadcrumbSchema([
    { label: 'Home', href: '/' },
    { label: 'Local', href: '/local' },
    { label: article.title, href: article.seo.canonical },
  ]);

  const heroColor = categoryColors[article.category];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumb) }} />

      <section className={`${heroColor} text-white relative overflow-hidden`}>
        {article.hero_image && (
          <div className="absolute inset-0">
            <img src={article.hero_image.src} alt={article.hero_image.alt}
              className="w-full h-full object-cover opacity-30" />
          </div>
        )}
        <div className="relative px-4 py-14 max-w-4xl mx-auto">
          <Breadcrumbs
            crumbs={[
              { label: 'Local', href: '/local' },
              { label: article.title },
            ]}
          />
          <p className="text-sm font-semibold uppercase tracking-widest text-white/70 mt-4 mb-2 capitalize">
            {article.category.replace('-', ' ')}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
          <p className="text-lg text-white/85 max-w-2xl leading-relaxed">{article.intro}</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-12">
          {article.sections.map((section) => (
            <section key={section.id} id={section.id}>
              <h2 className="text-2xl font-bold text-[#1B4F72] mb-4 pb-2 border-b border-[#E5E5E5]">
                {section.heading}
              </h2>
              <p className="text-[#333333] leading-relaxed text-lg mb-6">{section.body}</p>

              {section.places && section.places.length > 0 && (
                <ul className="space-y-3">
                  {section.places.map((place, i) => (
                    <li key={i} className="bg-white rounded-lg border border-[#E5E5E5] px-5 py-4">
                      <div className="flex items-start gap-3">
                        <span className="text-[#D4740A] font-bold mt-0.5">→</span>
                        <div>
                          {place.link ? (
                            <Link href={place.link} className="font-semibold text-[#1B4F72] hover:underline">
                              {place.name}
                            </Link>
                          ) : (
                            <span className="font-semibold text-[#1C1C1C]">{place.name}</span>
                          )}
                          {place.address && (
                            <p className="text-xs text-[#555555] mt-0.5">{place.address}</p>
                          )}
                          <p className="text-sm text-[#555555] mt-1">{place.note}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {article.related.length > 0 && (
          <section className="mt-12 pt-10 border-t border-[#E5E5E5]">
            <h2 className="text-xl font-bold text-[#1B4F72] mb-4">Related Guides</h2>
            <div className="flex flex-wrap gap-3">
              {article.related.map((r) => (
                <Link key={r.slug} href={relatedUrl(r)}
                  className="bg-white border border-[#E5E5E5] rounded-lg px-4 py-2 text-sm text-[#2E86C1] font-medium hover:bg-[#EBF5FB] transition-colors">
                  {r.title} →
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-12">
          <CTABlock
            heading="Find your neighborhood"
            body="Explore every Little Rock-area neighborhood with schools, commute, pricing, and lifestyle data."
            button_text="Browse Neighborhoods"
            href="/neighborhoods"
          />
        </div>
        <div className="mt-10">
          <NewsletterSignup />
        </div>
      </div>
    </>
  );
}

// ─── Page ──────────────────────────────────────────────

export default function LocalPage({ params }: Props) {
  const weekend = getWeekendGuide(params.slug);
  if (weekend) return <WeekendGuideView guide={weekend} />;

  const article = getLifestyleArticle(params.slug);
  if (article) return <LifestyleArticleView article={article} />;

  notFound();
}
