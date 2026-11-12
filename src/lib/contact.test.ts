import { describe, expect, it } from "vitest";
import { buildMailto, createContactSchema, type ContactValues } from "./contact";

const errors = { name: "name", email: "email", message: "message" };
const valid: ContactValues = {
  name: "Ana",
  email: "ana@example.com",
  phone: "",
  services: ["websites"],
  budget: "unsure",
  message: "I need a website for my bakery.",
  botcheck: "",
};

describe("createContactSchema", () => {
  const schema = createContactSchema(errors);

  it("accepts a valid message", () => {
    expect(schema.safeParse(valid).success).toBe(true);
  });

  it("rejects a bad email with the given message", () => {
    const result = schema.safeParse({ ...valid, email: "nope" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("email");
  });

  it("rejects a short message and a missing name", () => {
    const result = schema.safeParse({ ...valid, name: " ", message: "hi" });
    expect(result.error?.issues.map((i) => i.message).sort()).toEqual(["message", "name"]);
  });
});

describe("buildMailto", () => {
  it("encodes subject and body for the TailorWebs inbox", () => {
    const href = buildMailto(valid, { serviceNames: ["Websites"], budgetLabel: "Not sure yet" });
    expect(href.startsWith("mailto:info@tailorwebs.com?subject=")).toBe(true);
    const body = decodeURIComponent(href.split("&body=")[1]);
    expect(body).toContain("Ana <ana@example.com>");
    expect(body).toContain("Websites");
    expect(body).toContain("I need a website for my bakery.");
  });
});
