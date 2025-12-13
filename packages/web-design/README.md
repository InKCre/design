# @inkcre/web-design

A comprehensive design system built with Vite + Vue3, providing design tokens, components, and utilities for InKCre web applications.

## 📦 Installation

```bash
npm install @inkcre/web-design
# or
pnpm add @inkcre/web-design
```

## 🎨 Usage

### Vue Plugin

```javascript
import { createApp } from 'vue'
import InKCreWebDesign from '@inkcre/web-design'

const app = createApp(App)
app.use(InKCreWebDesign)
```

### Styles

```ts
// main.ts
import "@inkcre/web-design/styles";
```

```scss
// Your component styles
@use "@inkcre/web-design/styles/mixins" as *;
@use "@inkcre/web-design/styles/functions" as *;
```

## Features

- Design tokens automatically generated from the main tokens file
- CSS custom properties for theming (light/dark mode support)
- Component-scoped design tokens
- Modular SCSS architecture
