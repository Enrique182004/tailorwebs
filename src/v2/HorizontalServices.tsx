import { useLayoutEffect, useRef, useState, type FocusEvent } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ServicesSection } from "@/components/ServicesSection";
import { serviceGroups, serviceIcons } from "@/data/services";
import { useContactDraft } from "@/hooks/use-contact-draft";
import { useLanguage } from "@/hooks/use-language";
import type { GroupId } from "@/i18n/types";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "./hooks/use-media-query";

const GROUP_STYLE: Record<GroupId, string> = { build: "bg-rust", grow: "bg-cobalt", protect: "bg-pine" };
const CARDS = serviceGroups.flatMap((g) => g.services.map((id) => ({ id, group: g.id })));

function Track() {
  const { t } = useLanguage();
  const { sendToContact } = useContactDraft();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const tape = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Keyboard focus would otherwise scroll the clipped track sideways on top of the motion offset.
  // Instead, scroll the page to the point where the focused card sits in view.
  const onCardFocus = (event: FocusEvent<HTMLButtonElement>) => {
    const section = sectionRef.current;
    if (!section) return;
    const card = event.currentTarget;
    const offset = card.offsetLeft - (window.innerWidth - card.offsetWidth) / 2;
    const top = section.offsetTop + Math.min(Math.max(offset, 0), distance);
    window.scrollTo({ top, behavior: "instant" });
  };

  useLayoutEffect(() => {
    const measure = () => setDistance(Math.max(0, (trackRef.current?.scrollWidth ?? 0) - window.innerWidth));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section id="services" ref={sectionRef} data-tone="light" data-pin aria-labelledby="services-title" style={{ height: `calc(100vh + ${distance}px)` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-clip">
        <motion.div ref={trackRef} className="flex w-max items-stretch gap-6 pl-[max(1.5rem,calc((100vw-1280px)/2+1.5rem))] pr-24" style={{ x }}>
          <div className="flex w-[420px] shrink-0 flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rust">{t.services.eyebrow}</p>
            <h2 id="services-title" className="type-display-lg mt-4 font-bold text-ink">{t.services.title}</h2>
            <p className="mt-5 text-lg text-ink-muted">{t.v2.servicesHint} →</p>
          </div>
          {CARDS.map(({ id, group }, i) => {
            const Icon = serviceIcons[id];
            return (
              <button
                key={id}
                type="button"
                onClick={() => sendToContact({ services: [id] })}
                onFocus={onCardFocus}
                className="group flex h-[60vh] max-h-[520px] w-[340px] shrink-0 flex-col rounded-3xl border-2 border-dashed border-ink/20 bg-paper p-7 text-left transition-all duration-300 hover:-translate-y-2 hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex items-center justify-between">
                  <span className={cn("flex h-12 w-12 items-center justify-center rounded-xl text-white", GROUP_STYLE[group])}>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  {/* Decorative watermark drawn by CSS so it is not read as low-contrast text. */}
                  <span aria-hidden="true" data-n={`0${i + 1}`} className="font-display text-5xl font-bold text-ink/10 before:content-[attr(data-n)]" />
                </span>
                <span className="mt-auto block text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">{t.services.groups[group].name}</span>
                <span className="mt-2 block font-display text-3xl font-bold leading-tight text-ink">{t.services.items[id].name}</span>
                <span className="mt-3 block text-ink-muted">{t.services.items[id].description}</span>
                <span className="mt-6 inline-flex items-center gap-2 font-semibold text-rust">
                  <span className="sr-only">{t.services.rowCta}: {t.services.items[id].name}</span>
                  <span aria-hidden="true">{t.services.rowCta}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </button>
            );
          })}
        </motion.div>
        <div aria-hidden="true" className="container mt-10">
          <div className="h-1 overflow-hidden rounded-full bg-ink/10">
            <motion.div className="h-full origin-left bg-rust" style={{ scaleX: tape }} />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Sideways-scrolling cards on wide mouse screens; the regular list on phones and for reduced motion. */
export function HorizontalServices() {
  const wide = useMediaQuery("(min-width: 1024px)");
  const reduceMotion = useReducedMotion();
  return wide && !reduceMotion ? <Track /> : <ServicesSection />;
}
