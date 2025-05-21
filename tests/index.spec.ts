import type { Option } from "../src/index";
import { describe, expect, it } from "vitest";
import DefaultExport from "../src/index";
import VueSelect from "../src/Select.vue";

describe("index.ts exports", () => {
  it("should export VueSelect as the default export", () => {
    expect(DefaultExport).toBe(VueSelect);
  });

  it("should export the Option type", () => {
    const option: Option<string> = {
      label: "Test Option",
      value: "test",
      disabled: false,
    };

    // If this compiles, it confirms the Option type is exported correctly
    expect(option.label).toBe("Test Option");
    expect(option.value).toBe("test");
    expect(option.disabled).toBe(false);
  });
});
