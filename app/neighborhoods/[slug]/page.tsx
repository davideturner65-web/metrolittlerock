import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { getNeighborhoodGuide, getNeighborhoodSlugs } from '@/lib/content';
import { neighborhoodSchema, faqSchema, breadcrumbSchema, toJsonLd } from '@/lib/schema';
import type { NeighborhoodSlug } from '@/types/shared';

import StatCard from '@/components/shared/StatCard';
import FAQ from '@/components/shared/FAQ';
import TOC from '@/components/shared/TOC';
import CTABlock from '@/components/shared/CTABlock';
import Badge from '@/components/shared/Badge';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import Sidebar from '@/components/layout/Sidebar';

// ─── Static Params ────────────────────────────────────

export async function generateStaticParams() {
  const slugs = getNeighborhoodSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ─── Metadata ─────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const guide = getNeighborhoodGuide(params.slug as NeighborhoodSlug);
  if (!guide) return {};
  return {
    title: guide.seo.title,
    description: guide.seo.description,
    alternates: { canonical: guide.seo.canonical },
    openGraph: {
      title: guide.seo.title,
      description: guide.seo.description,
      ...(guide.seo.og_image ? { images: [guide.seo.og_image] } : {}),
    },
  };
}

// ─── TOC Items ────────────────────────────────────────

const TOC_ITEMS = [
  { id: 'real-estate-overview', heading: 'Real Estate' },
  { id: 'schools', heading: 'Schools' },
  { id: 'lifestyle', heading: 'Lifestyle' },
  { id: 'commute', heading: 'Commute' },
  { id: 'buyer-profile', heading: 'Who Lives Here' },
  { id: 'faqs', heading: 'FAQs' },
];

// ─── Page ─────────────────────────────────────────────

