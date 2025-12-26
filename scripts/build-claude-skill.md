# build-claude-skill.ts

Generates comprehensive Claude Skill documentation for the `@inkcre/web-design` package.

## Overview

This script automatically generates a `CLAUDE_SKILL.md` file that serves as comprehensive documentation for Claude AI to understand and use the web-design package effectively. The skill includes:

- Component interfaces, props, and events
- Usage examples from component story.md files
- Router and i18n integration patterns
- Styling system documentation (tokens, mixins, functions)
- Best practices and coding guidelines
- Utilities and composables

## Usage

From the repository root:

```bash
pnpm build-skill
```

From the web-design package:

```bash
cd packages/web-design
pnpm build:skill
```

## What It Does

1. **Scans Components**: Discovers all component directories in `src/components/`
2. **Extracts Information**:
   - Props and emits from `compName.ts` files
   - Documentation from `compName.story.md` files
   - Type definitions
3. **Generates Sections**:
   - Introduction and installation
   - Router integration with examples
   - i18n integration with examples
   - Styling system documentation
   - Component-by-component documentation
   - Utilities and composables
   - Best practices and guidelines

## Output

- **File**: `packages/web-design/CLAUDE_SKILL.md`
- **Format**: Markdown with code examples
- **Shipping**: File is included in the npm package via `files` array

## Integration with Build Process

The skill generation is integrated into the build process:

```json
{
  "scripts": {
    "build": "pnpm run clean && pnpm run build:js && pnpm run build:locales && pnpm run build:skill"
  }
}
```

This ensures the skill documentation is always up-to-date with each release.

## Component Documentation Structure

For each component, the script includes:

1. **Story Documentation**: Full content from `compName.story.md`
2. **Props Definition**: Extracted TypeScript props object
3. **Events**: Extracted emits definition
4. **Types**: Related type definitions
5. **Import Examples**: How to import the component

## Maintenance

The script automatically:
- Filters out Histoire-specific syntax (imports, Story/Variant tags)
- Sorts components alphabetically
- Formats code blocks consistently
- Includes both router and i18n interface definitions
- Documents the styling token system

## Requirements

- Node.js with ES modules support
- TypeScript via tsx
- All component directories follow naming convention: `inkComponentName/`
- Component files follow pattern: `compName.ts`, `compName.story.md`

## Future Enhancements

Potential improvements:
- Extract examples from `compName.story.vue` files
- Include component dependency graphs
- Add usage statistics or popular patterns
- Generate component API reference tables
- Include accessibility notes per component
