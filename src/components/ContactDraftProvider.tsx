import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { ContactDraftContext, type ContactDraft } from "@/lib/contact-draft-context";

interface ContactDraftProviderProps {
  children: ReactNode;
  /** Lets a page with a custom smooth-scroller (V2's Lenis) take over the scroll to #contact. */
  scrollToContact?: () => void;
}

export function ContactDraftProvider({ children, scrollToContact }: ContactDraftProviderProps) {
  const [draft, setDraft] = useState<ContactDraft | null>(null);
  const nextId = useRef(1);

  const sendToContact = useCallback((next: Omit<ContactDraft, "id">) => {
    setDraft({ ...next, id: nextId.current++ });
    if (scrollToContact) {
      scrollToContact();
      return;
    }
    // scrollIntoView() follows the CSS scroll-behavior, which is "auto" under reduced motion.
    document.getElementById("contact")?.scrollIntoView();
  }, [scrollToContact]);

  const value = useMemo(() => ({ draft, sendToContact }), [draft, sendToContact]);
  return <ContactDraftContext.Provider value={value}>{children}</ContactDraftContext.Provider>;
}
