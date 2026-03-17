import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getServicePage, getServiceSlugs } from '@/lib/content';
import { breadcrumbSchema, toJsonLd } from '@/lib/schema';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import FAQ from '@/components/shared/FAQ';
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
  return getServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getServicePage(params.slug);
  if (!page) return {};
  return {
    title: page.seo.title,
    description: page.seo.description,
    alternates: { canonical: page.seo.canonical },
    openGraph: {
      title: page.seo.title,
      description: page.seo.description,
      url: page.seo.canonical,
    },
  };
}

export default function ServicePageRoute({ params }: Props) {
  const page = getServicePage(params.slug);
  if (!page) notFound();

  const breadcrumb = breadcrumbSchema([
    { label: 'Services', href: '/services' },
    { label: page.title, href: page.seo.canonical },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumb) }} />

      {/* Hero */}
      <section className="bg-[#1B4F72] text-white relative overflow-hidden">
        {page.hero_image?.src && (
          <div className="absolute inset-0">
            <img
              src={page.hero_image.src}
              alt={page.hero_image.alt}
              className="w-full h-full object-cover opacity-25"
            />
          </div>
        )}
        <div className="relative px-4 py-14 max-w-4xl mx-auto">
          <Breadcrumbs crumbs={[{ label: 'Services', href: '/services' }, { label: page.title }]} />
          <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-4">{page.title}</h1>
          <p className="text-lg text-white/85 max-w-2xl leading-relaxed">{page.intro}</p>
        </div>
      </section>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-10">
          {page.sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-2xl font-bold text-[#1B4F72] mb-3 pb-2 border-b border-[#E5E5E5]">
                {section.heading}
              </h2>
              <p className="text-[#333333] leading-relaxed text-lg">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-12">
          <CTABlock
            heading={page.cta.heading}
            body={page.cta.body}
            button_text={page.cta.button_text}
            href="/contact"
          />
        </div>

        {page.faqs.length > 0 && (
          <div className="mt-10">
            <FAQ items={page.faqs} />
          </div>
        )}

        {page.related.length > 0 && (
          <section className="mt-12 pt-10 border-t border-[#E5E5E5]">
            <h2 className="text-xl font-bold text-[#1B4F72] mb-4">Related</h2>
            <div className="flex flex-wrap gap-3">
              {page.related.map((r) => (
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

        <div className="mt-10">
          <NewsletterSignup />
        </div>
      </div>
    </>
  );
}
