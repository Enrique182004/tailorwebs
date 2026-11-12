import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { Scissors } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

function Row({ text, baseVelocity, outlined }: { text: string; baseVelocity: number; outlined?: boolean }) {
  const reduceMotion = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [0, 1000], [0, 5], { clamp: false });
  const skewX = useTransform(velocity, [-2000, 2000], [12, -12]);
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduceMotion) return;
    if (boost.get() < 0) direction.current = -1;
    else if (boost.get() > 0) direction.current = 1;
    let move = direction.current * baseVelocity * (delta / 1000);
    move += direction.current * move * boost.get();
    baseX.set(baseX.get() + move);
  });

  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <motion.div className="flex" style={{ x, skewX: reduceMotion ? 0 : skewX }}>
        {Array.from({ length: 4 }, (_, i) => (
          <span
            key={i}
            className={cn(
              "type-display-xl flex items-center gap-[0.3em] pr-[0.3em] font-bold uppercase",
              outlined ? "text-transparent [-webkit-text-stroke:2px_#B5482C]" : "text-ink",
            )}
          >
            {text}
            <Scissors className="h-[0.6em] w-[0.6em] text-rust" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function VelocityMarquee() {
  const { t } = useLanguage();
  return (
    <section data-tone="light" className="overflow-hidden py-16 md:py-24">
      <p className="sr-only">{t.v2.marquee}</p>
      <div aria-hidden="true" className="space-y-2">
        <Row text={t.v2.marquee} baseVelocity={-3} />
        <Row text={t.v2.marquee} baseVelocity={3} outlined />
      </div>
    </section>
  );
}
