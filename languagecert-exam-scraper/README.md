# LanguageCert exam catalogue scraper

Install with `npm install`, then run `npm run scrape`. Select the JSON environment with `LANGUAGECERT_ENV` (default: `production`). The environment file controls the base URL, locale and optional `cm` path normalization.

Live results are written deterministically to `output/`: `gathered-exams.json`, `with-price.json`, `no-price.json`, `zero-price.json`, and `blank.json`. `progress.json` updates after every attempted exam and failures are recorded in `errors.json`. The exam list is saved before page processing and category files are checkpointed after every exam. Requested title mapping is represented by each record's `title`: `price`, `no-price`, `zero`, or `blank`. Runtime output is intentionally gitignored and no sample scrape is fabricated.
