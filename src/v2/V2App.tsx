import { useCallback } from "react";
import { MotionConfig } from "motion/react";
import { ContactDraftProvider } from "@/components/ContactDraftProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import { useSmoothScroll } from "./hooks/use-smooth-scroll";
import { V2Page } from "./V2Page";

function V2Shell() {
  const lenisRef = useSmoothScroll();
  const scrollToContact = useCallback(() => {
    const lenis = lenisRef.current;
    // Lenis applies the CSS scroll-padding-top (header clearance) itself.
    if (lenis) lenis.scrollTo("#contact");
    else document.getElementById("contact")?.scrollIntoView();
  }, [lenisRef]);

  return (
    <ContactDraftProvider scrollToContact={scrollToContact}>
      <V2Page />
    </ContactDraftProvider>
  );
}

export function V2App() {
  return (
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <V2Shell />
      </LanguageProvider>
    </MotionConfig>
  );
}
