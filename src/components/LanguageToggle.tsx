import { useLanguage } from "@/hooks/use-language";
import type { Language } from "@/i18n/types";
import { cn } from "@/lib/utils";

const OPTIONS: Language[] = ["es", "en"];

export function LanguageToggle({ className }: { className?: string }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div role="group" aria-label={t.nav.language} className={cn("inline-flex rounded-full border border-chalk bg-paper p-0.5", className)}>
      {OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          lang={option}
          aria-pressed={language === option}
          onClick={() => setLanguage(option)}
          className={cn(
            "flex h-9 min-w-11 items-center justify-center rounded-full px-3 text-xs font-semibold uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            language === option ? "bg-ink text-paper" : "text-ink-muted hover:text-ink",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
