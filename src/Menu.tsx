import type { DataInjection, PropsInjection } from "./lib/provide-inject";
import type { Option } from "./types/option";
import type { MenuSlots } from "./types/slots";
import { computed, defineComponent, inject, onBeforeUnmount, onMounted, useTemplateRef } from "vue";
import { DATA_KEY, PROPS_KEY } from "./lib/provide-inject";
import classes from "./Menu.module.css";
import MenuOption from "./MenuOption.vue";

export const Menu = defineComponent(
  <GenericOption extends Option<OptionValue>, OptionValue = string>(props: {
    slots: MenuSlots<GenericOption, OptionValue>;
    modelValue: OptionValue | OptionValue[];
  }, { emit }: { emit: {
      (e: "update:modelValue", value: OptionValue | OptionValue[]): void;
    }; }) => {
    // Emulate v-model without defineModel because of defineComponent.
    const selected = computed<OptionValue | OptionValue[]>({
      get: () => props.modelValue,
      set: (val) => {
        emit("update:modelValue", val);
      },
    });

    const sharedProps = inject<PropsInjection<GenericOption, OptionValue>>(PROPS_KEY)!;
    const sharedData = inject<DataInjection<GenericOption, OptionValue>>(DATA_KEY)!;

    const menuRef = useTemplateRef<HTMLElement>("menu");

    const calculateMenuPosition = () => {
      if (sharedData.containerRef.value) {
        const rect = sharedData.containerRef.value.getBoundingClientRect();

        return {
          left: `${rect.x}px`,
          top: `${rect.y + rect.height}px`,
        };
      }

      console.warn("Unable to calculate dynamic menu position because of missing internal DOM reference.");

      return { top: "0px", left: "0px" };
    };

    const handleNavigation = (e: KeyboardEvent) => {
      if (sharedData.menuOpen.value) {
        const currentIndex = sharedData.focusedOption.value;

        if (e.key === "ArrowDown") {
          e.preventDefault();

          const nextOptionIndex = sharedData.availableOptions.value.findIndex((option, i) => !option.disabled && i > currentIndex);
          const firstOptionIndex = sharedData.availableOptions.value.findIndex((option) => !option.disabled);

          sharedData.focusedOption.value = nextOptionIndex === -1 ? firstOptionIndex : nextOptionIndex;
        }

        if (e.key === "ArrowUp") {
          e.preventDefault();

          const prevOptionIndex = sharedData.availableOptions.value.reduce(
            (acc, option, i) => (!option.disabled && i < currentIndex ? i : acc),
            -1,
          );

          const lastOptionIndex = sharedData.availableOptions.value.reduce(
            (acc, option, i) => (!option.disabled ? i : acc),
            -1,
          );

          sharedData.focusedOption.value = prevOptionIndex === -1 ? lastOptionIndex : prevOptionIndex;
        }

        if (e.key === "Enter") {
          const selectedOption = sharedData.availableOptions.value[currentIndex];

          e.preventDefault();

          if (selectedOption) {
            sharedData.setOption(selectedOption);
          }
          else if (sharedProps.isTaggable && sharedData.search.value) {
            sharedData.createOption();
          }
        }

        // When pressing space with menu open but no search, select the focused option.
        if (e.code === "Space" && sharedData.search.value.length === 0) {
          const selectedOption = sharedData.availableOptions.value[currentIndex];

          e.preventDefault();

          if (selectedOption) {
            sharedData.setOption(selectedOption);
          }
        }

        if (e.key === "Escape") {
          e.preventDefault();
          sharedData.closeMenu();
        }

        const hasSelectedValue = sharedProps.isMulti && Array.isArray(selected.value) ? selected.value.length > 0 : !!selected.value;

        // When pressing backspace with no search, remove the last selected option.
        if (e.key === "Backspace" && sharedData.search.value.length === 0 && hasSelectedValue) {
          e.preventDefault();

          if (sharedProps.isMulti && Array.isArray(selected.value)) {
            selected.value = selected.value.slice(0, -1);
          }
          else {
            selected.value = undefined as OptionValue;
          }
        }
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isInsideContainer = sharedData.containerRef.value && sharedData.containerRef.value.contains(target);
      const isInsideMenu = menuRef.value && menuRef.value.contains(target);

      if (!isInsideContainer && !isInsideMenu) {
        sharedData.closeMenu();
      }
    };

    onMounted(() => {
      document.addEventListener("keydown", handleNavigation);
      document.addEventListener("click", handleClickOutside);
    });

    onBeforeUnmount(() => {
      document.removeEventListener("keydown", handleNavigation);
      document.removeEventListener("click", handleClickOutside);
    });

    const DefaultMenuContent = () => (
      <>
        {props.slots["menu-header"] ? props.slots["menu-header"]() : null}

        {sharedData.availableOptions.value.map((option, i) => (
          <MenuOption
            key={i}
            menu={menuRef.value}
            index={i}
            isFocused={sharedData.focusedOption.value === i}
            isSelected={Array.isArray(selected.value) ? selected.value.includes(option.value) : option.value === selected.value}
            isDisabled={option.disabled || false}
            class={sharedProps.classes?.menuOption}
            onSelect={() => sharedData.setOption(option)}
          >
            {
              props.slots.option
                ? props.slots.option({
                    option,
                    index: i,
                    isFocused: sharedData.focusedOption.value === i,
                    isSelected: Array.isArray(selected.value) ? selected.value.includes(option.value) : option.value === selected.value,
                    isDisabled: option.disabled || false,
                  })
                : sharedProps.getOptionLabel
                  ? sharedProps.getOptionLabel(option)
                  : option.label
            }
          </MenuOption>
        ))}

        {!sharedProps.isTaggable && sharedData.availableOptions.value.length === 0 && (
          <div class={[classes["no-results"], sharedProps.classes?.noResults]}>
            {
              props.slots["no-options"]
                ? props.slots["no-options"]()
                : "No results found"
            }
          </div>
        )}

        {sharedProps.isTaggable && sharedData.search.value && (
          <div
            class={[classes["taggable-no-options"], sharedProps.classes?.taggableNoOptions]}
            onClick={sharedData.createOption}
          >
            {
              props.slots["taggable-no-options"]
                ? props.slots["taggable-no-options"]({ value: sharedData.search.value })
                : `Press enter to add ${sharedData.search.value} option`
            }
          </div>
        )}
      </>
    );

    return () => (
      <div
        id={`vue-select-${sharedProps.uid}-listbox`}
        ref={menuRef}
        class={[classes.menu, sharedProps.classes?.menuContainer]}
        role="listbox"
        aria-label={sharedProps.aria?.labelledby}
        aria-multiselectable={sharedProps.isMulti}
        style={{
          width: sharedProps.teleport ? `${sharedData.containerRef?.value?.getBoundingClientRect().width}px` : "100%",
          top: sharedProps.teleport ? calculateMenuPosition().top : "unset",
          left: sharedProps.teleport ? calculateMenuPosition().left : "unset",
        }}
      >
        {
          props.slots["menu-container"]
            ? props.slots["menu-container"]({ defaultContent: <DefaultMenuContent /> })
            : <DefaultMenuContent />
        }
      </div>
    );
  },
  { name: "Menu", props: ["slots", "modelValue"], emits: ["update:modelValue"] },
);
