import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getComparison, getComparisonSlugs, getNeighborhoodGuide } from '@/lib/content';
import { breadcrumbSchema, toJsonLd } from '@/lib/schema';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import ComparisonTable from '@/components/shared/ComparisonTable';
import CTABlock from '@/components/shared/CTABlock';
import NewsletterSignup from '@/components/shared/NewsletterSignup';
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
    'eat-drink': '/eat-drink',
  };
  return `${prefixes[r.type] ?? ''}/${r.slug}`;
}

export async function generateStaticParams() {
  return getComparisonSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const comparison = getComparison(params.slug);
  if (!comparison) return {};
  return {
    title: comparison.seo.title,
    description: comparison.seo.description,
    alternates: { canonical: comparison.seo.canonical },
    openGraph: {
      title: comparison.seo.title,
      description: comparison.seo.description,
      url: comparison.seo.canonical,
    },
  };
}

export default function ComparisonPage({ params }: Props) {
  const comparison = getComparison(params.slug);
  if (!comparison) notFound();

  const guideA = getNeighborhoodGuide(comparison.neighborhood_a);
  const guideB = getNeighborhoodGuide(comparison.neighborhood_b);
  const nameA = guideA?.name ?? comparison.neighborhood_a.replace(/-/g, ' ');
  const nameB = guideB?.name ?? comparison.neighborhood_b.replace(/-/g, ' ');

  const breadcrumb = breadcrumbSchema([
    { label: 'Compare', href: '/compare' },
    { label: `${nameA} vs ${nameB}`, href: comparison.seo.canonical },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumb) }} />

      {/* Hero */}
      <section className="bg-[#1B4F72] text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs crumbs={[{ label: 'Compare', href: '/compare' }, { label: `${nameA} vs ${nameB}` }]} />
          <div className="flex items-center gap-4 mt-4 mb-3 flex-wrap">
            <Link
              href={`/neighborhoods/${comparison.neighborhood_a}`}
              className="text-[#AED6F1] hover:text-white font-medium underline underline-offset-2"
            >
              {nameA}
            </Link>
            <span className="text-white/50 font-bold text-xl">vs</span>
            <Link
              href={`/neighborhoods/${comparison.neighborhood_b}`}
              className="text-[#AED6F1] hover:text-white font-medium underline underline-offset-2"
            >
              {nameB}
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{nameA} vs {nameB}</h1>
          <p className="text-lg text-[#D6EAF8] max-w-2xl leading-relaxed">{comparison.intro}</p>
        </div>
      </section>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <Link
            href={`/neighborhoods/${comparison.neighborhood_a}`}
            className="bg-[#EBF5FB] rounded-lg p-4 text-center hover:bg-[#D6EAF8] transition-colors"
          >
            <p className="text-xs text-[#555555] uppercase tracking-wider mb-1">Full Guide</p>
            <p className="font-semibold text-[#1B4F72]">{nameA} →</p>
          </Link>
          <Link
            href={`/neighborhoods/${comparison.neighborhood_b}`}
            className="bg-[#EBF5FB] rounded-lg p-4 text-center hover:bg-[#D6EAF8] transition-colors"
          >
            <p className="text-xs text-[#555555] uppercase tracking-wider mb-1">Full Guide</p>
            <p className="font-semibold text-[#1B4F72]">{nameB} →</p>
          </Link>
        </div>

        {/* Comparison table */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#1B4F72] mb-6">Side-by-Side Comparison</h2>
          <ComparisonTable name_a={nameA} name_b={nameB} metrics={comparison.metrics} />
        </section>

        {/* Summary */}
        <section className="mb-12 bg-[#F8F9FA] rounded-xl p-6 border-l-4 border-[#2E86C1]">
          <h2 className="text-xl font-bold text-[#1B4F72] mb-3">The Bottom Line</h2>
          <p className="text-[#333333] leading-relaxed text-lg">{comparison.summary}</p>
        </section>

        {/* Related */}
        {comparison.related.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-[#1B4F72] mb-4">Related</h2>
            <div className="flex flex-wrap gap-3">
              {comparison.related.map((r) => (
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
          heading="Not sure which is right for you?"
          body="Take the neighborhood quiz and get matched to the right Little Rock area neighborhood for your lifestyle."
          button_text="Take the Quiz"
          href="/tools/neighborhood-quiz"
        />

        <div className="mt-10">
          <NewsletterSignup />
        </div>
      </div>
    </>
  );
}
