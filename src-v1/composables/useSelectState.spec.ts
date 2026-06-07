import { describe, expect, it } from "vitest";
import { ref } from "vue";

import { useSelectCollection } from "./useSelectCollection";
import { useSelectState } from "./useSelectState";

describe("useSelectState", () => {
  it("normalizes selected options from the merged collection", () => {
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
      propOptions: ref([]),
      filterBy: ref((option, search) => option.label.toLowerCase().includes(search.toLowerCase())),
      collection,
    });

    expect(context.selectedOptions.value.map((option) => option.value)).toEqual(["ts"]);
  });

  it("resets the active option when filtering removes it from the navigable set", () => {
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

  it("toggles values in multi-select mode without closing", () => {
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
