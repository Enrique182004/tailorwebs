# TailorWebs Rebrand Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Lovable "AxiomAI" template with a one-page, bilingual (ES/EN) "Tailored craft" marketing site for TailorWebs, then publish it on GitHub Pages.

**Architecture:** Keep the Vite + React 18 + Tailwind 3 + shadcn/ui foundation. Delete the blog/admin/Supabase code. All copy lives in two typed dictionaries (`src/i18n/es.ts`, `src/i18n/en.ts`) served by a `LanguageProvider`. Page = small section components. Four Magic UI components are vendored (copied) into `src/components/magicui/` and adapted to Tailwind 3. Two custom motifs (`StitchLine`, `MeasuringTape`) use `motion`. The contact form posts to Web3Forms or falls back to `mailto:`.

**Tech Stack:** Vite 5, React 18, TypeScript, Tailwind 3.4, shadcn/ui (accordion only), `motion` (Motion for React), react-hook-form + zod, lucide-react, Vitest, bun, GitHub Actions + Pages.

**Spec:** `docs/superpowers/specs/2026-11-12-tailorwebs-rebrand-design.md`

**Working directory:** `/Volumes/Kuike HD/Projects/tailorwebs` (quote the path — it contains a space). Branch: `feat/tailored-rebrand`. Package manager: **bun**.

---

## File map

| File | Responsibility |
| --- | --- |
| `src/config/site.ts` | Business constants: name, email, Web3Forms key, WhatsApp number, public URL |
| `src/i18n/types.ts` | `Language`, `ServiceId`, `BudgetId`, `Dictionary` types |
| `src/i18n/es.ts`, `src/i18n/en.ts` | All copy |
| `src/i18n/detect-language.ts` | Pure: pick initial language |
| `src/i18n/language-context.ts` | React context object |
| `src/components/LanguageProvider.tsx` | Holds language state, persists it, syncs `<html lang>` and title |
| `src/hooks/use-language.ts` | `useLanguage()` hook |
| `src/data/services.ts` | Service ids, groups, icons, budget ids |
| `src/lib/contact.ts` | Contact zod schema, `buildMailto`, `submitContact` |
| `src/components/magicui/*.tsx` | Vendored Magic UI: blur-fade, word-rotate, marquee, number-ticker |
| `src/components/motifs/StitchLine.tsx`, `MeasuringTape.tsx` | Brand motion |
| `src/components/{Header,LanguageToggle,Hero,ServicesSection,ProcessSection,WhySection,FaqSection,ContactSection,ContactForm,ServiceChips,Footer,WhatsAppButton,SkipLink}.tsx` | Page sections |
| `src/pages/Index.tsx`, `src/pages/NotFound.tsx` | Routes |
| `src/App.tsx`, `src/main.tsx` | Root |
| `.github/workflows/deploy.yml` | Build + deploy to Pages |

---

### Task 1: Remove the template's backend, blog, admin and assets

**Files:**
- Delete: listed in Step 1
- Modify: `src/App.tsx`, `src/pages/Index.tsx`, `vite.config.ts`, `package.json`

- [ ] **Step 1: Delete files**

```bash
cd "/Volumes/Kuike HD/Projects/tailorwebs"
git rm -rq src/pages/Admin*.tsx src/pages/Blog.tsx src/pages/BlogPost.tsx src/pages/About.tsx \
  src/pages/Contact.tsx src/pages/ResetPassword.tsx src/pages/demo \
  src/components/admin src/components/auth src/components/blog \
  src/components/LogoStrip.tsx src/components/TestimonialsSection.tsx src/components/EnterpriseSection.tsx \
  src/components/PricingSection.tsx src/components/BenefitsSection.tsx src/components/FeaturesSection.tsx \
  src/components/HeroSection.tsx src/components/HowItWorksSection.tsx src/components/FAQSection.tsx \
  src/components/CTASection.tsx src/components/ScrollToTop.tsx src/components/Header.tsx src/components/Footer.tsx \
  src/hooks/useAuth.tsx src/integrations src/types/blog.ts src/demo \
  supabase .env .lovable src/assets public/lovable-uploads public/placeholder.svg public/favicon.ico \
  package-lock.json bun.lockb roadmap.md
```

- [ ] **Step 2: Write a temporary `src/App.tsx` and `src/pages/Index.tsx` so the app still builds**

`src/App.tsx`:
```tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

`src/main.tsx`:
```tsx
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
```

`src/pages/Index.tsx`:
```tsx
const Index = () => <main id="main-content">TailorWebs</main>;

export default Index;
```

- [ ] **Step 3: Replace `vite.config.ts`** (drops `lovable-tagger`; base path comes from `BASE_PATH` for GitHub Pages)

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  server: { host: "::", port: 8080 },
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
```

- [ ] **Step 4: Remove and add dependencies**

```bash
bun remove @supabase/supabase-js @tanstack/react-query @tiptap/extension-bubble-menu @tiptap/extension-image \
  @tiptap/extension-link @tiptap/extension-placeholder @tiptap/react @tiptap/starter-kit dompurify @types/dompurify \
  framer-motion hugeicons-react lovable-tagger @lovable.dev/vite-plugin-dev-server-bridge @lovable.dev/vite-plugin-hmr-gate
bun add motion
bun add -d vitest
```

Then add to `package.json` `scripts`: `"test": "vitest run"`.

- [ ] **Step 5: Verify nothing still imports deleted code**

Run: `grep -rnE "supabase|tiptap|hugeicons|framer-motion|react-query|useAuth|@/assets" src || echo CLEAN`
Expected: `CLEAN`

Run: `bun run build`
Expected: `✓ built in …` with no errors.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "chore: remove blog, admin, Supabase backend and template assets"
```

---

### Task 2: Brand tokens, fonts and Tailwind config

**Files:**
- Modify: `src/index.css` (full replace), `tailwind.config.ts`, `index.html` (fonts only in this task)

- [ ] **Step 1: Replace `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 36 43% 93%;
    --foreground: 22 15% 11%;
    --card: 38 50% 97%;
    --card-foreground: 22 15% 11%;
    --popover: 38 50% 97%;
    --popover-foreground: 22 15% 11%;
    --primary: 22 15% 11%;
    --primary-foreground: 38 50% 97%;
    --secondary: 35 29% 88%;
    --secondary-foreground: 22 15% 11%;
    --muted: 35 29% 88%;
    --muted-foreground: 29 13% 37%;
    --accent: 12 61% 44%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 72% 42%;
    --destructive-foreground: 0 0% 100%;
    --border: 35 29% 79%;
    --input: 35 29% 79%;
    --ring: 12 61% 44%;
    --radius: 0.75rem;
  }

  * {
    @apply border-border;
  }

  html {
    scroll-behavior: smooth;
    scroll-padding-top: 6rem;
  }

  body {
    @apply bg-background font-sans text-foreground antialiased;
  }

  h1, h2, h3 {
    @apply font-display tracking-tight;
  }
}

