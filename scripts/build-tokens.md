# `build-tokens.mjs` Doc

Transforms design tokens from JSON (follows W3C DTCG) to SCSS format.

Input:

- Default: inkcre.tokens.json
- Optional: Custom path via command line argument

Output:

For packages/web-design:

- src/style/tokens/_ref.scss: Reference/primitive tokens
  - color (from `ref.color`)
  - space (from `ref.space`)
  - shape (from `ref.shape`)
  - typo (from `ref.typo`)
  - font (from `typography`)
  - breakpoint (from `ref.breakpoint`)
  - elevation (from `effect.elevation`)
  - all: aggregate all the above categories.

- src/style/tokens/_sys.scss: System tokens
  - color-light (from sys.light)
  - color-dark (from sys.dark)
  - base: aggregate tokens other than color

- src/style/tokens/_comp.scss: Component tokens, from `comp`
  - <comp-name> (from `comp.<comp-name>`)
  - all: aggregate all components tokens

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
