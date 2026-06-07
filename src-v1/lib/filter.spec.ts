import type { RegisteredOption } from "@v1/composables/useSelectCollection";

import { describe, expect, it } from "vitest";

import { defaultSelectFilterBy, filterOptions } from "./filter";

const options: RegisteredOption<string>[] = [
  { id: "1", value: "js", label: "JavaScript", disabled: false },
  { id: "2", value: "ts", label: "TypeScript", disabled: false },
  { id: "3", value: "py", label: "Python", disabled: false },
];

describe("filterOptions", () => {
  it("returns all options when search is empty", () => {
    expect(filterOptions(options, "")).toHaveLength(3);
    expect(filterOptions(options, "   ")).toHaveLength(3);
  });

  it("filters options by label using the default filter", () => {
    const filtered = filterOptions(options, "script", defaultSelectFilterBy);

    expect(filtered.map((option) => option.value)).toEqual(["js", "ts"]);
  });

  it("supports a custom filter function", () => {
    const filtered = filterOptions(options, "ts", (option) => option.value === "ts");

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.value).toBe("ts");
  });
});
