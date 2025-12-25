# InkDropdown

A form control component for selecting a single option from a dropdown list with support for lazy-loaded options.

## Rationale

Provides a consistent dropdown selection control that supports both static and dynamically loaded options. Use for single selection from a list, especially when options need to be loaded on-demand.

## Design Semantics

### Concepts

- Static options: Pre-defined array of options passed directly
- Lazy-loaded options: Options loaded on-demand when the dropdown is opened, or immediately if modelValue is set

### Visual / UX Meaning

The dropdown displays as a box showing the selected value or placeholder. Opening reveals a list of options. Loading state shows a spinner. Refresh button allows manual reload for lazy options, indicating dynamic content.

## Canonical Examples

- Basic static options with label:

  ```vue
  <InkDropdown
    v-model="selected"
    label="Choose option"
    :options="[{value: 'a', label: 'Option A'}, {value: 'b', label: 'Option B'}]"
  />
  ```

- Lazy-loaded options with refresh:

  ```vue
  <InkDropdown
    v-model="selected"
    :refresher="async () => [{value: '1', label: 'Loaded 1'}, {value: '2', label: 'Loaded 2'}]"
  />
  ```

- Dynamic options with manual refresh:

  ```vue
  <InkDropdown
    v-model="selected"
    v-model:options="dynamicOptions"
    :refresher="loadOptions"
  />
  ```

## Behavioral Contract

- In loading state: No selection possible, loading indicator shown
- Selection emits update:modelValue and change events
- Refresh button reloads options asynchronously, disabled during load
- When modelValue is set on mount with a refresher function, options are loaded immediately to display the correct label
- State transitions are idempotent

## Extension & Composition

- Composes with InkForm for consistent form layouts
- Supports controlled and uncontrolled usage via v-model

## Non-Goals

- Multi-selection
- Custom option rendering
- Data persistence or authorization logic

## Implementation Notes

- Internal state managed via reactive refs
- Uses Vue reactivity for updates
- Handles async loading with promises
- Relies on DOM for rendering
