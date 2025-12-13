# `@inkcre/web-design` components coding guide

## File Structure

Each component has a folder (`compName/`) containing the following files:

- `compName.md`: component documentation, [more](./AGENTS.comp-doc.md)
- `compName.vue`: template, component specific logic, [more](./AGENTS.comp-vue.md)
- `compName.ts`: component props, emits, models, types, constants, utilities, [detailed guide](./AGENTS.comp-ts.md)
- `compName.scss`: component styles, [more](./AGENTS.comp-scss.md)

## Best Practices

- Single Responsibility Principle
- High Cohesion and Low Coupling
- Easy to Test and Maintain
- Clear and consistent API
- Avoid prop drilling
- Proper use of provide/inject

### Interface

- if prop `modelValue` is mutable, and the component tends to be state less, name it `value` and do not emit `update:value`

### Naming

- `camelCase` for component name, variables, functions
- `kebab-case` for selectors, events

### Error Handling

- Graceful degradation
- User-friendly error messages
- Logging
