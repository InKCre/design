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

The design system supports internationalization. You can provide your own i18n implementation via the `INK_I18N_KEY` injection key.

Your i18n provider must implement the following interface:

```ts
interface InkI18n {
  t: (key: string) => string;  // Translation function
  locale: Ref<string>;          // Current locale as a reactive ref
}
```

Components will fall back to English strings if no i18n provider is configured.

#### Example with vue-i18n

1. `pnpm add vue-i18n`

2. Add your messages. You can extend our exported locales (`en`, `zhCN`) from `@inkcre/web-design/locales`.

    ```ts
    // your/locales/messages/en.ts
    import { en } from "@inkcre/web-design/locales";

    export default {
      ...en,
      // your translations here
    }
    ```

3. Config your vue-i18n

    ```ts
    // your/locales/index.ts
    import { createI18n } from "vue-i18n";
    import messages from "your/locales/messages";  

    const i18n = createI18n({
      legacy: false,
      locale: "en",
      fallbackLocale: "en",
      messages,
    });

    export default i18n;
    ```

4. Provide it to us

    ```ts
    // App.vue
    <script lang="ts" setup>
    import { INK_I18N_KEY } from "@inkcre/web-design";
    import i18n from "./locales";

    // Provide i18n to the design system
    provide(INK_I18N_KEY, {
      t: i18n.global.t,
      locale: i18n.global.locale,
    });
    </script>
    ```

## Features

- Design tokens automatically generated from the main tokens file
- CSS custom properties for theming (light/dark mode support)
- Component-scoped design tokens
- Modular SCSS architecture
- Provider-agnostic router support
- Provider-agnostic internationalization support
- Claude AI Skill documentation for comprehensive package understanding

## Documentation

### Claude AI Skill

The package includes comprehensive Claude AI Skill documentation (`CLAUDE_SKILL.md`) that provides:
- Complete component API reference with props, events, and types
- Usage examples from component documentation
- Router and i18n integration guides
- Styling system documentation
- Best practices and coding guidelines

This documentation is automatically generated from component source code and story files during the build process.
