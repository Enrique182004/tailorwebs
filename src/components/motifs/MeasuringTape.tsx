import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

export function MeasuringTape({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 35%"] });
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const dark = tone === "dark";

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("relative h-10 overflow-hidden rounded-md border", dark ? "border-paper/20 bg-paper/5" : "border-chalk bg-paper", className)}
    >
      <motion.div
        className={cn("absolute inset-y-0 left-0 w-full origin-left", dark ? "bg-rust/60" : "bg-rust/20")}
        style={{ scaleX: reduceMotion ? 1 : scaleX }}
      />
      <div className={cn("absolute inset-0", dark ? "tape-ticks-light" : "tape-ticks")} />
    </div>
  );
}
