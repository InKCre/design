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
        'i-mdi-alert-circle-outline',
        'i-mdi-inbox-outline',
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

### Use internationalization (i18n)

The design system supports internationalization via vue-i18n. You can provide your own i18n instance to enable multi-language support.

**Install vue-i18n:**

```bash
pnpm add vue-i18n
```

**Setup i18n:**

```ts
// i18n.ts
import { createI18n } from "vue-i18n";
import { locales } from "@inkcre/web-design";

const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages: locales,
});

export default i18n;
```

**Provide i18n to components:**

```ts
// App.vue
<script lang="ts" setup>
import { INK_I18N_KEY } from "@inkcre/web-design";
import i18n from "./i18n";

// Provide the i18n composer instance
provide(INK_I18N_KEY, i18n.global);
</script>
```

**Supported locales:**

- `en` - English
- `zh-CN` - Chinese (Simplified)

The design system will fall back to English strings if no i18n instance is provided.

## Features

- Design tokens automatically generated from the main tokens file
- CSS custom properties for theming (light/dark mode support)
- Component-scoped design tokens
- Modular SCSS architecture
- Internationalization support (en, zh-CN)
