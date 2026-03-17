/**
 * Schema.org JSON-LD generators for Metro Little Rock.
 * Every page type gets appropriate structured data.
 */

const SITE_URL = 'https://metrolittlerock.com';
const SITE_NAME = 'Metro Little Rock';

const AGENT = {
  '@type': 'RealEstateAgent',
  name: 'David',
  url: SITE_URL,
  description: 'Little Rock area real estate agent with EXP Realty',
  areaServed: 'Little Rock, AR metropolitan area',
};

// ─── Site-Wide ────────────────────────────────────────

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Your guide to living, working, and playing in central Arkansas.',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbSchema(crumbs: { label: string; href?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      ...crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: c.label,
        ...(c.href ? { item: `${SITE_URL}${c.href}` } : {}),
      })),
    ],
  };
}

// ─── Neighborhood Guide ───────────────────────────────

export function neighborhoodSchema(opts: {
  name: string;
  slug: string;
  description: string;
  lat: number;
  lng: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: opts.name,
    url: `${SITE_URL}/neighborhoods/${opts.slug}`,
    description: opts.description,
    geo: { '@type': 'GeoCoordinates', latitude: opts.lat, longitude: opts.lng },
    containedInPlace: { '@type': 'City', name: 'Little Rock', addressRegion: 'AR' },
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

// ─── Market Report ────────────────────────────────────

export function marketReportSchema(opts: {
  slug: string;
  neighborhood: string;
  report_date: string;
  description: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `${opts.neighborhood} Real Estate Market Report`,
    description: opts.description,
    url: `${SITE_URL}/neighborhoods/${opts.slug}/market`,
    dateModified: opts.report_date,
    creator: AGENT,
  };
}

// ─── Article / Guide ──────────────────────────────────

export function articleSchema(opts: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    url: `${SITE_URL}${opts.url}`,
    author: AGENT,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    ...(opts.datePublished ? { datePublished: opts.datePublished } : {}),
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
    ...(opts.image ? { image: opts.image } : {}),
  };
}

// ─── Event ────────────────────────────────────────────

export function eventSchema(opts: {
  name: string;
  slug: string;
  startDate: string;
  endDate?: string;
  description: string;
  venue_name: string;
  venue_address: string;
  lat: number;
  lng: number;
  price_range: string;
  ticket_url?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: opts.name,
    url: `${SITE_URL}/events/${opts.slug}`,
    startDate: opts.startDate,
    ...(opts.endDate ? { endDate: opts.endDate } : {}),
    description: opts.description,
    location: {
      '@type': 'Place',
      name: opts.venue_name,
      address: opts.venue_address,
      geo: { '@type': 'GeoCoordinates', latitude: opts.lat, longitude: opts.lng },
    },
    offers: {
      '@type': 'Offer',
      price: opts.price_range === 'free' ? '0' : undefined,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: opts.ticket_url,
    },
  };
}

// ─── Local Business ───────────────────────────────────

export function localBusinessSchema(opts: {
  name: string;
  slug: string;
  type: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  website?: string;
  price_range: string;
}) {
  const schemaType = opts.type === 'restaurant' ? 'Restaurant'
    : opts.type === 'bar' || opts.type === 'brewery' ? 'BarOrPub'
    : opts.type === 'coffee' ? 'CafeOrCoffeeShop'
    : opts.type === 'bakery' ? 'Bakery'
    : 'LocalBusiness';

  return {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: opts.name,
    url: `${SITE_URL}/places/${opts.slug}`,
    description: opts.description,
    address: { '@type': 'PostalAddress', streetAddress: opts.address, addressRegion: 'AR' },
    geo: { '@type': 'GeoCoordinates', latitude: opts.lat, longitude: opts.lng },
    priceRange: opts.price_range,
    ...(opts.phone ? { telephone: opts.phone } : {}),
    ...(opts.website ? { sameAs: opts.website } : {}),
  };
}

// ─── Best-Of List ─────────────────────────────────────

export function bestOfListSchema(opts: {
  title: string;
  slug: string;
  category: string;
  area: string;
  items: { name: string; slug: string; rank: number }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: opts.title,
    url: `${SITE_URL}/best-of/${opts.category}/${opts.area}`,
    numberOfItems: opts.items.length,
    itemListElement: opts.items.map((item) => ({
      '@type': 'ListItem',
      position: item.rank,
      name: item.name,
      url: `${SITE_URL}/places/${item.slug}`,
    })),
  };
}

// ─── News Article ─────────────────────────────────────

export function newsArticleSchema(opts: {
  title: string;
  slug: string;
  summary: string;
  datePublished: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: opts.title,
    url: `${SITE_URL}/news/${opts.slug}`,
    description: opts.summary,
    datePublished: opts.datePublished,
    author: AGENT,
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    ...(opts.image ? { image: opts.image } : {}),
  };
}

/** Serialize any schema object to a <script> tag string for use in <head> */
export function toJsonLd(schema: object): string {
  return JSON.stringify(schema);
}
