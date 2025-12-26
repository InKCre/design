# @inkcre/web-design - Claude Skill

This is a comprehensive guide for using the @inkcre/web-design package, InKCre's design system for web applications.

## Overview

@inkcre/web-design is a Vue 3 component library built with TypeScript, providing:
- Design tokens (colors, spacing, typography, etc.)
- Reusable UI components
- Router and i18n abstractions
- SCSS utilities and mixins
- Comprehensive styling system

## Tech Stack

- **Framework**: Vue 3 + TypeScript + Vite
- **Styles**: SCSS + UnoCSS (icons only)
- **Internationalization**: vue-i18n compatible
- **Testing**: Vitest
- **Storybook**: Histoire

## Installation

```bash
npm install @inkcre/web-design
# or
pnpm add @inkcre/web-design
```

## Basic Setup

### Main Application Setup

```typescript
// main.ts
import { createApp } from 'vue'
import InKCreWebDesign from '@inkcre/web-design'
import "@inkcre/web-design/styles"

const app = createApp(App)
app.use(InKCreWebDesign)
```

### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "types": ["@inkcre/web-design"]
  }
}
```

### UnoCSS Configuration

```typescript
// uno.config.ts
export default defineConfig({
  safelist: [
    'i-mdi-menu',
    'i-mdi-loading',
    'i-mdi-refresh',
    'i-mdi-chevron-right',
    'i-mdi-chevron-down',
    'i-mdi-alert-circle-outline',
    'i-mdi-inbox-outline',
    'animate-spin'
  ]
})
```

## Router Integration

Some components (like InkHeader) require router capabilities. The design system uses a provider pattern that works with any router.

### Interface

```typescript
import type { ComputedRef, InjectionKey } from "vue";
import { inject } from "vue";

export interface InkRouter {
  /** 当前路径（响应式） */
  currentPath: ComputedRef<string>;
  /** 当前页面名称 */
  currentName: ComputedRef<string | null>;
}

export const INK_ROUTER_KEY: InjectionKey<InkRouter> = Symbol("INK_ROUTER");

export function useOptionalRouter(): InkRouter | null {
  return inject(INK_ROUTER_KEY, null);
}

```

### Setup with Vue Router

```typescript
// your-router.ts
import { computed } from "vue";
import type { Router, RouteLocationNormalizedLoaded } from "vue-router";
import type { InkRouter } from "@inkcre/web-design";

export function createInkRouterAdapter(
  router: Router,
  route: RouteLocationNormalizedLoaded
): InkRouter {
  return {
    currentPath: computed(() => route.path),
    currentName: computed(() => route.name),
  };
}
```

```typescript
// App.vue
<script setup lang="ts">
import { INK_ROUTER_KEY } from "@inkcre/web-design";
import { createInkRouterAdapter } from "./your-router";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

provide(INK_ROUTER_KEY, createInkRouterAdapter(router, route));
</script>
```

## Internationalization (i18n)

The design system supports internationalization through a provider pattern that works with any i18n library.

### Interface

```typescript
import type { InjectionKey, Ref } from "vue";
import { inject } from "vue";

export interface InkI18n {
  t: (key: string) => string;
  locale: Ref<string>;
}

export const INK_I18N_KEY: InjectionKey<InkI18n> = Symbol("INK_I18N");

export function useOptionalI18n(): InkI18n | null {
  return inject(INK_I18N_KEY, null);
}

```

### Setup with vue-i18n

1. Install vue-i18n:
```bash
pnpm add vue-i18n
```

2. Extend provided locales:
```typescript
// locales/en.ts
import { en } from "@inkcre/web-design/locales";

export default {
  ...en,
  // Your custom translations
}
```

3. Configure vue-i18n:
```typescript
// locales/index.ts
import { createI18n } from "vue-i18n";
import en from "./en";
import zhCN from "./zhCN";

const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages: { en, zhCN },
});

export default i18n;
```

4. Provide to design system:
```typescript
// App.vue
<script setup lang="ts">
import { INK_I18N_KEY } from "@inkcre/web-design";
import i18n from "./locales";

provide(INK_I18N_KEY, {
  t: i18n.global.t,
  locale: i18n.global.locale,
});
</script>
```

**Note**: Components fall back to English if no i18n provider is configured.

## Styling System

The design system provides a comprehensive styling system with design tokens, mixins, and utilities.

### Using SCSS Utilities

```scss
// Your component styles
@use "@inkcre/web-design/styles/mixins" as *;
@use "@inkcre/web-design/styles/functions" as *;
@use "@inkcre/web-design/tokens/ref" as ref;
@use "@inkcre/web-design/tokens/sys" as sys;
@use "@inkcre/web-design/tokens/comp" as comp;
```

### Design Tokens

Design tokens are organized in three layers:

1. **Reference Tokens** (`ref`): Primitive values (colors, spacing, etc.)
2. **System Tokens** (`sys`): Semantic tokens that reference primitives
3. **Component Tokens** (`comp`): Component-specific tokens

#### Example Usage

```scss
.my-component {
  // Using system tokens
  color: fn.map-deep-get(sys.$color-light, "text", "base");
  padding: fn.map-deep-get(ref.$space, "md");
  border-radius: fn.map-deep-get(ref.$radius, "sm");
  
  // Using component tokens
  background: fn.map-deep-get(comp.$light, "button", "bg-primary");
}
```

### Theme Support

The design system supports light and dark modes through CSS custom properties.

```scss
// Light mode
[data-theme="light"] {
  --color-text-base: #{fn.map-deep-get(sys.$color-light, "text", "base")};
}

// Dark mode
[data-theme="dark"] {
  --color-text-base: #{fn.map-deep-get(sys.$color-dark, "text", "base")};
}
```

### Available Token Categories

- **Colors**: `ref.$color`, `sys.$color-light`, `sys.$color-dark`
- **Spacing**: `ref.$space` (xs, sm, md, lg, xl, etc.)
- **Typography**: `ref.$typo` (font sizes, weights, line heights)
- **Border Radius**: `ref.$radius`
- **Elevation**: `ref.$elevation` (shadows)
- **Breakpoints**: `ref.$breakpoint` (sm, md, lg, xl)
- **Opacity**: `ref.$opacity`

## Components

The design system includes 19 components, each designed for specific use cases.

### Component List

- **inkAutoForm**
- **inkButton**
- **inkDatetimePickerView**
- **inkDialog**
- **inkDoubleCheck**
- **inkDropdown**
- **inkField**
- **inkForm**
- **inkHeader**
- **inkInput**
- **inkJsonEditor**
- **inkLoading**
- **inkPagination**
- **inkPicker**
- **inkPlaceholder**
- **inkPopup**
- **inkSwitch**
- **inkTextarea**
- **inkTooltip**


---

### inkAutoForm

# InkAutoForm

The InkAutoForm component automatically generates forms from flat JSON Schema definitions. It maps primitive types (string, number, boolean) to appropriate form controls and provides validation using `vscode-json-languageservice`.

## Rationale

InkAutoForm exists to simplify form creation by automatically generating UI controls from JSON Schema definitions, reducing boilerplate code for data input forms.

Use InkAutoForm when you have a flat JSON schema for user input and want to avoid manually wiring form controls. Do not use for complex nested schemas, arrays, or conditional logic.

## Design Semantics

### Concepts

- `Schema`: A JSON Schema object defining the structure and constraints of the form fields.
- `Form Data`: An object holding the current values of the form fields, updated in real-time.
- `Layout`: The arrangement of form fields, either inline, column, or row.

### Visual / UX Meaning

In the default state, fields display labels and inputs with placeholders. When validation fails, fields show error messages below the input, changing the border color to indicate errors. Required fields are marked with an asterisk. The layout affects spacing and flow: column stacks vertically, row aligns horizontally, inline compacts fields.

## Canonical Examples

- Basic form with string, number, and boolean fields:

  ```vue
  <script setup>
  import { ref } from 'vue';
  import { InkAutoForm } from '@inkcre/web-design';

  const schema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: 'Full Name',
        description: 'Enter your name'
      },
      age: {
        type: 'integer',
        title: 'Age',
        minimum: 18
      },
      subscribe: {
        type: 'boolean',
        title: 'Subscribe to newsletter'
      }
    },
    required: ['name']
  };

  const formData = ref({});
  </script>

  <template>
    <InkAutoForm 
      :schema="schema" 
      v-model:form-data="formData"
      layout="col"
    />
  </template>
  ```

## Behavioral Contract

- Form data is validated in real-time against the schema; errors are displayed immediately below invalid fields.
- Required fields must be filled; missing values trigger validation errors.
- Default values from the schema are applied on initialization.
- State transitions (e.g., from valid to invalid) update the UI without throwing exceptions.
- No uncaught exceptions are thrown during validation or rendering.

## Extension & Composition

InkAutoForm can be composed within larger forms or used standalone. It supports v-model for two-way binding and can be integrated with form submission logic. Not recommended for high-frequency reflow containers due to dynamic field rendering.

## Non-Goals

- Handling nested objects or arrays in schemas.
- Supporting complex conditional schemas with `if`/`then`/`else`.
- Data persistence or business logic integration.
- Custom validation beyond JSON Schema constraints.

## Implementation Notes

Relies on `vscode-json-languageservice` for schema validation. Internal state managed via Vue reactivity. Assumes DOM environment for rendering; SSR support may require additional handling.

#### Props Definition

```typescript
export const inkAutoFormProps = {
  /** JSON Schema definition for the form (flat properties only) */
  schema: {
    type: Object as PropType<JSONSchema>,
    required: true,
  },
  /** Form data object */
  formData: makeObjectProp<Record<string, any>>({}),
  /** Layout for form fields */
  layout: makeStringProp<FieldLayout>("col"),
} as const;
```

#### Events

```typescript
export const inkAutoFormEmits = {
  "update:formData": (value: Record<string, any>) => true,
} as const;
```

#### Types

```typescript
type FieldLayout = "inline" | "col" | "row";

