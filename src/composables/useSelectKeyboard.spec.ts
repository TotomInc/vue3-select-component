import type { SelectContext } from "../lib/context";
import { describe, expect, it, vi } from "vitest";

import { computed, ref } from "vue";
import { useSelectKeyboard } from "./useSelectKeyboard";

function createKeyboardContext(overrides: Partial<SelectContext<string>> = {}): SelectContext<string> {
  return {
    modelValue: ref(null),
    isOpen: ref(false),
    searchValue: ref(""),
    multiple: ref(false),
    disabled: ref(false),
    searchable: ref(false),
    clearable: ref(false),
    loading: ref(false),
    activeOptionValue: ref(null),
    triggerId: "trigger",
    listboxId: "listbox",
    activeOptionElementId: computed(() => undefined),
    allOptions: computed(() => []),
    filteredOptions: computed(() => []),
    selectedOptions: computed(() => []),
    open: vi.fn(),
    close: vi.fn(),
    toggle: vi.fn(),
    select: vi.fn(),
    selectActiveOption: vi.fn(),
    deselect: vi.fn(),
    deselectLast: vi.fn(),
    clear: vi.fn(),
    registerOption: vi.fn(),
    unregisterOption: vi.fn(),
    setActiveOptionValue: vi.fn(),
    moveActiveOption: vi.fn(),
    focusFirstOption: vi.fn(),
    isOptionVisible: vi.fn(),
    handleKeydown: vi.fn(),
    registerRootElement: vi.fn(),
    registerTriggerElement: vi.fn(),
    registerPopoverElement: vi.fn(),
    rootElement: ref(null),
    triggerElement: ref(null),
    popoverElement: ref(null),
    ...overrides,
  };
}

describe("useSelectKeyboard", () => {
  it("opens the menu from the trigger with arrow keys when closed", () => {
    const context = createKeyboardContext({ isOpen: ref(false) });
    const { handleKeydown } = useSelectKeyboard({ context });

    handleKeydown(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

    expect(context.open).toHaveBeenCalledOnce();
  });

  it("navigates and selects options when the menu is open", () => {
    const context = createKeyboardContext({ isOpen: ref(true) });
    const { handleKeydown } = useSelectKeyboard({ context });

    const arrowDown = new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true });
    handleKeydown(arrowDown);

    expect(context.moveActiveOption).toHaveBeenCalledWith(1);

    handleKeydown(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

    expect(context.selectActiveOption).toHaveBeenCalledOnce();
  });

  it("closes the menu on Escape and Tab", () => {
    const context = createKeyboardContext({ isOpen: ref(true) });
    const { handleKeydown } = useSelectKeyboard({ context });

    handleKeydown(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

    expect(context.close).toHaveBeenCalledOnce();

    handleKeydown(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));

    expect(context.close).toHaveBeenCalledTimes(2);
  });

  it("removes the last selected value on Backspace in multi-select mode", () => {
    const context = createKeyboardContext({
      isOpen: ref(true),
      multiple: ref(true),
      selectedOptions: computed(() => [{ id: "1", value: "js", label: "JavaScript", disabled: false }]),
    });
    const { handleKeydown } = useSelectKeyboard({ context });

    handleKeydown(new KeyboardEvent("keydown", { key: "Backspace", bubbles: true }));

    expect(context.deselectLast).toHaveBeenCalledOnce();
  });

  it("ignores keyboard actions when disabled", () => {
    const context = createKeyboardContext({
      isOpen: ref(false),
      disabled: ref(true),
    });
    const { handleKeydown } = useSelectKeyboard({ context });

    handleKeydown(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

    expect(context.open).not.toHaveBeenCalled();
  });
});
