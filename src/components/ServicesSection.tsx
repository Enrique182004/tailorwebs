import { ArrowRight } from "lucide-react";
import { serviceGroups, serviceIcons } from "@/data/services";
import { useContactDraft } from "@/hooks/use-contact-draft";
import { useLanguage } from "@/hooks/use-language";
import type { GroupId } from "@/i18n/types";
import { cn } from "@/lib/utils";
import { BlurFade } from "./magicui/blur-fade";
import { SectionHeading } from "./SectionHeading";

const GROUP_COLOR: Record<GroupId, string> = { build: "bg-rust", grow: "bg-cobalt", protect: "bg-pine" };

export function ServicesSection() {
  const { t } = useLanguage();
  const { sendToContact } = useContactDraft();
  const { services } = t;

  return (
    <section id="services" aria-labelledby="services-title" className="py-24 md:py-32">
      <div className="container">
        <SectionHeading id="services-title" eyebrow={services.eyebrow} title={services.title} subtitle={services.subtitle} />
        <div className="mt-14 space-y-12">
          {serviceGroups.map((group, groupIndex) => (
            <BlurFade key={group.id} delay={groupIndex * 0.06} className="grid gap-6 border-t-2 border-ink pt-8 md:grid-cols-[300px_1fr] md:gap-12">
              <div>
                <div className={cn("inline-flex h-14 w-14 items-center justify-center rounded-xl font-display text-xl font-bold text-white", GROUP_COLOR[group.id])}>
                  0{groupIndex + 1}
                </div>
                <h3 className="mt-4 text-3xl font-bold text-ink">{services.groups[group.id].name}</h3>
                <p className="mt-1 text-ink-muted">{services.groups[group.id].tagline}</p>
              </div>
              <ul>
                {group.services.map((id) => {
                  const Icon = serviceIcons[id];
                  return (
                    <li key={id} className="border-b border-dashed border-ink/20 last:border-b-0">
                      <button
                        type="button"
                        onClick={() => sendToContact({ services: [id] })}
                        className="group flex w-full items-center gap-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:gap-6"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-ink/15 bg-paper text-ink transition-colors group-hover:border-rust group-hover:text-rust">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="sr-only">{services.rowCta}: </span>
                          <span className="block font-display text-xl font-semibold text-ink md:text-2xl">{services.items[id].name}</span>
                          <span className="block text-ink-muted">{services.items[id].description}</span>
                        </span>
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-ink text-ink transition-all duration-300 group-hover:bg-ink group-hover:text-paper">
                          <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-rotate-45" aria-hidden="true" />
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
