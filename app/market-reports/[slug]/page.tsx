import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getMarketReport, getAllMarketReports } from '@/lib/content';
import { marketReportSchema, breadcrumbSchema, toJsonLd } from '@/lib/schema';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import StatCard from '@/components/shared/StatCard';
import PriceChart from '@/components/shared/PriceChart';
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

function formatPrice(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

export async function generateStaticParams() {
  const reports = getAllMarketReports();
  return reports.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const report = getMarketReport(params.slug);
  if (!report) return {};
  return {
    title: report.seo.title,
    description: report.seo.description,
    alternates: { canonical: report.seo.canonical },
    openGraph: {
      title: report.seo.title,
      description: report.seo.description,
      url: report.seo.canonical,
    },
  };
}

export default function MarketReportPage({ params }: Props) {
  const report = getMarketReport(params.slug);
  if (!report) notFound();

  const schema = marketReportSchema({
    slug: report.neighborhood_slug,
    neighborhood: report.neighborhood_name,
    report_date: report.report_date,
    description: report.seo.description,
  });

  const breadcrumb = breadcrumbSchema([
    { label: 'Market Reports', href: '/market-reports' },
    { label: `${report.neighborhood_name} Market Report`, href: report.seo.canonical },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumb) }} />

      {/* Hero */}
      <section className="bg-[#1B4F72] text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <Breadcrumbs
            crumbs={[
              { label: 'Market Reports', href: '/market-reports' },
              { label: report.neighborhood_name },
            ]}
          />
          <p className="text-sm font-semibold uppercase tracking-widest text-[#AED6F1] mt-4 mb-2">
            Real Estate Market Report · {formatDate(report.report_date)}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {report.neighborhood_name} Real Estate Market
          </h1>
          <p className="text-lg text-[#D6EAF8] max-w-2xl leading-relaxed">{report.summary}</p>
          <div className="mt-4">
            <Link
              href={`/neighborhoods/${report.neighborhood_slug}`}
              className="text-sm text-[#AED6F1] hover:text-white underline underline-offset-2"
            >
              ← Full {report.neighborhood_name} Neighborhood Guide
            </Link>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Key stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Median Price"
            value={formatPrice(report.stats.median_price)}
            subtext={`${report.stats.median_price_change_yoy} YoY`}
            color="primary"
          />
          <StatCard
            label="Days on Market"
            value={String(report.stats.avg_days_on_market)}
            subtext={`${report.stats.dom_change_yoy} YoY`}
            color="accent"
          />
          <StatCard
            label="Active Listings"
            value={String(report.stats.active_listings)}
            color="warm"
          />
          <StatCard
            label="Sold (30 Days)"
            value={String(report.stats.sold_last_30_days)}
            color="success"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <StatCard
            label="Price Per Sq Ft"
            value={`$${report.stats.price_per_sqft}`}
          />
          <StatCard
            label="List-to-Sale Ratio"
            value={report.stats.list_to_sale_ratio}
          />
        </div>

        {/* Price trend chart */}
        {report.price_trend_data.length > 0 && (
          <div className="mb-12">
            <PriceChart
              data={report.price_trend_data}
              title={`${report.neighborhood_name} — Median Price Trend`}
            />
          </div>
        )}

        {/* Analysis cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
            <h2 className="text-lg font-bold text-[#1B4F72] mb-3">Inventory</h2>
            <p className="text-[#333333] leading-relaxed text-sm">{report.inventory_analysis}</p>
          </div>
          <div className="bg-[#EBF5FB] rounded-xl border border-[#AED6F1] p-6">
            <h2 className="text-lg font-bold text-[#1B4F72] mb-3">For Buyers</h2>
            <p className="text-[#333333] leading-relaxed text-sm">{report.buyer_insights}</p>
          </div>
          <div className="bg-[#FEF9EF] rounded-xl border border-[#F0C980] p-6">
            <h2 className="text-lg font-bold text-[#D4740A] mb-3">For Sellers</h2>
            <p className="text-[#333333] leading-relaxed text-sm">{report.seller_insights}</p>
          </div>
        </div>

        {/* Forecast */}
        <div className="bg-[#F8F9FA] rounded-xl p-6 border-l-4 border-[#1E8449] mb-12">
          <h2 className="text-lg font-bold text-[#1B4F72] mb-2">Outlook</h2>
          <p className="text-[#333333] leading-relaxed">{report.forecast}</p>
        </div>

        {/* Related */}
        {report.related.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-[#1B4F72] mb-4">Related</h2>
            <div className="flex flex-wrap gap-3">
              {report.related.map((r) => (
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
          heading="Thinking about buying or selling in this area?"
          body="Get a free market analysis and expert guidance from a local real estate professional."
          button_text="Contact Us"
          href="/contact"
        />

        <div className="mt-10">
          <NewsletterSignup />
        </div>
      </div>
    </>
  );
}
