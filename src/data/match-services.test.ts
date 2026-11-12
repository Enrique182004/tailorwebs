import { describe, expect, it } from "vitest";
import { matchServices } from "./match-services";

describe("matchServices", () => {
  it("finds a website and online ordering in Spanish", () => {
    expect(matchServices("Quiero una página con menú y pedidos en línea para mi taquería")).toEqual([
      "websites",
      "ecommerce",
    ]);
  });

  it("finds inventory and a store", () => {
    expect(matchServices("Necesito controlar el inventario de mi tienda desde el celular")).toEqual([
      "ecommerce",
      "inventory",
    ]);
  });

  it("does not treat 'redes sociales' as network work", () => {
    expect(matchServices("Quiero crecer en redes sociales y aparecer en Google")).toEqual(["socialSeo"]);
  });

  it("finds network infrastructure and a network audit", () => {
    expect(matchServices("La red de mi oficina es lenta y quiero una auditoría")).toEqual([
      "networkInfra",
      "networkAudits",
    ]);
  });

  it("routes a generic audit to IT unless the text is about the network", () => {
    expect(matchServices("Quiero una auditoría de TI")).toEqual(["itAudits"]);
    expect(matchServices("I want an audit of our office")).toEqual(["itAudits"]);
  });

  it("matches singular device words", () => {
    expect(matchServices("mi computadora está lenta")).toEqual(["itAudits"]);
    expect(matchServices("my computer is slow")).toEqual(["itAudits"]);
  });

  it("works in English", () => {
    expect(matchServices("I need a website and Instagram ads")).toEqual(["websites", "socialSeo", "marketing"]);
  });

  it("returns nothing for empty or unrelated text", () => {
    expect(matchServices("")).toEqual([]);
    expect(matchServices("hola")).toEqual([]);
  });
});
