import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "../hooks/use-media-query";
import { BuildStage } from "./BuildStage";
import { EXPAND_START, STATIC_PROGRESS, stepAt } from "./timeline";

export function BuildScene() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();
  // The single-column layout only fits a pinned 100svh frame on tall screens (not landscape phones).
  const tallEnough = useMediaQuery("(min-height: 700px), (min-width: 1024px) and (min-height: 560px)");
  const pinned = tallEnough && !reduceMotion;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const staticProgress = useMotionValue(STATIC_PROGRESS);
  const progress = pinned ? scrollYProgress : staticProgress;
  const [active, setActive] = useState(0);
  useMotionValueEvent(progress, "change", (v) => setActive(stepAt(v)));
  useEffect(() => setActive(stepAt(progress.get())), [progress]);

  const tape = useTransform(progress, [0, STATIC_PROGRESS], [0, 1]);
  const reveal = useTransform(progress, [EXPAND_START, 1], ["circle(0% at 70% 58%)", "circle(150% at 70% 58%)"]);
  const steps = t.process.steps;

  return (
    <section
      id="process"
      ref={ref}
      data-tone="dark"
      data-pin={pinned ? "" : undefined}
      aria-labelledby="scene-title"
      className={cn("relative bg-ink text-paper", pinned ? "h-[520vh]" : "py-24")}
    >
      <div className={cn("overflow-hidden", pinned && "sticky top-0 flex h-[100svh] items-center")}>
        <div className="container grid w-full items-center gap-8 pt-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.3fr)] lg:gap-14 lg:pt-0">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-ember">
              <span className="h-2 w-2 animate-pulse rounded-full bg-ember motion-reduce:animate-none" aria-hidden="true" />
              {t.v2.sceneEyebrow}
            </p>
            <h2 id="scene-title" className="mt-3 text-4xl font-bold md:text-5xl">{t.v2.sceneTitle}</h2>
            <div className="mt-8 flex gap-5">
              <div aria-hidden="true" className="relative hidden w-1 shrink-0 overflow-hidden rounded-full bg-paper/10 lg:block">
                <motion.div className="tape-ticks-light absolute inset-0 origin-top bg-ember/70" style={{ scaleY: tape }} />
              </div>
              <ol className="space-y-5">
                {steps.map((step, i) => {
                  const isActive = !pinned || i === active;
                  return (
                    <li
                      key={step.title}
                      aria-current={pinned && isActive ? "step" : undefined}
                      // Inactive steps stay readable by screen readers on phones, just not shown.
                      className={cn("transition-colors duration-500", !isActive && "sr-only lg:not-sr-only")}
                    >
                      <p className={cn("font-display text-sm font-bold", isActive ? "text-ember" : "text-[#9A8E81]")}>0{i + 1}</p>
                      <h3 className={cn("text-2xl font-bold md:text-3xl", isActive ? "text-paper" : "text-[#9A8E81]")}>{step.title}</h3>
                      <p className={isActive ? "mt-1 max-w-sm text-[#C9BFB2]" : "sr-only"}>{step.description}</p>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
          <BuildStage progress={progress} published={t.v2.published} />
        </div>
        {pinned && (
          <motion.div aria-hidden="true" data-tone="light" className="absolute inset-0 bg-cream" style={{ clipPath: reveal }} />
        )}
      </div>
    </section>
  );
}
