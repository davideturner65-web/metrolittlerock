#!/usr/bin/env python3
"""
Fetches local Arkansas news RSS feeds, filters for metro Little Rock stories,
and uses Claude to convert them into MetroLittleRock NewsPost JSON files.

Usage:
  python tools/fetch_news_rss.py            # write new posts
  python tools/fetch_news_rss.py --dry-run  # preview without writing
  python tools/fetch_news_rss.py --limit 5  # cap at 5 new posts
"""

import argparse
import json
import os
import re
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

import anthropic
import feedparser
from dotenv import load_dotenv

# ── Paths ──────────────────────────────────────────────────────────────────

ROOT = Path(__file__).resolve().parent.parent
NEWS_DIR = ROOT / "content" / "news"

# ── RSS Sources ────────────────────────────────────────────────────────────

RSS_FEEDS = [
    {"name": "KARK",              "url": "https://www.kark.com/feed/"},
    {"name": "KATV",              "url": "https://katv.com/feed/"},
    {"name": "THV11",             "url": "https://www.thv11.com/feeds/syndication/rss/news/"},
    {"name": "Arkansas Times",    "url": "https://arktimes.com/feed/"},
    {"name": "Talk Business",     "url": "https://talkbusiness.net/feed/"},
]

LOOKBACK_DAYS = 14

# ── Relevance Filters ──────────────────────────────────────────────────────

LOCATION_KEYWORDS = [
    "little rock", "north little rock", "conway", "bryant", "benton",
    "maumelle", "sherwood", "cabot", "jacksonville", "argenta", "chenal",
    "the heights", "soma district", "south main", "river market",
    "pulaski county", "saline county", "faulkner county",
]

CATEGORY_KEYWORDS = [
    "opens", "opening", "new restaurant", "new bar", "new shop", "grand opening",
    "coming soon", "closes", "closing", "shut down", "shuttered",
    "development", "construction", "approved", "permit", "groundbreaking",
    "mixed-use", "apartment", "housing project", "renovation", "remodel",
    "expansion", "announced", "plans for", "awarded",
]

VALID_NEIGHBORHOODS = [
    "the-heights", "west-little-rock", "downtown", "maumelle", "cammack-village",
    "north-little-rock", "conway", "chenal-valley", "pleasant-valley", "sherwood",
    "jacksonville", "cabot", "bryant", "benton", "hot-springs-village",
    "soma", "riverdale", "midtown", "colony-west-otter-creek", "scott-landmark",
]

# ── Helpers ────────────────────────────────────────────────────────────────

def get_existing_slugs() -> set[str]:
    return {p.stem for p in NEWS_DIR.glob("*.json")}


def entry_date(entry) -> datetime | None:
    parsed = entry.get("published_parsed")
    if parsed:
        return datetime(*parsed[:6], tzinfo=timezone.utc)
    return None


def is_relevant(entry) -> bool:
    text = f"{entry.get('title', '')} {entry.get('summary', '')}".lower()
    pub = entry_date(entry)
    if pub and pub < datetime.now(tz=timezone.utc) - timedelta(days=LOOKBACK_DAYS):
        return False
    has_location = any(kw in text for kw in LOCATION_KEYWORDS)
    has_signal   = any(kw in text for kw in CATEGORY_KEYWORDS)
    return has_location and has_signal


def slugify(text: str) -> str:
    s = text.lower()
    s = re.sub(r"[^a-z0-9\s-]", "", s)
    s = re.sub(r"\s+", "-", s.strip())
    s = re.sub(r"-+", "-", s)
    return s[:80]

# ── Claude conversion ──────────────────────────────────────────────────────

SCHEMA_INSTRUCTIONS = f"""You are an editor for Metro Little Rock, a local lifestyle and real estate guide
for the Little Rock, AR metro area. Your voice is practical, neighborhood-focused,
and honest — not promotional, not sensational.

Convert the provided RSS article into a NewsPost JSON object.

VALID NEIGHBORHOOD SLUGS (use only these exact values):
{json.dumps(VALID_NEIGHBORHOODS, indent=2)}

OUTPUT a single valid JSON object matching this shape exactly:
{{
  "slug": "kebab-case-title-2026",
  "title": "Clear editorial headline",
  "seo": {{
    "title": "Headline | Metro Little Rock News",
    "description": "150-160 char description of what the story is about",
    "canonical": "/news/slug-value"
  }},
  "date_published": "YYYY-MM-DD",
  "category": "opening | closing | development | renovation | announcement",
  "neighborhood_slugs": ["one-to-three", "valid-slugs"],
  "summary": "2-3 sentence summary. First thing readers see.",
  "body_sections": [
    {{"body": "First paragraph, no heading."}},
    {{"heading": "Optional Section Heading", "body": "Section body."}}
  ],
  "impact_note": "1-2 sentences on what this means for residents or buyers. Optional.",
  "source_url": "original article URL",
  "related": []
}}

Return ONLY the JSON object. No markdown fences, no explanation."""


