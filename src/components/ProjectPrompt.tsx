import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { matchServices } from "@/data/match-services";
import { serviceIcons } from "@/data/services";
import { useContactDraft } from "@/hooks/use-contact-draft";
import { useLanguage } from "@/hooks/use-language";
import { useTypedPlaceholder } from "@/hooks/use-typed-placeholder";
import type { ServiceId } from "@/i18n/types";
import { cn } from "@/lib/utils";

const QUICK_PICKS: ServiceId[] = ["websites", "customApps", "ecommerce", "socialSeo", "itAudits"];

export function ProjectPrompt({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const { t } = useLanguage();
  const { sendToContact } = useContactDraft();
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const [picked, setPicked] = useState<ServiceId[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useTypedPlaceholder(textareaRef, t.hero.promptExamples, focused || text.length > 0);

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    const services = Array.from(new Set([...picked, ...matchServices(text)]));
    sendToContact({ message: text.trim() || undefined, services });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) submit();
  };

  const toggle = (id: ServiceId) =>
    setPicked((current) => (current.includes(id) ? current.filter((v) => v !== id) : [...current, id]));

  return (
    <div className={cn("mx-auto w-full max-w-2xl", className)}>
      <form
        onSubmit={submit}
        className="rounded-2xl border-2 border-dashed border-rust/45 bg-paper p-4 text-left shadow-[0_30px_60px_-35px_rgba(31,26,23,0.45)] transition-colors focus-within:border-rust md:p-5"
      >
        <label htmlFor="project-prompt" className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
          {t.hero.promptLabel}
        </label>
        <textarea
          id="project-prompt"
          rows={3}
          value={text}
          ref={textareaRef}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={onKeyDown}
          className="mt-2 w-full resize-none bg-transparent text-lg leading-snug text-ink placeholder:text-ink-muted/80 focus:outline-none md:text-xl"
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="hidden text-sm text-ink-muted sm:block">{t.hero.promptHint}</p>
          <button
            type="submit"
            className="ml-auto inline-flex min-h-11 items-center gap-2 rounded-xl bg-rust px-4 font-semibold text-white transition-all hover:bg-rust-dark active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {t.hero.promptSubmit}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </form>
      <div className="mt-4" role="group" aria-label={t.hero.promptChipsLabel}>
        <p aria-hidden="true" className={cn("mb-2 text-sm", dark ? "text-[#C9BFB2]" : "text-ink-muted")}>{t.hero.promptChipsLabel}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {QUICK_PICKS.map((id) => {
            const Icon = serviceIcons[id];
            const active = picked.includes(id);
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                onClick={() => toggle(id)}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-xl border px-3.5 text-sm font-medium transition-all hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? dark
                      ? "border-ember bg-ember text-ink"
                      : "border-ink bg-ink text-paper"
                    : "border-chalk bg-paper text-ink hover:border-ink/40",
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {t.services.items[id].name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
