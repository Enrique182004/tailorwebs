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

export type ShowcaseId = "inventory" | "restaurant" | "store" | "audit";

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
    subtitle: string;
    promptLabel: string;
    promptExamples: string[];
    promptSubmit: string;
    promptChipsLabel: string;
    promptHint: string;
    secondaryCta: string;
  };
  showcase: {
    eyebrow: string;
    title: string;
    subtitle: string;
    conceptTag: string;
    items: Record<ShowcaseId, { title: string; caption: string }>;
    mock: {
      stock: string;
      lowStock: string;
      ordersToday: string;
      dish1: string;
      dish2: string;
      dish3: string;
      add: string;
      cart: string;
      securityScore: string;
      risksFound: string;
      fixed: string;
    };
  };
  services: {
    eyebrow: string;
    title: string;
    subtitle: string;
    groups: Record<GroupId, { name: string; tagline: string }>;
    items: Record<ServiceId, { name: string; description: string }>;
    rowCta: string;
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
      draftMessage: string;
      draftServices: string;
      success: string;
      mailto: string;
      error: string;
      errors: { name: string; email: string; message: string };
    };
  };
  footer: { tagline: string; serving: string; rights: string };
  notFound: { title: string; body: string; back: string };
  whatsapp: { label: string };
  v2: {
    kicker: string;
    scrollCue: string;
    manifesto: string;
    sceneEyebrow: string;
    sceneTitle: string;
    published: string;
    marquee: string;
    servicesHint: string;
    ctaTitle: string;
    ctaBody: string;
    ctaButton: string;
    version: string;
  };
}
