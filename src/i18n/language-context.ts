import { createContext } from "react";
import type { Dictionary, Language } from "./types";

export interface LanguageContextValue {
  language: Language;
  t: Dictionary;
  setLanguage: (language: Language) => void;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);
