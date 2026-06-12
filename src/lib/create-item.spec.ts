import { describe, expect, it } from "vitest";

import { shouldShowCreateItem } from "./create-item";

describe("shouldShowCreateItem", () => {
  it("returns false when create item is disabled", () => {
    expect(shouldShowCreateItem(false, true, "new", 0)).toBe(false);
    expect(shouldShowCreateItem(undefined, true, "new", 0)).toBe(false);
  });

  it("returns false when search is not enabled", () => {
    expect(shouldShowCreateItem(true, false, "new", 0)).toBe(false);
  });

  it("returns false when the search query is empty", () => {
    expect(shouldShowCreateItem(true, true, "", 0)).toBe(false);
    expect(shouldShowCreateItem(true, true, "   ", 0)).toBe(false);
  });

  it("shows create item when enabled and there are no matches", () => {
    expect(shouldShowCreateItem(true, true, "new", 0)).toBe(true);
  });

  it("hides create item when enabled and matches remain", () => {
    expect(shouldShowCreateItem(true, true, "java", 1)).toBe(false);
  });

  it("always shows create item when mode is always and search is non-empty", () => {
    expect(shouldShowCreateItem("always", true, "java", 1)).toBe(true);
    expect(shouldShowCreateItem("always", true, "new", 0)).toBe(true);
  });
});
