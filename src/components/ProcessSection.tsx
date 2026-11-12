import { useLanguage } from "@/hooks/use-language";
import { BlurFade } from "./magicui/blur-fade";
import { MeasuringTape } from "./motifs/MeasuringTape";
import { SectionHeading } from "./SectionHeading";

export function ProcessSection() {
  const { t } = useLanguage();
  const { process } = t;

  return (
    <section id="process" aria-labelledby="process-title" className="px-3 md:px-6">
      <div className="rounded-[2rem] bg-ink py-24 text-paper md:py-32">
        <div className="container">
          <SectionHeading id="process-title" tone="dark" eyebrow={process.eyebrow} title={process.title} subtitle={process.subtitle} />
          <MeasuringTape tone="dark" className="mt-14" />
          <ol className="mt-12 grid gap-10 md:grid-cols-4 md:gap-8">
            {process.steps.map((step, index) => (
              <li key={step.title} className="border-t-2 border-dashed border-paper/25 pt-6">
                <BlurFade delay={index * 0.1}>
                  <p className="font-display text-6xl font-bold leading-none text-[#E9A58F]">0{index + 1}</p>
                  <h3 className="mt-4 text-2xl font-bold">{step.title}</h3>
                  <p className="mt-2 text-[#C9BFB2]">{step.description}</p>
                </BlurFade>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
