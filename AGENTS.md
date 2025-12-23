# `@inkcre/design` coding guide

This repo includes everything about the design of InKCre.

## Project Structure

- `packages/`: this is a monorepo
  - `web-design`: InKCre Design System for web projects
- `tokens/`
  - `inkcre.tokens.json`: Design tokens follows W3C DTCG format
- `scripts/`
  - `build-tokens.ts`: Transform design tokens to code

## Coding Guidelines

- [Coding for Human](/.github/instructions/coding-for-human.instructions.md)

## Development Workflows

- Use PNPM as package manager
- Use changeset for automatic CHANGELOG and release. So run `pnpm changeset` after you made changes.