export interface JSONSchema {
  type: "object";
  properties: Record<string, JSONSchemaProperty>;
  required?: string[];
  [key: string]: any;
}
interface JSONSchemaProperty {
  type: "string" | "number" | "integer" | "boolean";
  title?: string;
  description?: string;
  default?: any;
  enum?: any[];
  format?: "date" | "time" | "datetime" | "date-time";
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  pattern?: string;
  [key: string]: any;
}
interface FieldComponentMapping {
  component: string;
  props: Record<string, any>;
}
```

#### Import

```typescript
import { inkAutoForm } from '@inkcre/web-design';
// or
import inkAutoForm from '@inkcre/web-design/components/inkAutoForm/inkAutoForm.vue';
```


---

### inkButton

# InkButton

Just button, you can have text, icon here and provides different semantics in different sizes.

## Rationale

InkButton exists to provide a consistent visual and interactive affordance for primary actions, secondary actions, and destructive actions across the product.

Use it for any single-click action that requires a compact button UI; avoid using it when a non-single-click workflow is needed (for example, file uploads with progress, or long-running background tasks that need a separate action component).

## Design Semantics

### Concepts

- `type`: visual and purposeful variant of the button (`subtle`, `primary`, `danger`).
- `size`: density of the control (`md`, `sm`).
- `slot`: custom content (e.g., icon + label, label only).

### Visual / UX Meaning

- `subtle` (default): low emphasis, use for non-critical or contextual actions.
- `primary`: main action in a section or modal; higher contrast to attract attention.
- `danger`: destructive action that explains a potentially destructive outcome (e.g., delete).
- `sm`: smaller footprint for compact toolbars; `md`: default size used in forms and actions.

## Canonical Examples

- Subtle (default): Used as the normal/secondary action.

  ```vue
  <InkButton text="Cancel" />
  ```

- Primary: The primary action in a modal or a form footer.

  ```vue
  <InkButton text="Save" theme="primary" />
  ```

- Danger: Used for destructive actions where the user must confirm an operation.

  ```vue
  <InkButton text="Delete" theme="danger" />
  ```

- Small size: Use in dense toolbars or where space is constrained.

  ```vue
  <InkButton text="Edit" size="sm" />
  ```

### Custom slot content (icon + label)

The `slot` is supported for custom content; this is how you add icons or non-text children.

```vue
<InkButton theme="primary">
  <svg aria-hidden="true" width="16" height="16">...</svg>
  <span>Save</span>
  </InkButton>
```

## Behavioral Contract

- In all variants, clicking the button emits a `click` event.
- Click events are always emitted; the component does not internally debounce, block, or prevent repeated clicks.
- The default values are: `text` = "Button Text", `type` = `subtle`, `size` = `md`.
- The component uses a native `<button>` element, so it inherits browser keyboard accessibility (space/enter) and form behavior; consumers should be aware of the native `type` default behavior in forms and add an explicit `type` attribute where necessary to avoid accidental form submits.

## Extension & Composition

- The component is intentionally simple and is designed for composition via the `slot` and surrounding layout.
- Accepts custom slot content for icons or complex inline labels (icon + text). The component does not provide a built-in `icon` prop; use the slot to place an icon element before or after the label.
- Works well inside `FormItem` or other containers. Because it is a native `button`, it behaves like a regular HTML button in forms.

## Non-Goals

- There is no built-in `disabled` or `loading` prop. Disabling or preventing repeated action should be handled by parent components or by a wrapper that manages state.
- It does not provide variant-level keyboard shortcuts or automatic confirmation dialogs.
- It does not manage long-running workflows, API states, or request lifecycle (for example, showing an internal spinner when an action is in-flight).

## Implementation Notes

- Props: `text` (string, default "Button Text"), `type` (`subtle` | `primary` | `danger`, default `subtle`), `size` (`md` | `sm`, default `md`).
- Emits: `click` (always true), implemented as a regular native `<button>` click event via `emit('click')`.
- The `slot` is present and should be considered the source of truth for custom content; the `text` prop is a convenience when only a label is used.
- Accessibility note for maintainers: the component omits an explicit `type` attribute on the underlying `<button>`, so by default in HTML forms the button will behave as `submit`. When used inside a form where submission is not intended, the caller should pass a `type="button"` attribute to avoid accidental form submits.

#### Props Definition

```typescript
export const inkButtonProps = {
  text: makeStringProp("Button Text"),
  type: makeStringProp<ButtonType>("default"),
  theme: makeStringProp<ButtonTheme>("subtle"),
  size: makeStringProp<ButtonSize>("md"),
  isLoading: makeBooleanProp(false),
} as const;
```

#### Events

```typescript
export const inkButtonEmits = {
  click: () => true,
} as const;
```

#### Types

```typescript
type ButtonTheme = "subtle" | "primary" | "danger";
type ButtonType = "default" | "icon";
type ButtonSize = "md" | "sm";

// --- Props ---
export const inkButtonProps = {
  text: makeStringProp("Button Text"),
  type: makeStringProp<ButtonType>("default"),
  theme: makeStringProp<ButtonTheme>("subtle"),
  size: makeStringProp<ButtonSize>("md"),
  isLoading: makeBooleanProp(false),
}
```

#### Import

```typescript
import { inkButton } from '@inkcre/web-design';
// or
import inkButton from '@inkcre/web-design/components/inkButton/inkButton.vue';
```


---

### inkDatetimePickerView

# InkDatetimePickerView

A comprehensive picker view for selecting weekday, date, and time values.

## Rationale

Provides an interactive picker interface for datetime selection, triggered by InkPicker. Use when needing scrollable columns for weekday, date, and time selection. Avoid for simple text input or non-scrollable pickers.

## Design Semantics

### Concepts

- `Weekday`: Selectable day of the week.
- `Date`: Year, month, day selection.
- `Time`: Hour and minute selection.

### Visual / UX Meaning

Scrollable columns represent selectable values. Enabled columns show active selection; disabled columns are hidden. User perceives smooth scrolling and immediate feedback on selection changes.

## Canonical Examples

- Datetime mode: Full selection with weekday, date, and time.

  ```vue
  <InkDatetimePickerView v-model="selectedDate" mode="datetime" />
  ```

- Date only: Select date without time.

  ```vue
  <InkDatetimePickerView v-model="selectedDate" mode="date" />
  ```

## Behavioral Contract

- Emits `update:modelValue` on value change.
- Emits `confirm` on user confirmation.
- Emits `cancel` on cancellation.
- Respects minDate and maxDate limits.
- Hour format affects time display (12 or 24).

## Extension & Composition

Composes with InkPicker for modal display. Supports controlled usage via v-model.

## Non-Goals

Handling data persistence or business logic. Not for direct keyboard input.

## Implementation Notes

Uses scrollable columns for selection. Manages internal state for current selections. Relies on Vue reactivity for updates.

#### Props Definition

```typescript
export const inkDatetimePickerViewProps = {
  modelValue: {
    type: Date as PropType<Date>,
    default: () => new Date(),
  },
  mode: makeStringProp<InkDatetimePickerMode>("datetime"),
  minDate: {
    type: Date as PropType<Date>,
    default: undefined,
  },
  maxDate: {
    type: Date as PropType<Date>,
    default: undefined,
  },
  hourFormat: makeStringProp<HourFormat>("24"),
} as const;
```

#### Events

```typescript
export const inkDatetimePickerViewEmits = {
  "update:modelValue": (value: Date) => value instanceof Date,
} as const;
```

#### Types

```typescript
type InkDatetimePickerMode =
  | "date"
  | "time"
  | "datetime"
  | "weekday"
  | "weekday-date"
  | "weekday-datetime";

