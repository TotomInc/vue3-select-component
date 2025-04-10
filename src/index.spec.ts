import type { Option } from "./index";
import { describe, expect, it } from "vitest";
import DefaultExport from "./index";
import VueSelect from "./Select.vue";

describe("index.ts exports", () => {
  it("should export VueSelect as the default export", () => {
    // Verify that the default export from index.ts is the same as importing VueSelect directly
    expect(DefaultExport).toBe(VueSelect);
  });

  it("should export the Option type", () => {
    // Create an object that matches the Option type to verify the type is exported correctly
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
