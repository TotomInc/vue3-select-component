export type SelectClasses = {
  container?: string;
  control?: string;
  valueContainer?: string;
  placeholder?: string;
  singleValue?: string;
  multiValue?: string;
  multiValueLabel?: string;
  multiValueRemove?: string;
  inputContainer?: string;
  searchInput?: string;
  menuContainer?: string;
  menuOption?: string;
  noResults?: string;
  taggableNoOptions?: string;
};

export type Props<GenericOption, OptionValue> = {
  /**
   * A list of options to render on the select component.
   */
  options: GenericOption[];

  /**
   * When passed to the component, only these specific options will be rendered
   * on the list of options.
   */
  displayedOptions?: GenericOption[];

  /**
   * The placeholder text to display when no option is selected.
   */
  placeholder?: string;

  /**
   * When set to true, the input can be cleared by clicking the clear button.
   */
  isClearable?: boolean;

  /**
   * When set to true, disable the select component.
   */
  isDisabled?: boolean;

  /**
   * When set to true, allow the user to filter the options by typing in the search input.
   */
  isSearchable?: boolean;

  /**
   * When set to true, allow the user to select multiple options. This will change the
   * `selected` model to an array of strings. You should pass an array of strings to the
   * `v-model` directive when using this prop.
   */
  isMulti?: boolean;

  /**
   * When set to true, allow the user to create a new option if it doesn't exist.
   */
  isTaggable?: boolean;

  /**
   * When set to true, show a loading spinner inside the select component. This is useful
   * when fetching the options asynchronously.
   */
  isLoading?: boolean;

  /**
   * Control the menu open state programmatically.
   */
  isMenuOpen?: boolean;

  /**
   * When set to true with `isMulti`, selected options won't be displayed in
   * the menu.
   */
  hideSelectedOptions?: boolean;

  /**
   * When set to true, focus the first option when the menu is opened.
   * When set to false, no option will be focused.
   */
  shouldAutofocusOption?: boolean;

  /**
   * When set to true, clear the search input when an option is selected.
   */
  closeOnSelect?: boolean;

  /**
   * Teleport the menu to another part of the DOM with higher priority such as `body`.
   * This way, you can avoid z-index issues. Menu position will be calculated using
   * JavaScript, instead of using CSS absolute & relative positioning.
   */
  teleport?: string;

  /**
   * The ID of the input element. This is useful for accessibility or forms.
   */
  inputId?: string;

  /**
   * CSS classes to apply to the select component.
   */
  classes?: SelectClasses;

  /**
   * Unique identifier to identify the select component, using `id` attribute.
   * This is useful for accessibility.
   */
  uid?: string | number;

  /**
   * ARIA attributes to describe the select component. This is useful for accessibility.
   */
  aria?: {
    labelledby?: string;
    required?: boolean;
  };

  /**
   * When set to true, the component will not emit a `console.warn` because of an invalid
   * `v-model` type when using `isMulti`. This is useful when using the component with
   * dynamic `v-model` references.
   */
  disableInvalidVModelWarn?: boolean;

  /**
   * Callback to filter the options based on the search input. By default, it filters
   * the options based on the `label` property of the option. The label is retrieved
   * using `getOptionLabel`.
   *
   * @param option The option to filter.
   * @param label The label of the option.
   * @param search The search input value.
   */
  filterBy?: (option: GenericOption, label: string, search: string) => boolean;

  /**
   * Resolves option data to a string to compare options and specify value attributes.
   *
   * @param option The option to render.
   */
  getOptionValue?: (option: GenericOption) => OptionValue;

  /**
   * Resolves option data to a string to render the option label.
   *
   * @param option The option to render.
   */
  getOptionLabel?: (option: GenericOption) => string;

  /**
   * HTML attributes to apply to the search input element.
   * Useful for form integration (tabindex, autocomplete, required, etc.).
   */
  inputAttrs?: Record<string, string | number | boolean | undefined | null | Array<unknown>>;
};
