# Useful Kit

**300 practical browser tools, in batches of five.**

This repo is a static [GitHub Pages](https://pages.github.com/) product site. Every tool runs in the browser, ships with sample input, and can export Markdown results. No API keys. No backend.

## Run locally

```bash
npm install
npm run generate   # builds src/data/catalog.json
npm run dev        # http://127.0.0.1:4321
```

Production build:

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

1. In the repo settings, set Pages **Source** to **GitHub Actions**.
2. Push to `main`.
3. The workflow in `.github/workflows/pages.yml` builds and deploys `dist/`.

The app uses a hash router (`#/tool/...`) so it works on project Pages without server rewrites.

## What’s inside

| | |
| --- | --- |
| Tools | 300 |
| Batches | 60 × 5 |
| Engines | JSON/CSV, diffs, hashes, JWT inspect, license scan, OpenAPI diff, invoice match, SLA percentiles, and more |

Browse batches on the site, or start at batch 1 and step through.

## License

MIT — see [LICENSE](./LICENSE).
