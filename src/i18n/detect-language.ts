import type { Language } from "./types";

export const LANGUAGE_STORAGE_KEY = "tailorwebs-language";

export function detectLanguage(saved: string | null, browserLanguages: readonly string[]): Language {
  if (saved === "es" || saved === "en") return saved;
  return browserLanguages.some((lang) => lang.toLowerCase().startsWith("es")) ? "es" : "en";
}
