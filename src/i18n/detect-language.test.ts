import { describe, expect, it } from "vitest";
import { detectLanguage } from "./detect-language";

describe("detectLanguage", () => {
  it("uses a valid saved choice first", () => {
    expect(detectLanguage("en", ["es-MX"])).toBe("en");
    expect(detectLanguage("es", ["en-US"])).toBe("es");
  });

  it("ignores an invalid saved value", () => {
    expect(detectLanguage("fr", ["es-US"])).toBe("es");
  });

  it("picks Spanish when any browser language is Spanish", () => {
    expect(detectLanguage(null, ["en-US", "es-MX"])).toBe("es");
  });

  it("defaults to English otherwise", () => {
    expect(detectLanguage(null, ["de-DE"])).toBe("en");
    expect(detectLanguage(null, [])).toBe("en");
  });
});
