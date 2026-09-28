# Useful Kit

**300 practical browser tools, in batches of five.**

Live: **[https://theworker02.github.io/useful-kit/](https://theworker02.github.io/useful-kit/)**

Also on Vercel: [https://useful-kit.vercel.app](https://useful-kit.vercel.app)

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

GitHub Pages serves the built site from the `gh-pages` branch:

```bash
npm run build
# publish dist/ to the gh-pages branch
```

Repo: [github.com/theworker02/useful-kit](https://github.com/theworker02/useful-kit)

The app uses a hash router (`#/tool/...`) and a relative Vite `base`, so project Pages work without server rewrites.

## What’s inside

| | |
| --- | --- |
| Tools | 300 |
| Batches | 60 × 5 |
| Engines | JSON/CSV, diffs, hashes, JWT inspect, license scan, OpenAPI diff, invoice match, SLA percentiles, and more |

## License

MIT — see [LICENSE](./LICENSE).
