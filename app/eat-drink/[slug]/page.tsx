import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllSeasonalGuides, getSeasonalGuide } from '@/lib/content';
import { breadcrumbSchema, toJsonLd } from '@/lib/schema';
import CTABlock from '@/components/shared/CTABlock';
import NewsletterSignup from '@/components/shared/NewsletterSignup';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import type { RelatedLink } from '@/types/shared';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const guides = getAllSeasonalGuides();
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getSeasonalGuide(params.slug);
  if (!guide) return {};
  return {
    title: guide.seo.title,
    description: guide.seo.description,
    alternates: { canonical: guide.seo.canonical },
    openGraph: {
      title: guide.seo.title,
      description: guide.seo.description,
      url: guide.seo.canonical,
    },
  };
}

const seasonColors: Record<string, { bg: string; accent: string; textClass: string }> = {
  spring: { bg: 'bg-[#1E8449]', accent: '#1E8449', textClass: 'text-[#1E8449]' },
  summer: { bg: 'bg-[#D4740A]', accent: '#D4740A', textClass: 'text-[#D4740A]' },
  fall:   { bg: 'bg-[#784212]', accent: '#784212', textClass: 'text-[#784212]' },
  winter: { bg: 'bg-[#1B4F72]', accent: '#1B4F72', textClass: 'text-[#1B4F72]' },
  holiday:{ bg: 'bg-[#78281F]', accent: '#78281F', textClass: 'text-[#78281F]' },
};

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

export default function SeasonalGuidePage({ params }: Props) {
  const guide = getSeasonalGuide(params.slug);
  if (!guide) notFound();

  const colors = seasonColors[guide.season] ?? seasonColors.spring;

  const breadcrumb = breadcrumbSchema([
    { label: 'Home', href: '/' },
    { label: 'Eat & Drink', href: '/eat-drink' },
    { label: guide.title, href: guide.seo.canonical },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumb) }}
      />

      {/* Hero */}
      <section className={`${colors.bg} text-white relative overflow-hidden`}>
        {guide.hero_image && (
          <div className="absolute inset-0">
            <img
              src={guide.hero_image.src}
              alt={guide.hero_image.alt}
              className="w-full h-full object-cover opacity-30"
            />
          </div>
        )}
        <div className="relative px-4 py-14 max-w-4xl mx-auto">
          <Breadcrumbs
            crumbs={[
              { label: 'Eat & Drink', href: '/eat-drink' },
              { label: guide.title },
            ]}
          />
          <p className="text-sm font-semibold uppercase tracking-widest text-white/70 mt-4 mb-3 capitalize">
            {guide.season} Guide
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{guide.title}</h1>
          <p className="text-lg text-white/85 max-w-2xl leading-relaxed">{guide.intro}</p>
        </div>
      </section>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Sections */}
        <div className="space-y-14">
          {guide.sections.map((section, i) => (
            <section key={i}>
              <h2
                className={`text-2xl font-bold mb-4 ${colors.textClass} border-l-4 pl-4`}
                style={{ borderColor: colors.accent }}
              >
                {section.heading}
              </h2>
              <p className="text-[#333333] leading-relaxed text-lg mb-6">{section.body}</p>

              {section.places && section.places.length > 0 && (
                <ul className="space-y-3">
                  {section.places.map((place) => (
                    <li
                      key={place.name}
                      className="bg-white rounded-lg border border-[#E5E5E5] px-5 py-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-[#D4740A] font-bold mt-0.5">→</span>
                        <div>
                          {place.slug ? (
                            <Link
                              href={`/places/${place.slug}`}
                              className="font-semibold text-[#1B4F72] hover:underline"
                            >
                              {place.name}
                            </Link>
                          ) : (
                            <span className="font-semibold text-[#1C1C1C]">{place.name}</span>
                          )}
                          <p className="text-sm text-[#555555] mt-0.5">{place.note}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* Related */}
        {guide.related.length > 0 && (
          <section className="mt-14 pt-10 border-t border-[#E5E5E5]">
            <h2 className="text-xl font-bold text-[#1B4F72] mb-4">Related Guides</h2>
            <div className="flex flex-wrap gap-3">
              {guide.related.map((r) => (
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

        <div className="mt-12">
          <CTABlock
            heading="Explore Little Rock neighborhoods"
            body="Find the right area for your lifestyle — restaurants, schools, commute, and market data."
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
