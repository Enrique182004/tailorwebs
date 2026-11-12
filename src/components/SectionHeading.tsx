import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  id: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  tone?: "light" | "dark";
  className?: string;
}

export function SectionHeading({ id, eyebrow, title, subtitle, tone = "light", className }: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <div className={cn("max-w-3xl", className)}>
      <p className={cn("flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em]", dark ? "text-[#E9A58F]" : "text-rust")}>
        <span aria-hidden="true" className="w-8 border-t-2 border-dashed border-current" />
        {eyebrow}
      </p>
      <h2 id={id} className={cn("type-display-lg mt-4 font-bold", dark ? "text-paper" : "text-ink")}>{title}</h2>
      {subtitle && <p className={cn("mt-5 max-w-2xl text-lg", dark ? "text-[#C9BFB2]" : "text-ink-muted")}>{subtitle}</p>}
    </div>
  );
}
