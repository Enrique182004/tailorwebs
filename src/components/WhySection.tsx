import { Languages, Ruler, ShieldCheck, Users } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";
import { BlurFade } from "./magicui/blur-fade";
import { NumberTicker } from "./magicui/number-ticker";
import { SectionHeading } from "./SectionHeading";

const BLOCKS = [
  { icon: Ruler, style: "bg-rust text-white", body: "text-white" },
  { icon: ShieldCheck, style: "bg-cobalt text-white", body: "text-cobalt-soft" },
  { icon: Languages, style: "bg-pine text-white", body: "text-pine-soft" },
  { icon: Users, style: "border-2 border-dashed border-ink/30 bg-paper text-ink", body: "text-ink-muted" },
];

export function WhySection() {
  const { t } = useLanguage();
  const { why } = t;
  const facts = [
    { value: 9, label: why.facts.services },
    { value: 2, label: why.facts.languages },
    { value: 1, label: why.facts.replyDays },
  ];

  return (
    <section id="why" aria-labelledby="why-title" className="py-24 md:py-32">
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
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {why.points.map((point, index) => {
            const { icon: Icon, style, body } = BLOCKS[index];
            return (
              <li key={point.title}>
                <BlurFade delay={index * 0.08} className="h-full">
                  <div className={cn("flex h-full min-h-[15rem] flex-col rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1 hover:-rotate-1", style)}>
                    <Icon className="h-7 w-7" aria-hidden="true" />
                    <h3 className="mt-auto pt-10 text-2xl font-bold">{point.title}</h3>
                    <p className={cn("mt-2", body)}>{point.description}</p>
                  </div>
                </BlurFade>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
