import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllNewsPosts, getNewsPost } from '@/lib/content';
import { breadcrumbSchema, toJsonLd } from '@/lib/schema';
import Badge from '@/components/shared/Badge';
import NewsletterSignup from '@/components/shared/NewsletterSignup';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import type { RelatedLink } from '@/types/shared';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = getAllNewsPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getNewsPost(params.slug);
  if (!post) return {};
  return {
    title: post.seo.title,
    description: post.seo.description,
    alternates: { canonical: post.seo.canonical },
    openGraph: {
      title: post.seo.title,
      description: post.seo.description,
      url: post.seo.canonical,
    },
  };
}

const categoryVariant: Record<string, 'primary' | 'accent' | 'warm' | 'success' | 'neutral'> = {
  opening: 'success',
  closing: 'neutral',
  development: 'accent',
  renovation: 'warm',
  announcement: 'primary',
};

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
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

export default function NewsPostPage({ params }: Props) {
  const post = getNewsPost(params.slug);
  if (!post) notFound();

  const breadcrumb = breadcrumbSchema([
    { label: 'Home', href: '/' },
    { label: 'News', href: '/news' },
    { label: post.title, href: post.seo.canonical },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumb) }} />

      {/* Hero */}
      <section className="bg-[#1B4F72] text-white py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <Breadcrumbs
            crumbs={[
              { label: 'News', href: '/news' },
              { label: post.title },
            ]}
          />
          <div className="flex items-center gap-3 mt-4 mb-3 flex-wrap">
            <Badge
              label={post.category}
              variant={categoryVariant[post.category] ?? 'neutral'}
            />
            {post.neighborhood_slugs.map((slug) => (
              <Link
                key={slug}
                href={`/neighborhoods/${slug}`}
                className="text-xs text-[#AED6F1] hover:text-white capitalize underline underline-offset-2"
              >
                {slug.replace(/-/g, ' ')}
              </Link>
            ))}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-3">{post.title}</h1>
          <time className="text-sm text-white/70">{formatDate(post.date_published)}</time>
        </div>
      </section>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Hero image */}
        {post.image && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img
              src={post.image.src}
              alt={post.image.alt}
              className="w-full object-cover"
            />
          </div>
        )}

        {/* Summary */}
        <p className="text-lg font-medium text-[#1C1C1C] leading-relaxed mb-8 pb-8 border-b border-[#E5E5E5]">
          {post.summary}
        </p>

        {/* Body Sections */}
        <div className="space-y-8">
          {post.body_sections.map((section, i) => (
            <section key={i}>
              {section.heading && (
                <h2 className="text-xl font-bold text-[#1B4F72] mb-3">{section.heading}</h2>
              )}
              <p className="text-[#333333] leading-relaxed">{section.body}</p>
            </section>
          ))}
        </div>

        {/* Impact Note */}
        {post.impact_note && (
          <div className="mt-8 bg-[#EBF5FB] border-l-4 border-[#2E86C1] rounded-r-lg p-5">
            <p className="text-sm font-semibold text-[#1B4F72] uppercase tracking-wide mb-1">
              What This Means
            </p>
            <p className="text-[#333333]">{post.impact_note}</p>
          </div>
        )}

        {/* Source */}
        {post.source_url && (
          <p className="mt-6 text-sm text-[#555555]">
            Source:{' '}
            <a
              href={post.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2E86C1] hover:underline"
            >
              {post.source_url}
            </a>
          </p>
        )}

        {/* Related */}
        {post.related.length > 0 && (
          <section className="mt-12 pt-10 border-t border-[#E5E5E5]">
            <h2 className="text-xl font-bold text-[#1B4F72] mb-4">Related</h2>
            <div className="flex flex-wrap gap-3">
              {post.related.map((r) => (
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
    </>
  );
}
