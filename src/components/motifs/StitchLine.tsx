import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const PATHS = {
  wave: "M0 60 C 200 10, 400 110, 600 60 S 1000 10, 1200 60",
  straight: "M0 60 L 1200 60",
} as const;

interface StitchLineProps {
  variant?: keyof typeof PATHS;
  trigger?: "mount" | "view";
  className?: string;
}

export function StitchLine({ variant = "wave", trigger = "view", className }: StitchLineProps) {
  const maskId = `stitch-${useId().replace(/:/g, "")}`;
  const reduceMotion = useReducedMotion();
  const d = PATHS[variant];
  const drawn = { pathLength: 1 };
  const animation = reduceMotion
    ? { initial: drawn }
    : trigger === "mount"
      ? { initial: { pathLength: 0 }, animate: drawn }
      : { initial: { pathLength: 0 }, whileInView: drawn, viewport: { once: true } };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className={cn("h-12 w-full text-rust", className)}
    >
      <defs>
        <mask id={maskId}>
          <motion.path
            d={d}
            fill="none"
            stroke="white"
            strokeWidth={10}
            transition={{ duration: 1.6, ease: "easeInOut" }}
            {...animation}
          />
        </mask>
      </defs>
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeDasharray="12 9"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        mask={`url(#${maskId})`}
      />
    </svg>
  );
}
