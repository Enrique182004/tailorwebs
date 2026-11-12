import { describe, expect, it } from "vitest";
import { stepAt } from "./timeline";

describe("stepAt", () => {
  it("maps scroll progress to the active tailor step", () => {
    expect(stepAt(0)).toBe(0);
    expect(stepAt(0.21)).toBe(0);
    expect(stepAt(0.22)).toBe(1);
    expect(stepAt(0.5)).toBe(2);
    expect(stepAt(0.95)).toBe(3);
  });
});
