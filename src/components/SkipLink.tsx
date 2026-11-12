import { useLanguage } from "@/hooks/use-language";

export function SkipLink() {
  const { t } = useLanguage();
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-rust focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
    >
      {t.nav.skip}
    </a>
  );
}
