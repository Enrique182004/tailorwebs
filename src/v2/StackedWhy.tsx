import { useRef } from "react";
import { Languages, Ruler, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { SectionHeading } from "@/components/SectionHeading";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";

const CARDS: { icon: LucideIcon; style: string; body: string }[] = [
  { icon: Ruler, style: "bg-rust text-white", body: "text-white" },
  { icon: ShieldCheck, style: "bg-cobalt text-white", body: "text-cobalt-soft" },
  { icon: Languages, style: "bg-pine text-white", body: "text-pine-soft" },
  { icon: Users, style: "bg-ink text-paper", body: "text-[#C9BFB2]" },
];

interface CardProps {
  index: number;
  total: number;
  title: string;
  description: string;
  progress: MotionValue<number>;
}

function StackCard({ index, total, title, description, progress }: CardProps) {
  const { icon: Icon, style, body } = CARDS[index];
  const scale = useTransform(progress, [index / total, 1], [1, 1 - (total - index) * 0.05]);
  const reduceMotion = useReducedMotion();

  return (
    <li className="sticky top-0 flex h-[80vh] items-center justify-center">
      <motion.div
        className={cn("relative flex h-[56vh] min-h-[320px] w-full max-w-4xl origin-top flex-col justify-between rounded-[2rem] p-8 md:p-12", style)}
        style={{ scale: reduceMotion ? 1 : scale, top: `calc(-6vh + ${index * 26}px)` }}
      >
        <span className="flex items-center justify-between">
          <Icon className="h-10 w-10" aria-hidden="true" />
          <span aria-hidden="true" data-n={`0${index + 1}`} className="font-display text-6xl font-bold opacity-30 before:content-[attr(data-n)]" />
        </span>
        <span>
          <h3 className="type-display-lg font-bold">{title}</h3>
          <p className={cn("mt-4 max-w-xl text-lg md:text-xl", body)}>{description}</p>
        </span>
      </motion.div>
    </li>
  );
}

export function StackedWhy() {
  const { t } = useLanguage();
  const { why } = t;
  const listRef = useRef<HTMLUListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start start", "end end"] });
  const facts = [
    { value: 9, label: why.facts.services },
    { value: 2, label: why.facts.languages },
    { value: 1, label: why.facts.replyDays },
  ];

  return (
    <section id="why" data-tone="light" aria-labelledby="why-title" className="pt-24 md:pt-32">
      <div className="container">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading id="why-title" eyebrow={why.eyebrow} title={why.title} />
          <dl aria-label={why.factsTitle} className="flex shrink-0 divide-x-2 divide-dashed divide-ink/20">
            {facts.map((fact) => (
              <div key={fact.label} className="flex flex-col-reverse px-6 first:pl-0 last:pr-0">
                <dt className="mt-1 max-w-[8rem] text-sm text-ink-muted">{fact.label}</dt>
                <dd className="font-display text-6xl font-bold leading-none text-ink">
                  <NumberTicker value={fact.value} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <ul ref={listRef} className="mt-10">
          {why.points.map((point, i) => (
            <StackCard key={point.title} index={i} total={why.points.length} title={point.title} description={point.description} progress={scrollYProgress} />
          ))}
        </ul>
      </div>
    </section>
  );
}
