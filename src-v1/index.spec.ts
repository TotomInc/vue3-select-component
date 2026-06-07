import type { SelectModelValue, SelectOptionData } from "./index";

import { describe, expect, it } from "vitest";
import {
  Select,

  SelectOption,

  SelectRoot,
} from "./index";

describe("src-v1 internal exports", () => {
  it("exports the assembled Select and primitive components", () => {
    expect(Select).toBeTruthy();
    expect(SelectRoot).toBeTruthy();
    expect(SelectOption).toBeTruthy();
  });

  it("exports v1 option and model types", () => {
    const option: SelectOptionData<string> = {
      label: "TypeScript",
      value: "ts",
    };

    const model: SelectModelValue<string> = option.value;

    expect(option.label).toBe("TypeScript");
    expect(model).toBe("ts");
  });
});