def convert_entry(client: anthropic.Anthropic, entry: dict, source: str) -> dict:
    pub = entry_date(entry)
    pub_str = pub.strftime("%Y-%m-%d") if pub else datetime.now().strftime("%Y-%m-%d")

    content_body = ""
    if entry.get("content"):
        content_body = entry["content"][0].get("value", "")

    article_text = (
        f"Source: {source}\n"
        f"Title: {entry.get('title', '')}\n"
        f"URL: {entry.get('link', '')}\n"
        f"Published: {pub_str}\n"
        f"Body: {entry.get('summary', '') or content_body}"
    )

    resp = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1500,
        system=[
            {
                "type": "text",
                "text": SCHEMA_INSTRUCTIONS,
                "cache_control": {"type": "ephemeral"},
            }
        ],
        messages=[{"role": "user", "content": article_text}],
    )

    raw = resp.content[0].text.strip()
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)
    return json.loads(raw)

# ── Main ───────────────────────────────────────────────────────────────────

def main():
    load_dotenv(ROOT / ".env")

    parser = argparse.ArgumentParser(description="Fetch and convert local news RSS to Metro Little Rock JSON")
    parser.add_argument("--dry-run", action="store_true", help="Preview without writing files")
    parser.add_argument("--limit", type=int, default=10, help="Max new posts to generate (default 10)")
    args = parser.parse_args()

    if not NEWS_DIR.exists():
        sys.exit(f"ERROR: News directory not found at {NEWS_DIR}")

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key and not args.dry_run:
        sys.exit("ERROR: ANTHROPIC_API_KEY not set. Add it to metrolittlerock/.env")

    client = anthropic.Anthropic(api_key=api_key) if api_key else None
    existing = get_existing_slugs()

    print(f"Existing posts : {len(existing)}")
    print(f"Scanning feeds : {len(RSS_FEEDS)}\n")

    candidates: list[tuple[dict, str]] = []
    for feed_cfg in RSS_FEEDS:
        try:
            feed = feedparser.parse(feed_cfg["url"])
            hits = [e for e in feed.entries if is_relevant(e)]
            print(f"  {feed_cfg['name']:20s} {len(feed.entries):3d} entries  {len(hits):2d} relevant")
            candidates.extend((e, feed_cfg["name"]) for e in hits)
        except Exception as exc:
            print(f"  {feed_cfg['name']:20s} ERROR: {exc}")

    print(f"\n{len(candidates)} candidates — processing up to {args.limit}\n")

    if args.dry_run:
        print("DRY RUN — listing candidates (no API calls, no files written):\n")
        shown = 0
        for entry, source in candidates:
            if shown >= args.limit:
                break
            title = entry.get("title", "")
            rough = slugify(title)
            if any(rough[:30] in s for s in existing):
                continue
            pub = entry_date(entry)
            pub_str = pub.strftime("%Y-%m-%d") if pub else "unknown"
            print(f"  [{source}] {pub_str}")
            print(f"  {title}")
            print(f"  {entry.get('link', '')[:80]}")
            print()
            shown += 1
        print(f"{shown} candidate(s) would be sent to Claude. Run without --dry-run to convert.")
        return

    created = 0
    for entry, source in candidates:
        if created >= args.limit:
            break

        title = entry.get("title", "")
        rough = slugify(title)

        if any(rough[:30] in s for s in existing):
            print(f"  SKIP (duplicate) : {title[:65]}")
            continue

        print(f"  Converting : {title[:65]}")
        try:
            post = convert_entry(client, entry, source)
            slug = post.get("slug", rough)

            if slug in existing:
                print(f"    -> SKIP (slug exists): {slug}")
                continue

            out = NEWS_DIR / f"{slug}.json"
            out.write_text(json.dumps(post, indent=2, ensure_ascii=False), encoding="utf-8")
            print(f"    -> Written  : {out.name}")
            existing.add(slug)
            created += 1

        except json.JSONDecodeError as exc:
            print(f"    -> ERROR parsing JSON: {exc}")
        except anthropic.APIError as exc:
            print(f"    -> API error: {exc}")
        except Exception as exc:
            print(f"    -> ERROR: {exc}")

    print(f"\nDone. {created} post(s) created.")

    if created > 0:
        print("\nNext steps:")
        print("  git add content/news/")
        print(f'  git commit -m "news: weekly feed update {datetime.now().strftime("%Y-%m-%d")}"')
        print("  git push")


if __name__ == "__main__":
    main()
