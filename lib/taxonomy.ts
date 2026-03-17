import fs from 'fs';
import path from 'path';
import type { NeighborhoodContext, BuyerSegmentContext, NeighborhoodRelationship } from '@/types/taxonomy';
import type { NeighborhoodSlug, BuyerSegment } from '@/types/shared';

const TAXONOMY_DIR = path.join(process.cwd(), 'content', 'taxonomy');

let _marketContext: NeighborhoodContext[] | null = null;
let _buyerSegments: BuyerSegmentContext[] | null = null;
let _neighborhoodGraph: NeighborhoodRelationship[] | null = null;

function loadMarketContext(): NeighborhoodContext[] {
  if (_marketContext) return _marketContext;
  const filePath = path.join(TAXONOMY_DIR, 'market-context.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  _marketContext = JSON.parse(raw) as NeighborhoodContext[];
  return _marketContext;
}

function loadBuyerSegments(): BuyerSegmentContext[] {
  if (_buyerSegments) return _buyerSegments;
  const filePath = path.join(TAXONOMY_DIR, 'buyer-segments.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  _buyerSegments = JSON.parse(raw) as BuyerSegmentContext[];
  return _buyerSegments;
}

function loadNeighborhoodGraph(): NeighborhoodRelationship[] {
  if (_neighborhoodGraph) return _neighborhoodGraph;
  const filePath = path.join(TAXONOMY_DIR, 'neighborhood-graph.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  _neighborhoodGraph = JSON.parse(raw) as NeighborhoodRelationship[];
  return _neighborhoodGraph;
}

// ─── Neighborhood Context ─────────────────────────────

export function getAllNeighborhoodContexts(): NeighborhoodContext[] {
  return loadMarketContext();
}

export function getNeighborhoodContext(slug: NeighborhoodSlug): NeighborhoodContext | null {
  return loadMarketContext().find((n) => n.slug === slug) ?? null;
}

// ─── Buyer Segments ───────────────────────────────────

export function getAllBuyerSegments(): BuyerSegmentContext[] {
  return loadBuyerSegments();
}

export function getBuyerSegment(id: BuyerSegment): BuyerSegmentContext | null {
  return loadBuyerSegments().find((s) => s.id === id) ?? null;
}

export function getSegmentsForNeighborhood(slug: NeighborhoodSlug): BuyerSegmentContext[] {
  return loadBuyerSegments().filter((s) => s.recommended_neighborhoods.includes(slug));
}

// ─── Neighborhood Graph ───────────────────────────────

export function getNeighborhoodRelationships(slug: NeighborhoodSlug): NeighborhoodRelationship | null {
  return loadNeighborhoodGraph().find((r) => r.slug === slug) ?? null;
}

export function getSimilarNeighborhoods(slug: NeighborhoodSlug): NeighborhoodContext[] {
  const rel = getNeighborhoodRelationships(slug);
  if (!rel) return [];
  return rel.similar_to
    .map((s) => getNeighborhoodContext(s))
    .filter((n): n is NeighborhoodContext => n !== null);
}

export function getAdjacentNeighborhoods(slug: NeighborhoodSlug): NeighborhoodContext[] {
  const rel = getNeighborhoodRelationships(slug);
  if (!rel) return [];
  return rel.adjacent_to
    .map((s) => getNeighborhoodContext(s))
    .filter((n): n is NeighborhoodContext => n !== null);
}

/**
 * Build taxonomy prompt context for AI content generation.
 * Returns a structured object with all relevant context for a given neighborhood.
 */
export function buildNeighborhoodPromptContext(slug: NeighborhoodSlug) {
  const context = getNeighborhoodContext(slug);
  const relationships = getNeighborhoodRelationships(slug);
  const segments = getSegmentsForNeighborhood(slug);
  const similar = getSimilarNeighborhoods(slug);
  const adjacent = getAdjacentNeighborhoods(slug);

  return {
    neighborhood: context,
    relationships,
    target_segments: segments,
    similar_neighborhoods: similar.map((n) => ({ slug: n.slug, name: n.name })),
    adjacent_neighborhoods: adjacent.map((n) => ({ slug: n.slug, name: n.name })),
  };
}
