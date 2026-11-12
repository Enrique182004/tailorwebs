import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";
import { LanguageToggle } from "./LanguageToggle";

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-display font-bold tracking-tight text-ink", className ?? "text-2xl")}>
      Tailor<span className="text-rust">Webs</span>
    </span>
  );
}

export function Header() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const links = [
    { href: "#work", label: t.showcase.eyebrow },
    { href: "#services", label: t.nav.services },
    { href: "#process", label: t.nav.process },
    { href: "#why", label: t.nav.why },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      // The focused menu link unmounts; without this, focus falls back to <body>.
      toggleRef.current?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open ? "border-b border-dashed border-ink/20 bg-cream/90 backdrop-blur" : "border-b border-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-4">
        <a href="#top" aria-label="TailorWebs" className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Wordmark />
        </a>
        <nav aria-label={t.nav.primary} className="hidden lg:block">
          <ul className="flex items-center gap-8 text-sm font-medium text-ink-muted">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="transition-colors hover:text-ink">{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <a href="#contact" className="hidden min-h-11 items-center rounded-xl bg-ink px-4 text-sm font-semibold text-paper transition-all hover:bg-rust active:scale-95 sm:inline-flex">
            {t.nav.cta}
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-xl text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label={t.nav.primary} className="max-h-[calc(100dvh-4rem)] overflow-y-auto lg:hidden">
          <ul className="container flex flex-col pb-4">
            {[...links, { href: "#contact", label: t.nav.cta }].map((link) => (
              <li key={link.href} className="border-b border-dashed border-ink/15 last:border-0">
                <a href={link.href} onClick={() => setOpen(false)} className="block py-3.5 font-display text-2xl font-semibold text-ink">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
