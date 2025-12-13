# `@inkcre/web-design` coding agent guide

This package provides a consistent design system and common components for InKCre client using web tech stacks.

## Tech Stacks

- Framework: Vue3 + TypeScript + Sass(scss) + Vite
- Internalization: vue-i18n
- Packagae management: pnpm

## Project Strucutre

This project is a sub repo of `InKCre/design` workspace.

```
src/
├── components/         # Vue components
├── styles/             # Design tokens in sass map and sass utilties
    └── tokens/         # Design token exports
├── main.ts             # Development entry
├── App.vue             # Development playground
└── index.js            # Library entry point
```
