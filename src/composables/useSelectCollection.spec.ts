import { describe, expect, it } from "vitest";
import { ref } from "vue";

import {
  findNextEnabledOption,
  getEnabledOptions,
  useSelectCollection,
} from "./useSelectCollection";

describe("useSelectCollection", () => {
  it("merges prop options and declarative registrations by value", () => {
    const propOptions = ref([
      { label: "JavaScript", value: "js" },
      { label: "TypeScript", value: "ts" },
    ]);

    const collection = useSelectCollection({
      propOptions: () => propOptions.value,
    });

    collection.register({
      id: "declarative-rust",
      value: "rs",
      label: "Rust",
      disabled: false,
    });

    collection.register({
      id: "declarative-ts-duplicate",
      value: "ts",
      label: "TS duplicate",
      disabled: false,
    });

    const values = collection.allOptions.value.map((option) => option.value);

    expect(values).toEqual(["js", "ts", "rs"]);
    expect(collection.allOptions.value.find((option) => option.value === "ts")?.label).toBe("TypeScript");
    expect(collection.allOptions.value.find((option) => option.value === "ts")?.id).toBe("declarative-ts-duplicate");
  });

  it("prefers prop disabled state over stale declarative registrations", () => {
    const propOptions = ref([
      { label: "Option 1", value: "1", disabled: true },
      { label: "Option 2", value: "2", disabled: false },
    ]);

    const collection = useSelectCollection({
      propOptions: () => propOptions.value,
    });

    collection.register({
      id: "declarative-1",
      value: "1",
      label: "Option 1",
      disabled: false,
    });

    expect(collection.allOptions.value.find((option) => option.value === "1")?.disabled).toBe(true);

    propOptions.value = [
      { label: "Option 1", value: "1", disabled: false },
      { label: "Option 2", value: "2", disabled: true },
    ];

    expect(collection.allOptions.value.find((option) => option.value === "1")?.disabled).toBe(false);
    expect(collection.allOptions.value.find((option) => option.value === "2")?.disabled).toBe(true);
  });

  it("unregisters declarative options on unmount", () => {
    const collection = useSelectCollection({
      propOptions: () => [],
    });

    collection.register({
      id: "option-1",
      value: "js",
      label: "JavaScript",
      disabled: false,
    });

    expect(collection.allOptions.value).toHaveLength(1);

    collection.unregister("option-1");

    expect(collection.allOptions.value).toHaveLength(0);
  });

  it("updates declarative options when re-registered with the same id", () => {
    const collection = useSelectCollection({
      propOptions: () => [],
    });

    collection.register({
      id: "option-1",
      value: "js",
      label: "JavaScript",
      disabled: false,
    });

    collection.register({
      id: "option-1",
      value: "js",
      label: "JavaScript",
      disabled: true,
    });

    expect(collection.allOptions.value).toHaveLength(1);
    expect(collection.allOptions.value[0]?.disabled).toBe(true);
  });

  it("keeps declarative metadata when no matching options prop exists", () => {
    const collection = useSelectCollection({
      propOptions: () => [],
    });

    collection.register({
      id: "declarative-only",
      value: "custom",
      label: "Custom label",
      disabled: true,
    });

    const option = collection.allOptions.value.find((entry) => entry.value === "custom");

    expect(option?.label).toBe("Custom label");
    expect(option?.disabled).toBe(true);
    expect(option?.id).toBe("declarative-only");
  });
});

describe("collection navigation helpers", () => {
  const options = [
    { id: "1", value: "a", label: "A", disabled: false },
    { id: "2", value: "b", label: "B", disabled: true },
    { id: "3", value: "c", label: "C", disabled: false },
  ];

  it("returns only enabled options", () => {
    expect(getEnabledOptions(options).map((option) => option.value)).toEqual(["a", "c"]);
  });

  it("moves to the next enabled option and skips disabled entries", () => {
    expect(findNextEnabledOption(options, "a", 1)?.value).toBe("c");
    expect(findNextEnabledOption(options, "c", 1)?.value).toBe("a");
  });

  it("moves to the previous enabled option and skips disabled entries", () => {
    expect(findNextEnabledOption(options, "c", -1)?.value).toBe("a");
    expect(findNextEnabledOption(options, "a", -1)?.value).toBe("c");
  });

  it("starts from the first or last enabled option when nothing is active", () => {
    expect(findNextEnabledOption(options, null, 1)?.value).toBe("a");
    expect(findNextEnabledOption(options, null, -1)?.value).toBe("c");
  });
});
