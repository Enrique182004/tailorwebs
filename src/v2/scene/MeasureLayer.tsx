import { motion, useTransform, type MotionValue } from "motion/react";

const GUIDES = [
  { axis: "h", pos: "12%" },
  { axis: "h", pos: "62%" },
  { axis: "v", pos: "4%" },
  { axis: "v", pos: "54%" },
  { axis: "v", pos: "96%" },
] as const;

function Guide({ axis, pos, index, progress }: { axis: "h" | "v"; pos: string; index: number; progress: MotionValue<number> }) {
  const grow = useTransform(progress, [0.02 + index * 0.025, 0.1 + index * 0.025], [0, 1]);
  return axis === "h" ? (
    <motion.div className="absolute inset-x-0 origin-left border-t border-dashed border-ember/50" style={{ top: pos, scaleX: grow }} />
  ) : (
    <motion.div className="absolute inset-y-0 origin-top border-l border-dashed border-ember/50" style={{ left: pos, scaleY: grow }} />
  );
}

export function MeasureLayer({ progress }: { progress: MotionValue<number> }) {
  const fade = useTransform(progress, [0.5, 0.6], [1, 0]);
  const width = useTransform(progress, [0.02, 0.18], [0, 1440]);
  const rounded = useTransform(width, (v) => Math.round(v));
  const tapeX = useTransform(progress, [0, 0.14], ["-110%", "0%"]);
  const tapeFade = useTransform(progress, [0.2, 0.28], [1, 0]);

  return (
    <motion.div className="absolute inset-0" style={{ opacity: fade }}>
      {GUIDES.map((g, i) => (
        <Guide key={`${g.axis}-${g.pos}`} axis={g.axis} pos={g.pos} index={i} progress={progress} />
      ))}
      <p className="absolute right-[4%] top-[2.5%] font-mono text-[10px] text-ember md:text-xs">
        <motion.span>{rounded}</motion.span> × 900
      </p>
      <motion.div
        className="tape-ticks-light absolute bottom-[3%] left-[4%] right-[4%] h-[6%] rounded-sm bg-paper/10"
        style={{ x: tapeX, opacity: tapeFade }}
      />
    </motion.div>
  );
}
