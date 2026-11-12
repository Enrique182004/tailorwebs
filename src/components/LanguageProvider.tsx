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
