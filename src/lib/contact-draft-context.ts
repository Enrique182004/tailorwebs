import { createContext } from "react";
import type { ServiceId } from "@/i18n/types";

export interface ContactDraft {
  message?: string;
  services: ServiceId[];
  /** Increments on every hand-off so the form re-applies a repeated draft. */
  id: number;
}

export interface ContactDraftContextValue {
  draft: ContactDraft | null;
  sendToContact: (draft: Omit<ContactDraft, "id">) => void;
}

export const ContactDraftContext = createContext<ContactDraftContextValue | null>(null);
