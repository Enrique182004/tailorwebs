import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useLanguage } from "@/hooks/use-language";

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  // 0.4 keeps unrevealed words at ≥3:1 contrast on ink (large-text minimum).
  const opacity = useTransform(progress, range, [0.4, 1]);
  const reduceMotion = useReducedMotion();
  return (
    <motion.span style={{ opacity: reduceMotion ? 1 : opacity }} className="inline-block">
      {word}&nbsp;
    </motion.span>
  );
}

export function Manifesto() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 45%"] });
  const words = t.v2.manifesto.split(" ");

  return (
    <section id="manifesto" data-tone="dark" className="bg-ink py-32 text-paper md:py-48">
      <div ref={ref} className="container">
        <p className="sr-only">{t.v2.manifesto}</p>
        <p aria-hidden="true" className="type-display-lg max-w-5xl font-bold">
          {words.map((word, i) => (
            <Word key={`${word}-${i}`} word={word} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
          ))}
        </p>
      </div>
    </section>
  );
}
