import { describe, expect, it } from "vitest";
import { en } from "./en";
import { es } from "./es";

type Leaf = { path: string; value: unknown };

function leaves(node: unknown, path = ""): Leaf[] {
  if (Array.isArray(node)) return node.flatMap((item, i) => leaves(item, `${path}[${i}]`));
  if (node !== null && typeof node === "object") {
    return Object.entries(node).flatMap(([key, value]) => leaves(value, path ? `${path}.${key}` : key));
  }
  return [{ path, value: node }];
}

describe("dictionaries", () => {
  it("have exactly the same keys and array lengths", () => {
    expect(leaves(es).map((l) => l.path)).toEqual(leaves(en).map((l) => l.path));
  });

  it("have no empty strings", () => {
    const empty = [...leaves(es), ...leaves(en)].filter((l) => typeof l.value !== "string" || l.value.trim() === "");
    expect(empty).toEqual([]);
  });

  it("name all nine services", () => {
    expect(Object.keys(es.services.items)).toHaveLength(9);
  });
});
