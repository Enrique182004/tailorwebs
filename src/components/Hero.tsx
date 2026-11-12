import type { CSSProperties } from "react";
import { useLanguage } from "@/hooks/use-language";
import { ProjectPrompt } from "./ProjectPrompt";

const delay = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

export function Hero() {
  const { t } = useLanguage();
  const { hero } = t;

  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden pb-20 pt-28 md:pb-28 md:pt-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black_60%,transparent)] bg-[radial-gradient(45%_40%_at_15%_20%,rgba(181,72,44,0.14),transparent),radial-gradient(40%_35%_at_85%_30%,rgba(51,70,211,0.10),transparent),radial-gradient(50%_40%_at_50%_100%,rgba(47,93,80,0.10),transparent)]"
      />
      <div className="container text-center">
        <p className="rise inline-flex items-center gap-2 rounded-full border border-dashed border-ink/25 bg-paper/70 px-4 py-1.5 text-sm text-ink-muted" style={delay(0)}>
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rust/60 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-rust" />
          </span>
          {hero.badge}
        </p>
        <h1 id="hero-title" className="type-display-xl mx-auto mt-7 max-w-5xl font-bold text-ink">
          <span className="rise block" style={delay(80)}>{hero.title}</span>
          <span className="rise block text-rust" style={delay(180)}>{hero.titleAccent}</span>
        </h1>
        <p className="rise mx-auto mt-6 max-w-2xl text-lg text-ink-muted md:text-xl" style={delay(280)}>
          {hero.subtitle}
        </p>
        <div className="rise mt-10" style={delay(380)}>
          <ProjectPrompt />
        </div>
        <a
          href="#services"
          className="rise mt-8 inline-flex min-h-11 items-center text-sm font-semibold text-ink underline decoration-rust decoration-2 underline-offset-[6px] transition-colors hover:text-rust"
          style={delay(480)}
        >
          {hero.secondaryCta}
        </a>
      </div>
    </section>
  );
}
