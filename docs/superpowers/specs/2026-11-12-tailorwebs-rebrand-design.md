# TailorWebs rebrand — design

Date: 2026-11-12 · Branch: `feat/tailored-rebrand` · Status: awaiting review

## Goal

Turn the Lovable "AxiomAI" template into a one-page, bilingual (ES/EN) marketing site for
TailorWebs that promotes nine tech services, looks hand-made rather than templated, and is
published on GitHub Pages. TailorWebs stands alone (no BEMECH Consulting branding).

## Decisions already made

| Topic | Decision |
| --- | --- |
| Visual direction | A · Tailored craft — cream, ink, rust accent, serif headings, stitch/measuring-tape motion |
| Approach | Keep the template's foundation (Vite, React 18, Tailwind 3, shadcn/ui, framer-motion, a11y work); rebuild the page content |
| Scope | Marketing only. Blog, admin, demo, auth and the Lovable Cloud (Supabase) backend are deleted |
| Brand | TailorWebs only |
| Proof | No invented testimonials, client logos or stats. A portfolio section is added later when real work exists |
| Hosting | New GitHub repo + GitHub Pages, done after the site is finished |

## Content: the nine services

Grouped so the page reads as three ideas instead of nine equal boxes.

| Group (ES / EN) | Services |
| --- | --- |
| Construimos / Build | Aplicaciones personalizadas · Páginas web · Tiendas en línea (e-commerce) · Sistemas de inventario |
| Hacemos crecer / Grow | Redes sociales y SEO · Marketing digital |
| Protegemos / Protect | Infraestructura de redes · Auditorías de TI (software y hardware) · Auditorías de redes |

Each service has a one-line description in both languages and a Lucide icon.

## Page structure (single page, anchor navigation)

1. **Header** — "TailorWebs" serif wordmark, anchor links (Servicios, Proceso, Por qué, Contacto),
   ES/EN toggle, primary CTA "Cotiza gratis / Free quote". Keeps the template's existing mobile menu
   behavior (Escape, outside click).
2. **Hero** — headline "Tecnología a la medida" / "Technology, made to measure", a rotating word
   naming the service lines (Magic UI `word-rotate`), sub-copy, two CTAs (quote, see services),
   and a stitch line that draws itself across the hero. A slow Magic UI `marquee` strip at the
   bottom lists all nine services.
3. **Services** — three group columns/cards with `blur-fade` reveal; each service row has icon,
   name, one line.
4. **Process** — four steps reused from the current tailorwebs.com copy: Medir/Measure,
   Diseñar/Design, Construir/Build, Ajustar y soporte/Fit & support. A measuring-tape bar with tick
   marks fills as the section scrolls into view.
5. **Why TailorWebs** — four points: hecho a tu medida, seguridad primero, en tu idioma
   (bilingual, plain language), un solo socio (one partner). Small facts row with Magic UI
   `number-ticker` limited to true numbers: 9 services, 2 languages, 1 business day reply.
6. **FAQ** — 5–6 questions (cost, timeline, do you work outside El Paso, do you maintain sites,
   do I own my site, do you work in Spanish), using the existing shadcn accordion.
7. **Contact** — form (name, email, phone optional, services as chips, budget range, message),
   plus email and location. Submits to Web3Forms (see "Contact form").
8. **Footer** — wordmark, El Paso, TX · serving clients anywhere, email, language toggle, ©.

Optional floating WhatsApp button renders only when a number is set in `src/config/site.ts`.

## Visual system

| Token | Value | Use |
| --- | --- | --- |
| `--cream` | `#F5EFE6` | page background |
| `--paper` | `#FBF8F3` | cards |
| `--ink` | `#1F1A17` | headings, body |
| `--ink-muted` | `#6B5E52` | secondary text (passes AA on cream) |
| `--rust` | `#B5482C` | accent, CTAs, stitch lines (passes AA on cream) |
| `--chalk` | `#D9CCBA` | borders, tape ticks |

- Fonts: **Fraunces** (headings, variable serif with full Spanish accents) + **Inter** (body,
  already loaded). Outfit is dropped.
- shadcn HSL variables in `src/index.css` are remapped to these colors so existing ui components
  inherit the brand. The `.dark` block and sidebar tokens are removed (light theme only).
- Motif: dashed "stitch" strokes (SVG `stroke-dasharray`) and tape tick marks. No texture or
  noise overlays, to keep it fast and clean.
- Contrast checked: rust on cream 4.68:1, white on rust 5.35:1, muted on cream 5.49:1,
  ink on cream 15.08:1 (all pass WCAG AA).

## Motion

| Effect | Source | Where |
| --- | --- | --- |
| `blur-fade` | Magic UI | section and card reveals |
| `word-rotate` | Magic UI | hero rotating word |
| `marquee` | Magic UI | hero services strip |
| `number-ticker` | Magic UI | facts row |
| `StitchLine` | custom (framer-motion `pathLength`) | hero, section dividers |
| `MeasuringTape` | custom (framer-motion `useScroll`) | process section |

