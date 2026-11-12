import { useEffect, useRef, useState, type RefObject } from "react";
import { useReducedMotion } from "motion/react";

const TYPE_MS = 38;
const HOLD_MS = 1800;

/**
 * Types example prompts into an input's placeholder. Writes the DOM attribute directly so the
 * surrounding form doesn't re-render on every character, and stops while off-screen or paused.
 * When paused it shows the whole current example rather than a half-typed word.
 */
export function useTypedPlaceholder(
  ref: RefObject<HTMLInputElement | HTMLTextAreaElement>,
  examples: string[],
  paused: boolean,
) {
  const reduceMotion = useReducedMotion();
  const [onScreen, setOnScreen] = useState(true);
  const progress = useRef({ index: 0, length: 0 });

  useEffect(() => {
    progress.current = { index: 0, length: 0 };
  }, [examples]);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el || examples.length === 0) return;
    const current = () => examples[progress.current.index % examples.length];

    if (reduceMotion) {
      el.placeholder = examples[0];
      return;
    }
    if (paused || !onScreen) {
      el.placeholder = current();
      return;
    }

    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const p = progress.current;
      const text = current();
      if (p.length >= text.length) {
        timer = setTimeout(() => {
          p.index = (p.index + 1) % examples.length;
          p.length = 0;
          tick();
        }, HOLD_MS);
        return;
      }
      p.length += 1;
      el.placeholder = text.slice(0, p.length);
      timer = setTimeout(tick, TYPE_MS);
    };
    tick();
    return () => clearTimeout(timer);
  }, [ref, examples, paused, onScreen, reduceMotion]);
}
