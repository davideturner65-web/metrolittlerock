import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllNewsPosts } from '@/lib/content';
import { breadcrumbSchema, toJsonLd } from '@/lib/schema';
import Badge from '@/components/shared/Badge';
import NewsletterSignup from '@/components/shared/NewsletterSignup';

export const metadata: Metadata = {
  title: 'Little Rock Metro News — Openings, Development & Real Estate | Metro Little Rock',
  description: 'Stay current on what\'s opening, closing, and changing in metro Little Rock — new restaurants, development projects, and neighborhood-level updates.',
  alternates: { canonical: '/news' },
  openGraph: {
    title: 'Little Rock Metro News — Openings, Development & Real Estate',
    description: 'Openings, closings, development, and real estate news across metro Little Rock.',
    url: '/news',
  },
};

const breadcrumb = breadcrumbSchema([
  { label: 'Home', href: '/' },
  { label: 'News', href: '/news' },
]);

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

export default function NewsHubPage() {
  const posts = getAllNewsPosts();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumb) }}
      />

      {/* Hero */}
      <section className="bg-[#1B4F72] text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#AED6F1] mb-3">
            Metro Little Rock
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Local News</h1>
          <p className="text-lg text-[#D6EAF8] max-w-2xl">
            Openings, closings, development projects, and changes across the metro. Neighborhood-level updates, not press releases.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {posts.length === 0 ? (
          <p className="text-center text-[#555555] py-16">No news posts yet.</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-xl border border-[#E5E5E5] shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <Link href={`/news/${post.slug}`} className="block p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        label={post.category}
                        variant={categoryVariant[post.category] ?? 'neutral'}
                      />
                      {post.neighborhood_slugs.map((slug) => (
                        <span
                          key={slug}
                          className="text-xs text-[#555555] bg-[#F0F0F0] px-2 py-0.5 rounded capitalize"
                        >
                          {slug.replace(/-/g, ' ')}
                        </span>
                      ))}
                    </div>
                    <time className="text-sm text-[#555555] flex-shrink-0">
                      {formatDate(post.date_published)}
                    </time>
                  </div>

                  <h2 className="text-xl font-bold text-[#1B4F72] mb-2 hover:underline">
                    {post.title}
                  </h2>
                  <p className="text-[#333333] leading-relaxed">{post.summary}</p>
                </Link>
              </article>
            ))}
          </div>
        )}

        <div className="mt-14">
          <NewsletterSignup />
        </div>
      </div>
    </>
  );
}
