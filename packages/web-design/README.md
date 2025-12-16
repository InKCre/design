# @inkcre/web-design

A comprehensive design system built with Vite + Vue3, providing design tokens, components, and utilities for InKCre web applications.

## Installation

```bash
npm install @inkcre/web-design
# or
pnpm add @inkcre/web-design
```

## Usage

```typescript
// main.ts
import { createApp } from 'vue'
import InKCreWebDesign from '@inkcre/web-design'  // optional
import "@inkcre/web-design/styles" // must

const app = createApp(App)
app.use(InKCreWebDesign)
```

```scss
// Your component styles
@use "@inkcre/web-design/styles/mixins" as *;
@use "@inkcre/web-design/styles/functions" as *;
```

```json
// tsconfig.json
{
    "compilerOptions": {
        "types": [
            ...,
            "@inkcre/web-design"  // add this
        ]
    }
}
```

```ts
// uno.config.ts
export default defineConfig({
    ...,
    safelist: [
        'i-mdi-menu',
        'i-mdi-loading',
        i-mdi-refresh,
        'i-mdi-chevron-right',
        'i-mdi-chevron-down',
        'animate-spin'
    ]
})
```

### Use routing

InkHeader and some other components relies on your router abilities.

```ts
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

```ts
// App.vue
<script lang="ts" setup>
import { INK_ROUTER_KEY } from "@inkcre/web-design";
import { createInkRouterAdapter } from "./your-router.ts";
import { useRoute } from "vue-router";

provide(
  INK_ROUTER_KEY,
  createInkRouterAdapter(router, useRoute())
);
</script>
```

## Features

- Design tokens automatically generated from the main tokens file
- CSS custom properties for theming (light/dark mode support)
- Component-scoped design tokens
- Modular SCSS architecture
