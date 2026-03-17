import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

import { getEvent, getAllEvents } from '@/lib/content';
import { eventSchema, breadcrumbSchema, toJsonLd } from '@/lib/schema';
import type { EventCategory } from '@/types/shared';

import Breadcrumbs from '@/components/layout/Breadcrumbs';
import Badge from '@/components/shared/Badge';
import EventCard from '@/components/shared/EventCard';
import NewsletterSignup from '@/components/shared/NewsletterSignup';

// ─── Static Params ────────────────────────────────────

export async function generateStaticParams() {
  return getAllEvents().map((e) => ({ slug: e.slug }));
}

// ─── Metadata ─────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const event = getEvent(params.slug);
  if (!event) return {};
  return {
    title: event.seo.title,
    description: event.seo.description,
    alternates: { canonical: event.seo.canonical },
    openGraph: {
      title: event.seo.title,
      description: event.seo.description,
      ...(event.seo.og_image ? { images: [event.seo.og_image] } : {}),
    },
  };
}

// ─── Category styling ─────────────────────────────────

const categoryHero: Record<EventCategory, string> = {
  music: 'bg-[#1B4F72]',
  food: 'bg-[#D4740A]',
  family: 'bg-[#1E8449]',
  arts: 'bg-[#2E86C1]',
  sports: 'bg-[#1B4F72]',
  markets: 'bg-[#D4740A]',
  community: 'bg-[#1E8449]',
  nightlife: 'bg-[#1C1C1C]',
};

const categoryBadge: Record<EventCategory, 'primary' | 'accent' | 'warm' | 'success' | 'neutral'> = {
  music: 'primary',
  food: 'warm',
  family: 'success',
  arts: 'accent',
  sports: 'primary',
  markets: 'warm',
  community: 'success',
  nightlife: 'neutral',
};

// ─── Helpers ──────────────────────────────────────────

const MONTHS = ['January','February','March','April','May','June',
  'July','August','September','October','November','December'];
const WDAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function formatFullDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00');
  return `${WDAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function mapsLink(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

// ─── Page ─────────────────────────────────────────────

export default function EventDetailPage({ params }: { params: { slug: string } }) {
  const event = getEvent(params.slug);
  if (!event) notFound();

  const relatedEvents = getAllEvents()
    .filter((e) => e.category === event.category && e.slug !== event.slug)
    .slice(0, 3);

  const jsonLdEvent = eventSchema({
    name: event.event_name,
    slug: event.slug,
    startDate: event.date_start,
    endDate: event.date_end,
    description: event.seo.description,
    venue_name: event.venue_name,
    venue_address: event.venue_address,
    lat: event.venue_coordinates.lat,
    lng: event.venue_coordinates.lng,
    price_range: event.price_range,
    ticket_url: event.ticket_url,
  });

  const jsonLdBreadcrumb = breadcrumbSchema([
    { label: 'Events', href: '/events' },
    { label: event.event_name },
  ]);

  return (
    <>
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(jsonLdEvent) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(jsonLdBreadcrumb) }} />

      {/* Hero banner */}
      <div className={`${categoryHero[event.category]} text-white py-10 px-4`}>
        <div className="max-w-5xl mx-auto">
          <Breadcrumbs
            crumbs={[
              { label: 'Events', href: '/events' },
              { label: event.event_name },
            ]}
          />
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <Badge label={event.category} variant={categoryBadge[event.category]} />
            {event.highlight && (
              <span className="text-xs bg-[#D4740A] text-white px-2.5 py-0.5 rounded-full font-medium">
                ★ Editor&apos;s Pick
              </span>
            )}
            {event.recurring && (
              <span className="text-xs bg-white/20 text-white px-2.5 py-0.5 rounded-full font-medium capitalize">
                {event.recurring.pattern}
                {event.recurring.day_of_week ? ` · ${event.recurring.day_of_week}s` : ''}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mt-3 leading-tight">
            {event.event_name}
          </h1>
          <p className="text-white/80 mt-2 text-lg">
            {formatFullDate(event.date_start)}
            {event.date_end && event.date_end !== event.date_start
              ? ` – ${formatFullDate(event.date_end)}`
              : ''}{' '}
            · {event.time}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">

          {/* Main */}
          <article className="min-w-0">

            {/* When & Where */}
            <div className="bg-[#F0F4F8] rounded-xl p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p className="text-xs font-semibold text-[#555555] uppercase tracking-wide mb-1">Date &amp; Time</p>
                <p className="font-semibold text-[#1C1C1C]">{formatFullDate(event.date_start)}</p>
                {event.date_end && event.date_end !== event.date_start && (
                  <p className="text-sm text-[#555555]">through {formatFullDate(event.date_end)}</p>
                )}
                <p className="text-[#555555] text-sm mt-0.5">{event.time}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#555555] uppercase tracking-wide mb-1">Venue</p>
                <p className="font-semibold text-[#1C1C1C]">{event.venue_name}</p>
                <p className="text-sm text-[#555555]">{event.venue_address}</p>
                <a
                  href={mapsLink(event.venue_address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#2E86C1] hover:underline mt-1 inline-block"
                >
                  Get directions →
                </a>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-slate max-w-none mb-8">
              <p className="text-[#333333] leading-relaxed text-base">{event.description}</p>
            </div>

            {/* Tags */}
            {event.tags.length > 0 && (
              <div className="mb-8">
                <p className="text-xs font-semibold text-[#555555] uppercase tracking-wide mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-[#F0F4F8] text-[#555555] px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related events */}
            {relatedEvents.length > 0 && (
              <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#1C1C1C]">
                    More {event.category.charAt(0).toUpperCase() + event.category.slice(1)} Events
                  </h2>
                  <Link href={`/events`} className="text-sm text-[#2E86C1] hover:underline">
                    All events →
                  </Link>
                </div>
                <div className="space-y-3">
                  {relatedEvents.map((e) => (
                    <EventCard
                      key={e.slug}
                      slug={e.slug}
                      event_name={e.event_name}
                      date_start={e.date_start}
                      time={e.time}
                      venue_name={e.venue_name}
                      category={e.category}
                      price_range={e.price_range}
                      highlight={e.highlight}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Newsletter */}
            <NewsletterSignup />

          </article>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="sticky top-6 space-y-5">

              {/* Ticket / RSVP */}
              <div className="bg-[#1B4F72] text-white rounded-xl p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-200 mb-1">Admission</p>
                <p className="text-2xl font-bold">
                  {event.price_range === 'free' ? 'Free' : event.price_range}
                </p>
                {event.ticket_url ? (
                  <a
                    href={event.ticket_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 block w-full text-center px-5 py-3 bg-[#D4740A] hover:bg-[#B8620A] text-white font-semibold rounded-lg transition-colors text-sm"
                  >
                    Get Tickets
                  </a>
                ) : (
                  <p className="text-blue-200 text-sm mt-2">
                    {event.price_range === 'free' ? 'No tickets required.' : 'Tickets at the door.'}
                  </p>
                )}
              </div>

              {/* Quick facts */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-[#555555] uppercase tracking-wide">Category</p>
                  <p className="mt-1 capitalize text-[#1C1C1C] font-medium">{event.category}</p>
                </div>
                {event.neighborhood_slug && (
                  <div>
                    <p className="text-xs font-semibold text-[#555555] uppercase tracking-wide">Neighborhood</p>
                    <Link
                      href={`/neighborhoods/${event.neighborhood_slug}`}
                      className="mt-1 text-[#2E86C1] hover:underline text-sm font-medium block"
                    >
                      {event.neighborhood_slug
                        .split('-')
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(' ')} →
                    </Link>
                  </div>
                )}
                {event.recurring && (
                  <div>
                    <p className="text-xs font-semibold text-[#555555] uppercase tracking-wide">Recurring</p>
                    <p className="mt-1 text-[#1C1C1C] text-sm capitalize">
                      {event.recurring.pattern}
                      {event.recurring.day_of_week ? ` on ${event.recurring.day_of_week}s` : ''}
                    </p>
                  </div>
                )}
                {event.source_url && (
                  <div>
                    <a
                      href={event.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#2E86C1] hover:underline"
                    >
                      Official event page →
                    </a>
                  </div>
                )}
              </div>

              {/* Back to events */}
              <Link
                href="/events"
                className="block text-center text-sm text-[#1B4F72] hover:text-[#2E86C1] font-medium py-2"
              >
                ← All Events
              </Link>

            </div>
          </aside>

        </div>
      </div>
    </>
  );
}
