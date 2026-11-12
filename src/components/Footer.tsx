import { siteConfig } from "@/config/site";
import { useLanguage } from "@/hooks/use-language";
import { Wordmark } from "./Header";
import { LanguageToggle } from "./LanguageToggle";
import { StitchLine } from "./motifs/StitchLine";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="overflow-hidden pt-10">
      <StitchLine variant="straight" className="h-6" />
      <div className="container py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-lg text-ink">{t.footer.tagline}</p>
            <p className="mt-1 text-sm text-ink-muted">
              {t.footer.serving} · <a href={`mailto:${siteConfig.email}`} className="underline decoration-rust underline-offset-4">{siteConfig.email}</a>
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <LanguageToggle />
            <p className="text-sm text-ink-muted">© {new Date().getFullYear()} TailorWebs. {t.footer.rights}</p>
          </div>
        </div>
        <p aria-hidden="true" className="mt-10 select-none">
          <Wordmark className="type-display-xl block leading-none" />
        </p>
      </div>
    </footer>
  );
}
