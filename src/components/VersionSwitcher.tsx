import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";

interface VersionSwitcherProps {
  current: 1 | 2;
}

/** Floating V1 · V2 toggle for presenting both designs. Remove once one version is chosen. */
export function VersionSwitcher({ current }: VersionSwitcherProps) {
  const { t } = useLanguage();
  const base = import.meta.env.BASE_URL;
  const versions = [
    { n: 1, href: base },
    { n: 2, href: `${base}v2/` },
  ] as const;

  return (
    <nav
      aria-label={t.v2.version}
      className="fixed bottom-5 left-5 z-[60] flex items-center gap-1 rounded-full border border-ink/15 bg-paper/90 p-1 shadow-lg backdrop-blur"
    >
      {versions.map(({ n, href }) => (
        <a
          key={n}
          href={href}
          aria-current={current === n ? "page" : undefined}
          aria-label={`V${n} (${t.v2.version} ${n})`}
          className={cn(
            "flex h-10 min-w-11 items-center justify-center rounded-full px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            current === n ? "bg-ink text-paper" : "text-ink-muted hover:text-ink",
          )}
        >
          V{n}
        </a>
      ))}
    </nav>
  );
}
