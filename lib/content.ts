import fs from 'fs';
import path from 'path';
import type { NeighborhoodGuide, MarketReport, ServicePage, ResourceGuide, NeighborhoodComparison, Event, BusinessSpotlight, BestOfList, SeasonalGuide, WeekendGuide, NewsPost, LifestyleArticle } from '@/types/content';
import type { NeighborhoodSlug } from '@/types/shared';

const CONTENT_DIR = path.join(process.cwd(), 'content');

function readJSON<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

function readJSONDir<T>(dir: string): T[] {
  const dirPath = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath)
    .filter((f) => f.endsWith('.json'))
    .map((f) => readJSON<T>(path.join(dirPath, f)));
}

// ─── Neighborhood Guides ─────────────────────────────

export function getAllNeighborhoodGuides(): NeighborhoodGuide[] {
  return readJSONDir<NeighborhoodGuide>('neighborhoods');
}

export function getNeighborhoodGuide(slug: NeighborhoodSlug): NeighborhoodGuide | null {
  const filePath = path.join(CONTENT_DIR, 'neighborhoods', `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  return readJSON<NeighborhoodGuide>(filePath);
}

export function getNeighborhoodSlugs(): NeighborhoodSlug[] {
  const dirPath = path.join(CONTENT_DIR, 'neighborhoods');
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace('.json', '') as NeighborhoodSlug);
}

// ─── Market Reports ───────────────────────────────────

export function getAllMarketReports(): MarketReport[] {
  return readJSONDir<MarketReport>('market-reports');
}

export function getMarketReport(slug: string): MarketReport | null {
  const filePath = path.join(CONTENT_DIR, 'market-reports', `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  return readJSON<MarketReport>(filePath);
}

export function getMarketReportByNeighborhood(neighborhoodSlug: NeighborhoodSlug): MarketReport | null {
  const all = getAllMarketReports();
  return all.find((r) => r.neighborhood_slug === neighborhoodSlug) ?? null;
}

// ─── Service Pages ────────────────────────────────────

export function getAllServicePages(): ServicePage[] {
  return readJSONDir<ServicePage>('services');
}

export function getServicePage(slug: string): ServicePage | null {
  const filePath = path.join(CONTENT_DIR, 'services', `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  return readJSON<ServicePage>(filePath);
}

export function getServiceSlugs(): string[] {
  const dirPath = path.join(CONTENT_DIR, 'services');
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath).filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', ''));
}

// ─── Resource Guides ──────────────────────────────────

export function getAllResourceGuides(): ResourceGuide[] {
  return readJSONDir<ResourceGuide>('guides');
}

export function getResourceGuide(slug: string): ResourceGuide | null {
  const filePath = path.join(CONTENT_DIR, 'guides', `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  return readJSON<ResourceGuide>(filePath);
}

export function getGuideSlugs(): string[] {
  const dirPath = path.join(CONTENT_DIR, 'guides');
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath).filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', ''));
}

// ─── Comparisons ──────────────────────────────────────

export function getAllComparisons(): NeighborhoodComparison[] {
  return readJSONDir<NeighborhoodComparison>('comparisons');
}

export function getComparison(slug: string): NeighborhoodComparison | null {
  const filePath = path.join(CONTENT_DIR, 'comparisons', `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  return readJSON<NeighborhoodComparison>(filePath);
}

export function getComparisonSlugs(): string[] {
  const dirPath = path.join(CONTENT_DIR, 'comparisons');
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath).filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', ''));
}

// ─── Events ───────────────────────────────────────────

export function getAllEvents(): Event[] {
  return readJSONDir<Event>('events').sort(
    (a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime()
  );
}

export function getEvent(slug: string): Event | null {
  const filePath = path.join(CONTENT_DIR, 'events', `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  return readJSON<Event>(filePath);
}

export function getUpcomingEvents(limit?: number): Event[] {
  const now = new Date();
  const upcoming = getAllEvents().filter((e) => new Date(e.date_start) >= now);
  return limit ? upcoming.slice(0, limit) : upcoming;
}

export function getHighlightedEvents(limit = 5): Event[] {
  return getUpcomingEvents().filter((e) => e.highlight).slice(0, limit);
}

// ─── Business Spotlights ──────────────────────────────

export function getAllSpotlights(): BusinessSpotlight[] {
  return readJSONDir<BusinessSpotlight>('places');
}

export function getSpotlight(slug: string): BusinessSpotlight | null {
  const filePath = path.join(CONTENT_DIR, 'places', `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  return readJSON<BusinessSpotlight>(filePath);
}

export function getSpotlightsByNeighborhood(neighborhoodSlug: NeighborhoodSlug): BusinessSpotlight[] {
  return getAllSpotlights().filter((s) => s.neighborhood_slug === neighborhoodSlug);
}

// ─── Best-Of Lists ────────────────────────────────────

export function getAllBestOfLists(): BestOfList[] {
  return readJSONDir<BestOfList>('best-of');
}

export function getBestOfList(slug: string): BestOfList | null {
  const filePath = path.join(CONTENT_DIR, 'best-of', `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  return readJSON<BestOfList>(filePath);
}

export function getBestOfSlugs(): { category: string; area: string }[] {
  return getAllBestOfLists().map((l) => ({ category: l.category, area: l.area }));
}

// ─── Seasonal Guides ──────────────────────────────────

export function getAllSeasonalGuides(): SeasonalGuide[] {
  return readJSONDir<SeasonalGuide>('eat-drink');
}

export function getSeasonalGuide(slug: string): SeasonalGuide | null {
  const filePath = path.join(CONTENT_DIR, 'eat-drink', `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  return readJSON<SeasonalGuide>(filePath);
}

// ─── Weekend Guides ───────────────────────────────────

export function getAllWeekendGuides(): WeekendGuide[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return readJSONDir<any>('local').filter((item: any) => item.date_range !== undefined) as WeekendGuide[];
}

export function getWeekendGuide(slug: string): WeekendGuide | null {
  const filePath = path.join(CONTENT_DIR, 'local', `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = readJSON<any>(filePath);
  return data.date_range ? (data as WeekendGuide) : null;
}

// ─── News Posts ───────────────────────────────────────

export function getAllNewsPosts(): NewsPost[] {
  return readJSONDir<NewsPost>('news').sort(
    (a, b) => new Date(b.date_published).getTime() - new Date(a.date_published).getTime()
  );
}

export function getNewsPost(slug: string): NewsPost | null {
  const filePath = path.join(CONTENT_DIR, 'news', `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  return readJSON<NewsPost>(filePath);
}

export function getLatestNews(limit = 5): NewsPost[] {
  return getAllNewsPosts().slice(0, limit);
}

// ─── Lifestyle Articles ───────────────────────────────

export function getAllLifestyleArticles(): LifestyleArticle[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const all = readJSONDir<any>('local');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return all.filter((item: any) => item.category !== undefined && item.date_range === undefined) as LifestyleArticle[];
}

export function getLifestyleArticle(slug: string): LifestyleArticle | null {
  const filePath = path.join(CONTENT_DIR, 'local', `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  return readJSON<LifestyleArticle>(filePath);
}
