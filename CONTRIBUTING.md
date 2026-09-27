# Contributing

Thanks for helping raise the quality of North Harbor Studio.

## Ground rules

- Prefer deepening an existing product over adding toy repos
- Keep engines pure and unit-testable
- Update acquisition docs when behavior or ICP changes
- Never commit real secrets or customer data

## Local development

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Pull request checklist

- [ ] Product workspace still loads sample fixtures
- [ ] Export paths still produce Markdown/JSON
- [ ] `docs/<product>/ACQUISITION.md` updated if positioning changed
- [ ] No production secrets in fixtures

## Code style

- TypeScript strictness as configured by the Next.js scaffold
- UI primitives via shadcn/ui — do not add a second component library
- Match existing coastal studio visual language
