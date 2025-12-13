# `@inkcre/web-design` coding agent guide

This package provides a consistent design system and common components for InKCre client using web tech stacks.

## Tech Stacks

- Framework: Vue3 + TypeScript + Sass(scss) + Vite
- Internalization: vue-i18n
- Story-driven tooling: [Histoire](https://histoire.dev)
- Packagae management: pnpm
- Release management: changeset

## Project Strucutre (Crucial Only)

This project is a sub repo of `InKCre/design` workspace.

```
src/
├── components/         
├── styles/             # Design tokens in sass map and sass utilties
    └── tokens/         # Design token exports
├── vite.config.ts, vitest.config.ts, package.json, ...
```

## Development

After you made changes, run `pnpm run changeset` to summarize your changes.