All motion is disabled or reduced to simple fades under `prefers-reduced-motion`. Content must be
visible without JavaScript-driven reveals finishing (no blank hero like the current site).

Magic UI components are added with the shadcn CLI from `magicui.design/r/<name>`. Magic UI now
targets Tailwind v4; any `@theme` keyframes it ships are ported by hand into `tailwind.config.ts`.
Its components import `motion/react`, so the `motion` package is added (framer-motion stays only if
still referenced, otherwise removed).

## Bilingual (ES/EN)

- `src/i18n/es.ts` and `src/i18n/en.ts` export the same typed `Dictionary` shape; a unit test checks
  both have identical keys.
- `LanguageProvider` + `useLanguage()` hook. Initial language: saved choice in `localStorage`
  (wrapped in try/catch), else `navigator.language` starting with `es` → Spanish, else English.
- Toggle updates `<html lang>` and `document.title`.

## Contact form

- Validation with the existing react-hook-form + zod.
- Submission: POST to Web3Forms (free, no backend; messages arrive at `info@tailorwebs.com`).
  Its access key is public by design and lives in `src/config/site.ts`. The user creates the key at
  web3forms.com (Claude cannot create accounts). Until a key is set, the submit button opens a
  pre-filled `mailto:` instead.
- Honeypot field for spam; success and error states in both languages.

## Removal list

Pages: `Blog`, `BlogPost`, `About`, `Contact` (becomes a section), all `Admin*`, `ResetPassword`,
`demo/*`. Components: `admin/`, `auth/`, `blog/`, `LogoStrip`, `TestimonialsSection`,
`EnterpriseSection`, `PricingSection`, `BenefitsSection`, `FeaturesSection`. Also `hooks/useAuth`,
`integrations/supabase`, `types/blog`, `demo/seedData`, `supabase/`, `.env`, `.lovable/`, unused
assets (stock images, videos, partner logos). Dependencies no longer imported (supabase-js, tiptap,
dompurify, react-query if unused, `lovable-tagger`) are uninstalled. `NotFound` stays.

## SEO and metadata

`index.html`: title, description, Open Graph and Twitter tags with a 1200×630 share image,
`LocalBusiness` JSON-LD (TailorWebs, El Paso TX, email, `areaServed`), favicon from the wordmark.

## Testing and verification

- Add Vitest. Tests: dictionary key parity; contact schema validation; language detection logic.
- `npm run build` and `npm run lint` clean.
- Browser check at 375 / 768 / 1440 px: no horizontal overflow, hero visible on first paint,
  mobile menu works, toggle switches every string, form validation and mailto fallback work.
- axe-core run on the page: 0 violations.

## Publishing (after the site is done)

- Create a new repo `Enrique182004/tailorwebs`. GitHub Pages on a free plan needs a **public**
  repo; the user confirms before it is created.
- Publish with a fresh history (one initial commit) so the old Lovable history, `.env` and template
  assets are not exposed.
- GitHub Actions workflow builds and deploys `dist/` to Pages. Vite `base` is `/tailorwebs/` for the
  `enrique182004.github.io/tailorwebs` URL. Pointing `tailorwebs.com` at Pages is a DNS change the
  user decides on separately (then `base` becomes `/` and a `CNAME` file is added).
- `404.html` is a copy of `index.html` so unknown paths still load the app.

## Out of scope

Blog/CMS, portfolio and testimonials (until real work exists), pricing tables, dark mode,
analytics, server-rendered separate `/es` and `/en` URLs.

## Revision 2026-11-12: "bold studio" restyle (approved)

After reviewing Base44 and WeWeb, the user approved a bolder look. This replaces the visual system and
hero above; content, i18n, contact delivery, a11y and publishing are unchanged.

- **Type:** Bricolage Grotesque (display, 700, tight tracking, `clamp()` sizes) + Geist (body). Fraunces,
  Inter, the rotating hero word and the services marquee are removed.
- **Color:** cream/ink/rust stay; adds color blocks `cobalt #3346D3` and `pine #2F5D50` (white text 7.1:1
  and 7.49:1). Subtle SVG grain on the page background; soft radial glows behind the hero.
- **Hero:** headline "Tu negocio, hecho a la medida." plus a project box with self-typing example prompts and
  five quick-pick service chips. Submitting hands the text and services to the contact form
  (`ContactDraftProvider`), which fills itself, plays a stitched-outline animation and focuses Name.
  Services are also auto-detected from the text (`matchServices`, unit-tested in ES and EN).
- **New "What we build" gallery:** four code-built concept mock-ups (inventory, restaurant, store, network
  audit), each labeled "Concepto/Concept", animating when scrolled into view.
- **Services:** grouped list rows with circled arrows; clicking a row pre-selects that service in the form.
- **Process:** dark rounded band with a light measuring tape. **Why:** four color-block cards plus big
  number tickers.
- **Motion:** CSS staggered hero load, in-view reveals, hover lifts, header border on scroll, a soft fade on
  language switch (no remount, so form input survives). All disabled or reduced under
  `prefers-reduced-motion`.
