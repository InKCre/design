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
  <InkButton text="Save" type="primary" />
  ```

- Danger: Used for destructive actions where the user must confirm an operation.

  ```vue
  <InkButton text="Delete" type="danger" />
  ```

- Small size: Use in dense toolbars or where space is constrained.

  ```vue
  <InkButton text="Edit" size="sm" />
  ```

### Custom slot content (icon + label)

The `slot` is supported for custom content; this is how you add icons or non-text children.

```vue
<InkButton type="primary">
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
