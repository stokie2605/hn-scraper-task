# Hacker News HTML Scraper

Built by Dean Wilshaw.

Hacker News HTML Scraper is a Node.js data pipeline that fetches the live Hacker News homepage, parses the raw HTML with Cheerio, extracts story metadata, sorts stories by engagement score, and writes structured JSON output for downstream analysis.

The project demonstrates production-style scraping patterns: retry-safe network access, DOM selector handling, data normalization, deterministic sorting, and persistent local JSON export.

### Parsing Architecture & Network Logic

- **Network resilience:** `fetchWithRetry()` wraps the Axios request with three retry attempts and a delay between failures.
- **Browser-like request headers:** The scraper sends a desktop `User-Agent` header to reduce fragile request behavior against the live HTML endpoint.
- **Cheerio DOM parsing:** The raw HTML response is loaded with `cheerio.load()` so Hacker News table rows can be queried with stable CSS selectors.
- **Story row selection:** The scraper targets `.athing` rows, then reads the adjacent subtext row with `titleRow.next()` to collect author and score metadata.
- **Structured normalization:** Extracted values are converted into `{ id, title, author, score, url }` records.
- **Engagement sorting:** Stories are sorted descending by numeric score before export.
- **Dual file output:** The latest dataset is written to `stories.json`, while a date-stamped archive is written to `stories-archive-YYYY-MM-DD.json`.

## The Business Problem

Operational teams often need lightweight ways to collect public web data without relying on a formal API. HTML pages can change, network calls can fail, and raw markup rarely arrives in a shape suitable for reporting or automation.

Common problems this project addresses:

- Raw HTML is difficult to consume directly in analytics workflows.
- Network calls may fail intermittently and need retry handling.
- DOM extraction can become brittle without clear selector boundaries.
- Scraped records need consistent field names and fallback values.
- Engagement metrics must be parsed as numbers before sorting.
- Teams need both a latest output file and archive evidence for repeatable runs.

## The Solution & Architecture

This project implements a simple but robust scraping pipeline:

```text
Hacker News Homepage
        |
        v
Axios fetchWithRetry()
        |
        v
Cheerio HTML Parser
        |
        v
.athing Story Row Selection
        |
        v
Metadata Extraction + URL Normalization
        |
        v
Score-Based Sorting
        |
        +--> stories.json
        |
        +--> stories-archive-YYYY-MM-DD.json
```

## Technical Toolkit

- Node.js
- Axios
- Cheerio
- CommonJS modules
- JSON file serialization
- Basic assertion-based unit testing

## Local Execution Setup

### Install Dependencies

```bash
npm install
```

### Run the Scraper

Fetch and sort the default top 5 stories:

```bash
node scraper.js
```

Fetch a custom number of stories:

```bash
node scraper.js 10
```

### Run the Sorting Test

```bash
node test.js
```

## Output Files

```text
stories.json                         # Latest scraped and sorted dataset
stories-archive-YYYY-MM-DD.json      # Date-stamped archive from the run
```

Example record:

```json
{
  "id": 123456,
  "title": "Example Hacker News Story",
  "author": "example-user",
  "score": 250,
  "url": "https://example.com/story"
}
```

## Production Readiness Notes

- Add structured logging with clear ASCII-safe terminal output for Windows shells.
- Add selector regression tests using saved HTML fixtures.
- Add CLI flags for output directory, retry count, and archive mode.
- Add schema validation for extracted story records.
- Respect target-site rate limits and avoid high-frequency scraping.
- Consider exporting CSV or NDJSON for data pipeline ingestion.
