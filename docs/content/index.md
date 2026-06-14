---
title: Vue 3 Select Component
description: Build accessible, type-safe select inputs in Vue 3. Use the batteries-included Select component or compose headless primitives for full UI control.
seo:
  title: Vue 3 Select Component | Accessible Vue 3 Select
  description: Build accessible, type-safe select inputs in Vue 3. Use the batteries-included Select component or compose headless primitives for full UI control.
---

::u-page-hero
---
orientation: horizontal
ui:
  container: max-w-7xl mx-auto
---
#headline
  :::u-button
  ---
  size: sm
  to: /guide/migration
  variant: outline
  icon: i-lucide-sparkles
  ---
  v1: introducing Primitives
  :::

#title
Vue 3 Select Component

#description
Ship accessible selects in minutes. Use the assembled component or compose headless primitives.

#links
  :::u-button
  ---
  color: neutral
  size: xl
  to: /getting-started/introduction
  trailing-icon: i-lucide-arrow-right
  ---
  Get Started
  :::

  :::u-button
  ---
  color: neutral
  icon: i-simple-icons-github
  size: xl
  to: https://github.com/TotomInc/vue3-select-component
  target: _blank
  variant: outline
  ---
  GitHub
  :::
::

::u-page-section
---
headline: Core features
title: Everything you need in a select
description: Type-safe and accessible. Pick the assembled component or compose primitives.
ui:
  container: max-w-7xl mx-auto
---
#features
  :::u-page-feature
  ---
  icon: i-lucide-layers
  to: /getting-started/usage
  ---
  #title
  Batteries-included Select

  #description
  Drop-in component with v-model, options, search, clear, and multi-select.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-blocks
  to: /guide/primitives
  ---
  #title
  Headless primitives

  #description
  Compose SelectRoot, SelectTrigger, SelectPopover, and more for custom UX.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-braces
  to: /guide/typescript
  ---
  #title
  End-to-end types

  #description
  Generics tie option values to v-model. Extend options with custom fields safely.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-shield-check
  to: /guide/accessibility
  ---
  #title
  Accessible by default

  #description
  WAI-ARIA combobox pattern, keyboard navigation, focus management, and screen readers.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-palette
  to: /guide/styling
  ---
  #title
  Your design system

  #description
  Unstyled primitives with stable data-attribute hooks. Bring your own CSS.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-arrow-right-left
  to: /guide/migration
  ---
  #title
  v0 migration guide

  #description
  Step-by-step upgrade path from v0 to v1. Rename props, restyle, and adopt primitives.
  :::
::

::u-page-section
---
headline: Documentation
title: Explore the API
description: Configuration, customization, and every primitive component.
ui:
  container: max-w-7xl mx-auto
---
  :::u-page-grid
    ::::u-page-card
    ---
    spotlight: true
    class: col-span-2 lg:col-span-1
    to: /api/props
    icon: i-lucide-settings-2
    ---
    #title
    Props

    #description
    v-model, options, flags, mappers, teleport, and filterBy for Select and SelectRoot.
    ::::

    ::::u-page-card
    ---
    spotlight: true
    class: col-span-2 lg:col-span-1
    to: /api/events
    icon: i-lucide-zap
    ---
    #title
    Events

    #description
    optionSelected, optionDeselected, search, menuOpened, and menuClosed with typed payloads.
    ::::

    ::::u-page-card
    ---
    spotlight: true
    class: col-span-2 lg:col-span-1
    to: /api/slots
    icon: i-lucide-layout-template
    ---
    #title
    Slots

    #description
    Customize values, options, tags, icons, and empty states on primitives.
    ::::

    ::::u-page-card
    ---
    spotlight: true
    class: col-span-2 lg:col-span-1
    to: /api/components
    icon: i-lucide-box
    ---
    #title
    Components

    #description
    Reference for SelectRoot, SelectTrigger, SelectListbox, SelectOption, and more.
    ::::

    ::::u-page-card
    ---
    spotlight: true
    class: col-span-2 lg:col-span-1
    to: /guide/multiselect
    icon: i-lucide-check-square
    ---
    #title
    Multi-select

    #description
    Pick multiple values, show tags, remove with keyboard, and clear all at once.
    ::::

    ::::u-page-card
    ---
    spotlight: true
    class: col-span-2 lg:col-span-1
    to: /guide/styling
    icon: i-lucide-palette
    ---
    #title
    Styling

    #description
    Style every part with stable data-attribute hooks and your own CSS.
    ::::
  :::
::
