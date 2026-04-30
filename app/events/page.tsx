import type { Metadata } from 'next';
import Link from 'next/link';

import { getUpcomingEvents, getHighlightedEvents } from '@/lib/content';
import { breadcrumbSchema, toJsonLd } from '@/lib/schema';

import Breadcrumbs from '@/components/layout/Breadcrumbs';
import NewsletterSignup from '@/components/shared/NewsletterSignup';
import EventsGrid from './_components/EventsGrid';

export const metadata: Metadata = {
  title: 'Events in Little Rock & Central Arkansas | Metro Little Rock',
  description:
    'Find upcoming events in Little Rock, Conway, Bryant, and the central Arkansas metro — concerts, food festivals, art walks, farmers markets, and family events.',
  alternates: { canonical: '/events' },
  openGraph: {
    title: 'Events in Little Rock & Central Arkansas',
    description:
      'Concerts, food festivals, art walks, farmers markets, and more across the Little Rock metro.',
  },
};

const MONTHS = [
  'Jan','Feb','Mar','Apr','May','Jun',
  'Jul','Aug','Sep','Oct','Nov','Dec',
];

function formatShortDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00');
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

export default function EventsHubPage() {
  const allEvents = getUpcomingEvents();
  const highlights = getHighlightedEvents(6);

  const jsonLdBreadcrumb = breadcrumbSchema([{ label: 'Events' }]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(jsonLdBreadcrumb) }}
      />

      {/* Hero */}
      <div className="bg-[#1B4F72] text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Breadcrumbs crumbs={[{ label: 'Events' }]} />
          <h1 className="text-3xl md:text-4xl font-bold mt-3 mb-2">
            What&apos;s Happening in Little Rock
          </h1>
          <p className="text-blue-200 max-w-2xl text-lg">
            Concerts, food festivals, art walks, farmers markets, and community events
            across the central Arkansas metro.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 space-y-14">

        {/* Editor's Picks */}
        {highlights.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-[#1C1C1C]">Editor&apos;s Picks</h2>
              <span className="text-xs bg-[#D4740A] text-white px-2.5 py-1 rounded-full font-medium">
                ★ Don&apos;t Miss
              </span>
            </div>

            {/* Horizontal scroll on mobile, grid on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {highlights.map((event) => (
                <div key={event.slug} className="relative">
                  <Link
                    href={`/events/${event.slug}`}
                    className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
                  >
                    <div className="bg-[#1B4F72] px-4 py-3 flex items-center justify-between">
                      <span className="text-white font-bold text-sm">
                        {formatShortDate(event.date_start)}
                      </span>
                      <span className="text-blue-200 text-xs capitalize">{event.category}</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-[#1C1C1C] group-hover:text-[#1B4F72] transition-colors leading-snug">
                        {event.event_name}
                      </h3>
                      <p className="text-sm text-[#555555] mt-1">{event.time}</p>
                      <p className="text-sm text-[#555555]">{event.venue_name}</p>
                      <p className="text-xs font-medium text-[#D4740A] mt-2">
                        {event.price_range === 'free' ? 'Free' : event.price_range}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Events with filter */}
        <section>
          <h2 className="text-xl font-bold text-[#1C1C1C] mb-5">Browse All Events</h2>
          <EventsGrid events={allEvents} />
        </section>

        {/* Submit / source callout */}
        <section className="bg-[#F0F4F8] rounded-xl p-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-[#1C1C1C]">Know about an event we missed?</h3>
            <p className="text-sm text-[#555555] mt-1">
              We cover events across the metro — concerts, markets, community nights, and more.
              Send us a tip and we&apos;ll get it listed.
            </p>
          </div>
          <Link
            href="/contact"
            className="flex-shrink-0 px-5 py-2.5 bg-[#1B4F72] text-white text-sm font-semibold rounded-lg hover:bg-[#2E86C1] transition-colors"
          >
            Submit an Event
          </Link>
        </section>

        {/* Newsletter */}
        <section>
          <NewsletterSignup />
        </section>

      </div>
    </>
  );
}
