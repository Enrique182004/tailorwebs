import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useLanguage } from "@/hooks/use-language";
import { Magnetic } from "./Magnetic";

/** Dark band whose rounded mask opens to full width as it scrolls into view. */
export function RevealCta() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const clipPath = useTransform(scrollYProgress, [0, 1], ["inset(14% 12% round 48px)", "inset(0% 0% round 0px)"]);

  return (
    // The tone lives on the clipped band, so the cream margins around it read as light for the header.
    <section ref={ref} data-tone="light" aria-labelledby="cta-title" className="relative">
      <motion.div data-tone="dark" className="bg-ink py-32 text-paper md:py-44" style={{ clipPath: reduceMotion ? "none" : clipPath }}>
        <div className="container text-center">
          <h2 id="cta-title" className="type-display-xl mx-auto max-w-5xl font-bold">
            {t.v2.ctaTitle}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-[#C9BFB2] md:text-xl">{t.v2.ctaBody}</p>
          <div className="mt-12">
            <Magnetic>
              <a
                href="#contact"
                className="inline-flex min-h-14 items-center gap-3 rounded-full bg-ember px-8 text-lg font-bold text-ink transition-colors hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
              >
                {t.v2.ctaButton}
                <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
              </a>
            </Magnetic>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
