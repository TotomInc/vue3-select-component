---
title: 'Input Attributes'
---

# Input Attributes

Use the `inputAttrs` prop to add HTML attributes to the search input element. This is particularly useful for form integration, accessibility, and browser features.

## Autocomplete Support

Enable browser autocomplete by setting the `autocomplete` attribute:

```vue
<template>
  <VueSelect
    v-model="selectedCountry"
    :options="countries"
    :input-attrs="{ autocomplete: 'country' }"
    placeholder="Select your country"
  />

  <VueSelect
    v-model="selectedUsername"
    :options="usernames"
    :input-attrs="{ autocomplete: 'username' }"
    placeholder="Select username"
    is-taggable
  />
</template>
```

::: warning
`autocomplete` browser UI might conflict with the component's UI. For example, if you are using the `autocomplete` attribute on a select field, the browser will show a dropdown of autocomplete options. To avoid this, you can set the `autocomplete` attribute to `off` (which is the default value).
:::

## Required Field Validation

Mark fields as required for HTML5 form validation:

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <VueSelect
      v-model="selectedCountry"
      :options="countries"
      :input-attrs="{ required: true }"
      placeholder="Country (required)"
    />

    <button type="submit">
      Submit
    </button>
  </form>
</template>
```

::: info
It isn't recommended to use HTML5 form validation with custom components, as you might run into issues. It's better instead to use a dedicated library for form validation (e.g. vee-validate) as it's easier to connect it with the component's data.
:::

## Data Attributes

Add custom data attributes for testing or analytics:

```vue
<template>
  <VueSelect
    v-model="selectedOption"
    :options="options"
    :input-attrs="{
      'data-testid': 'user-preference-select',
      'data-analytics': 'form-interaction',
      'data-component': 'country-selector',
    }"
  />
</template>
```

## Overriding Default Attributes

The component sets some default attributes that you can override:

- `autocapitalize: "none"`
- `autocomplete: "off"`
- `autocorrect: "off"`
- `spellcheck: false`
- `tabindex: 0`
- `type: "text"`

Essential attributes like `aria-autocomplete`, `aria-labelledby`, `disabled`, and `placeholder` are preserved and cannot be overridden through `inputAttrs`.

```vue
<template>
  <!-- Override default autocomplete="off" -->
  <VueSelect
    v-model="username"
    :options="usernames"
    :input-attrs="{ autocomplete: 'username' }"
  />

  <!-- Enable spellcheck (default is false) -->
  <VueSelect
    v-model="comment"
    :options="comments"
    :input-attrs="{ spellcheck: true }"
    is-taggable
  />
</template>
```
