# InKCre Design

Design system and any other design stuff of InKCre

## Single Source of Truth

Designer will push tokens from Figma using plugin [lukasoppermann/design-token-transformer](/lukasoppermann/design-token-transformer). So keep `tokens/inkcre.tokens.json` read-only.

`scripts/build-tokens.mjs` will transform `tokens/inkcre.tokens.json` into each packages styles code:

- For `packages/web-design`, will generates `styles/tokens/_ref.scss`, `styles/tokens/_sys.scss` and `styles/tokens/_comp.scss`

`scripts/build-tokens.mjs` relies on [Style Dictionary](https://www.npmjs.com/package/style-dictionary) to transform tokens.

Tokens are listed in `tokens/tokes.md`

## Development

Packages are hosted on Github NPM Registry, make sure you configure environment variable `NODE_AUTH_TOKEN` or you will get warnings from your package manager.
