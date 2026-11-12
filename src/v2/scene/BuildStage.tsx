import { motion, useTransform, type MotionValue } from "motion/react";
import { EXPAND_START } from "./timeline";
import { FinishLayer, PhoneFit } from "./FinishLayer";
import { MeasureLayer } from "./MeasureLayer";
import { StageBlocks } from "./StageBlocks";

/** A browser window in which a website is measured, cut, sewn and fitted as `progress` goes 0 → 1. */
export function BuildStage({ progress, published }: { progress: MotionValue<number>; published: string }) {
  const cream = useTransform(progress, [0.45, 0.56], [0, 1]);
  const scale = useTransform(progress, [EXPAND_START - 0.02, 1], [1, 1.06]);

  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-3xl">
      <motion.div className="overflow-hidden rounded-xl border border-paper/15 bg-[#28221E] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]" style={{ scale }}>
        <div className="flex items-center gap-1.5 border-b border-paper/10 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#E9A58F]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-paper/30" />
          <span className="h-2.5 w-2.5 rounded-full bg-paper/30" />
          <span className="ml-3 rounded-md bg-paper/10 px-3 py-0.5 font-mono text-[10px] text-[#C9BFB2]">tunegocio.com</span>
        </div>
        <div className="relative aspect-[16/10]">
          <motion.div className="absolute inset-0 bg-cream" style={{ opacity: cream }} />
          <MeasureLayer progress={progress} />
          <StageBlocks progress={progress} />
          <FinishLayer progress={progress} published={published} />
        </div>
      </motion.div>
      <PhoneFit progress={progress} />
    </div>
  );
}
