# @inkcre/web-design

A comprehensive design system built with Vite + Vue3, providing design tokens, components, and utilities for web applications.

## 🚀 Development

This package is built with Vite and includes a development playground for testing components and design tokens.

### Scripts

```bash
# Start development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview

# Clean build artifacts
pnpm run clean
```

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

```scss
// Import all styles
@use '@inkcre/web-design/styles';
```

```javascript
// Import CSS (processed)
import '@inkcre/web-design/styles.css'
```

### Design Tokens

```javascript
import { tokens } from '@inkcre/web-design'

console.log(tokens.color.primary) // Access token values
```

## 🏗️ Architecture

- **Vite**: Build tool and dev server
- **Vue3**: Component framework
- **SCSS**: Styling with design token integration
- **Design Tokens**: Centralized design values

## 📁 Project Structure

```
src/
├── components/          # Vue components
├── styles/             # SCSS styles and tokens
├── tokens/             # Design token exports
├── main.js             # Development entry
├── App.vue             # Development playground
└── index.js            # Library entry point
```

## Features

- Design tokens automatically generated from the main tokens file
- CSS custom properties for theming (light/dark mode support)
- Component-scoped design tokens
- Modular SCSS architecture
