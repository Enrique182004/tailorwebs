import { SERVICE_IDS, type ServiceId } from "@/i18n/types";

// Accent-free, lowercase phrases. Single words also match their plural (+s / +es).
const KEYWORDS: Record<ServiceId, string[]> = {
  customApps: ["app", "aplicacion", "movil", "mobile", "portal", "software"],
  websites: ["pagina", "sitio", "web", "website", "landing", "menu"],
  ecommerce: ["tienda", "store", "shop", "vender", "sell", "ecommerce", "e-commerce", "pedidos en linea", "online ordering", "pagos", "payments"],
  inventory: ["inventario", "inventory", "existencias", "stock", "almacen"],
  socialSeo: ["seo", "google", "redes sociales", "social media", "instagram", "facebook", "tiktok"],
  marketing: ["marketing", "campana", "campaign", "anuncios", "ads", "publicidad"],
  networkInfra: ["red de", "mi red", "la red", "network", "wifi", "wi-fi", "internet", "cableado", "router"],
  itAudits: ["auditoria de ti", "it audit", "computadora", "computer", "laptop", "hardware", "equipos de computo"],
  networkAudits: ["auditoria de red", "auditoria de la red", "network audit", "red lenta", "slow network", "network is slow"],
};

function normalize(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function escape(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const PATTERNS: Record<ServiceId, RegExp> = Object.fromEntries(
  SERVICE_IDS.map((id) => [
    id,
    new RegExp(`(^|[^a-z])(${KEYWORDS[id].map(escape).join("|")})(s|es)?(?![a-z])`),
  ]),
) as Record<ServiceId, RegExp>;

const GENERIC_AUDIT = /(^|[^a-z])(auditoria|audit)(s|es)?(?![a-z])/;

export function matchServices(text: string): ServiceId[] {
  const normalized = normalize(text);
  if (!normalized.trim()) return [];
  const found = new Set(SERVICE_IDS.filter((id) => PATTERNS[id].test(normalized)));
  // A bare "audit" is about the network only when the text already talks about a network.
  if (GENERIC_AUDIT.test(normalized) && !found.has("itAudits") && !found.has("networkAudits")) {
    found.add(found.has("networkInfra") ? "networkAudits" : "itAudits");
  }
  return SERVICE_IDS.filter((id) => found.has(id));
}