@layer utilities {
  .tape-ticks {
    background:
      repeating-linear-gradient(90deg, #1f1a17 0 1px, transparent 1px 50px) top left / 100% 60% no-repeat,
      repeating-linear-gradient(90deg, #6b5e52 0 1px, transparent 1px 10px) top left / 100% 30% no-repeat;
  }
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  .animate-marquee {
    animation: none;
  }
}
```

- [ ] **Step 2: Replace the `theme.extend` block in `tailwind.config.ts`**

Replace from `extend: {` to the end of the `animation` object with:

```ts
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
      },
      colors: {
        cream: "#F5EFE6",
        paper: "#FBF8F3",
        ink: { DEFAULT: "#1F1A17", muted: "#6B5E52" },
        rust: { DEFAULT: "#B5482C", dark: "#943A23" },
        chalk: "#D9CCBA",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(calc(-100% - var(--gap)))" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        marquee: "marquee var(--duration) linear infinite",
      },
    },
```

Also change `darkMode: ["class"],` → delete that line (light theme only).

- [ ] **Step 3: Fonts in `index.html`** — replace both Google Fonts `href`s (the `<link rel="stylesheet">` and the `<noscript>` one) with:

```
https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..600;1,9..144,400..600&family=Inter:wght@400;500;600&display=swap
```

- [ ] **Step 4: Verify** — Run: `bun run build` → Expected: builds with no errors.

- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: tailored craft color tokens and Fraunces/Inter fonts"`

---

### Task 3: Types, site config and services data

**Files:**
- Create: `src/i18n/types.ts`, `src/config/site.ts`, `src/data/services.ts`

- [ ] **Step 1: `src/i18n/types.ts`**

```ts
export type Language = "es" | "en";

export const SERVICE_IDS = [
  "customApps",
  "websites",
  "ecommerce",
  "inventory",
  "socialSeo",
  "marketing",
  "networkInfra",
  "itAudits",
  "networkAudits",
] as const;
export type ServiceId = (typeof SERVICE_IDS)[number];

export const BUDGET_IDS = ["unsure", "under1k", "1to5k", "5to15k", "over15k"] as const;
export type BudgetId = (typeof BUDGET_IDS)[number];

export type GroupId = "build" | "grow" | "protect";

interface TitleText {
  title: string;
  description: string;
}

export interface Dictionary {
  meta: { title: string; description: string };
  nav: {
    services: string;
    process: string;
    why: string;
    contact: string;
    cta: string;
    openMenu: string;
    closeMenu: string;
    language: string;
    skip: string;
    primary: string;
  };
  hero: {
    badge: string;
    title: string;
    titleAccent: string;
    rotatePrefix: string;
    rotateWords: string[];
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    marqueeLabel: string;
  };
  services: {
    eyebrow: string;
    title: string;
    subtitle: string;
    groups: Record<GroupId, { name: string; tagline: string }>;
    items: Record<ServiceId, { name: string; description: string }>;
  };
  process: { eyebrow: string; title: string; subtitle: string; steps: TitleText[] };
  why: {
    eyebrow: string;
    title: string;
    points: TitleText[];
    factsTitle: string;
    facts: { services: string; languages: string; replyDays: string };
  };
  faq: { eyebrow: string; title: string; items: { question: string; answer: string }[] };
  contact: {
    eyebrow: string;
    title: string;
    subtitle: string;
    emailLabel: string;
    locationLabel: string;
    locationValue: string;
    responseLabel: string;
    responseValue: string;
    languagesLabel: string;
    languagesValue: string;
    form: {
      name: string;
      email: string;
      phone: string;
      optional: string;
      services: string;
      budget: string;
      budgetOptions: Record<BudgetId, string>;
      message: string;
      messagePlaceholder: string;
      submit: string;
      submitting: string;
      privacy: string;
      success: string;
      mailto: string;
      error: string;
      errors: { name: string; email: string; message: string };
    };
  };
  footer: { tagline: string; serving: string; rights: string };
  notFound: { title: string; body: string; back: string };
  whatsapp: { label: string };
}
```

- [ ] **Step 2: `src/config/site.ts`**

```ts
export const siteConfig = {
  name: "TailorWebs",
  email: "info@tailorwebs.com",
  city: "El Paso, TX",
  publicUrl: "https://enrique182004.github.io/tailorwebs/",
  // Public by design: Web3Forms keys only allow sending to the owner's inbox. Empty = mailto fallback.
  web3formsKey: "",
  // Digits only with country code, e.g. "19155550123". Empty = WhatsApp button hidden.
  whatsapp: "",
} as const;
```

- [ ] **Step 3: `src/data/services.ts`**

```ts
import {
  Boxes,
  Globe,
  Hash,
  Laptop,
  Megaphone,
  Network,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import type { GroupId, ServiceId } from "@/i18n/types";

export const serviceGroups: { id: GroupId; services: ServiceId[] }[] = [
  { id: "build", services: ["customApps", "websites", "ecommerce", "inventory"] },
  { id: "grow", services: ["socialSeo", "marketing"] },
  { id: "protect", services: ["networkInfra", "itAudits", "networkAudits"] },
];

export const serviceIcons: Record<ServiceId, LucideIcon> = {
  customApps: Smartphone,
  websites: Globe,
  ecommerce: ShoppingCart,
  inventory: Boxes,
  socialSeo: Hash,
  marketing: Megaphone,
  networkInfra: Network,
  itAudits: Laptop,
  networkAudits: ShieldCheck,
};
```

- [ ] **Step 4: Verify** — Run: `bunx tsc -p tsconfig.app.json --noEmit` → Expected: no output.

- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: add i18n types, site config and service data"`

---

### Task 4: Spanish and English dictionaries (TDD)

**Files:**
- Create: `src/i18n/dictionaries.test.ts`, `src/i18n/es.ts`, `src/i18n/en.ts`, `vitest.config.ts`

- [ ] **Step 1: `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  test: { environment: "node", include: ["src/**/*.test.ts"] },
});
```

- [ ] **Step 2: Write the failing test `src/i18n/dictionaries.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { en } from "./en";
import { es } from "./es";

type Leaf = { path: string; value: unknown };

function leaves(node: unknown, path = ""): Leaf[] {
  if (Array.isArray(node)) return node.flatMap((item, i) => leaves(item, `${path}[${i}]`));
  if (node !== null && typeof node === "object") {
    return Object.entries(node).flatMap(([key, value]) => leaves(value, path ? `${path}.${key}` : key));
  }
  return [{ path, value: node }];
}

describe("dictionaries", () => {
  it("have exactly the same keys and array lengths", () => {
    expect(leaves(es).map((l) => l.path)).toEqual(leaves(en).map((l) => l.path));
  });

  it("have no empty strings", () => {
    const empty = [...leaves(es), ...leaves(en)].filter((l) => typeof l.value !== "string" || l.value.trim() === "");
    expect(empty).toEqual([]);
  });

  it("name all nine services", () => {
    expect(Object.keys(es.services.items)).toHaveLength(9);
  });
});
```

- [ ] **Step 3: Run it** — `bun run test` → Expected: FAIL, `Cannot find module './en'`.

- [ ] **Step 4: `src/i18n/es.ts`**

```ts
import type { Dictionary } from "./types";

export const es: Dictionary = {
  meta: {
    title: "TailorWebs | Páginas web, apps y servicios de TI a la medida en El Paso, TX",
    description:
      "TailorWebs crea páginas web, apps, tiendas en línea y sistemas de inventario, impulsa tus redes y SEO, y audita tu red y equipos de TI. En español e inglés, desde El Paso, TX.",
  },
  nav: {
    services: "Servicios",
    process: "Proceso",
    why: "Por qué nosotros",
    contact: "Contacto",
    cta: "Cotiza gratis",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    language: "Idioma",
    skip: "Saltar al contenido",
    primary: "Principal",
  },
  hero: {
    badge: "Aceptando nuevos proyectos · El Paso, TX",
    title: "Tecnología",
    titleAccent: "a la medida.",
    rotatePrefix: "Te ayudamos con",
    rotateWords: ["páginas web", "apps personalizadas", "tiendas en línea", "redes sociales y SEO", "auditorías de TI"],
    subtitle:
      "Diseñamos, construimos y protegemos la tecnología de tu negocio: desde tu primera página web hasta tu red. Sin plantillas genéricas y explicado en tu idioma.",
    primaryCta: "Cotiza gratis",
    secondaryCta: "Ver servicios",
    marqueeLabel: "Nuestros servicios",
  },
  services: {
    eyebrow: "Servicios",
    title: "Todo lo que tu negocio necesita, cortado a su medida",
    subtitle: "Nueve servicios en tres áreas. Elige uno o deja que lo armemos todo contigo.",
    groups: {
      build: { name: "Construimos", tagline: "Las herramientas con las que trabajas y vendes." },
      grow: { name: "Hacemos crecer", tagline: "Que te encuentren y te elijan." },
      protect: { name: "Protegemos", tagline: "Una red y equipos seguros y en orden." },
    },
    items: {
      customApps: { name: "Aplicaciones personalizadas", description: "Apps web y móviles hechas para tus procesos, no al revés." },
      websites: { name: "Páginas web", description: "Sitios rápidos y modernos que convierten visitas en clientes." },
      ecommerce: { name: "Tiendas en línea", description: "Vende 24/7 con pagos, envíos e inventario conectados." },
      inventory: { name: "Sistemas de inventario", description: "Controla existencias, entradas y salidas en tiempo real." },
      socialSeo: { name: "Redes sociales y SEO", description: "Aparece en Google y mantén tus redes activas y profesionales." },
      marketing: { name: "Marketing digital", description: "Campañas y contenido que traen clientes, con resultados medibles." },
      networkInfra: { name: "Infraestructura de redes", description: "Instalamos y configuramos redes estables, rápidas y seguras." },
      itAudits: { name: "Auditorías de TI", description: "Revisión de software y hardware con un plan claro y priorizado." },
      networkAudits: { name: "Auditorías de redes", description: "Detectamos fallas y riesgos en tu red antes de que te cuesten." },
    },
  },
  process: {
    eyebrow: "Cómo trabajamos",
    title: "Medimos, cortamos, ajustamos.",
    subtitle: "Un proceso simple y transparente, como el de un buen sastre.",
    steps: [
      { title: "Medir", description: "Una llamada gratis para entender tu negocio, tus metas y tu presupuesto." },
      { title: "Diseñar", description: "Recibes una propuesta clara, un precio fijo y un diseño que apruebas antes de construir." },
      { title: "Construir", description: "Desarrollamos y probamos, mostrándote avances para que no haya sorpresas." },
      { title: "Ajustar y soporte", description: "Lanzamiento, capacitación y soporte continuo hasta que quede perfecto." },
    ],
  },
  why: {
    eyebrow: "Por qué TailorWebs",
    title: "Tecnología que se ajusta a tu negocio, no al revés.",
    points: [
      { title: "Hecho a tu medida", description: "Nada de plantillas genéricas. Cada solución se diseña según lo que necesitas." },
      { title: "Seguridad primero", description: "Experiencia en redes y seguridad de TI en todo lo que construimos." },
      { title: "En tu idioma", description: "Te explicamos la tecnología con claridad, en español o en inglés." },
      { title: "Un solo socio", description: "Web, apps, marketing y TI bajo un mismo techo. Una llamada lo resuelve." },
    ],
    factsTitle: "En números",
    facts: { services: "servicios", languages: "idiomas", replyDays: "día hábil para responderte" },
  },
  faq: {
    eyebrow: "Preguntas frecuentes",
    title: "Lo que más nos preguntan",
    items: [
      { question: "¿Cuánto cuesta una página web?", answer: "Depende de lo que necesites. Después de una llamada gratis te damos una cotización fija, sin costos ocultos." },
      { question: "¿Cuánto tiempo toma?", answer: "Una página web sencilla suele estar lista en 2 a 4 semanas. Apps y sistemas a la medida toman más; te damos fechas claras en la propuesta." },
      { question: "¿Solo trabajan en El Paso?", answer: "Estamos en El Paso, TX, pero trabajamos con clientes de cualquier lugar de forma remota." },
      { question: "¿Dan mantenimiento después del lanzamiento?", answer: "Sí. Ofrecemos actualizaciones, respaldos, monitoreo y soporte para que todo siga funcionando." },
      { question: "¿La página será mía?", answer: "Sí. Tu dominio, tu contenido y tu código son tuyos." },
      { question: "¿Pueden revisar mi red o mis equipos actuales?", answer: "Sí. Nuestras auditorías de TI y de redes te dan un reporte claro con lo que hay que corregir primero." },
    ],
  },
  contact: {
    eyebrow: "Contacto",
    title: "¿Tienes una idea? Hagámosla a tu medida.",
    subtitle: "Cuéntanos qué necesitas y te respondemos en un día hábil con los siguientes pasos y una cotización gratis.",
    emailLabel: "Correo",
    locationLabel: "Ubicación",
    locationValue: "El Paso, Texas · clientes locales y remotos",
    responseLabel: "Respuesta",
    responseValue: "En 1 día hábil",
    languagesLabel: "Idiomas",
    languagesValue: "Español · English",
    form: {
      name: "Nombre",
      email: "Correo electrónico",
      phone: "Teléfono",
      optional: "opcional",
      services: "Me interesa",
      budget: "Presupuesto estimado",
      budgetOptions: {
        unsure: "Aún no sé",
        under1k: "Menos de $1,000",
        "1to5k": "$1,000 – $5,000",
        "5to15k": "$5,000 – $15,000",
        over15k: "Más de $15,000",
      },
      message: "Cuéntanos de tu proyecto",
      messagePlaceholder: "Tengo una taquería y quiero una página con menú y pedidos en línea…",
      submit: "Enviar mensaje",
      submitting: "Enviando…",
      privacy: "Solo usamos tus datos para responderte. Nada de spam.",
      success: "¡Gracias! Recibimos tu mensaje y te responderemos en un día hábil.",
      mailto: "Abrimos tu app de correo con el mensaje listo. Solo presiona enviar.",
      error: "No se pudo enviar. Escríbenos directo a info@tailorwebs.com.",
      errors: {
        name: "Escribe tu nombre.",
        email: "Escribe un correo válido.",
        message: "Cuéntanos un poco más (mínimo 10 caracteres).",
      },
    },
  },
  footer: {
    tagline: "Tecnología a la medida para tu negocio.",
    serving: "El Paso, Texas · atendemos clientes en todas partes",
    rights: "Todos los derechos reservados.",
  },
  notFound: { title: "Página no encontrada", body: "Esta página no existe o se movió.", back: "Volver al inicio" },
  whatsapp: { label: "Escríbenos por WhatsApp" },
};
```

- [ ] **Step 5: `src/i18n/en.ts`**

```ts
import type { Dictionary } from "./types";

export const en: Dictionary = {
  meta: {
    title: "TailorWebs | Custom websites, apps and IT services in El Paso, TX",
    description:
      "TailorWebs builds websites, apps, online stores and inventory systems, grows your social media and SEO, and audits your network and IT. In English and Spanish, from El Paso, TX.",
  },
  nav: {
    services: "Services",
    process: "Process",
    why: "Why us",
    contact: "Contact",
    cta: "Free quote",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
    skip: "Skip to content",
    primary: "Main",
  },
  hero: {
    badge: "Taking new projects · El Paso, TX",
    title: "Technology,",
    titleAccent: "made to measure.",
    rotatePrefix: "We help with",
    rotateWords: ["websites", "custom apps", "online stores", "social media and SEO", "IT audits"],
    subtitle:
      "We design, build and protect your business technology, from your first website to your network. No generic templates, explained in your language.",
    primaryCta: "Get a free quote",
    secondaryCta: "See services",
    marqueeLabel: "Our services",
  },
  services: {
    eyebrow: "Services",
    title: "Everything your business needs, cut to fit",
    subtitle: "Nine services in three areas. Pick one, or let us put the whole outfit together with you.",
    groups: {
      build: { name: "Build", tagline: "The tools you work and sell with." },
      grow: { name: "Grow", tagline: "Get found and get chosen." },
      protect: { name: "Protect", tagline: "A secure, well-kept network and devices." },
    },
    items: {
      customApps: { name: "Custom apps", description: "Web and mobile apps built around your processes, not the other way around." },
      websites: { name: "Websites", description: "Fast, modern sites that turn visitors into customers." },
      ecommerce: { name: "Online stores", description: "Sell 24/7 with payments, shipping and inventory connected." },
      inventory: { name: "Inventory systems", description: "Track stock, receiving and sales in real time." },
      socialSeo: { name: "Social media and SEO", description: "Show up on Google and keep your social channels active and professional." },
      marketing: { name: "Digital marketing", description: "Campaigns and content that bring customers, with measurable results." },
      networkInfra: { name: "Network infrastructure", description: "We install and configure stable, fast and secure networks." },
      itAudits: { name: "IT audits", description: "A software and hardware review with a clear, prioritized plan." },
      networkAudits: { name: "Network audits", description: "We find faults and risks in your network before they cost you." },
    },
  },
  process: {
    eyebrow: "How we work",
    title: "Measured, cut, fitted.",
    subtitle: "A simple, transparent process, just like a good tailor.",
    steps: [
      { title: "Measure", description: "A free call to understand your business, your goals and your budget." },
      { title: "Design", description: "You get a clear proposal, a fixed quote and a design you approve before we build." },
      { title: "Build", description: "We develop and test, sharing progress along the way so there are no surprises." },
      { title: "Fit and support", description: "Launch, training and ongoing support. We adjust until it fits perfectly." },
    ],
  },
  why: {
    eyebrow: "Why TailorWebs",
    title: "Technology that fits your business, not the other way around.",
    points: [
      { title: "Built for you", description: "No generic templates. Every solution is designed around your needs." },
      { title: "Security first", description: "Networking and IT security experience in everything we build." },
      { title: "In your language", description: "We explain the tech clearly, in English or Spanish." },
      { title: "One partner", description: "Web, apps, marketing and IT under one roof. One call solves it." },
    ],
    factsTitle: "By the numbers",
    facts: { services: "services", languages: "languages", replyDays: "business day to reply" },
  },
  faq: {
    eyebrow: "FAQ",
    title: "What people ask us most",
    items: [
      { question: "How much does a website cost?", answer: "It depends on what you need. After a free call we give you a fixed quote with no hidden costs." },
      { question: "How long does it take?", answer: "A simple website is usually ready in 2 to 4 weeks. Custom apps and systems take longer; the proposal gives you clear dates." },
      { question: "Do you only work in El Paso?", answer: "We're based in El Paso, TX, and work remotely with clients anywhere." },
      { question: "Do you maintain sites after launch?", answer: "Yes. We offer updates, backups, monitoring and support so everything keeps running." },
      { question: "Will I own my website?", answer: "Yes. Your domain, your content and your code belong to you." },
      { question: "Can you review my current network or devices?", answer: "Yes. Our IT and network audits give you a clear report of what to fix first." },
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Have an idea? Let's tailor it.",
    subtitle: "Tell us what you need and we'll reply within one business day with next steps and a free estimate.",
    emailLabel: "Email",
    locationLabel: "Location",
    locationValue: "El Paso, Texas · local and remote clients",
    responseLabel: "Response time",
    responseValue: "Within 1 business day",
    languagesLabel: "Languages",
    languagesValue: "English · Español",
    form: {
      name: "Name",
      email: "Email",
      phone: "Phone",
      optional: "optional",
      services: "I'm interested in",
      budget: "Estimated budget",
      budgetOptions: {
        unsure: "Not sure yet",
        under1k: "Under $1,000",
        "1to5k": "$1,000 – $5,000",
        "5to15k": "$5,000 – $15,000",
        over15k: "$15,000+",
      },
      message: "Tell us about your project",
      messagePlaceholder: "I run a taco shop and want a site with our menu and online ordering…",
      submit: "Send message",
      submitting: "Sending…",
      privacy: "We only use your details to reply. No spam, ever.",
      success: "Thanks! We got your message and will reply within one business day.",
      mailto: "We opened your email app with the message ready. Just press send.",
      error: "Couldn't send. Email us directly at info@tailorwebs.com.",
      errors: {
        name: "Enter your name.",
        email: "Enter a valid email.",
        message: "Tell us a bit more (10 characters minimum).",
      },
    },
  },
  footer: {
    tagline: "Technology made to measure for your business.",
    serving: "El Paso, Texas · serving clients everywhere",
    rights: "All rights reserved.",
  },
  notFound: { title: "Page not found", body: "This page doesn't exist or has moved.", back: "Back to home" },
  whatsapp: { label: "Message us on WhatsApp" },
};
```

- [ ] **Step 6: Run** — `bun run test` → Expected: 3 passed.

- [ ] **Step 7: Commit** — `git add -A && git commit -m "feat: add Spanish and English copy with parity test"`

---

### Task 5: Language detection, provider and hook (TDD)

**Files:**
- Create: `src/i18n/detect-language.test.ts`, `src/i18n/detect-language.ts`, `src/i18n/language-context.ts`, `src/components/LanguageProvider.tsx`, `src/hooks/use-language.ts`

- [ ] **Step 1: Failing test `src/i18n/detect-language.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { detectLanguage } from "./detect-language";

describe("detectLanguage", () => {
  it("uses a valid saved choice first", () => {
    expect(detectLanguage("en", ["es-MX"])).toBe("en");
    expect(detectLanguage("es", ["en-US"])).toBe("es");
  });

  it("ignores an invalid saved value", () => {
    expect(detectLanguage("fr", ["es-US"])).toBe("es");
  });

  it("picks Spanish when any browser language is Spanish", () => {
    expect(detectLanguage(null, ["en-US", "es-MX"])).toBe("es");
  });

  it("defaults to English otherwise", () => {
    expect(detectLanguage(null, ["de-DE"])).toBe("en");
    expect(detectLanguage(null, [])).toBe("en");
  });
});
```

- [ ] **Step 2: Run** — `bun run test` → Expected: FAIL, `Cannot find module './detect-language'`.

- [ ] **Step 3: `src/i18n/detect-language.ts`**

```ts
import type { Language } from "./types";

export const LANGUAGE_STORAGE_KEY = "tailorwebs-language";

export function detectLanguage(saved: string | null, browserLanguages: readonly string[]): Language {
  if (saved === "es" || saved === "en") return saved;
  return browserLanguages.some((lang) => lang.toLowerCase().startsWith("es")) ? "es" : "en";
}
```

- [ ] **Step 4: Run** — `bun run test` → Expected: all pass.

- [ ] **Step 5: `src/i18n/language-context.ts`**

```ts
import { createContext } from "react";
import type { Dictionary, Language } from "./types";

export interface LanguageContextValue {
  language: Language;
  t: Dictionary;
  setLanguage: (language: Language) => void;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);
```

- [ ] **Step 6: `src/hooks/use-language.ts`**

```ts
import { useContext } from "react";
import { LanguageContext, type LanguageContextValue } from "@/i18n/language-context";

export function useLanguage(): LanguageContextValue {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return value;
}
```

- [ ] **Step 7: `src/components/LanguageProvider.tsx`**

```tsx
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { detectLanguage, LANGUAGE_STORAGE_KEY } from "@/i18n/detect-language";
import { en } from "@/i18n/en";
import { es } from "@/i18n/es";
import { LanguageContext } from "@/i18n/language-context";
import type { Language } from "@/i18n/types";

function readSaved(): string | null {
  try {
    return window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() =>
    detectLanguage(readSaved(), navigator.languages ?? [navigator.language]),
  );
  const t = language === "es" ? es : en;

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", t.meta.description);
  }, [language, t]);

  const value = useMemo(
    () => ({
      language,
      t,
      setLanguage: (next: Language) => {
        setLanguageState(next);
        try {
          window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
        } catch {
          // Storage can be blocked (private mode); the choice still applies for this visit.
        }
      },
    }),
    [language, t],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
```

- [ ] **Step 8: Verify** — `bunx tsc -p tsconfig.app.json --noEmit && bun run test` → no type errors, all tests pass.

- [ ] **Step 9: Commit** — `git add -A && git commit -m "feat: language detection, provider and useLanguage hook"`

---

### Task 6: Contact logic (TDD)

**Files:**
- Create: `src/lib/contact.test.ts`, `src/lib/contact.ts`

- [ ] **Step 1: Failing test `src/lib/contact.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { buildMailto, createContactSchema, type ContactValues } from "./contact";

const errors = { name: "name", email: "email", message: "message" };
const valid: ContactValues = {
  name: "Ana",
  email: "ana@example.com",
  phone: "",
  services: ["websites"],
  budget: "unsure",
  message: "I need a website for my bakery.",
  botcheck: "",
};

describe("createContactSchema", () => {
  const schema = createContactSchema(errors);

  it("accepts a valid message", () => {
    expect(schema.safeParse(valid).success).toBe(true);
  });

  it("rejects a bad email with the given message", () => {
    const result = schema.safeParse({ ...valid, email: "nope" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("email");
  });

  it("rejects a short message and a missing name", () => {
    const result = schema.safeParse({ ...valid, name: " ", message: "hi" });
    expect(result.error?.issues.map((i) => i.message).sort()).toEqual(["message", "name"]);
  });
});

describe("buildMailto", () => {
  it("encodes subject and body for the TailorWebs inbox", () => {
    const href = buildMailto(valid, { serviceNames: ["Websites"], budgetLabel: "Not sure yet" });
    expect(href.startsWith("mailto:info@tailorwebs.com?subject=")).toBe(true);
    const body = decodeURIComponent(href.split("&body=")[1]);
    expect(body).toContain("Ana <ana@example.com>");
    expect(body).toContain("Websites");
    expect(body).toContain("I need a website for my bakery.");
  });
});
```

- [ ] **Step 2: Run** — `bun run test` → Expected: FAIL, `Cannot find module './contact'`.

- [ ] **Step 3: `src/lib/contact.ts`**

```ts
import { z } from "zod";
import { siteConfig } from "@/config/site";
import { BUDGET_IDS, SERVICE_IDS } from "@/i18n/types";

export function createContactSchema(messages: { name: string; email: string; message: string }) {
  return z.object({
    name: z.string().trim().min(1, messages.name).max(100),
    email: z.string().trim().email(messages.email).max(200),
    phone: z.string().trim().max(30),
    services: z.array(z.enum(SERVICE_IDS)),
    budget: z.enum(BUDGET_IDS),
    message: z.string().trim().min(10, messages.message).max(2000),
    botcheck: z.string(),
  });
}

export type ContactValues = z.infer<ReturnType<typeof createContactSchema>>;

interface Labels {
  serviceNames: string[];
  budgetLabel: string;
}

function summary(values: ContactValues, labels: Labels): string {
  const lines = [`${values.name} <${values.email}>`];
  if (values.phone) lines.push(`Phone: ${values.phone}`);
  if (labels.serviceNames.length > 0) lines.push(`Services: ${labels.serviceNames.join(", ")}`);
  lines.push(`Budget: ${labels.budgetLabel}`, "", values.message);
  return lines.join("\n");
}

export function buildMailto(values: ContactValues, labels: Labels): string {
  const subject = encodeURIComponent(`New project inquiry from ${values.name}`);
  return `mailto:${siteConfig.email}?subject=${subject}&body=${encodeURIComponent(summary(values, labels))}`;
}

export type SubmitResult = { kind: "sent" } | { kind: "mailto"; href: string } | { kind: "spam" };

export async function submitContact(values: ContactValues, labels: Labels): Promise<SubmitResult> {
  if (values.botcheck) return { kind: "spam" };
  if (!siteConfig.web3formsKey) return { kind: "mailto", href: buildMailto(values, labels) };

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: siteConfig.web3formsKey,
      subject: `New project inquiry from ${values.name}`,
      from_name: "TailorWebs website",
      name: values.name,
      email: values.email,
      phone: values.phone,
      services: labels.serviceNames.join(", "),
      budget: labels.budgetLabel,
      message: values.message,
    }),
  });
  const data: { success?: boolean } = await response.json();
  if (!response.ok || !data.success) throw new Error("Web3Forms rejected the message");
  return { kind: "sent" };
}
```

- [ ] **Step 4: Run** — `bun run test` → Expected: all pass.

- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: contact schema, mailto fallback and Web3Forms submit"`

---

### Task 7: Vendor Magic UI components (Tailwind 3 adaptations)

Source: `https://magicui.design/r/<name>.json` (MIT). Copied rather than installed with the shadcn CLI because the CLI writes Tailwind v4 CSS. Changes from upstream are listed per file.

**Files:**
- Create: `src/components/magicui/blur-fade.tsx`, `word-rotate.tsx`, `marquee.tsx`, `number-ticker.tsx`

- [ ] **Step 1: `blur-fade.tsx`** (upstream unchanged except removed `"use client"` and `AnimatePresence`, which is unused without exit animations)

```tsx
import { useRef, type ReactNode } from "react";
import { motion, useInView, type MotionProps, type UseInViewOptions, type Variants } from "motion/react";

interface BlurFadeProps extends MotionProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  offset?: number;
  inView?: boolean;
  inViewMargin?: UseInViewOptions["margin"];
  blur?: string;
}

export function BlurFade({
  children,
  className,
  duration = 0.4,
  delay = 0,
  offset = 12,
  inView = true,
  inViewMargin = "-50px",
  blur = "6px",
  ...props
}: BlurFadeProps) {
  const ref = useRef(null);
  const inViewResult = useInView(ref, { once: true, margin: inViewMargin });
  const isInView = !inView || inViewResult;
  const variants: Variants = {
    hidden: { y: offset, opacity: 0, filter: `blur(${blur})` },
    visible: { y: 0, opacity: 1, filter: "blur(0px)" },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{ delay: 0.04 + delay, duration, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: `word-rotate.tsx`** (changes: renders inline `span` instead of `h1` so the page keeps one `h1`; static first word under reduced motion; hidden from screen readers because the caller renders the full list in `sr-only`)

```tsx
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface WordRotateProps {
  words: string[];
  duration?: number;
  className?: string;
}

export function WordRotate({ words, duration = 2500, className }: WordRotateProps) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setIndex(0);
    if (reduceMotion) return;
    const interval = setInterval(() => setIndex((prev) => (prev + 1) % words.length), duration);
    return () => clearInterval(interval);
  }, [words, duration, reduceMotion]);

  return (
    <span aria-hidden="true" className="inline-flex overflow-hidden py-1 align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          className={cn("inline-block", className)}
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
```

- [ ] **Step 3: `marquee.tsx`** (changes: v4 `gap-(--gap)` → v3 `gap-[var(--gap)]`; vertical mode removed)

```tsx
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  reverse?: boolean;
  pauseOnHover?: boolean;
  repeat?: number;
  children: ReactNode;
}

