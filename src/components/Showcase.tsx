import type { ComponentType } from "react";
import { useLanguage } from "@/hooks/use-language";
import type { ShowcaseId } from "@/i18n/types";
import { BlurFade } from "./magicui/blur-fade";
import { AuditMock, InventoryMock, RestaurantMock, StoreMock } from "./ShowcaseMocks";
import { SectionHeading } from "./SectionHeading";

const ITEMS: { id: ShowcaseId; Mock: ComponentType; span: string }[] = [
  { id: "inventory", Mock: InventoryMock, span: "md:col-span-7" },
  { id: "restaurant", Mock: RestaurantMock, span: "md:col-span-5" },
  { id: "store", Mock: StoreMock, span: "md:col-span-5" },
  { id: "audit", Mock: AuditMock, span: "md:col-span-7" },
];

export function Showcase() {
  const { t } = useLanguage();
  const { showcase } = t;

  return (
    <section id="work" aria-labelledby="work-title" className="pb-24 md:pb-32">
      <div className="container">
        <SectionHeading id="work-title" eyebrow={showcase.eyebrow} title={showcase.title} subtitle={showcase.subtitle} />
        <div className="mt-12 grid gap-5 md:grid-cols-12">
          {ITEMS.map(({ id, Mock, span }, index) => (
            <BlurFade key={id} delay={index * 0.08} className={span}>
              <figure className="group h-full overflow-hidden rounded-2xl border border-ink/10 bg-paper transition-transform duration-300 hover:-translate-y-1.5">
                <div aria-hidden="true" className="h-60 transition-transform duration-500 group-hover:scale-[1.02]">
                  <Mock />
                </div>
                <figcaption className="flex items-start justify-between gap-4 p-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">{showcase.items[id].caption}</p>
                    <p className="mt-1 font-display text-xl font-semibold text-ink">{showcase.items[id].title}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-dashed border-ink/30 px-2.5 py-1 text-xs text-ink-muted">
                    {showcase.conceptTag}
                  </span>
                </figcaption>
              </figure>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
