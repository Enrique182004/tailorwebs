import { useEffect, useState } from "react";

type Tone = "light" | "dark";

/**
 * Reports the tone of the section under the fixed header, read from the nearest [data-tone]
 * ancestor, so the header can flip between light and dark as sections pass beneath it.
 */
export function useSectionTone(headerHeight = 64, fallback: Tone = "light"): Tone {
  const [tone, setTone] = useState<Tone>("dark");

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const stack = document.elementsFromPoint(window.innerWidth / 2, headerHeight / 2);
      const under = stack.find((el) => !el.closest("header") && !el.closest("[data-tone-ignore]"));
      const value = under?.closest<HTMLElement>("[data-tone]")?.dataset.tone;
      setTone(value === "dark" || value === "light" ? value : fallback);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headerHeight, fallback]);

  return tone;
}
