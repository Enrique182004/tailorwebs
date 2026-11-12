import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { ContactDraftContext, type ContactDraft } from "@/lib/contact-draft-context";

export function ContactDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<ContactDraft | null>(null);
  const nextId = useRef(1);

  const sendToContact = useCallback((next: Omit<ContactDraft, "id">) => {
    setDraft({ ...next, id: nextId.current++ });
    // scrollIntoView() follows the CSS scroll-behavior, which is "auto" under reduced motion.
    document.getElementById("contact")?.scrollIntoView();
  }, []);

  const value = useMemo(() => ({ draft, sendToContact }), [draft, sendToContact]);
  return <ContactDraftContext.Provider value={value}>{children}</ContactDraftContext.Provider>;
}
