import { Check } from "lucide-react";
import { motion, useTransform, type MotionValue } from "motion/react";

function Needle() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 md:h-6 md:w-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M3 21 17 7" />
      <ellipse cx="19" cy="5" rx="2.6" ry="1.4" transform="rotate(-45 19 5)" />
    </svg>
  );
}

function Seam({ top, range, progress }: { top: string; range: [number, number]; progress: MotionValue<number> }) {
  const clipPath = useTransform(progress, range, ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]);
  return <motion.div className="absolute left-[4%] right-[4%] border-t-2 border-dashed border-rust" style={{ top, clipPath }} />;
}

/** Sewing seams + needle, and the "Published" tag. Lives inside the browser canvas. */
export function FinishLayer({ progress, published }: { progress: MotionValue<number>; published: string }) {
  const needleLeft = useTransform(progress, [0.58, 0.68], ["3%", "95%"]);
  const needleOpacity = useTransform(progress, [0.5, 0.52, 0.66, 0.68], [0, 1, 1, 0]);
  const needleY = useTransform(progress, (v) => Math.sin(v * 160) * 4);
  const badge = useTransform(progress, [0.8, 0.84], [0, 1]);

  return (
    <>
      <Seam top="14%" range={[0.5, 0.6]} progress={progress} />
      <Seam top="62.5%" range={[0.58, 0.68]} progress={progress} />
      <motion.span className="absolute top-[58%] z-10 text-rust" style={{ left: needleLeft, opacity: needleOpacity, y: needleY }}>
        <Needle />
      </motion.span>
      <motion.span
        className="absolute right-[4%] top-[2%] z-10 inline-flex items-center gap-1 rounded-md bg-pine px-2 py-0.5 text-[10px] font-semibold text-white md:text-xs"
        style={{ scale: badge, opacity: badge }}
      >
        <Check className="h-3 w-3" aria-hidden="true" /> {published}
      </motion.span>
    </>
  );
}

/** The same design on a phone, sliding in during the "fit" step. */
export function PhoneFit({ progress }: { progress: MotionValue<number> }) {
  const x = useTransform(progress, [0.7, 0.8], ["160%", "0%"]);
  const opacity = useTransform(progress, [0.7, 0.74], [0, 1]);
  const rotate = useTransform(progress, [0.7, 0.8], [12, -4]);

  return (
    <motion.div
      className="absolute -bottom-[10%] -right-[2%] w-[23%] min-w-[64px]"
      style={{ x, opacity, rotate }}
    >
      <div className="flex aspect-[9/19] flex-col gap-[5%] rounded-[1.1rem] border-[5px] border-[#3a322d] bg-cream p-[8%] shadow-2xl">
        <span className="h-[5%] rounded-sm bg-ink" />
        <span className="mt-[4%] h-[4%] w-[85%] rounded-full bg-ink" />
        <span className="h-[4%] w-[65%] rounded-full bg-rust" />
        <span className="h-[22%] rounded-md bg-rust" />
        <span className="h-[12%] rounded-md bg-cobalt" />
        <span className="h-[12%] rounded-md bg-pine" />
        <span className="h-[12%] rounded-md bg-ink" />
      </div>
    </motion.div>
  );
}
