import Link from 'next/link';
import SearchBar from '@/components/shared/SearchBar';
import NewsletterSignup from '@/components/shared/NewsletterSignup';
import EventCard from '@/components/shared/EventCard';
import { getUpcomingEvents, getAllNewsPosts, getAllSpotlights } from '@/lib/content';

const featuredNeighborhoods = [
  { slug: 'the-heights', name: 'The Heights', tagline: 'Walkable, food-forward, best restaurant scene in LR', price: '$285K–$750K' },
  { slug: 'chenal-valley', name: 'Chenal Valley', tagline: 'Master-planned, executive homes, golf community', price: '$400K–$1.2M' },
  { slug: 'downtown', name: 'Downtown', tagline: 'River Market, lofts, urban energy', price: '$180K–$550K' },
  { slug: 'soma', name: 'SoMa District', tagline: 'South Main arts scene, breweries, galleries', price: '$200K–$480K' },
  { slug: 'conway', name: 'Conway', tagline: 'College town, 30 min north, fast growth', price: '$185K–$420K' },
  { slug: 'bryant', name: 'Bryant', tagline: 'Top schools, south suburb, strong value', price: '$185K–$420K' },
];

const popularGuides = [
  { href: '/guides/moving-to-little-rock', title: 'Moving to Little Rock', desc: 'Everything you need to know before the move.' },
  { href: '/guides/first-time-homebuyer-arkansas', title: 'First-Time Homebuyer in Arkansas', desc: 'Down payment assistance, the process, what to watch for.' },
  { href: '/guides/best-neighborhoods-for-families', title: 'Best Neighborhoods for Families', desc: 'Schools, safety, parks — the honest comparison.' },
  { href: '/local/outdoor-guide-little-rock-2026', title: 'Outdoor Activities in Little Rock', desc: 'River trails, state parks, lakes. More than you expect.' },
  { href: '/best-of/dinner/little-rock', title: 'Best Dinner in Little Rock', desc: 'The real list. No sponsored rankings.' },
  { href: '/guides/little-rock-newcomer-guide', title: "Newcomer's Guide to Little Rock", desc: 'The city cheat-sheet. Culture, food, what locals know.' },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function HomePage() {
  const upcomingEvents = getUpcomingEvents(4);
  const latestNews = getAllNewsPosts().slice(0, 3);
  const featuredPlaces = getAllSpotlights().filter((p) => p.featured).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="bg-[#1B4F72] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight text-balance">
            Your guide to living, working, and playing in central Arkansas
          </h1>
          <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto">
            Neighborhood guides, local events, the best places to eat, and real estate resources — all in one place.
          </p>
          <div className="flex justify-center">
            <SearchBar size="lg" placeholder="Search neighborhoods, events, guides..." />
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Link href="/guides/moving-to-little-rock" className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors">
              📦 Moving Here
            </Link>
            <Link href="/neighborhoods" className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors">
              🏘️ All Neighborhoods
            </Link>
            <Link href="/tools/neighborhood-quiz" className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors">
              🗺️ Find My Neighborhood
            </Link>
            <Link href="/events" className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors">
              📅 This Weekend
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16">

        {/* Explore Neighborhoods */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#1C1C1C]">Explore Neighborhoods</h2>
            <Link href="/neighborhoods" className="text-sm text-[#2E86C1] hover:underline font-medium">
              All 20 →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredNeighborhoods.map(({ slug, name, tagline, price }) => (
              <Link
                key={slug}
                href={`/neighborhoods/${slug}`}
                className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-5 border-l-4 border-[#2E86C1]"
              >
                <h3 className="font-semibold text-[#1C1C1C] group-hover:text-[#1B4F72] transition-colors">{name}</h3>
                <p className="text-sm text-[#555555] mt-1">{tagline}</p>
                <p className="text-sm font-medium text-[#1B4F72] mt-2">{price}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Neighborhood Quiz CTA */}
        <section className="bg-[#F0F4F8] rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-[#1C1C1C] mb-3">Not sure where to start?</h2>
          <p className="text-[#555555] mb-6 max-w-lg mx-auto">
            Answer a few questions about your lifestyle, budget, and priorities — we&apos;ll match you with the right neighborhoods.
          </p>
          <Link
            href="/tools/neighborhood-quiz"
            className="inline-block bg-[#1B4F72] hover:bg-[#2E86C1] text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Take the Neighborhood Quiz
          </Link>
        </section>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#1C1C1C]">Upcoming Events</h2>
              <Link href="/events" className="text-sm text-[#2E86C1] hover:underline font-medium">
                All events →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {upcomingEvents.map((event) => (
                <div key={event.slug} className="bg-white rounded-lg border border-[#E5E5E5] shadow-sm p-4">
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
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Featured Places */}
        {featuredPlaces.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#1C1C1C]">Featured Places</h2>
              <Link href="/places" className="text-sm text-[#2E86C1] hover:underline font-medium">
                All places →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {featuredPlaces.map((place) => (
                <Link
                  key={place.slug}
                  href={`/places/${place.slug}`}
                  className="group bg-white rounded-lg border border-[#E5E5E5] shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  {place.image ? (
                    <div className="h-36 overflow-hidden">
                      <img
                        src={place.image.src}
                        alt={place.image.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-36 bg-gradient-to-br from-[#1B4F72] to-[#2E86C1] flex items-center justify-center">
                      <span className="text-3xl">
                        {place.type === 'restaurant' ? '🍽️'
                          : place.type === 'bar' || place.type === 'brewery' ? '🍺'
                          : place.type === 'coffee' ? '☕'
                          : place.type === 'bakery' ? '🥐'
                          : '🏪'}
                      </span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-[#1C1C1C] group-hover:text-[#1B4F72] transition-colors">
                      {place.name}
                    </h3>
                    <p className="text-xs text-[#555555] mt-0.5 capitalize">
                      {place.type.replace('_', ' ')} · {place.price_range}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Latest News */}
        {latestNews.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#1C1C1C]">Latest News</h2>
              <Link href="/news" className="text-sm text-[#2E86C1] hover:underline font-medium">
                All news →
              </Link>
            </div>
            <div className="space-y-3">
              {latestNews.map((post) => (
                <Link
                  key={post.slug}
                  href={`/news/${post.slug}`}
                  className="flex items-start gap-4 bg-white rounded-lg border border-[#E5E5E5] shadow-sm hover:shadow-md transition-shadow p-4"
                >
                  <div className="flex-shrink-0 text-xs font-semibold text-[#555555] pt-0.5 w-16 text-right">
                    {formatDate(post.date_published)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1C1C1C] hover:text-[#1B4F72] transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-sm text-[#555555] mt-1 line-clamp-1">{post.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Popular Guides */}
        <section>
          <h2 className="text-2xl font-bold text-[#1C1C1C] mb-6">Popular Guides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularGuides.map(({ href, title, desc }) => (
              <Link
                key={href}
                href={href}
                className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-5"
              >
                <h3 className="font-semibold text-[#1C1C1C] group-hover:text-[#1B4F72] transition-colors leading-snug">{title}</h3>
                <p className="text-sm text-[#555555] mt-2">{desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section>
          <NewsletterSignup />
        </section>

      </div>
    </>
  );
}
