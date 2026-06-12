import type { SelectContext } from "../lib/context";

type UseSelectKeyboardParams<OptionValue extends string | number> = {
  context: SelectContext<OptionValue>;
};

export function useSelectKeyboard<OptionValue extends string | number>(params: UseSelectKeyboardParams<OptionValue>) {
  const { context } = params;

  const handleKeydown = (event: KeyboardEvent) => {
    if (context.disabled.value) {
      return;
    }

    const isMenuOpen = context.isOpen.value;
    const hasSearchQuery = context.searchValue.value.length > 0;
    const isSearchInputEvent = event.target instanceof HTMLInputElement
      && event.target.dataset.selectInput != null;

    if (event.key === "Tab") {
      if (isMenuOpen) {
        context.close();
      }

      return;
    }

    if (!isMenuOpen) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        context.open();
        return;
      }

      if (event.code === "Space" && !hasSearchQuery && !isSearchInputEvent) {
        event.preventDefault();
        context.open();
      }

      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      context.moveActiveOption(1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      context.moveActiveOption(-1);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      context.selectActiveOption();
      return;
    }

    if (event.code === "Space" && !hasSearchQuery && !isSearchInputEvent) {
      event.preventDefault();
      context.selectActiveOption();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      context.close();
      return;
    }

    if (event.key === "Backspace" && !hasSearchQuery && context.multiple.value) {
      const hasSelectedValues = context.selectedOptions.value.length > 0;

      if (hasSelectedValues) {
        event.preventDefault();
        context.deselectLast();
      }
    }
  };

  return { handleKeydown };
}
