import { useRef, type CSSProperties } from "react";
import { ProjectPrompt } from "@/components/ProjectPrompt";
import { useLanguage } from "@/hooks/use-language";

const delay = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

function MaskedWords({ text, startMs, className }: { text: string; startMs: number; className?: string }) {
  return (
    <span className={className}>
      {text.split(" ").map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <span className="mask-rise inline-block" style={delay(startMs + i * 70)}>
            {word}&nbsp;
          </span>
        </span>
      ))}
    </span>
  );
}

export function V2Hero() {
  const { t } = useLanguage();
  const { hero, v2 } = t;
  const sectionRef = useRef<HTMLElement>(null);

  // Writes CSS variables directly so following the pointer never re-renders React.
  const onPointerMove = (e: React.PointerEvent) => {
    const el = sectionRef.current;
    if (!el || e.pointerType !== "mouse") return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  return (
    <section
      id="top"
      ref={sectionRef}
      data-tone="dark"
      aria-labelledby="hero-title"
      onPointerMove={onPointerMove}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink pb-16 pt-28 text-paper [--spot-x:50%] [--spot-y:35%] md:pt-32"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(251,248,243,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(251,248,243,0.07)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(70%_60%_at_50%_40%,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(420px_circle_at_var(--spot-x)_var(--spot-y),rgba(232,115,79,0.22),transparent_70%)]"
      />
      <div className="container flex flex-1 flex-col items-center text-center">
        <p className="rise text-xs font-semibold uppercase tracking-[0.25em] text-[#C9BFB2]" style={delay(0)}>
          {v2.kicker}
        </p>
        <h1 id="hero-title" className="type-display-xl mt-6 max-w-6xl font-bold">
          <MaskedWords text={hero.title} startMs={120} className="block" />
          <MaskedWords text={hero.titleAccent} startMs={320} className="block text-ember" />
        </h1>
        <p className="rise mx-auto mt-6 max-w-2xl text-lg text-[#C9BFB2] md:text-xl" style={delay(600)}>
          {hero.subtitle}
        </p>
        <div className="rise mt-10 w-full" style={delay(720)}>
          <ProjectPrompt tone="dark" />
        </div>
        <a href="#manifesto" className="rise mt-auto flex flex-col items-center gap-3 pt-12 text-sm text-[#C9BFB2] hover:text-paper" style={delay(900)}>
          {v2.scrollCue}
          <span aria-hidden="true" className="relative h-12 w-px overflow-hidden bg-paper/15">
            <span className="animate-thread absolute inset-0 bg-ember" />
          </span>
        </a>
      </div>
    </section>
  );
}
