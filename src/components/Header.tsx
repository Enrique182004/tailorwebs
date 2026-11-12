import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";
import { LanguageToggle } from "./LanguageToggle";

export function Wordmark({ className, accentClassName = "text-rust" }: { className?: string; accentClassName?: string }) {
  return (
    <span className={cn("font-display font-bold tracking-tight text-ink", className ?? "text-2xl")}>
      Tailor<span className={accentClassName}>Webs</span>
    </span>
  );
}

export function Header({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { t } = useLanguage();
  const dark = tone === "dark";
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
        scrolled || open
          ? cn("border-b border-dashed backdrop-blur", dark ? "border-paper/20 bg-ink/85" : "border-ink/20 bg-cream/90")
          : "border-b border-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-4">
        <a href="#top" aria-label="TailorWebs" className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Wordmark className={cn("text-2xl", dark && "text-paper")} accentClassName={dark ? "text-ember" : "text-rust"} />
        </a>
        <nav aria-label={t.nav.primary} className="hidden lg:block">
          <ul className={cn("flex items-center gap-8 text-sm font-medium", dark ? "text-[#C9BFB2]" : "text-ink-muted")}>
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={cn("transition-colors", dark ? "hover:text-paper" : "hover:text-ink")}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <a href="#contact" className={cn("hidden min-h-11 items-center rounded-xl px-4 text-sm font-semibold transition-all hover:bg-rust hover:text-white active:scale-95 sm:inline-flex", dark ? "bg-paper text-ink" : "bg-ink text-paper")}>
            {t.nav.cta}
          </a>
          <button
            ref={toggleRef}
            type="button"
            className={cn("flex h-11 w-11 items-center justify-center rounded-xl lg:hidden", dark ? "text-paper" : "text-ink")}
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
        <nav id="mobile-nav" aria-label={t.nav.primary} data-lenis-prevent className="max-h-[calc(100dvh-4rem)] overflow-y-auto lg:hidden">
          <ul className="container flex flex-col pb-4">
            {[...links, { href: "#contact", label: t.nav.cta }].map((link) => (
              <li key={link.href} className={cn("border-b border-dashed last:border-0", dark ? "border-paper/15" : "border-ink/15")}>
                <a href={link.href} onClick={() => setOpen(false)} className={cn("block py-3.5 font-display text-2xl font-semibold", dark ? "text-paper" : "text-ink")}>
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
