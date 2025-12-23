# `@inkcre/web-design` coding agent guide

This package provides a consistent design system and common components for InKCre client using web tech stacks.

## Tech Stacks

- Framework: Vue3 + TypeScript + Vite
- Styles: Sass(scss) + UnoCSS (iconfont only)
- Internalization: vue-i18n
- Story-driven tooling: [Histoire](https://histoire.dev)
- Testing: Vitest

## Project Strucutre (Crucial Only)

This project is a sub repo of `InKCre/design` workspace.

```
src/
├── components/     # read components/AGENTS.md for more
├── composables/
├── utils/
└── index.ts        # Entry of the package, export components, types here.         
styles/             # Design tokens in sass map and sass utilties
├── tokens/         # Design token exports
└── vite.config.ts, vitest.config.ts, package.json, ...
```