export type HourFormat = "12" | "24";

export interface PickerColumn {
  values: (string | number)[];
  defaultIndex: number;
}
```

#### Import

```typescript
import { inkDatetimePickerView } from '@inkcre/web-design';
// or
import inkDatetimePickerView from '@inkcre/web-design/components/inkDatetimePickerView/inkDatetimePickerView.vue';
```


---

### inkDialog

# inkDialog

A dialog component built on top of inkPopup, providing a complete modal dialog experience with built-in header, footer, and action buttons.

## Features

- Built-in cancel and confirm buttons
- Support for title and subtitle
- Multiple slots (default/content, header, footer)
- Loading state support via Promise-based modelValue
- Flexible positioning
- Scrim (backdrop) with optional click-to-close

## Props

### modelValue
- **Type**: `boolean | Promise<boolean>`
- **Default**: `false`
- **Description**: Controls the open/close state of the dialog. When a Promise is provided, the dialog enters a loading state until the promise resolves.

### position
- **Type**: `DialogPosition` (string or array)
- **Default**: `"center"`
- **Options**: `"center"`, `"left"`, `"right"`, `"top"`, `"bottom"`, or `[top, right, bottom, left]` array
- **Description**: Position of the dialog on screen

### closeOnScrim
- **Type**: `boolean`
- **Default**: `true`
- **Description**: Whether clicking the backdrop closes the dialog

### title
- **Type**: `string`
- **Default**: `""`
- **Description**: Dialog title text

### subtitle
- **Type**: `string`
- **Default**: `""`
- **Description**: Dialog subtitle text

### cancelText
- **Type**: `string`
- **Default**: `"Cancel"`
- **Description**: Text for the cancel button

### confirmText
- **Type**: `string`
- **Default**: `"Confirm"`
- **Description**: Text for the confirm button

### showCancel
- **Type**: `boolean`
- **Default**: `true`
- **Description**: Whether to show the cancel button

### showConfirm
- **Type**: `boolean`
- **Default**: `true`
- **Description**: Whether to show the confirm button

## Events

### update:modelValue
- **Payload**: `boolean`
- **Description**: Emitted when dialog state changes

### cancel
- **Description**: Emitted when cancel button is clicked

### confirm
- **Description**: Emitted when confirm button is clicked

## Slots

### default (content)
- **Props**: `{ cancel: Function, confirm: Function, isLoading: boolean }`
- **Description**: Main content area of the dialog

### header
- **Description**: Custom header content (replaces title and subtitle)

### footer
- **Description**: Custom footer content (replaces default buttons)

## Usage

### Basic Usage
```vue
<InkDialog
  v-model="dialogOpen"
  title="Confirm Action"
  subtitle="Are you sure?"
>
  <p>This action cannot be undone.</p>
</InkDialog>
```

### With Promise (Loading State)
```vue
<script setup>
import { ref } from 'vue';

const dialog = ref(false);

const handleConfirm = () => {
  dialog.value = new Promise((resolve) => {
    // Perform async operation
    setTimeout(() => {
      resolve(false); // Close dialog
    }, 2000);
  });
};
</script>

<template>
  <InkDialog
    v-model="dialog"
    title="Processing"
    @confirm="handleConfirm"
  >
    <p>Click confirm to start processing...</p>
  </InkDialog>
</template>
```

### Custom Content with Slot Props
```vue
<InkDialog v-model="dialogOpen">
  <template #default="{ cancel, confirm, isLoading }">
    <p>Custom content</p>
    <button @click="cancel">Cancel</button>
    <button @click="confirm" :disabled="isLoading">Confirm</button>
  </template>
</InkDialog>
```

#### Props Definition

```typescript
export const inkDialogProps = {
  modelValue: {
    type: [Boolean, Promise] as PropType<boolean | Promise<boolean>>,
    default: false,
  },
  position: {
    type: [String, Array] as PropType<DialogPosition>,
    default: "center",
  },
  closeOnScrim: makeBooleanProp(true),
  title: makeStringProp(""),
  subtitle: makeStringProp(""),
  cancelText: makeStringProp(""),
  confirmText: makeStringProp(""),
  showCancel: makeBooleanProp(true),
  showConfirm: makeBooleanProp(true),
} as const;
```

#### Events

```typescript
export const inkDialogEmits = {
  "update:modelValue": (value: boolean) => typeof value === "boolean",
  cancel: () => true,
  confirm: () => true,
} as const;
```

#### Types

```typescript
type DialogPosition =
  | "center"
  | "left"
  | "right"
  | "bottom"
  | "top"
  | [number, number, number, number]; // [top, right, bottom, left]

