import { useContext } from "react";
import { ContactDraftContext, type ContactDraftContextValue } from "@/lib/contact-draft-context";

export function useContactDraft(): ContactDraftContextValue {
  const value = useContext(ContactDraftContext);
  if (!value) throw new Error("useContactDraft must be used inside <ContactDraftProvider>");
  return value;
}
