# `build-tokens.mjs` Doc

Transforms design tokens from JSON to SCSS format.

Input:

- Default: inkcre.tokens.json
- Optional: Custom path via command line argument

Output:

For packages/web-design:

- src/style/tokens/_ref.scss: Reference/primitive tokens
  - palette (from ref.color)
  - space (from ref.space)
  - radius (from ref.radius)
  - typo (from ref.typo)
  - elevation (from effect.elevation)
  - opacity (from ref.opacity)
  - breakpoint (from ref.breakpoint)

- src/style/tokens/_sys.scss: System tokens
  - light (from sys.light)
  - dark (from sys.dark)
  - font (from font)

- src/style/tokens/_comp.scss: Component tokens
  - component-tokens (from comp)

Transforms

- attribute/kebab-path: Converts token paths to kebab-case
- color/hex-no-alpha: Removes alpha channel from hex colors
- size/px: Adds px unit to dimension tokens

Token naming

- camelCase converted to kebab-case
- Special characters replaced with hyphens
- All paths normalized to lowercase

Usage
npm run build-tokens
node scripts/build-tokens.mjs [custom-tokens.json]
