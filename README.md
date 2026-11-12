# TailorWebs

Bilingual (ES/EN) marketing site for TailorWebs — websites, apps and IT services, made to measure. El Paso, TX.

## Develop

```bash
bun install
bun run dev    # http://localhost:8080
bun run test
bun run build
```

## Edit content

- All text: `src/i18n/es.ts` and `src/i18n/en.ts` (same keys in both; `bun run test` checks it).
- Email, contact form key, WhatsApp: `src/config/site.ts`.
  - Contact form: create a free access key at web3forms.com for info@tailorwebs.com and paste it into `web3formsKey`. Without it, the form opens the visitor's email app.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds with `BASE_PATH=/tailorwebs/` and publishes to GitHub Pages.
If the site moves to a custom domain, set `BASE_PATH` to `/`, add `public/CNAME` with the domain, and update the `og:image` URL in `index.html` and `publicUrl` in `src/config/site.ts`.