// --- Props ---
export const inkDialogProps = {
  modelValue: {
    type: [Boolean, Promise] as PropType<boolean | Promise<boolean>>,
    default: false,
  }
```

#### Import

```typescript
import { inkDialog } from '@inkcre/web-design';
// or
import inkDialog from '@inkcre/web-design/components/inkDialog/inkDialog.vue';
```


---

### inkDoubleCheck

# InkDoubleCheck

Provides a confirmation mechanism for destructive or irreversible actions, preventing accidental clicks.

## Rationale

InkDoubleCheck exists to add a layer of confirmation for actions that could have significant consequences, such as deletions or irreversible changes. Use it when wrapping clickable elements that trigger such actions to avoid accidental executions. Do not use it for non-destructive actions or where confirmation is not necessary.

## Design Semantics

### Concepts

- `Confirmation Popup`: A modal dialog that appears on click, requiring user acknowledgment before proceeding.

### Visual / UX Meaning

The component maintains the original clickable element's appearance until clicked. Upon click, a popup overlays with a title, message, and action buttons. The confirm button is emphasized to guide the user towards confirmation, while cancel allows dismissal. States include open (popup visible) and closed (default).

## Canonical Examples

- Basic confirmation for a delete button:

  ```vue
  <InkDoubleCheck @confirm="deleteItem">
    <InkButton text="Delete" />
  </InkDoubleCheck>
  ```

## Behavioral Contract

- Click events on the wrapped element are intercepted and do not propagate until confirmation.
- The `confirm` event is emitted only after the user clicks the confirm button in the popup.
- The popup closes on either confirm or cancel, resetting the component to its initial state.
- No actions are performed if the popup is dismissed via cancel.

## Extension & Composition

- Can be composed with any clickable component via the default slot.
- Supports customization of popup text through props.
- Not recommended for use inside forms where validation might conflict.

## Non-Goals

- Handling the actual destructive action logic.
- Managing user permissions or authentication.
- Providing advanced popup customization beyond text.

## Implementation Notes

- Uses a slot to wrap the clickable element and attaches event listeners.
- Relies on a popup component for the confirmation dialog.
- State management handles popup visibility and event emission.

#### Props Definition

```typescript
export const inkDoubleCheckProps = {
  title: makeStringProp("Confirm Action"),
  message: makeStringProp("Are you sure you want to proceed?"),
  confirmText: makeStringProp("Confirm"),
  cancelText: makeStringProp("Cancel"),
} as const;
```

#### Events

```typescript
export const inkDoubleCheckEmits = {
  confirm: () => true,
} as const;
```

#### Import

```typescript
import { inkDoubleCheck } from '@inkcre/web-design';
// or
import inkDoubleCheck from '@inkcre/web-design/components/inkDoubleCheck/inkDoubleCheck.vue';
```


---

### inkDropdown

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

#### Props Definition

```typescript
export const inkDropdownProps = {
  ...formControlCommonProps,
  options: {
    type: Array as PropType<DropdownOption[]>,
  },
  refresher: {
    type: Function as PropType<() => Promise<DropdownOption[]>>,
  },
  modelValue: {
    type: [String, Number] as PropType<
      DropdownOption["value"] | undefined | null
    >,
    default: "",
  },
  placeholder: makeStringProp("Select an option"),
  displayAs: makeStringProp<"box">("box"),
} as const;
```

#### Events

```typescript
export const inkDropdownEmits = {
  "update:modelValue": (value: DropdownOption["value"]) => true,
  change: (value: DropdownOption["value"]) => true,
  "update:options": (options: DropdownOption[]) => true,
} as const;
```

#### Types

```typescript
interface DropdownOption {
  label: string;
  value: string | number;
  description?: string;
  [key: string]: any;
}
type DropdownOptionsSource = DropdownOption[];

// --- Props ---
export const inkDropdownProps = {
  ...formControlCommonProps,
  options: {
    type: Array as PropType<DropdownOption[]>,
  }
```

#### Import

```typescript
import { inkDropdown } from '@inkcre/web-design';
// or
import inkDropdown from '@inkcre/web-design/components/inkDropdown/inkDropdown.vue';
```


---

### inkField

# InkField

A component for displaying and editing key-value pairs in forms.

## Rationale

InkField exists to provide a consistent way to display labels and values in forms, supporting different layouts and editability.

Use it for form fields where you need a label and a value display or input; avoid using it for standalone labels or values without context.

## Design Semantics

### Concepts

- `layout`: arrangement of label and value (`inline`, `col`, `row`).
- `editable`: whether the value can be interacted with.
- `required`: indicates mandatory field.

### Visual / UX Meaning

- `inline`: label and value on the same line; value underlined and clickable if editable.
- `col`: label above value in a column.
- `row`: label and value side by side.

## Canonical Examples

- Inline editable field: Used for compact forms.

  ```vue
  <InkField label="Name" value="John Doe" />
  ```

- Column layout: For structured forms.

  ```vue
  <InkField label="Email" layout="col">
    <InkInput v-model="email" />
  </InkField>
  ```

- Required field: Indicates mandatory input.

  ```vue
  <InkField label="Password" required layout="col">
    <InkInput type="password" v-model="password" />
  </InkField>
  ```

## Behavioral Contract

- In editable state: value is clickable and emits 'value-click'.
- Required fields display a red asterisk next to the label.
- Layout changes affect positioning but not functionality.

## Extension & Composition

- Supports slot for custom value content (e.g., inputs, pickers).
- Can be used in forms with InkForm.

## Non-Goals

- Handling validation or submission logic.
- Data persistence.

## Implementation Notes

- Uses computed classes for layout and state.
- Relies on Vue slots for flexibility.

#### Props Definition

```typescript
export const inkFieldProps = {
  label: makeStringProp("Label"),
  layout: makeStringProp<FieldLayout>("col"),
  value: makeStringProp(""),
  editable: makeBooleanProp(true),
  required: makeBooleanProp(false),
} as const;
```

#### Events

```typescript
export const inkFieldEmits = {
  "value-click": () => true,
} as const;
```

#### Types

```typescript
type FieldLayout = "inline" | "col" | "row";

// --- Props ---
export const inkFieldProps = {
  label: makeStringProp("Label"),
  layout: makeStringProp<FieldLayout>("col"),
  value: makeStringProp(""),
  editable: makeBooleanProp(true),
  required: makeBooleanProp(false),
}
```

#### Import

```typescript
import { inkField } from '@inkcre/web-design';
// or
import inkField from '@inkcre/web-design/components/inkField/inkField.vue';
```


---

### inkForm

# InkForm

## Rationale

A form container component that provides consistent layout context for form controls.

## Goals

Provide a form wrapper that automatically configures child form controls (InkInput, InkTextarea, InkPicker) to use InkField for consistent field layouts.

## Specification

A form container that uses Vue's provide/inject API to communicate layout preferences to child form controls. Form controls inside InkForm will automatically wrap themselves with InkField.

## Implementation

### Props

- `layout` (`"inline" | "col" | "row"`, `"col"`): The default layout for all form fields inside this form

### Events

- `submit(e: Event)`: Emitted when the form is submitted

### Slots

- `default`: The form content (form controls, buttons, etc.)

### Context

The component provides `INK_FORM_CONTEXT_KEY` context that child form controls can inject to detect they are inside a form and access the default layout.

#### Props Definition

```typescript
export const inkFormProps = {
  layout: makeStringProp<FieldLayout>("col"),
} as const;
```

#### Events

```typescript
export const inkFormEmits = {
  submit: (e: Event) => true,
} as const;
```

#### Types

```typescript
interface InkFormContext {
  layout: FieldLayout;
}
```

#### Import

```typescript
import { inkForm } from '@inkcre/web-design';
// or
import inkForm from '@inkcre/web-design/components/inkForm/inkForm.vue';
```


---

### inkHeader

# InkHeader

A header component for application navigation and branding.

## Rationale

InkHeader exists to provide a consistent top navigation bar with logo, title, and menu options.

Use it for app headers where branding and navigation are needed; avoid using it for content headers or footers.

## Design Semantics

### Concepts

- `title`: main app or page title.
- `pageTitle`: current page or section title.
- `logoSrc`: image for branding.

### Visual / UX Meaning

- Logo and title on the left for branding.
- Page title and menu on the right for context and actions.

## Canonical Examples

- Basic header: With title and menu.

  ```vue
  <InkHeader title="My App" />
  ```

- With logo: For branded apps.

  ```vue
  <InkHeader title="InKCre" logoSrc="/logo.png" />
  ```

- With page title: Showing current section.

  ```vue
  <InkHeader title="Dashboard" pageTitle="Overview" />
  ```

## Behavioral Contract

- Clicking title or logo emits 'title-click'.
- Clicking menu emits 'menu-click'.
- Page title displays current route name if available.

## Extension & Composition

- Supports slot for custom right icon.
- Integrates with vue-router for automatic page titles.

## Non-Goals

- Handling routing or menu logic.
- Footer or sidebar functionality.

## Implementation Notes

- Uses vue-router if available for page title.
- Emits events for parent handling.

#### Props Definition

```typescript
export const inkHeaderProps = {
  title: makeStringProp("InKCre"),
  pageTitle: makeStringProp<string | undefined>(undefined),
  logoSrc: makeStringProp(""),
};

// --- Emits ---
export const inkHeaderEmits = {
  "menu-click": () => true,
  "title-click": () => true,
} as const;
```

#### Events

```typescript
export const inkHeaderEmits = {
  "menu-click": () => true,
  "title-click": () => true,
} as const;
```

#### Import

```typescript
import { inkHeader } from '@inkcre/web-design';
// or
import inkHeader from '@inkcre/web-design/components/inkHeader/inkHeader.vue';
```


---

### inkInput

# inkInput

> 提供灵活的文本输入，支持标准输入和内联编辑模式。
> Provides flexible text input with standard and inline editing modes.

---

## Usage Intent

### Why this exists
- 统一文本输入的样式和交互
- 支持表单集成和独立使用两种模式
- 提供内联编辑能力，适合详情页快速修改

### When to use
- 表单中的文本输入字段
- 需要内联编辑功能的场景
- 需要与 InkForm 集成的输入

### When NOT to use
- 多行文本输入（使用 `InkTextarea`）
- 选择型输入（使用 `InkDropdown` 或 `InkPicker`）

---

## Design Semantics

### Concepts
- `type`: 输入模式 / Input mode
  - `default`: 标准输入框，带边框 / Standard input with border
  - `inline`: 内联编辑，点击后显示输入框 / Inline edit, shows input on click
- `layout`: 与标签的布局关系（仅在表单中有效）/ Layout with label (only in forms)

### Visual / UX Meaning
- **Default Type**: 明确的输入区域，适合表单填写
- **Inline Type**: 低干扰的编辑体验，适合详情页修改

---

## Canonical Examples

> 以下示例是**规范用法**，不是完整参数排列组合。


  
    <InkInput
      modelValue=""
      label="Full Name"
      placeholder="Enter your name"
      layout="col"
    />
  

  
    <InkInput
      modelValue=""
      label="Email"
      placeholder="email@example.com"
      layout="inline"
    />
  



  
    <InkInput
      modelValue=""
      label="Nickname"
      placeholder="Optional field"
      :required="false"
      layout="col"
    />
  

  
    <InkInput
      modelValue=""
      label="Email Address"
      placeholder="email@example.com"
      :required="true"
      layout="col"
    />
  


---

## Behavioral Contract

> 这些是**使用者可以依赖的行为保证**。

- 当 `type="default"` 时：
  - ✅ 始终显示输入框
  - ✅ 实时触发 `update:modelValue` 事件
- 当 `type="inline"` 时：
  - ✅ 默认显示纯文本
  - ✅ 点击后切换为输入框
  - ✅ 按 Enter 保存，按 Esc 取消
  - ✅ 失焦时退出编辑但不保存
- 与 InkForm 集成时：
  - ✅ 自动继承表单的 layout 配置
  - ✅ 自动使用 InkField 包装

---

## Public API

### Props
- `modelValue`: 输入值（支持 v-model）/ Input value (supports v-model)
- `type`: 输入类型 (`default` | `inline`) / Input type
- `label`: 字段标签（启用 InkField 包装）/ Field label (enables InkField wrapper)
- `layout`: 布局模式（仅在有 label 时）/ Layout mode (only with label)
- `placeholder`: 占位符文本 / Placeholder text
- `required`: 是否必填 / Whether required
- `editable`: 是否可编辑 / Whether editable

> 完整类型、默认值与可控项请参考下方自动生成的 API 表格。

### Events
- `update:modelValue(value: string)`: 输入值变化时触发 / Emitted when input value changes

---

## Extension & Composition

- 可独立使用或集成在 InkForm 中
- 支持 v-model 双向绑定
- 内联模式适合与 InkField 组合使用

---

## Non-Goals

> 以下内容**不属于该组件的职责范围**。

- 不提供输入验证（应由表单层处理）
- 不处理密码显示/隐藏（使用专门的密码组件）
- 不支持多行文本（使用 InkTextarea）

---

## Implementation Notes

> ⚠️ 面向维护者，而非组件使用者。

- 使用 `@vueuse/core` 的 `createReusableTemplate` 实现模板复用
- 内联模式通过 ref 管理编辑状态
- 依赖 InkForm 的 provide/inject 机制自动集成


### Slots

- `default`: Customize the display value in inline mode. If not provided, displays the `modelValue` by default.

### Inline Type Behavior

When `type="inline"`:

- Displays as plain text by default
- Clicking the text enters edit mode
- Shows a bordered input field in edit mode (same as default type)
- **Pressing Enter saves the edit and exits edit mode**
- **Pressing Esc or clicking outside exits edit mode without saving changes**
- Use the default slot to customize how the value is displayed

#### Props Definition

```typescript
export const inkInputProps = {
  ...formControlCommonProps,
  modelValue: makeStringProp(""),
  placeholder: makeStringProp(""),
  type: makeStringProp<InkInputType>("default"),
} as const;
```

#### Events

```typescript
export const inkInputEmits = {
  "update:modelValue": (value: string) => true,
} as const;
```

#### Types

```typescript
type InkInputType = "default" | "inline";

// --- Props ---
export const inkInputProps = {
  ...formControlCommonProps,
  modelValue: makeStringProp(""),
  placeholder: makeStringProp(""),
  type: makeStringProp<InkInputType>("default"),
}
```

#### Import

```typescript
import { inkInput } from '@inkcre/web-design';
// or
import inkInput from '@inkcre/web-design/components/inkInput/inkInput.vue';
```


---

### inkJsonEditor

# InkJsonEditor

A specialized textarea component for editing JSON with enhanced editing features.

## Rationale

InkJsonEditor exists to provide a consistent JSON editor field for forms with smart indentation, quote completion, and comma completion to streamline JSON configuration editing.

Use it for editing JSON strings in forms; avoid using it for general text editing or non-JSON content.

## Design Semantics

### Concepts

### Visual / UX Meaning

- Editable mode: displays a textarea with JSON editing features
- Read-only mode: displays formatted JSON text

## Canonical Examples

- Basic editable JSON editor:

  ```html
  <InkJsonEditor v-model="{}" />
  ```

- With label inside form:

  ```html
  <InkField label="Configuration">
    <InkJsonEditor v-model="{}" />
  </InkField>
  ```

- Read-only display:

  ```html
  <InkJsonEditor :editable="false" v-model='{"key": "value"}' />
  ```

- Json Schema:

  ```html
  <InkJsonEditor v-model='{"key": "value"}' schema='{"type": "object", "properties": {...}}'  />
  ```

## Behavioral Contract

- Use modelValue and ensures it's a valid JSON string (If editor value is invalid, will not update to modelValue)
- Supports keyboard shortcuts: Tab/Shift+Tab for indentation, quote auto-completion, comma completion
- Supports to provide lint and autocomplete from JSON Schema.

## Extension & Composition

- Integrates with InkForm and InkField for consistent form layout
- Can be used standalone or within forms
- Supports custom layouts via `layout` prop

## Non-Goals

- General text editing (only optimized for JSON)
- Data validation beyond JSON syntax
- File upload or external JSON loading

## Implementation Notes

- Built on Code Mirror 6 and vscode-json-languageservice for advanced editing features
- Height is fixed to `rows * 1.2em + space-sm * 2` and so set `line-height: 1.2 !important`
- JSON edit features: tab indentation, quote completion, comma completion, JSON schema support (vscode-json-languageservice)

#### Props Definition

```typescript
export const inkJsonEditorProps = {
  ...formControlCommonProps,
  /** Ensured to be a valid JSON string
   */
  modelValue: makeStringProp(""),
  placeholder: makeStringProp(""),
  /**
   * the number of visible text rows, affecting the fixed height
   */
  rows: makeNumberProp(5),
  // --- JSON Schema features ---
  schema: makeObjectProp(),
  schemaUri: makeStringProp("inkcre://schema.json"),
} as const;
```

#### Events

```typescript
export const inkJsonEditorEmits = {
  "update:modelValue": (value: string) => true,
} as const;
```

#### Import

```typescript
import { inkJsonEditor } from '@inkcre/web-design';
// or
import inkJsonEditor from '@inkcre/web-design/components/inkJsonEditor/inkJsonEditor.vue';
```


---

### inkLoading

# InkLoading

A loading indicator for asynchronous operations.

## Rationale

InkLoading exists to provide visual feedback during loading states, using an animated sequence of blocks.

Use it for loading screens or inline loading; avoid using it for static placeholders.

## Design Semantics

### Concepts

- `size`: dimensions of the blocks (`xs`, `sm`, `md`).
- `density`: spacing between blocks (`sm`, `md`).

### Visual / UX Meaning

- Animated pulsing blocks indicate ongoing process.
- Size affects prominence; density affects compactness.

## Canonical Examples

- Default loading: Standard size and density.

  ```vue
  <InkLoading />
  ```

- Small compact: For tight spaces.

  ```vue
  <InkLoading size="sm" density="sm" />
  ```

## Behavioral Contract

- Continuous animation loop.
- No user interaction; purely visual.

## Extension & Composition

- Can be overlaid on content or used inline.

## Non-Goals

- Progress indication or text labels.
- Interactive elements.

## Implementation Notes

- Uses CSS keyframes for animation.
- Sequential delays for wave effect.

#### Props Definition

```typescript
export const inkLoadingProps = {
  size: makeStringProp<LoadingSize>("md"),
  density: makeStringProp<LoadingDensity>("md"),
} as const;
```

#### Types

```typescript
type LoadingSize = "xs" | "sm" | "md";
type LoadingDensity = "sm" | "md";

// --- Props ---
export const inkLoadingProps = {
  size: makeStringProp<LoadingSize>("md"),
  density: makeStringProp<LoadingDensity>("md"),
}
```

#### Import

```typescript
import { inkLoading } from '@inkcre/web-design';
// or
import inkLoading from '@inkcre/web-design/components/inkLoading/inkLoading.vue';
```


---

### inkPagination

# InkPagination

A pagination component that provides a row of page buttons with outline on hover and prev/next navigation actions.

## Rationale

InkPagination exists to provide consistent navigation through paginated content across the product. It displays page numbers as buttons and provides previous/next navigation controls. It supports two types: default (with numbered buttons) and text (with text navigation and page info).

Use it when you need to navigate through multiple pages of content in a list or table view. Avoid using it when content should be loaded incrementally (use infinite scroll instead) or when there are very few items that fit on one page.

## Design Semantics

### Concepts

- `currentPage`: the currently active page number (1-indexed)
- `totalPages`: the total number of pages available
- `type`: the pagination type - "default" (numbered buttons) or "text" (text navigation with page info)
- `page-change` event: emitted when user clicks on a page button or prev/next navigation

### Visual / UX Meaning

**Default type:**
- Page buttons show transparent background with outline border on hover
- Active page button has primary color border and subtle background
- Prev/Next buttons show chevron icons and are disabled at boundaries
- Ellipsis (...) shows when there are many pages, indicating hidden pages

**Text type:**
- Shows "Previous" and "Next" text buttons
- Displays "x of y" page information in the center
- No numbered page buttons
- Navigation buttons are disabled at boundaries

## Canonical Examples

- Basic pagination with few pages:

  ```vue
  <InkPagination
    :current-page="currentPage"
    :total-pages="5"
    @page-change="(page) => (currentPage = page)"
  />
  ```

- Pagination with many pages (shows ellipsis):

  ```vue
  <InkPagination
    :current-page="currentPage"
    :total-pages="50"
    @page-change="(page) => (currentPage = page)"
  />
  ```

- Text type pagination:

  ```vue
  <InkPagination
    type="text"
    :current-page="currentPage"
    :total-pages="20"
    @page-change="(page) => (currentPage = page)"
  />
  ```

## Behavioral Contract

- Clicking a page button emits `page-change` event with the page number
- Clicking prev/next buttons navigates to adjacent pages
- Prev button is disabled on first page
- Next button is disabled on last page
- Active page button cannot be clicked again (default type only)
- When there are 7 or fewer pages, all pages are shown (default type only)
- When there are more than 7 pages, ellipsis (...) appears to indicate hidden pages (default type only)
- Pages are always 1-indexed (first page is 1, not 0)
- Text type displays "x of y" format for page information

## Extension & Composition

- The component is intentionally simple and designed for direct use
- Works well inside table footers or list containers
- Parent component should manage the current page state via v-model pattern or event handling

## Non-Goals

- Does not handle data fetching or loading states
- Does not provide per-page size selection (e.g., "10 per page" dropdown)
- Does not show total item count or "showing X-Y of Z" text
- Does not support custom page ranges or arbitrary page jumps via input field

## Implementation Notes

- Props: `currentPage` (number, default 1), `totalPages` (number, default 1), `type` (string, default "default")
- Emits: `page-change` (page: number) when user navigates to a different page
- Uses chevron icons from mdi icon set for prev/next navigation (default type)
- The ellipsis button is disabled and cannot be clicked (default type)
- Smart page number display: shows first, last, current, and adjacent pages with ellipsis for gaps (default type)
- Text type uses InkButton components with "subtle" theme

#### Props Definition

```typescript
export const inkPaginationProps = {
	currentPage: makeNumberProp(1),
	totalPages: makeNumberProp(1),
	type: makeStringProp<PaginationType>("default"),
} as const;
```

#### Events

```typescript
export const inkPaginationEmits = {
	"page-change": (page: number) => true,
} as const;
```

#### Types

```typescript
type PaginationType = "default" | "text";

// --- Props ---
export const inkPaginationProps = {
	currentPage: makeNumberProp(1),
	totalPages: makeNumberProp(1),
	type: makeStringProp<PaginationType>("default"),
}
```

#### Import

```typescript
import { inkPagination } from '@inkcre/web-design';
// or
import inkPagination from '@inkcre/web-design/components/inkPagination/inkPagination.vue';
```


---

### inkPicker

# InkPicker

## Rationale

A unified picker component that combines field, value display, formatter, popup, and picker view functionality.

## Goals

Provide a consistent picker field for forms that integrates field layout, value formatting, and picker interactions.

## Specification

Displays a value that can be clicked to pick, in inline or box layout. When used inside InkForm with a label, it automatically integrates with InkField for consistent field layout. The component combines:

- Field wrapper (via InkField when inside InkForm with label)
- Value display with formatting (via formatter prop)
- Picker view (via InkDatetimePickerView when type is set)
- Click interaction (via pick event)

## Implementation

### Props

- `modelValue` (`string | any`, `""`)：The value to display and edit
- `editable` (`boolean`, `true`)：Whether the picker is clickable
- `type` (`"date" | "time" | "datetime" | undefined`, `undefined`)：If set, uses InkDatetimePickerView for the specified mode
- `displayValueAs` (`"inline-text" | "box"`, `"inline-text"`)：The display style
- `formatter` (`(value: any) => string | undefined`, `undefined`)：Custom formatter function for the display value
- `showPopup` (`boolean`, `false`)：Controls the visibility of the popup
- `prop` (`string`, `""`)：The property name for form binding
- `label` (`string`, `""`)：The field label. When provided and inside InkForm, the component uses InkField internally
- `layout` (`"inline" | "col" | "row" | undefined`, `undefined`)：The field layout (only applies when inside InkForm with label). If not specified, inherits from InkForm's layout

### Events

- `pick()`: Emitted when the picker is clicked and editable
- `update:modelValue(value: any)`: Emitted when the model value changes
- `update:showPopup(value: boolean)`: Emitted when the popup visibility changes

### Models

- `modelValue` (`string | any`, `""`)：The value to display and edit
- `showPopup` (`boolean`, `false`)：Controls the visibility of the popup

### Slots

- `default`: custom picker view in popup
  - mount when `props.type` not set
  - `closePopup() => void` will be provided

#### Types

```typescript
type DisplayValueAs = "inline-text" | "box";
type InkPickerType = "date" | "time" | "datetime";

// --- Props ---
export const inkPickerProps = <T>() =>
  ({
    ...formControlCommonProps,
    modelValue: {
      type: [String, Object, Date] as PropType<T>,
    }
```

#### Import

```typescript
import { inkPicker } from '@inkcre/web-design';
// or
import inkPicker from '@inkcre/web-design/components/inkPicker/inkPicker.vue';
```


---

### inkPlaceholder

# InkPlaceholder

A component to communicate empty or error states and guide users to appropriate actions.

## Rationale

InkPlaceholder exists to provide consistent visual feedback when content is unavailable or an error occurs, reducing user confusion and providing clear next steps.

Use it when:

- A view has no data to display (empty state)
- An operation fails and the user needs guidance (error state)
- You need to suggest actions to resolve the empty/error condition

Avoid using it for:

- Loading states (use InkLoading instead)
- Inline validation errors (use form field validation)
- Temporary placeholder content during data fetching

## Design Semantics

### Concepts

- `state`: visual variant representing the reason for no content (`empty`, `error`)
- `illustration`: icon or custom visual representing the state
- `title`: primary message explaining the state
- `description`: secondary text providing context or guidance
- `actions`: suggested actions to resolve or navigate away from the state

### Visual / UX Meaning

- `empty`: neutral state indicating no data exists yet; uses subtle colors to avoid alarm
- `error`: critical state indicating something went wrong; uses danger colors to signal urgency

## Canonical Examples

- Empty state (default): Used when a list, table, or collection has no items.

  ```vue
  <InkPlaceholder state="empty" />
  ```

- Empty state with custom content and actions: Guide users to create their first item.

  ```vue
  <InkPlaceholder
    state="empty"
    title="No projects"
    description="Start by creating your first project."
  >
    <template #actions>
      <InkButton text="Create Project" theme="primary" />
    </template>
  </InkPlaceholder>
  ```

- Error state with retry: Used when an operation fails and can be retried.

  ```vue
  <InkPlaceholder
    state="error"
    title="Connection failed"
    description="Unable to connect to the server."
  >
    <template #actions>
      <InkButton text="Retry" theme="primary" />
    </template>
  </InkPlaceholder>
  ```

- Custom illustration via slot: Override the default icon with custom content.

  ```vue
  <InkPlaceholder state="empty" title="No files" description="Upload a file to get started.">
    <template #illustration>
      <span class="i-mdi-folder-outline" />
    </template>
  </InkPlaceholder>
  ```

## Behavioral Contract

- Default content is provided for both `empty` and `error` states:
  - Empty: "No data" title, "There's nothing here yet." description, inbox icon
  - Error: "Something went wrong" title, "An error occurred. Please try again." description, alert icon
- All content (illustration, title, description) can be overridden via props or slots
- Actions slot is only rendered when provided (does not show empty container)
- The component is presentational only; it does not handle action logic or state management

## Extension & Composition

- Can be used in any container requiring empty/error state feedback
- Supports full customization via named slots (illustration, title, description, actions)
- Works well with InkButton for action suggestions
- Not recommended for use within small containers (< 300px wide) due to centered layout

## Non-Goals

- Does not handle loading states or async operations
- Does not manage retry logic or error recovery (caller's responsibility)
- Does not provide built-in navigation or routing
- Does not enforce specific icon libraries (UnoCSS icons work by default)

## Implementation Notes

- Props: `state` (`empty` | `error`, default `empty`), `illustration` (string), `title` (string), `description` (string)
- Slots: `illustration`, `title`, `description`, `actions`
- Default icons use UnoCSS MDI icons: `i-mdi-inbox-outline` (empty), `i-mdi-alert-circle-outline` (error)
- Consumers should add default icons to UnoCSS safelist: `i-mdi-inbox-outline`, `i-mdi-alert-circle-outline`
- Layout uses flexbox with centered alignment; max-width on description (400px) for readability

#### Props Definition

```typescript
export const inkPlaceholderProps = {
  /** The state of the placeholder */
  state: makeStringProp<PlaceholderState>("empty"),
  /** The illustration to display (icon class name or custom content via slot) */
  illustration: makeStringProp<string>(""),
  /** The title text */
  title: makeStringProp<string>(""),
  /** The description text */
  description: makeStringProp<string>(""),
} as const;
```

#### Types

```typescript
type PlaceholderState = "empty" | "error";

// --- Props ---
export const inkPlaceholderProps = {
  /** The state of the placeholder */
  state: makeStringProp<PlaceholderState>("empty"),
  /** The illustration to display (icon class name or custom content via slot) */
  illustration: makeStringProp<string>(""),
  /** The title text */
  title: makeStringProp<string>(""),
  /** The description text */
  description: makeStringProp<string>(""),
}
```

#### Import

```typescript
import { inkPlaceholder } from '@inkcre/web-design';
// or
import inkPlaceholder from '@inkcre/web-design/components/inkPlaceholder/inkPlaceholder.vue';
```


---

### inkPopup

# InkPopup

A flexible popup component with support for multiple positions, scrim overlay, and v-model control.

## Features

- **Flexible Positioning**: Support for predefined positions (`center`, `left`, `right`, `top`, `bottom`) or custom coordinates
- **Scrim Control**: Overlay that can close the popup on click
- **V-Model Support**: Easy open/close state management
- **Transitions**: Smooth fade and slide animations
- **Teleport**: Renders at the document root to avoid z-index stacking issues

## Usage

### Basic Example

```vue
<script setup lang="ts">
import { ref } from "vue";
import InkPopup from "@/components/common/InkPopup/InkPopup.vue";

const isOpen = ref(false);
</script>

<template>
  <button @click="isOpen = true">Open Popup</button>

  <InkPopup v-model:open="isOpen">
    <div>Popup content here</div>
  </InkPopup>
</template>
```

### Positioned Popup

```vue
<InkPopup v-model:open="isOpen" position="top">
  <div>Popup content</div>
</InkPopup>
```

### Custom Position

```vue
<InkPopup v-model:open="isOpen" :position="[10, 20, 30, 40]">
  <div>Popup content</div>
</InkPopup>
```

### Disable Scrim Close

```vue
<InkPopup v-model:open="isOpen" :close-on-scrim="false">
  <div>Popup content</div>
</InkPopup>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | `false` | Controls popup visibility (supports v-model) |
| `position` | `PopupPosition` | `'center'` | Position of the popup: `'center'`, `'left'`, `'right'`, `'top'`, `'bottom'`, or array `[top, right, bottom, left]` |
| `closeOnScrim` | `boolean` | `true` | Whether clicking the scrim closes the popup |

## Types

```typescript
type PopupPosition =
  | "center"
  | "left"
  | "right"
  | "bottom"
  | "top"
  | [number, number, number, number]; // [top, right, bottom, left]
```

#### Props Definition

```typescript
export const inkPopupProps = {
  position: {
    type: [String, Array] as PropType<PopupPosition>,
    default: "center",
  },
  closeOnScrim: makeBooleanProp(true),
} as const;
```

#### Events

```typescript
export const inkPopupEmits = {
  "scrim-click": () => true,
} as const;
```

#### Types

```typescript
type PopupPosition =
  | "center"
  | "left"
  | "right"
  | "bottom"
  | "top"
  | [number, number, number, number]; // [top, right, bottom, left]

// --- Props ---
export const inkPopupProps = {
  position: {
    type: [String, Array] as PropType<PopupPosition>,
    default: "center",
  }
```

#### Import

```typescript
import { inkPopup } from '@inkcre/web-design';
// or
import inkPopup from '@inkcre/web-design/components/inkPopup/inkPopup.vue';
```


---

### inkSwitch

# InkSwitch

A toggle switch for binary state selection.

## Rationale

InkSwitch exists to allow users to toggle between two states, with support for async operations.

Use it for settings or preferences; avoid using it for multi-state selections.

## Design Semantics

### Concepts

- `modelValue`: boolean or promise for the state.
- `size`: visual size (`xs`, `sm`, `md`, `lg`).
- `showLabel`: whether to display on/off text.

### Visual / UX Meaning

- On state: switch to the right, green or active color.
- Off state: switch to the left, default color.
- Size affects touch target and prominence.

## Canonical Examples

- Basic toggle: On/off without labels.

  ```vue
  <InkSwitch v-model="enabled" />
  ```

- With labels: Showing state text.

  ```vue
  <InkSwitch v-model="enabled" showLabel />
  ```

- Async toggle: For operations that take time.

  ```vue
  <InkSwitch v-model="asyncToggle" />
  ```

## Behavioral Contract

- Clicking toggles the value and emits update.
- During async switching, prevents further clicks.
- Label shows 'ON' or 'OFF' based on state.

## Extension & Composition

- Supports v-model for two-way binding.
- Can be used in forms or settings panels.

## Non-Goals

- Multi-value selection.
- Complex state management.

## Implementation Notes

- Uses useAsyncState for promise handling.
- Computed classes for styling.

#### Props Definition

```typescript
export const inkSwitchProps = {
  modelValue: {
    type: [Boolean, Promise] as PropType<boolean | Promise<boolean>>,
    default: false,
  },
  // TODO add SizeItems type
  size: makeStringProp<"xs" | "sm" | "md" | "lg">("md"),
  showLabel: makeBooleanProp(true),
  offText: makeStringProp("OFF"),
  onText: makeStringProp("ON"),
  isSwitching: makeBooleanProp(false),
} as const;
```

#### Events

```typescript
export const inkSwitchEmits = {
  "update:modelValue": (value: boolean) => true,
} as const;
```

#### Import

```typescript
import { inkSwitch } from '@inkcre/web-design';
// or
import inkSwitch from '@inkcre/web-design/components/inkSwitch/inkSwitch.vue';
```


---

### inkTextarea

# InkTextarea

A multi-line text input component for forms.

## Rationale

InkTextarea exists to allow users to input or display multi-line text, integrating with forms for consistent layout.

Use it for comments, descriptions, or any multi-line text input; avoid using it for single-line inputs.

## Design Semantics

### Concepts

- `editable`: whether the text can be edited.
- `rows`: number of visible lines.
- `placeholder`: hint text when empty.

### Visual / UX Meaning

- Editable: shows textarea for input.
- Read-only: displays formatted text.
- Integrates with InkField in forms for labeling.

## Canonical Examples

- Basic editable textarea: For user input.

  ```vue
  <InkTextarea v-model="description" rows="4" />
  ```

- In form with label: Automatic field layout.

  ```vue
  <InkForm>
    <InkTextarea label="Comments" v-model="comments" />
  </InkForm>
  ```

- Read-only display: Showing text.

  ```vue
  <InkTextarea :value="bio" :editable="false" />
  ```

## Behavioral Contract

- In editable mode: emits update:value on input.
- In read-only: displays value as text.
- When in form with label: uses InkField for layout.

## Extension & Composition

- Supports v-model for two-way binding.
- Composes with InkForm for validation and layout.

## Non-Goals

- Single-line text input.
- Rich text editing.

## Implementation Notes

- Uses reusable template for conditional rendering.
- Injects form context for integration.

#### Props Definition

```typescript
export const inkTextareaProps = {
  ...formControlCommonProps,
  value: makeStringProp(""),
  placeholder: makeStringProp(""),
  rows: {
    type: Number,
    default: 5,
  },
} as const;
```

#### Events

```typescript
export const inkTextareaEmits = {
  "update:value": (value: string) => true,
} as const;
```

#### Types

```typescript
type FieldLayout = "inline" | "col" | "row";

// --- Props ---
export const inkTextareaProps = {
  ...formControlCommonProps,
  value: makeStringProp(""),
  placeholder: makeStringProp(""),
  rows: {
    type: Number,
    default: 5,
  }
```

#### Import

```typescript
import { inkTextarea } from '@inkcre/web-design';
// or
import inkTextarea from '@inkcre/web-design/components/inkTextarea/inkTextarea.vue';
```


---

### inkTooltip

# inkTooltip

> 在 hover 时显示上下文提示信息，帮助用户理解功能或内容。
> Shows contextual hints on hover to help users understand features or content.

---

## Usage Intent

### Why this exists
- 提供非侵入式的额外信息展示
- 避免界面过度拥挤
- 统一提示信息的交互和样式

### When to use
- 图标或缩写需要解释时
- 提供操作的额外说明
- 显示截断文本的完整内容

### When NOT to use
- 关键信息（应直接显示）
- 移动端（hover 不可用，使用其他方式）
- 长篇帮助文本（使用帮助面板）

---

## Design Semantics

### Concepts
- `position`: 提示框位置，避免遮挡内容 / Tooltip position to avoid blocking content
- `content`: 提示文本，简洁明了 / Hint text, clear and concise

### Visual / UX Meaning
- **Hover 触发**: 鼠标悬停时显示，移开时隐藏
- **位置选择**: 根据触发元素位置自动避免溢出视口

---

## Canonical Examples

> 以下示例是**规范用法**，不是完整参数排列组合。


  
    <InkTooltip content="Tooltip on top" position="top">
      <button style="padding: 8px 16px; cursor: pointer;">
        Hover (Top)
      </button>
    </InkTooltip>
  

  
    <InkTooltip content="Tooltip on bottom" position="bottom">
      <button style="padding: 8px 16px; cursor: pointer;">
        Hover (Bottom)
      </button>
    </InkTooltip>
  

  
    <InkTooltip content="Tooltip on left" position="left">
      <button style="padding: 8px 16px; cursor: pointer;">
        Hover (Left)
      </button>
    </InkTooltip>
  

  
    <InkTooltip content="Tooltip on right" position="right">
      <button style="padding: 8px 16px; cursor: pointer;">
        Hover (Right)
      </button>
    </InkTooltip>
  


---

## Behavioral Contract

> 这些是**使用者可以依赖的行为保证**。

- 鼠标悬停时：
  - ✅ 显示提示框
  - ✅ 提示框定位在指定方向
- 鼠标移开时：
  - ✅ 隐藏提示框
- 提示框：
  - ❌ 不会阻挡鼠标事件
  - ❌ 不会影响页面布局

---

## Public API

### Props
- `content`: 提示文本内容 / Tooltip text content
- `position`: 提示框位置 (`top` | `bottom` | `left` | `right`) / Tooltip position

> 完整类型、默认值与可控项请参考下方自动生成的 API 表格。

---

## Slots

### default
触发提示的元素，通常是图标、按钮或文本。
Trigger element, usually an icon, button, or text.

---

## Extension & Composition

- 可包裹任何需要提示的元素
- 建议提示文本不超过一行
- 不要嵌套使用多个 tooltip

---

## Non-Goals

> 以下内容**不属于该组件的职责范围**。

- 不支持富文本内容（使用 Popover 组件）
- 不处理移动端点击显示（移动端应使用其他方式）
- 不提供箭头指示器（保持简洁）

---

## Implementation Notes

> ⚠️ 面向维护者，而非组件使用者。

- 使用 absolute 定位实现位置控制
- hover 状态通过 ref 管理
- CSS transition 实现显示/隐藏动画
- 依赖父元素的 relative 定位

#### Props Definition

```typescript
export const inkTooltipProps = {
  content: makeStringProp(""),
  position: makeStringProp<TooltipPosition>("top"),
} as const;
```

#### Events

```typescript
export const inkTooltipEmits = {} as const;
```

#### Types

```typescript
type TooltipPosition = "top" | "bottom" | "left" | "right";

// --- Props ---
export const inkTooltipProps = {
  content: makeStringProp(""),
  position: makeStringProp<TooltipPosition>("top"),
}
```

#### Import

```typescript
import { inkTooltip } from '@inkcre/web-design';
// or
import inkTooltip from '@inkcre/web-design/components/inkTooltip/inkTooltip.vue';
```

## Utilities

The design system provides several utility functions and composables.

### Vue Props Utilities

```typescript
import { makeStringProp, makeBooleanProp, makeNumberProp } from '@inkcre/web-design/utils';

// Create props with defaults and type safety
const props = {
  text: makeStringProp("Default text"),
  isActive: makeBooleanProp(false),
  count: makeNumberProp(0),
};
```

### Composables

Use the router and i18n composables to access provided instances:

```typescript
import { useOptionalRouter, useOptionalI18n } from '@inkcre/web-design';

const router = useOptionalRouter(); // Returns null if not provided
const i18n = useOptionalI18n();     // Returns null if not provided

if (router) {
  console.log(router.currentPath.value);
}

if (i18n) {
  console.log(i18n.t('common.save'));
}
```

## Best Practices

### Component Development

1. **Single Responsibility Principle**: Each component should do one thing well
2. **High Cohesion, Low Coupling**: Keep related code together, minimize dependencies
3. **Clear and Consistent API**: Props and events should be intuitive
4. **Avoid Prop Drilling**: Use provide/inject for deeply nested data
5. **Easy to Test and Maintain**: Write testable, readable code

### Naming Conventions

- **Components**: `camelCase` (e.g., `inkButton`)
- **CSS Classes**: `kebab-case` (e.g., `ink-button`)
- **Props/Variables**: `camelCase` (e.g., `isLoading`)
- **Events**: `kebab-case` (e.g., `update:modelValue`)

### Error Handling

- Use graceful degradation
- Provide user-friendly error messages
- Log errors appropriately
- Validate inputs and provide defaults

### Accessibility

- Use semantic HTML elements
- Provide ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers
- Maintain proper color contrast

### Performance

- Use `v-if` vs `v-show` appropriately
- Avoid unnecessary watchers
- Use `computed` for derived state
- Lazy load components when possible
- Optimize large lists with virtual scrolling

## Coding Guidelines

### Code for Human Brains

Write code that's easy to understand and maintain:

- **Keep it simple**: Prefer straightforward solutions
- **Limit cognitive load**: Keep functions and conditions simple (≤4 concepts)
- **Use meaningful names**: Variables and functions should be self-documenting
- **Prefer early returns**: Avoid deeply nested conditions
- **Comment the "why"**: Explain motivation, not just what the code does

### Example: Complex vs Simple

❌ Hard to understand:
```typescript
if (val > someConstant && (condition2 || condition3) && (condition4 && !condition5)) {
  // What are we checking here?
}
```

✅ Easy to understand:
```typescript
const isValid = val > someConstant;
const isAllowed = condition2 || condition3;
const isSecure = condition4 && !condition5;

if (isValid && isAllowed && isSecure) {
  // Clear what each condition means
}
```


---

*This documentation was auto-generated by build-claude-skill.ts*
