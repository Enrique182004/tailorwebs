import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "motion/react";

/**
 * Inertial wheel scrolling (Lenis) for mouse/trackpad users. Off for touch and reduced motion.
 * In-page links are handled here so focus follows the link like a native jump. Lenis already honours
 * the page's CSS scroll-padding-top (header clearance); pinned sections ([data-pin]) cancel it so the
 * pinned frame starts exactly at the top.
 */
export function useSmoothScroll() {
  const reduceMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reduceMotion || window.matchMedia("(pointer: coarse)").matches) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1 });
    lenisRef.current = lenis;

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href^="#"]');
      const id = link ? decodeURIComponent(link.hash.slice(1)) : "";
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      event.preventDefault();
      const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      lenis.scrollTo(target, { offset: target.hasAttribute("data-pin") ? padding : 0 });
      history.pushState(null, "", `#${id}`);
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduceMotion]);

  return lenisRef;
}
