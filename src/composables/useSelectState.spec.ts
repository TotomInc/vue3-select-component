import { describe, expect, it, vi } from "vitest";
import { effectScope, ref } from "vue";

import { useSelectCollection } from "./useSelectCollection";
import { useSelectState } from "./useSelectState";

function runInScope<T>(fn: () => T) {
  const scope = effectScope();
  const result = scope.run(fn);

  scope.stop();

  return result as T;
}

describe("useSelectState", () => {
  it("normalizes selected options from the merged collection", () => {
    runInScope(() => {
      const modelValue = ref<string | null>("ts");
      const collection = useSelectCollection<string>({
        propOptions: () => [
          { label: "JavaScript", value: "js" },
          { label: "TypeScript", value: "ts" },
        ],
      });

      const { context } = useSelectState({
        modelValue,
        multiple: ref(false),
        disabled: ref(false),
        searchable: ref(false),
        clearable: ref(false),
        loading: ref(false),
        closeOnSelect: ref(true),
        propOptions: ref([]),
        filterBy: ref((option, search) => option.label.toLowerCase().includes(search.toLowerCase())),
        collection,
      });

      expect(context.selectedOptions.value.map((option) => option.value)).toEqual(["ts"]);
    });
  });

  it("resets the active option when filtering removes it from the navigable set", () => {
    runInScope(() => {
      const modelValue = ref<string | null>(null);
      const collection = useSelectCollection<string>({
        propOptions: () => [
          { label: "JavaScript", value: "js" },
          { label: "TypeScript", value: "ts" },
        ],
      });

      const { context } = useSelectState({
        modelValue,
        multiple: ref(false),
        disabled: ref(false),
        searchable: ref(true),
        clearable: ref(false),
        loading: ref(false),
        closeOnSelect: ref(true),
        propOptions: ref([]),
        filterBy: ref((option, search) => option.label.toLowerCase().includes(search.toLowerCase())),
        collection,
      });

      context.open();
      context.setActiveOptionValue("ts");
      context.searchValue.value = "java";

      expect(context.activeOptionValue.value).toBe("js");
      expect(context.filteredOptions.value.map((option) => option.value)).toEqual(["js"]);
    });
  });

  it("toggles values in multi-select mode without closing", () => {
    runInScope(() => {
      const modelValue = ref<string[]>([]);
      const collection = useSelectCollection<string>({
        propOptions: () => [
          { label: "JavaScript", value: "js" },
          { label: "TypeScript", value: "ts" },
        ],
      });

      const { context } = useSelectState({
        modelValue,
        multiple: ref(true),
        disabled: ref(false),
        searchable: ref(false),
        clearable: ref(false),
        loading: ref(false),
        closeOnSelect: ref(false),
        propOptions: ref([]),
        filterBy: ref((option, search) => option.label.toLowerCase().includes(search.toLowerCase())),
        collection,
      });

      context.open();
      context.select("js");
      context.select("ts");
      context.select("js");

      expect(modelValue.value).toEqual(["ts"]);
      expect(context.isOpen.value).toBe(true);
    });
  });

  it("closes on single-select by default when closeOnSelect is null", () => {
    runInScope(() => {
      const modelValue = ref<string | null>(null);
      const collection = useSelectCollection<string>({
        propOptions: () => [
          { label: "JavaScript", value: "js" },
          { label: "TypeScript", value: "ts" },
        ],
      });

      const { context } = useSelectState({
        modelValue,
        multiple: ref(false),
        disabled: ref(false),
        searchable: ref(false),
        clearable: ref(false),
        loading: ref(false),
        closeOnSelect: ref(null),
        propOptions: ref([]),
        filterBy: ref((option, search) => option.label.toLowerCase().includes(search.toLowerCase())),
        collection,
      });

      context.open();
      context.select("js");

      expect(modelValue.value).toBe("js");
      expect(context.isOpen.value).toBe(false);
    });
  });

  it("stays open on multi-select by default when closeOnSelect is null", () => {
    runInScope(() => {
      const modelValue = ref<string[]>([]);
      const collection = useSelectCollection<string>({
        propOptions: () => [
          { label: "JavaScript", value: "js" },
          { label: "TypeScript", value: "ts" },
        ],
      });

      const { context } = useSelectState({
        modelValue,
        multiple: ref(true),
        disabled: ref(false),
        searchable: ref(false),
        clearable: ref(false),
        loading: ref(false),
        closeOnSelect: ref(null),
        propOptions: ref([]),
        filterBy: ref((option, search) => option.label.toLowerCase().includes(search.toLowerCase())),
        collection,
      });

      context.open();
      context.select("js");

      expect(modelValue.value).toEqual(["js"]);
      expect(context.isOpen.value).toBe(true);
    });
  });

  it("closes the menu on multi-select when closeOnSelect is enabled", () => {
    runInScope(() => {
      const modelValue = ref<string[]>([]);
      const collection = useSelectCollection<string>({
        propOptions: () => [
          { label: "JavaScript", value: "js" },
          { label: "TypeScript", value: "ts" },
        ],
      });

      const { context } = useSelectState({
        modelValue,
        multiple: ref(true),
        disabled: ref(false),
        searchable: ref(false),
        clearable: ref(false),
        loading: ref(false),
        closeOnSelect: ref(true),
        propOptions: ref([]),
        filterBy: ref((option, search) => option.label.toLowerCase().includes(search.toLowerCase())),
        collection,
      });

      context.open();
      context.select("js");

      expect(modelValue.value).toEqual(["js"]);
      expect(context.isOpen.value).toBe(false);
    });
  });

  it("keeps the menu open on single-select when closeOnSelect is disabled", () => {
    runInScope(() => {
      const modelValue = ref<string | null>(null);
      const collection = useSelectCollection<string>({
        propOptions: () => [
          { label: "JavaScript", value: "js" },
          { label: "TypeScript", value: "ts" },
        ],
      });

      const { context } = useSelectState({
        modelValue,
        multiple: ref(false),
        disabled: ref(false),
        searchable: ref(false),
        clearable: ref(false),
        loading: ref(false),
        closeOnSelect: ref(false),
        propOptions: ref([]),
        filterBy: ref((option, search) => option.label.toLowerCase().includes(search.toLowerCase())),
        collection,
      });

      context.open();
      context.select("js");

      expect(modelValue.value).toBe("js");
      expect(context.isOpen.value).toBe(true);
    });
  });

  it("emits lifecycle and selection events", () => {
    runInScope(() => {
      const modelValue = ref<string | null>(null);
      const onMenuOpened = vi.fn();
      const onMenuClosed = vi.fn();
      const onOptionSelected = vi.fn();
      const onOptionDeselected = vi.fn();
      const onSearch = vi.fn();
      const collection = useSelectCollection<string>({
        propOptions: () => [
          { label: "JavaScript", value: "js" },
          { label: "TypeScript", value: "ts" },
        ],
      });

      const { context } = useSelectState({
        modelValue,
        multiple: ref(false),
        disabled: ref(false),
        searchable: ref(true),
        clearable: ref(true),
        loading: ref(false),
        closeOnSelect: ref(true),
        propOptions: ref([]),
        filterBy: ref((option, search) => option.label.toLowerCase().includes(search.toLowerCase())),
        collection,
        events: {
          onMenuOpened,
          onMenuClosed,
          onOptionSelected,
          onOptionDeselected,
          onSearch,
        },
      });

      context.open();
      expect(onMenuOpened).toHaveBeenCalledTimes(1);

      context.searchValue.value = "type";
      expect(onSearch).toHaveBeenCalledWith("type");

      context.select("ts");
      expect(onOptionSelected).toHaveBeenCalledWith("ts");
      expect(onMenuClosed).toHaveBeenCalledTimes(1);

      context.open();
      context.clear();
      expect(onOptionDeselected).toHaveBeenCalledWith("ts");
    });
  });
});
