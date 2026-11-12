import type { ReactNode } from "react";
import { Scissors } from "lucide-react";
import { motion, useTransform, type MotionValue } from "motion/react";

const bar = (w: string, color: string) => <span className="block h-[14%] rounded-full" style={{ width: w, background: color }} />;

const BLOCKS: { x: number; y: number; w: number; h: number; body: ReactNode }[] = [
  { x: 4, y: 4, w: 92, h: 7, body: <div className="flex h-full items-center justify-between bg-ink px-[3%]"><span className="h-[40%] w-[16%] rounded-sm bg-paper" /><span className="h-[50%] w-[12%] rounded-full bg-rust" /></div> },
  { x: 4, y: 18, w: 48, h: 28, body: <div className="flex h-full flex-col justify-center gap-[10%]">{bar("95%", "#1F1A17")}{bar("70%", "#B5482C")}{bar("55%", "#6B5E52")}</div> },
  { x: 58, y: 18, w: 38, h: 40, body: <div className="relative h-full bg-rust"><span className="absolute left-[18%] top-[20%] h-[45%] w-[38%] rounded-full bg-white/25" /><span className="absolute bottom-[15%] right-[12%] h-[30%] w-[40%] rounded-md bg-white/20" /></div> },
  { x: 4, y: 50, w: 20, h: 8, body: <div className="h-full rounded-full bg-rust" /> },
  { x: 4, y: 67, w: 29, h: 27, body: <div className="flex h-full flex-col justify-end gap-[8%] bg-cobalt p-[8%]">{bar("70%", "#FFFFFF")}{bar("45%", "#DDE1FB")}</div> },
  { x: 35.5, y: 67, w: 29, h: 27, body: <div className="flex h-full flex-col justify-end gap-[8%] bg-pine p-[8%]">{bar("60%", "#FFFFFF")}{bar("40%", "#D5E8E0")}</div> },
  { x: 67, y: 67, w: 29, h: 27, body: <div className="flex h-full flex-col justify-end gap-[8%] bg-ink p-[8%]">{bar("65%", "#FBF8F3")}{bar("35%", "#E9A58F")}</div> },
];

function Block({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const { x, y, w, h, body } = BLOCKS[index];
  const cutStart = 0.24 + index * 0.025;
  const sewStart = 0.47 + index * 0.022;
  const outline = useTransform(progress, [cutStart, cutStart + 0.04], [0, 1]);
  const scale = useTransform(progress, [cutStart, cutStart + 0.05], [0.85, 1]);
  const fill = useTransform(progress, [sewStart, sewStart + 0.05], [0, 1]);

  return (
    <motion.div
      className="absolute rounded-[3px] border border-dashed border-ember/70"
      style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%`, opacity: outline, scale }}
    >
      <motion.div className="absolute inset-0 overflow-hidden rounded-[3px]" style={{ opacity: fill }}>
        {body}
      </motion.div>
    </motion.div>
  );
}

export function StageBlocks({ progress }: { progress: MotionValue<number> }) {
  const scissorsLeft = useTransform(progress, [0.22, 0.45], ["2%", "94%"]);
  const scissorsOpacity = useTransform(progress, [0.22, 0.24, 0.43, 0.45], [0, 1, 1, 0]);
  const snip = useTransform(progress, (v) => Math.sin(v * 90) * 14);

  return (
    <>
      {BLOCKS.map((_, i) => (
        <Block key={i} index={i} progress={progress} />
      ))}
      <motion.span className="absolute top-[9.5%] z-10 text-ember" style={{ left: scissorsLeft, opacity: scissorsOpacity, rotate: snip }}>
        <Scissors className="h-4 w-4 md:h-6 md:w-6" aria-hidden="true" />
      </motion.span>
    </>
  );
}
