import { describe, expect, it } from "vitest";

import {
  createGenericFilterByAdapter,
  createOptionMappers,
  findSourceOptionByValue,
  normalizeSelectOptions,
} from "./normalize-options";

describe("normalize-options", () => {
  const customOptions = [
    { id: "France", key: "fr" },
    { id: "USA", key: "us", disabled: true },
  ] as const;

  const mappers = createOptionMappers<typeof customOptions[number], string>({
    getOptionLabel: (option) => option.id,
    getOptionValue: (option) => option.key,
  });

  it("normalizes generic options with custom mappers", () => {
    expect(normalizeSelectOptions([...customOptions], mappers)).toEqual([
      { label: "France", value: "fr", disabled: undefined },
      { label: "USA", value: "us", disabled: true },
    ]);
  });

  it("adapts a generic filterBy to registered options", () => {
    const filterBy = createGenericFilterByAdapter(
      [...customOptions],
      mappers,
      (option, _label, search) => option.id.toLowerCase().includes(search.toLowerCase()),
    );

    expect(filterBy({ label: "France", value: "fr", disabled: false, id: "select-option-1" }, "fra")).toBe(true);
    expect(filterBy({ label: "USA", value: "us", disabled: false, id: "select-option-2" }, "fra")).toBe(false);
  });

  it("finds the source option from a normalized value", () => {
    expect(findSourceOptionByValue([...customOptions], mappers, "us")).toEqual(customOptions[1]);
  });
});