export function Marquee({ className, reverse = false, pauseOnHover = false, repeat = 4, children, ...props }: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn("group flex flex-row gap-[var(--gap)] overflow-hidden p-2 [--duration:40s] [--gap:1rem]", className)}
    >
      {Array.from({ length: repeat }, (_, i) => (
        <div
          key={i}
          aria-hidden={i > 0 ? true : undefined}
          className={cn("flex shrink-0 animate-marquee flex-row justify-around gap-[var(--gap)]", {
            "group-hover:[animation-play-state:paused]": pauseOnHover,
            "[animation-direction:reverse]": reverse,
          })}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: `number-ticker.tsx`** (changes: dropped `text-black dark:text-white`; shows the final value immediately under reduced motion)

```tsx
import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";
import { useInView, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number;
  delay?: number;
}

export function NumberTicker({ value, delay = 0, className, ...props }: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const motionValue = useMotionValue(reduceMotion ? value : 0);
  const springValue = useSpring(motionValue, { damping: 60, stiffness: 100 });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => motionValue.set(value), delay * 1000);
    return () => clearTimeout(timer);
  }, [motionValue, isInView, delay, value]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) ref.current.textContent = Math.round(latest).toString();
      }),
    [springValue],
  );

  return (
    <span ref={ref} className={cn("inline-block tabular-nums", className)} {...props}>
      {reduceMotion ? value : 0}
    </span>
  );
}
```

- [ ] **Step 5: Verify** — `bunx tsc -p tsconfig.app.json --noEmit` → no output.

- [ ] **Step 6: Commit** — `git add -A && git commit -m "feat: vendor Magic UI blur-fade, word-rotate, marquee, number-ticker"`

---

### Task 8: Brand motifs

**Files:**
- Create: `src/components/motifs/StitchLine.tsx`, `src/components/motifs/MeasuringTape.tsx`

- [ ] **Step 1: `StitchLine.tsx`** — a dashed "stitch" revealed by animating a solid mask path (animating `pathLength` on the dashed path itself would overwrite its dash pattern).

```tsx
import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const PATHS = {
  wave: "M0 60 C 200 10, 400 110, 600 60 S 1000 10, 1200 60",
  straight: "M0 60 L 1200 60",
} as const;

interface StitchLineProps {
  variant?: keyof typeof PATHS;
  trigger?: "mount" | "view";
  className?: string;
}

export function StitchLine({ variant = "wave", trigger = "view", className }: StitchLineProps) {
  const maskId = `stitch-${useId().replace(/:/g, "")}`;
  const reduceMotion = useReducedMotion();
  const d = PATHS[variant];
  const drawn = { pathLength: 1 };
  const animation = reduceMotion
    ? { initial: drawn }
    : trigger === "mount"
      ? { initial: { pathLength: 0 }, animate: drawn }
      : { initial: { pathLength: 0 }, whileInView: drawn, viewport: { once: true } };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className={cn("h-12 w-full text-rust", className)}
    >
      <defs>
        <mask id={maskId}>
          <motion.path
            d={d}
            fill="none"
            stroke="white"
            strokeWidth={10}
            transition={{ duration: 1.6, ease: "easeInOut" }}
            {...animation}
          />
        </mask>
      </defs>
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeDasharray="12 9"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        mask={`url(#${maskId})`}
      />
    </svg>
  );
}
```

- [ ] **Step 2: `MeasuringTape.tsx`**

```tsx
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

export function MeasuringTape({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 35%"] });
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("relative h-10 overflow-hidden rounded-md border border-chalk bg-paper", className)}
    >
      <motion.div
        className="absolute inset-y-0 left-0 w-full origin-left bg-rust/20"
        style={{ scaleX: reduceMotion ? 1 : scaleX }}
      />
      <div className="tape-ticks absolute inset-0" />
    </div>
  );
}
```

- [ ] **Step 3: Verify** — `bunx tsc -p tsconfig.app.json --noEmit` → no output.

- [ ] **Step 4: Commit** — `git add -A && git commit -m "feat: StitchLine and MeasuringTape motifs"`

---

### Task 9: Header, language toggle, skip link

**Files:**
- Create: `src/components/LanguageToggle.tsx`; Replace: `src/components/Header.tsx`, `src/components/SkipLink.tsx`

- [ ] **Step 1: `LanguageToggle.tsx`**

```tsx
import { useLanguage } from "@/hooks/use-language";
import type { Language } from "@/i18n/types";
import { cn } from "@/lib/utils";

const OPTIONS: Language[] = ["es", "en"];

export function LanguageToggle({ className }: { className?: string }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div role="group" aria-label={t.nav.language} className={cn("inline-flex rounded-full border border-chalk bg-paper p-0.5", className)}>
      {OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          lang={option}
          aria-pressed={language === option}
          onClick={() => setLanguage(option)}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            language === option ? "bg-ink text-paper" : "text-ink-muted hover:text-ink",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: `Header.tsx`**

```tsx
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { LanguageToggle } from "./LanguageToggle";

export function Wordmark() {
  return (
    <span className="font-display text-2xl font-semibold tracking-tight text-ink">
      Tailor<span className="italic text-rust">Webs</span>
    </span>
  );
}

export function Header() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const links = [
    { href: "#services", label: t.nav.services },
    { href: "#process", label: t.nav.process },
    { href: "#why", label: t.nav.why },
    { href: "#contact", label: t.nav.contact },
  ];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointer = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 border-b border-chalk/70 bg-cream/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <a href="#top" aria-label="TailorWebs" className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Wordmark />
        </a>
        <nav aria-label={t.nav.primary} className="hidden md:block">
          <ul className="flex items-center gap-7 text-sm text-ink-muted">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="transition-colors hover:text-ink">{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <a href="#contact" className="hidden rounded-full bg-rust px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rust-dark sm:inline-block">
            {t.nav.cta}
          </a>
          <button
            type="button"
            className="rounded-md p-2 text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label={t.nav.primary} className="border-t border-chalk bg-cream md:hidden">
          <ul className="container flex flex-col py-2">
            {[...links, { href: "#contact", label: t.nav.cta }].map((link) => (
              <li key={link.label}>
                <a href={link.href} onClick={() => setOpen(false)} className="block py-3 text-base text-ink">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
```

- [ ] **Step 3: `SkipLink.tsx`**

```tsx
import { useLanguage } from "@/hooks/use-language";

export function SkipLink() {
  const { t } = useLanguage();
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-rust focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
    >
      {t.nav.skip}
    </a>
  );
}
```

- [ ] **Step 4: Verify** — `bunx tsc -p tsconfig.app.json --noEmit` → no output.

- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: header, language toggle and translated skip link"`

---

### Task 10: Hero and Services sections

**Files:**
- Create: `src/components/Hero.tsx`, `src/components/ServicesSection.tsx`, `src/components/SectionHeading.tsx`

- [ ] **Step 1: `SectionHeading.tsx`** (shared eyebrow + title + subtitle)

```tsx
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  id: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeading({ id, eyebrow, title, subtitle, className }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rust">{eyebrow}</p>
      <h2 id={id} className="mt-3 text-3xl font-medium text-ink md:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 text-lg text-ink-muted">{subtitle}</p>}
    </div>
  );
}
```

- [ ] **Step 2: `Hero.tsx`** (no reveal animation on text: it must be visible on first paint)

```tsx
import { ArrowRight, Scissors } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { SERVICE_IDS } from "@/i18n/types";
import { Marquee } from "./magicui/marquee";
import { WordRotate } from "./magicui/word-rotate";
import { StitchLine } from "./motifs/StitchLine";

export function Hero() {
  const { t } = useLanguage();
  const { hero } = t;

  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden pt-32 md:pt-40">
      <div className="container text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-chalk bg-paper px-4 py-1.5 text-sm text-ink-muted">
          <span className="h-2 w-2 rounded-full bg-rust" aria-hidden="true" />
          {hero.badge}
        </p>
        <h1 id="hero-title" className="mx-auto mt-8 max-w-4xl text-5xl font-medium leading-[1.05] text-ink md:text-7xl">
          {hero.title} <span className="italic text-rust">{hero.titleAccent}</span>
        </h1>
        <p className="mt-6 text-xl text-ink md:text-2xl">
          {hero.rotatePrefix}{" "}
          <WordRotate words={hero.rotateWords} className="font-display italic text-rust" />
          <span className="sr-only">{hero.rotateWords.join(", ")}</span>
        </p>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-muted">{hero.subtitle}</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-rust px-7 py-3.5 font-semibold text-white transition-colors hover:bg-rust-dark">
            {hero.primaryCta} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <a href="#services" className="rounded-full border border-ink/20 px-7 py-3.5 font-semibold text-ink transition-colors hover:border-ink/50">
            {hero.secondaryCta}
          </a>
        </div>
      </div>
      <StitchLine trigger="mount" className="mt-14" />
      <div className="border-y border-chalk bg-paper py-3">
        <p className="sr-only">{hero.marqueeLabel}</p>
        <Marquee pauseOnHover className="[--duration:45s]">
          {SERVICE_IDS.map((id) => (
            <span key={id} className="flex items-center gap-4 whitespace-nowrap font-display text-lg italic text-ink">
              {t.services.items[id].name}
              <Scissors className="h-4 w-4 text-rust" aria-hidden="true" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: `ServicesSection.tsx`**

```tsx
import { serviceGroups, serviceIcons } from "@/data/services";
import { useLanguage } from "@/hooks/use-language";
import { BlurFade } from "./magicui/blur-fade";
import { SectionHeading } from "./SectionHeading";

export function ServicesSection() {
  const { t } = useLanguage();
  const { services } = t;

  return (
    <section id="services" aria-labelledby="services-title" className="py-24 md:py-32">
      <div className="container">
        <SectionHeading id="services-title" eyebrow={services.eyebrow} title={services.title} subtitle={services.subtitle} />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {serviceGroups.map((group, groupIndex) => (
            <BlurFade key={group.id} delay={groupIndex * 0.12}>
              <article className="h-full rounded-2xl border border-chalk bg-paper p-7 outline-dashed outline-1 outline-offset-[-10px] outline-chalk">
                <p className="font-display text-sm italic text-rust">0{groupIndex + 1}</p>
                <h3 className="mt-1 text-2xl font-medium text-ink">{services.groups[group.id].name}</h3>
                <p className="mt-1 text-sm text-ink-muted">{services.groups[group.id].tagline}</p>
                <ul className="mt-6 space-y-5">
                  {group.services.map((id) => {
                    const Icon = serviceIcons[id];
                    return (
                      <li key={id} className="flex gap-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rust/10 text-rust">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div>
                          <p className="font-semibold text-ink">{services.items[id].name}</p>
                          <p className="text-sm text-ink-muted">{services.items[id].description}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </article>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Verify** — `bunx tsc -p tsconfig.app.json --noEmit` → no output.

- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: hero and services sections"`

---

### Task 11: Process, Why and FAQ sections

**Files:**
- Create: `src/components/ProcessSection.tsx`, `src/components/WhySection.tsx`, `src/components/FaqSection.tsx`

- [ ] **Step 1: `ProcessSection.tsx`**

```tsx
import { useLanguage } from "@/hooks/use-language";
import { BlurFade } from "./magicui/blur-fade";
import { MeasuringTape } from "./motifs/MeasuringTape";
import { SectionHeading } from "./SectionHeading";

export function ProcessSection() {
  const { t } = useLanguage();
  const { process } = t;

  return (
    <section id="process" aria-labelledby="process-title" className="border-y border-chalk bg-paper py-24 md:py-32">
      <div className="container">
        <SectionHeading id="process-title" eyebrow={process.eyebrow} title={process.title} subtitle={process.subtitle} />
        <MeasuringTape className="mt-12" />
        <ol className="mt-10 grid gap-8 md:grid-cols-4">
          {process.steps.map((step, index) => (
            <li key={step.title} className="border-t-2 border-dashed border-rust/60 pt-5">
              <BlurFade delay={index * 0.1}>
                <p className="font-display text-3xl italic text-rust">0{index + 1}</p>
                <h3 className="mt-2 text-xl font-medium text-ink">{step.title}</h3>
                <p className="mt-2 text-ink-muted">{step.description}</p>
              </BlurFade>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

`BlurFade` sits inside the `li` so the list keeps valid `ol > li` markup.

- [ ] **Step 2: `WhySection.tsx`**

```tsx
import { Check } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { BlurFade } from "./magicui/blur-fade";
import { NumberTicker } from "./magicui/number-ticker";
import { SectionHeading } from "./SectionHeading";

export function WhySection() {
  const { t } = useLanguage();
  const { why } = t;
  const facts = [
    { value: 9, label: why.facts.services },
    { value: 2, label: why.facts.languages },
    { value: 1, label: why.facts.replyDays },
  ];

  return (
    <section id="why" aria-labelledby="why-title" className="py-24 md:py-32">
      <div className="container grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:items-start">
        <div>
          <SectionHeading id="why-title" eyebrow={why.eyebrow} title={why.title} />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {why.points.map((point) => (
              <li key={point.title} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rust text-white">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-sans text-base font-semibold tracking-normal text-ink">{point.title}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{point.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <BlurFade>
          <div className="rounded-2xl border border-chalk bg-ink p-8 text-paper">
            <h3 className="text-xl font-medium">{why.factsTitle}</h3>
            <dl className="mt-6 space-y-6">
              {facts.map((fact) => (
                <div key={fact.label} className="flex items-baseline gap-4 border-b border-paper/15 pb-6 last:border-0 last:pb-0">
                  <dt className="sr-only">{fact.label}</dt>
                  <dd className="font-display text-5xl text-[#E9A58F]">
                    <NumberTicker value={fact.value} />
                  </dd>
                  <dd aria-hidden="true" className="text-paper/80">{fact.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
```

`#E9A58F` is a light rust tint for numbers on the ink card (contrast ≈ 8:1 on `#1F1A17`).

- [ ] **Step 3: `FaqSection.tsx`**

```tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/hooks/use-language";
import { SectionHeading } from "./SectionHeading";

export function FaqSection() {
  const { t } = useLanguage();

  return (
    <section id="faq" aria-labelledby="faq-title" className="border-t border-chalk bg-paper py-24 md:py-32">
      <div className="container grid gap-10 lg:grid-cols-[1fr_1.5fr]">
        <SectionHeading id="faq-title" eyebrow={t.faq.eyebrow} title={t.faq.title} />
        <Accordion type="single" collapsible className="w-full">
          {t.faq.items.map((item, index) => (
            <AccordionItem key={item.question} value={`faq-${index}`} className="border-chalk">
              <AccordionTrigger className="text-left text-lg text-ink hover:no-underline">{item.question}</AccordionTrigger>
              <AccordionContent className="text-base text-ink-muted">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Verify** — `bunx tsc -p tsconfig.app.json --noEmit` → no output.

- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: process, why and FAQ sections"`

---

### Task 12: Contact section and form

**Files:**
- Create: `src/components/ServiceChips.tsx`, `src/components/ContactForm.tsx`, `src/components/ContactSection.tsx`

- [ ] **Step 1: `ServiceChips.tsx`**

```tsx
import { useLanguage } from "@/hooks/use-language";
import { SERVICE_IDS, type ServiceId } from "@/i18n/types";
import { cn } from "@/lib/utils";

interface ServiceChipsProps {
  value: ServiceId[];
  onChange: (value: ServiceId[]) => void;
}

export function ServiceChips({ value, onChange }: ServiceChipsProps) {
  const { t } = useLanguage();
  const toggle = (id: ServiceId) => onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-ink">{t.contact.form.services}</legend>
      <div className="flex flex-wrap gap-2">
        {SERVICE_IDS.map((id) => {
          const checked = value.includes(id);
          return (
            <label
              key={id}
              className={cn(
                "cursor-pointer rounded-full border px-3 py-1.5 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                checked ? "border-rust bg-rust text-white" : "border-chalk bg-paper text-ink hover:border-ink/40",
              )}
            >
              <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggle(id)} />
              {t.services.items[id].name}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
```

- [ ] **Step 2: `ContactForm.tsx`**

```tsx
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/hooks/use-language";
import { BUDGET_IDS } from "@/i18n/types";
import { createContactSchema, submitContact, type ContactValues } from "@/lib/contact";
import { ServiceChips } from "./ServiceChips";

type Status = "idle" | "sent" | "mailto" | "error";
const field = "mt-1 w-full rounded-lg border border-chalk bg-paper px-3 py-2.5 text-ink placeholder:text-ink-muted/70 focus:outline-none focus:ring-2 focus:ring-ring";
const label = "text-sm font-medium text-ink";
const errorText = "mt-1 text-sm text-destructive";

export function ContactForm() {
  const { t } = useLanguage();
  const copy = t.contact.form;
  const schema = useMemo(() => createContactSchema(copy.errors), [copy.errors]);
  const [status, setStatus] = useState<Status>("idle");
  const { register, control, handleSubmit, reset, formState } = useForm<ContactValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", services: [], budget: "unsure", message: "", botcheck: "" },
  });
  const { errors, isSubmitting } = formState;

  const onSubmit = async (values: ContactValues) => {
    const labels = {
      serviceNames: values.services.map((id) => t.services.items[id].name),
      budgetLabel: copy.budgetOptions[values.budget],
    };
    try {
      const result = await submitContact(values, labels);
      if (result.kind === "mailto") {
        window.location.href = result.href;
        setStatus("mailto");
        return;
      }
      setStatus("sent");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-2xl border border-chalk bg-paper p-6 md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={label}>{copy.name}</label>
          <input id="name" autoComplete="name" className={field} aria-invalid={!!errors.name} aria-describedby="name-error" {...register("name")} />
          {errors.name && <p id="name-error" className={errorText}>{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className={label}>{copy.email}</label>
          <input id="email" type="email" autoComplete="email" className={field} aria-invalid={!!errors.email} aria-describedby="email-error" {...register("email")} />
          {errors.email && <p id="email-error" className={errorText}>{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="phone" className={label}>{copy.phone} <span className="font-normal text-ink-muted">({copy.optional})</span></label>
          <input id="phone" type="tel" autoComplete="tel" className={field} {...register("phone")} />
        </div>
        <div>
          <label htmlFor="budget" className={label}>{copy.budget}</label>
          <select id="budget" className={field} {...register("budget")}>
            {BUDGET_IDS.map((id) => <option key={id} value={id}>{copy.budgetOptions[id]}</option>)}
          </select>
        </div>
      </div>
      <Controller control={control} name="services" render={({ field: f }) => <ServiceChips value={f.value} onChange={f.onChange} />} />
      <div>
        <label htmlFor="message" className={label}>{copy.message}</label>
        <textarea id="message" rows={5} placeholder={copy.messagePlaceholder} className={field} aria-invalid={!!errors.message} aria-describedby="message-error" {...register("message")} />
        {errors.message && <p id="message-error" className={errorText}>{errors.message.message}</p>}
      </div>
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" {...register("botcheck")} />
      <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-rust px-6 py-3.5 font-semibold text-white transition-colors hover:bg-rust-dark sm:w-auto">
        {isSubmitting ? copy.submitting : copy.submit}
      </button>
      <p className="text-sm text-ink-muted">{copy.privacy}</p>
      <p role="status" aria-live="polite" className={status === "error" ? "text-sm text-destructive" : "text-sm font-medium text-ink"}>
        {status === "sent" && copy.success}
        {status === "mailto" && copy.mailto}
        {status === "error" && copy.error}
      </p>
    </form>
  );
}
```

- [ ] **Step 3: `ContactSection.tsx`**

```tsx
import { Clock, Languages, Mail, MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useLanguage } from "@/hooks/use-language";
import { ContactForm } from "./ContactForm";
import { SectionHeading } from "./SectionHeading";

export function ContactSection() {
  const { t } = useLanguage();
  const { contact } = t;
  const details = [
    { icon: Mail, label: contact.emailLabel, value: <a href={`mailto:${siteConfig.email}`} className="underline decoration-rust underline-offset-4">{siteConfig.email}</a> },
    { icon: MapPin, label: contact.locationLabel, value: contact.locationValue },
    { icon: Clock, label: contact.responseLabel, value: contact.responseValue },
    { icon: Languages, label: contact.languagesLabel, value: contact.languagesValue },
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="py-24 md:py-32">
      <div className="container grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <SectionHeading id="contact-title" eyebrow={contact.eyebrow} title={contact.title} subtitle={contact.subtitle} />
          <dl className="mt-10 space-y-5">
            {details.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-4">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-rust" aria-hidden="true" />
                <div>
                  <dt className="text-sm text-ink-muted">{label}</dt>
                  <dd className="font-medium text-ink">{value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Verify** — `bunx tsc -p tsconfig.app.json --noEmit` → no output.

- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: contact section with validated form"`

---

### Task 13: Footer, WhatsApp button, pages and App wiring

**Files:**
- Replace: `src/components/Footer.tsx`, `src/pages/Index.tsx`, `src/pages/NotFound.tsx`, `src/App.tsx`
- Create: `src/components/WhatsAppButton.tsx`

- [ ] **Step 1: `Footer.tsx`**

```tsx
import { siteConfig } from "@/config/site";
import { useLanguage } from "@/hooks/use-language";
import { Wordmark } from "./Header";
import { LanguageToggle } from "./LanguageToggle";
import { StitchLine } from "./motifs/StitchLine";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-cream">
      <StitchLine variant="straight" className="h-6" />
      <div className="container flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between">
        <div>
          <Wordmark />
          <p className="mt-2 text-ink-muted">{t.footer.tagline}</p>
          <p className="mt-1 text-sm text-ink-muted">
            {t.footer.serving} · <a href={`mailto:${siteConfig.email}`} className="underline underline-offset-4">{siteConfig.email}</a>
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 md:items-end">
          <LanguageToggle />
          <p className="text-sm text-ink-muted">© {new Date().getFullYear()} TailorWebs. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: `WhatsAppButton.tsx`**

```tsx
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useLanguage } from "@/hooks/use-language";

export function WhatsAppButton() {
  const { t } = useLanguage();
  if (!siteConfig.whatsapp) return null;

  return (
    <a
      href={`https://wa.me/${siteConfig.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.whatsapp.label}
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#1F7A4D] text-white shadow-lg transition-transform hover:scale-105"
    >
      <MessageCircle className="h-6 w-6" aria-hidden="true" />
    </a>
  );
}
```

- [ ] **Step 3: `src/pages/Index.tsx`**

```tsx
import { ContactSection } from "@/components/ContactSection";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProcessSection } from "@/components/ProcessSection";
import { ServicesSection } from "@/components/ServicesSection";
import { SkipLink } from "@/components/SkipLink";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { WhySection } from "@/components/WhySection";

const Index = () => (
  <div className="min-h-dvh bg-cream">
    <SkipLink />
    <Header />
    <main id="main-content" tabIndex={-1} className="focus:outline-none">
      <Hero />
      <ServicesSection />
      <ProcessSection />
      <WhySection />
      <FaqSection />
      <ContactSection />
    </main>
    <Footer />
    <WhatsAppButton />
  </div>
);

export default Index;
```

- [ ] **Step 4: `src/pages/NotFound.tsx`**

```tsx
import { Link } from "react-router-dom";
import { Wordmark } from "@/components/Header";
import { useLanguage } from "@/hooks/use-language";

const NotFound = () => {
  const { t } = useLanguage();
  return (
    <main id="main-content" className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-cream px-4 text-center">
      <Wordmark />
      <h1 className="text-4xl font-medium text-ink">{t.notFound.title}</h1>
      <p className="text-ink-muted">{t.notFound.body}</p>
      <Link to="/" className="rounded-full bg-rust px-6 py-3 font-semibold text-white hover:bg-rust-dark">{t.notFound.back}</Link>
    </main>
  );
};

export default NotFound;
```

- [ ] **Step 5: `src/App.tsx`**

```tsx
import { MotionConfig } from "motion/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LanguageProvider } from "@/components/LanguageProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </MotionConfig>
  );
}
```

- [ ] **Step 6: Verify** — `bunx tsc -p tsconfig.app.json --noEmit && bun run lint && bun run test && bun run build` → all clean.

- [ ] **Step 7: Commit** — `git add -A && git commit -m "feat: assemble the one-page site"`

---

### Task 14: SEO, favicon and share image

**Files:**
- Modify: `index.html`
- Create: `public/favicon.svg`, `public/og-image.svg` (source), `public/og-image.png`

- [ ] **Step 1: `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#F5EFE6"/><text x="32" y="44" text-anchor="middle" font-family="Georgia, serif" font-size="34" font-style="italic" fill="#B5482C">Tw</text><path d="M10 54 H54" stroke="#1F1A17" stroke-width="2" stroke-dasharray="4 3"/></svg>
```

- [ ] **Step 2: `public/og-image.svg`** then render it to PNG

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#F5EFE6"/>
  <text x="90" y="170" font-family="Georgia, serif" font-size="56" fill="#1F1A17">Tailor<tspan font-style="italic" fill="#B5482C">Webs</tspan></text>
  <text x="90" y="330" font-family="Georgia, serif" font-size="92" fill="#1F1A17">Tecnología</text>
  <text x="90" y="430" font-family="Georgia, serif" font-size="92" font-style="italic" fill="#B5482C">a la medida.</text>
  <path d="M0 520 C 200 470, 400 570, 600 520 S 1000 470, 1200 520" fill="none" stroke="#B5482C" stroke-width="4" stroke-dasharray="16 12" stroke-linecap="round"/>
  <text x="90" y="590" font-family="Helvetica, Arial, sans-serif" font-size="28" fill="#6B5E52">Web · Apps · SEO · Marketing · Redes · Auditorías de TI — El Paso, TX</text>
</svg>
```

Run: `rsvg-convert -w 1200 -h 630 public/og-image.svg -o public/og-image.png && file public/og-image.png`
Expected: `PNG image data, 1200 x 630`. Then `git rm --cached -q public/og-image.svg 2>/dev/null; rm public/og-image.svg` (the PNG is what ships).

- [ ] **Step 3: Replace the `<head>` metadata in `index.html`** — keep the charset, viewport and font links from Task 2; replace title, description, favicon and any Lovable OG/Twitter tags with:

```html
<html lang="es">
...
    <title>TailorWebs | Páginas web, apps y servicios de TI a la medida en El Paso, TX</title>
    <meta name="description" content="TailorWebs crea páginas web, apps, tiendas en línea y sistemas de inventario, impulsa tus redes y SEO, y audita tu red y equipos de TI. En español e inglés, desde El Paso, TX." />
    <meta name="theme-color" content="#F5EFE6" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="TailorWebs | Tecnología a la medida" />
    <meta property="og:description" content="Páginas web, apps, tiendas en línea, redes y SEO, y auditorías de TI en El Paso, TX. Websites, apps and IT, made to measure." />
    <meta property="og:image" content="https://enrique182004.github.io/tailorwebs/og-image.png" />
    <meta property="og:locale" content="es_US" />
    <meta property="og:locale:alternate" content="en_US" />
    <meta name="twitter:card" content="summary_large_image" />
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "TailorWebs",
        "email": "info@tailorwebs.com",
        "address": { "@type": "PostalAddress", "addressLocality": "El Paso", "addressRegion": "TX", "addressCountry": "US" },
        "areaServed": "US",
        "availableLanguage": ["es", "en"],
        "description": "Custom websites, apps, online stores, inventory systems, social media and SEO, digital marketing, network infrastructure, and IT and network audits."
      }
    </script>
```

Delete every `<meta>` that mentions Lovable, AxiomAI or `lovable.dev`.

- [ ] **Step 4: Verify** — Run: `grep -niE "lovable|axiom" index.html || echo CLEAN` → `CLEAN`. Run `bun run build` → clean.

- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: metadata, structured data, favicon and share image"`

---

### Task 15: README, lockfile and GitHub Pages workflow

**Files:**
- Replace: `README.md`; Create: `.github/workflows/deploy.yml`; Modify: `.gitignore`

- [ ] **Step 1: `README.md`**

````markdown
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
````

- [ ] **Step 2: `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bun run test
      - run: bun run build
        env:
          BASE_PATH: /tailorwebs/
      - run: cp dist/index.html dist/404.html
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 3: Add `.env` and `.env.*` to `.gitignore`** (append two lines: `.env`, `.env.*`).

- [ ] **Step 4: Verify the Pages build locally**

Run: `BASE_PATH=/tailorwebs/ bun run build && grep -o 'src="/tailorwebs/assets/[^"]*"' dist/index.html`
Expected: one match. Then `bun run build` again (back to `/`).

- [ ] **Step 5: Commit** — `git add -A && git commit -m "ci: GitHub Pages deploy workflow and README"`

---

### Task 16: Verification in the browser

- [ ] **Step 1:** `bun run lint && bun run test && bun run build` — all clean. Paste the output summary.
- [ ] **Step 2:** Run the dev server (`bun run dev`) and open `http://localhost:8080` in the browser pane.
- [ ] **Step 3:** At 375, 768 and 1440 px: hero headline visible within the first screenshot (no blank hero); `document.documentElement.scrollWidth <= window.innerWidth` (no horizontal overflow); stitch line draws; marquee scrolls.
- [ ] **Step 4:** Click ES/EN: every visible string changes, `<html lang>` and `document.title` change; reload keeps the choice.
- [ ] **Step 5:** Mobile menu opens, closes on Escape, outside click and link click.
- [ ] **Step 6:** Submit the empty form: three translated errors. Submit a valid form with no Web3Forms key: status shows the mailto note (the browser pane may block opening the mail app; the status text is the check).
- [ ] **Step 7:** Inject axe-core from `https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js` and run `axe.run()`; expect 0 violations. Fix anything found, re-run.
- [ ] **Step 8:** Visit `/nope`: translated 404 page with a working link home.
- [ ] **Step 9:** Run the `reviewer` subagent on `git diff main...HEAD -- src` and fix confirmed issues. Commit fixes: `git commit -am "fix: review findings"`.

---

### Task 17: Publish to a new GitHub repo and Pages (confirm with the user first)

- [ ] **Step 1: Ask the user** to confirm creating the **public** repo `Enrique182004/tailorwebs` (Pages on a free plan requires public). Do not proceed without a yes.

- [ ] **Step 2: Create a fresh-history snapshot of the finished branch**

```bash
cd "/Volumes/Kuike HD/Projects/tailorwebs"
git switch --orphan publish
git checkout feat/tailored-rebrand -- .
git add -A && git commit -m "TailorWebs site: bilingual, made-to-measure marketing site"
git ls-files | grep -E "^\.env$|^supabase/|^\.lovable/" || echo "no secrets or Lovable files"
```

Expected: `no secrets or Lovable files`.

- [ ] **Step 3: Create the repo, push, enable Pages**

```bash
gh repo create Enrique182004/tailorwebs --public --description "TailorWebs — websites, apps and IT, made to measure. El Paso, TX." 
git remote add tailorwebs https://github.com/Enrique182004/tailorwebs.git
git push -u tailorwebs publish:main
gh api -X POST repos/Enrique182004/tailorwebs/pages -f build_type=workflow
```

- [ ] **Step 4: Watch the deploy and check the live URL**

Run: `gh run watch --repo Enrique182004/tailorwebs --exit-status $(gh run list --repo Enrique182004/tailorwebs --limit 1 --json databaseId --jq '.[0].databaseId')`
Expected: build and deploy succeed. Then open `https://enrique182004.github.io/tailorwebs/` in the browser pane and repeat Task 16 Step 3–4 quickly.

- [ ] **Step 5: Switch back** — `git switch feat/tailored-rebrand`. The original Lovable repo (`origin`) is left untouched.
