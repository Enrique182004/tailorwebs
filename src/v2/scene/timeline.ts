/** Scroll progress (0–1 through the pinned scene) where each tailor step begins. */
export const STEP_STARTS = [0, 0.22, 0.45, 0.7] as const;
/** The finished site stays on screen until here, then grows into the next section. */
export const EXPAND_START = 0.88;
/** Pose shown when motion is reduced: finished and published, before the expand. */
export const STATIC_PROGRESS = 0.86;

export function stepAt(progress: number): number {
  let index = 0;
  STEP_STARTS.forEach((start, i) => {
    if (progress >= start) index = i;
  });
  return index;
}
