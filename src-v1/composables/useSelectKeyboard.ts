import type { SelectContext } from "../lib/context";

type UseSelectKeyboardParams<OptionValue> = {
  context: SelectContext<OptionValue>;
};

/**
 * Keyboard navigation for the select collection.
 * Full Arrow/Enter/Escape handling lands in a later phase.
 */
export function useSelectKeyboard<OptionValue>(_params: UseSelectKeyboardParams<OptionValue>) {
  return {};
}
