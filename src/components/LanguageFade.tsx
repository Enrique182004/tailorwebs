import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { useLanguage } from "@/hooks/use-language";

/** Briefly fades content when the language switches, without remounting (keeps form input). */
export function LanguageFade({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const previous = useRef(language);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    // Comparing to the previous language (not a "first run" flag) keeps StrictMode's double
    // effect run and a reduced-motion change from replaying the fade.
    if (previous.current === language) return;
    previous.current = language;
    if (reduceMotion) return;
    ref.current?.animate(
      [
        { opacity: 0.25, filter: "blur(3px)" },
        { opacity: 1, filter: "blur(0px)" },
      ],
      { duration: 380, easing: "ease-out" },
    );
  }, [language, reduceMotion]);

  return <div ref={ref}>{children}</div>;
}