export default function NeighborhoodGuidePage({
  params,
}: {
  params: { slug: string };
}) {
  const guide = getNeighborhoodGuide(params.slug as NeighborhoodSlug);
  if (!guide) notFound();

  const jsonLdPlace = neighborhoodSchema({
    name: guide.display_name,
    slug: guide.slug,
    description: guide.seo.description,
    lat: 34.7465,
    lng: -92.2896,
  });

  const jsonLdFaq = faqSchema(guide.faqs);

  const jsonLdBreadcrumb = breadcrumbSchema([
    { label: 'Neighborhoods', href: '/neighborhoods' },
    { label: guide.display_name },
  ]);

  return (
    <>
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(jsonLdPlace) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(jsonLdBreadcrumb) }} />

      {/* Hero */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 bg-[#1B4F72] overflow-hidden">
        {guide.hero_image.src && (
          <Image
            src={guide.hero_image.src}
            alt={guide.hero_image.alt}
            fill
            className="object-cover opacity-70"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 md:px-8">
          <div className="max-w-6xl mx-auto">
            <Breadcrumbs
              crumbs={[
                { label: 'Neighborhoods', href: '/neighborhoods' },
                { label: guide.display_name },
              ]}
            />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-3">
              {guide.display_name}
            </h1>
            {guide.hero_image.credit && (
              <p className="text-white/50 text-xs mt-2">Photo: {guide.hero_image.credit}</p>
            )}
          </div>
        </div>
      </div>

      {/* Hero Stats Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Median Price" value={guide.hero_stats.median_price} color="primary" />
            <StatCard label="Avg Days on Market" value={guide.hero_stats.avg_days_on_market} subtext="days" color="accent" />
            <StatCard label="Price Trend" value={guide.hero_stats.price_trend} color="warm" />
            {guide.hero_stats.walkability_score != null && (
              <StatCard label="Walkability" value={`${guide.hero_stats.walkability_score}/100`} color="success" />
            )}
          </div>
        </div>
      </div>

      {/* Body: 2-col layout */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">

          {/* ── Main Content ── */}
          <article className="min-w-0">

            {/* Intro */}
            <p className="text-lg text-[#333333] leading-relaxed mb-10">
              {guide.intro}
            </p>

            {/* Real Estate Overview */}
            <section id="real-estate-overview" className="scroll-mt-6 mb-10">
              <h2 className="text-2xl font-bold text-[#1C1C1C] mb-4">Real Estate in {guide.display_name}</h2>
              <p className="text-[#444444] leading-relaxed">{guide.real_estate_overview}</p>
            </section>

            {/* Schools */}
            <section id="schools" className="scroll-mt-6 mb-10">
              <h2 className="text-2xl font-bold text-[#1C1C1C] mb-4">Schools</h2>
              <p className="text-[#444444] leading-relaxed mb-5">{guide.schools_section.overview}</p>
              {guide.schools_section.highlights.length > 0 && (
                <div className="space-y-3">
                  {guide.schools_section.highlights.map((h) => (
                    <div key={h.name} className="flex gap-3 bg-[#F0F4F8] rounded-lg p-4">
                      <div className="flex-shrink-0 w-1.5 rounded-full bg-[#1B4F72]" />
                      <div>
                        <p className="font-semibold text-[#1C1C1C] text-sm">{h.name}</p>
                        <p className="text-sm text-[#555555]">{h.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Lifestyle */}
            <section id="lifestyle" className="scroll-mt-6 mb-10">
              <h2 className="text-2xl font-bold text-[#1C1C1C] mb-4">Life in {guide.display_name}</h2>
              <p className="text-[#444444] leading-relaxed mb-6">{guide.lifestyle_section.overview}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-[#1B4F72] mb-2">Dining &amp; Drinks</h3>
                  <p className="text-sm text-[#444444] leading-relaxed">{guide.lifestyle_section.dining}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-[#1B4F72] mb-2">Parks &amp; Outdoors</h3>
                  <p className="text-sm text-[#444444] leading-relaxed">{guide.lifestyle_section.outdoor}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-[#1B4F72] mb-2">Arts &amp; Culture</h3>
                  <p className="text-sm text-[#444444] leading-relaxed">{guide.lifestyle_section.culture}</p>
                </div>
                {guide.lifestyle_section.family && (
                  <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <h3 className="font-semibold text-[#1B4F72] mb-2">Family Life</h3>
                    <p className="text-sm text-[#444444] leading-relaxed">{guide.lifestyle_section.family}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Commute */}
            <section id="commute" className="scroll-mt-6 mb-10">
              <h2 className="text-2xl font-bold text-[#1C1C1C] mb-4">Getting Around</h2>
              <p className="text-[#444444] leading-relaxed mb-5">{guide.commute_section.overview}</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#1B4F72] text-white">
                      <th className="text-left px-4 py-3 rounded-tl-lg font-medium">Destination</th>
                      <th className="text-left px-4 py-3 font-medium">Drive Time</th>
                      <th className="text-left px-4 py-3 rounded-tr-lg font-medium">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guide.commute_section.key_routes.map((r, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FA]'}>
                        <td className="px-4 py-3 font-medium text-[#1C1C1C]">{r.destination}</td>
                        <td className="px-4 py-3 text-[#2E86C1] font-semibold">{r.time}</td>
                        <td className="px-4 py-3 text-[#555555]">{r.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Buyer Profile */}
            <section id="buyer-profile" className="scroll-mt-6 mb-10">
              <h2 className="text-2xl font-bold text-[#1C1C1C] mb-4">Who Buys in {guide.display_name}</h2>
              <div className="bg-[#F0F4F8] rounded-xl p-6 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-[#555555] uppercase tracking-wide mb-2">Typical Buyer</p>
                  <p className="text-[#1C1C1C]">{guide.buyer_profile.typical_buyer}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#555555] uppercase tracking-wide mb-2">Budget Range</p>
                  <p className="text-[#1C1C1C] font-semibold text-lg">{guide.buyer_profile.budget_range}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#555555] uppercase tracking-wide mb-2">Ideal For</p>
                  <div className="flex flex-wrap gap-2">
                    {guide.buyer_profile.ideal_for.map((tag) => (
                      <Badge key={tag} label={tag} variant="accent" />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* FAQs */}
            <section id="faqs" className="scroll-mt-6 mb-10">
              <FAQ items={guide.faqs} title={`${guide.display_name} FAQs`} />
            </section>

            {/* Related Links */}
            {guide.related.length > 0 && (
              <section className="mb-10">
                <h2 className="text-xl font-bold text-[#1C1C1C] mb-4">Related Guides</h2>
                <div className="flex flex-wrap gap-3">
                  {guide.related.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/neighborhoods/${r.slug}`}
                      className="text-sm bg-white border border-gray-200 rounded-lg px-4 py-2 text-[#2E86C1] hover:border-[#2E86C1] hover:bg-[#F0F4F8] transition-colors"
                    >
                      {r.title} →
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* CTA */}
            <CTABlock
              heading={`Thinking About Buying in ${guide.display_name}?`}
              body={`Get an honest assessment of the market, current inventory, and whether ${guide.display_name} is the right fit for your situation.`}
              button_text="Talk to David"
              href="/contact"
              variant="primary"
            />
          </article>

          {/* ── Sidebar ── */}
          <aside className="space-y-6">
            <div className="sticky top-6 space-y-6">
              <TOC items={TOC_ITEMS} />
              <Sidebar showNeighborhoods showTools showNewsletter />
            </div>
          </aside>

        </div>
      </div>
    </>
  );
}
