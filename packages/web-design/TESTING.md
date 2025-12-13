# Component Testing & Playground

This package uses [Histoire](https://histoire.dev/) for component playground/documentation and [Vitest](https://vitest.dev/) for unit testing.

## Setup for Development

Some components use optional peer dependencies. Install them for full functionality during development:

```bash
pnpm add -D @vueuse/core dayjs @codemirror/autocomplete @codemirror/commands @codemirror/lang-json @codemirror/state @codemirror/view vue-router
```

These are optional in production and consumers only need to install the ones they use.

## Component Playground (Histoire)

Histoire provides an interactive playground for exploring and documenting components.

### Running the Playground

```bash
# Start development server
pnpm story:dev

# Build static documentation
pnpm story:build

# Preview built documentation
pnpm story:preview
```

The playground will be available at `http://localhost:6006` (default).

### Writing Stories

Create a `.story.vue` file next to your component:

```vue
<script setup lang="ts">
import MyComponent from "./MyComponent.vue";
</script>

<template>
  <Story title="Category/ComponentName">
    <Variant title="Default">
      <MyComponent prop="value" />
    </Variant>
    
    <Variant title="Alternative">
      <MyComponent prop="different" />
    </Variant>
  </Story>
</template>
```

## Component Testing (Vitest)

Vitest provides fast unit testing for components.

### Running Tests

```bash
# Run tests in watch mode
pnpm test

# Run tests with UI
pnpm test:ui

# Generate coverage report
pnpm test:coverage
```

### Writing Tests

Create a `.test.ts` file next to your component:

```typescript
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import MyComponent from "./MyComponent.vue";

describe("MyComponent", () => {
  it("renders correctly", () => {
    const wrapper = mount(MyComponent, {
      props: { text: "Hello" },
    });
    
    expect(wrapper.text()).toContain("Hello");
  });
  
  it("emits events", async () => {
    const wrapper = mount(MyComponent);
    await wrapper.find("button").trigger("click");
    
    expect(wrapper.emitted()).toHaveProperty("click");
  });
});
```

## Coverage

Test coverage reports are generated in the `coverage` directory when running `pnpm test:coverage`.

## CI Integration

Both Histoire build and test suite can be integrated into CI/CD pipelines:

```bash
# In CI, run tests without watch mode
pnpm test --run

# Build static documentation for deployment
pnpm story:build
```

