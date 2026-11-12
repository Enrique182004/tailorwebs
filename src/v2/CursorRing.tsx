import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useMediaQuery } from "./hooks/use-media-query";

const INTERACTIVE = "a, button, textarea, input, select, label, [role=button]";

/** Decorative trailing ring for mouse users. The native cursor stays visible. */
export function CursorRing() {
  const finePointer = useMediaQuery("(pointer: fine)");
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const [hovering, setHovering] = useState(false);
  const enabled = finePointer && !reduceMotion;

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHovering(Boolean((e.target as Element | null)?.closest?.(INTERACTIVE)));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, x, y]);

  if (!enabled) return null;
  return (
    <motion.div
      aria-hidden="true"
      data-tone-ignore
      className="pointer-events-none fixed left-0 top-0 z-[70] rounded-full border-2 border-white mix-blend-difference"
      style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
      animate={{ width: hovering ? 56 : 28, height: hovering ? 56 : 28 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    />
  );
}
