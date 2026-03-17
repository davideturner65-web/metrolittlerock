import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getResourceGuide, getGuideSlugs } from '@/lib/content';
import { breadcrumbSchema, articleSchema, faqSchema, toJsonLd } from '@/lib/schema';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import TOC from '@/components/shared/TOC';
import Checklist from '@/components/shared/Checklist';
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
  return getGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getResourceGuide(params.slug);
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

export default function GuidePage({ params }: Props) {
  const guide = getResourceGuide(params.slug);
  if (!guide) notFound();

  const breadcrumb = breadcrumbSchema([
    { label: 'Guides', href: '/guides' },
    { label: guide.title, href: guide.seo.canonical },
  ]);

  const article = articleSchema({
    title: guide.seo.title,
    description: guide.seo.description,
    url: guide.seo.canonical,
  });

  const faq = guide.faqs.length > 0 ? faqSchema(guide.faqs) : null;

  const tocItems = guide.sections.map((s) => ({ id: s.id, heading: s.heading }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(article) }} />
      {faq && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(faq) }} />}

      {/* Hero */}
      <section className="bg-[#1B4F72] text-white relative overflow-hidden">
        {guide.hero_image?.src && (
          <div className="absolute inset-0">
            <img
              src={guide.hero_image.src}
              alt={guide.hero_image.alt}
              className="w-full h-full object-cover opacity-25"
            />
          </div>
        )}
        <div className="relative px-4 py-14 max-w-4xl mx-auto">
          <Breadcrumbs crumbs={[{ label: 'Guides', href: '/guides' }, { label: guide.title }]} />
          <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-4">{guide.title}</h1>
          <p className="text-lg text-white/85 max-w-2xl leading-relaxed">{guide.intro}</p>
        </div>
      </section>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="lg:grid lg:grid-cols-[1fr_260px] lg:gap-10">

          {/* Main content */}
          <div>
            <div className="space-y-14">
              {guide.sections.map((section) => (
                <section key={section.id} id={section.id}>
                  <h2 className="text-2xl font-bold text-[#1B4F72] mb-4 pb-2 border-b border-[#E5E5E5]">
                    {section.heading}
                  </h2>
                  <p className="text-[#333333] leading-relaxed text-lg mb-6">{section.body}</p>
                  {section.checklist && section.checklist.length > 0 && (
                    <Checklist items={section.checklist} title={`${section.heading} Checklist`} />
                  )}
                </section>
              ))}
            </div>

            {guide.faqs.length > 0 && (
              <div className="mt-14">
                <FAQ items={guide.faqs} />
              </div>
            )}

            {guide.related.length > 0 && (
              <section className="mt-12 pt-10 border-t border-[#E5E5E5]">
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
              <NewsletterSignup />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <TOC items={tocItems} />
            <div className="mt-6">
              <CTABlock
                heading="Find your neighborhood"
                body="See every Little Rock area neighborhood with schools, pricing, commute, and lifestyle data."
                button_text="Browse Neighborhoods"
                href="/neighborhoods"
              />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
