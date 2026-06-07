import type { ComponentPublicInstance } from "vue";
import { describe, expect, it } from "vitest";

import { resolveHTMLElement } from "./dom";

describe("resolveHTMLElement", () => {
  it("returns the element when given an HTMLElement", () => {
    const element = document.createElement("div");

    expect(resolveHTMLElement(element)).toBe(element);
  });

  it("returns the root element from a component instance", () => {
    const element = document.createElement("button");
    const component = { $el: element } as ComponentPublicInstance;

    expect(resolveHTMLElement(component)).toBe(element);
  });

  it("returns null for unsupported nodes", () => {
    expect(resolveHTMLElement(null)).toBeNull();
    expect(resolveHTMLElement({} as ComponentPublicInstance)).toBeNull();
  });
});
