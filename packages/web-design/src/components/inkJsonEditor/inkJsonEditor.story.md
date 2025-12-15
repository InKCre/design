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

- Use modelValue
- Supports keyboard shortcuts: Tab/Shift+Tab for indentation, quote auto-completion, comma completion
- Uses JSON schema validation via `vscode-json-languageservice`
- When `editable` is false, no input is allowed

## Extension & Composition

- Integrates with InkForm and InkField for consistent form layout
- Can be used standalone or within forms
- Supports custom layouts via `layout` prop

## Non-Goals

- General text editing (only optimized for JSON)
- Data validation beyond JSON syntax
- File upload or external JSON loading

## Implementation Notes

- Built on Code Mirror 6 for advanced editing features
- Height is fixed to `rows * 1.2em + space-sm * 2` and so set `line-height: 1.2 !important`
- JSON edit features: tab indentation, quote completion, comma completion, JSON schema support (vscode-json-languageservice)

### Other

It's not time to reinvent the wheel yet; when learning, prioritize getting the product online first; use mature libraries like Code Mirror 6
