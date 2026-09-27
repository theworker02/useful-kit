# Useful Kit

**300 practical browser tools, in batches of five.**

Live: **[https://useful-kit.vercel.app](https://useful-kit.vercel.app)**

Static product site. Every tool runs in the browser, ships with sample input, and can export Markdown results. No API keys. No backend.

## Run locally

```bash
npm install
npm run generate   # builds public/catalog.json
npm run dev        # http://127.0.0.1:4321
```

Production build:

```bash
npm run build
npm run preview
```

## Deploy

Production is on Vercel as `useful-kit`:

```bash
npm run build
# deploy the dist/ folder (already live at useful-kit.vercel.app)
```

A GitHub Pages workflow is also in `.github/workflows/pages.yml` if you later connect a GitHub repo and enable Actions Pages. The app uses a hash router (`#/tool/...`) so project Pages work without server rewrites.

## What’s inside

| | |
| --- | --- |
| Tools | 300 |
| Batches | 60 × 5 |
| Engines | JSON/CSV, diffs, hashes, JWT inspect, license scan, OpenAPI diff, invoice match, SLA percentiles, and more |

## License

MIT — see [LICENSE](./LICENSE).
