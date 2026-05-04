# Workflow: Update Metro Little Rock News Feed

## Objective
Pull fresh local news from Arkansas RSS feeds, filter for metro Little Rock stories
(openings, closings, development, renovation, announcements), and convert them into
properly formatted NewsPost JSON files for the Metro Little Rock website.

## Frequency
Run weekly — Fridays work well so weekend visitors see fresh content.

## Prerequisites
- `ANTHROPIC_API_KEY` set in `metrolittlerock/.env`
- Python packages installed: `pip install -r requirements.txt`

## Steps

### 1. Install dependencies (first time only)
```
cd C:\Users\David\metrolittlerock
C:\Users\David\AppData\Local\Python\bin\python.exe -m pip install -r requirements.txt
```

### 2. Dry run — preview before committing API credits
```
C:\Users\David\AppData\Local\Python\bin\python.exe tools/fetch_news_rss.py --dry-run
```
Review the candidate stories. If quality looks good, proceed. If feeds are down or
candidates look off-topic, investigate before running for real.

### 3. Run for real
```
C:\Users\David\AppData\Local\Python\bin\python.exe tools/fetch_news_rss.py
```
New JSON files are written to `content/news/`.

### 4. Review generated files
Open each new file and check:
- **Factual accuracy** — Claude works from truncated RSS summaries. Verify key claims
  (business names, addresses, dates) especially for opening/closing stories.
- **Neighborhood slugs** — confirm the assigned slugs match the actual location.
- **Category** — opening/closing/development/renovation/announcement.
- **Summary and body** — reads like a Metro Little Rock editorial, not a press release.

### 5. Commit and push
```
cd C:\Users\David\metrolittlerock
git add content/news/
git commit -m "news: weekly feed update YYYY-MM-DD"
git push
```
Vercel redeploys automatically on push. Done.

---

## RSS Sources
| Source          | Coverage                         |
|-----------------|----------------------------------|
| KARK            | Breaking news, local TV          |
| KATV            | Breaking news, local TV          |
| THV11           | Breaking news, local TV          |
| Arkansas Times  | Alt weekly, deeper local stories |
| Talk Business   | Business and economic news       |

To add a source, append an entry to `RSS_FEEDS` in `tools/fetch_news_rss.py`.

## Relevance Filtering
Stories must pass both tests to become candidates:
1. **Location match** — title or summary mentions a metro city, neighborhood, or county
2. **Category signal** — contains a keyword like "opens", "groundbreaking", "approved",
   "renovation", etc.
3. **Age check** — published within the last 14 days (configurable via `LOOKBACK_DAYS`)

## Duplicate Prevention
The tool checks existing slugs before writing. Already-covered stories are skipped
automatically. Running the tool twice in the same week is safe.

## Edge Cases
| Situation                    | What happens                                      |
|------------------------------|---------------------------------------------------|
| RSS feed is down             | Logged, tool continues with other feeds           |
| Claude returns malformed JSON| Story is skipped, error logged, tool continues    |
| Story already in content/    | Skipped (slug match check)                        |
| No relevant stories found    | Tool exits cleanly with count of 0                |
| API rate limit hit           | anthropic SDK raises APIError, story is skipped   |

## Known Limitations
- RSS descriptions are often truncated — Claude summarizes what it can see. For major
  stories, expand `body_sections` manually after reviewing.
- The tool does not verify business names, addresses, or dates against any authoritative
  source. Always spot-check before pushing.
- Neighborhood slug assignment is AI-estimated. North Little Rock stories sometimes land
  on `downtown` — verify and correct as needed.
