import { readFileSync, readdirSync, writeFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================================================
// Constants
// ============================================================================

const COMPONENTS_DIR = resolve(__dirname, "../packages/web-design/src/components");
const OUTPUT_FILE = resolve(__dirname, "../packages/web-design/CLAUDE_SKILL.md");
const PACKAGE_ROOT = resolve(__dirname, "../packages/web-design");

// ============================================================================
// Types
// ============================================================================

interface ComponentInfo {
  name: string;
  path: string;
  props?: string;
  emits?: string;
  types?: string;
  documentation?: string;
  hasTests?: boolean;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Read a file safely, return null if not found
 */
function readFileSafe(filePath: string): string | null {
  try {
    return readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

/**
 * Extract component information from .ts file
 * 
 * Note: This uses regex patterns that work for the current codebase structure.
 * For very complex nested structures, a proper TypeScript parser would be more robust.
 * Current limitations:
 * - Nested objects with multiple closing braces may need adjustment
 * - Complex union types spanning multiple lines may not be fully captured
 */
function extractComponentInfo(tsContent: string): {
  props?: string;
  emits?: string;
  types?: string;
} {
  const result: { props?: string; emits?: string; types?: string } = {};

  // Extract props definition - handle nested objects and complex structures
  const propsMatch = tsContent.match(/export const \w+Props = \{[\s\S]*?\} as const;/);
  if (propsMatch) {
    result.props = propsMatch[0].trim();
  }

  // Extract emits definition - handle nested objects
  const emitsMatch = tsContent.match(/export const \w+Emits = \{[\s\S]*?\} as const;/);
  if (emitsMatch) {
    result.emits = emitsMatch[0].trim();
  }

  // Extract type definitions - handle multiline types and interfaces
  const typeMatches = tsContent.match(/(?:type|interface) \w+[^;{]*[;{][^}]*}?/g);
  if (typeMatches) {
    result.types = typeMatches.join("\n");
  }

  return result;
}

/**
 * Clean documentation content by removing Histoire-specific syntax
 */
function cleanDocumentation(content: string): string {
  return content
    .replace(/import .* from ['"]@histoire\/plugin-vue['"]/g, "")
    .replace(/import .* from ['"]\.\/.*\.vue['"]/g, "")
    .replace(/<Story[^>]*>/g, "")
    .replace(/<\/Story>/g, "")
    .replace(/<Variant[^>]*>/g, "")
    .replace(/<\/Variant>/g, "")
    .trim();
}

/**
 * Get all component directories
 */
function getComponentDirs(): string[] {
  const entries = readdirSync(COMPONENTS_DIR);
  return entries.filter(entry => {
    const fullPath = join(COMPONENTS_DIR, entry);
    return statSync(fullPath).isDirectory() && entry.startsWith("ink");
  });
}

/**
 * Collect information about a single component
 */
function collectComponentInfo(componentName: string): ComponentInfo {
  const componentPath = join(COMPONENTS_DIR, componentName);
  const info: ComponentInfo = {
    name: componentName,
    path: componentPath,
  };

  // Read .ts file for props and types
  const tsFile = join(componentPath, `${componentName}.ts`);
  const tsContent = readFileSafe(tsFile);
  if (tsContent) {
    const extracted = extractComponentInfo(tsContent);
    info.props = extracted.props;
    info.emits = extracted.emits;
    info.types = extracted.types;
  }

  // Read .story.md file for documentation
  const storyMdFile = join(componentPath, `${componentName}.story.md`);
  const storyMdContent = readFileSafe(storyMdFile);
  if (storyMdContent) {
    info.documentation = storyMdContent;
  }

  // Check for tests
  const testFile = join(componentPath, `${componentName}.test.ts`);
  info.hasTests = readFileSafe(testFile) !== null;

  return info;
}

// ============================================================================
// Content Generators
// ============================================================================

/**
 * Generate introduction section
 */
function generateIntroduction(): string {
  return `# @inkcre/web-design - Claude Skill

This is a comprehensive guide for using the @inkcre/web-design package, InKCre's design system for web applications.

## Overview

@inkcre/web-design is a Vue 3 component library built with TypeScript, providing:
- Design tokens (colors, spacing, typography, etc.)
- Reusable UI components
- Router and i18n abstractions
- SCSS utilities and mixins
- Comprehensive styling system

## Tech Stack

- **Framework**: Vue 3 + TypeScript + Vite
- **Styles**: SCSS + UnoCSS (icons only)
- **Internationalization**: vue-i18n compatible
- **Testing**: Vitest
- **Storybook**: Histoire

## Installation

\`\`\`bash
npm install @inkcre/web-design
# or
pnpm add @inkcre/web-design
\`\`\`

## Basic Setup

### Main Application Setup

\`\`\`typescript
// main.ts
import { createApp } from 'vue'
import InKCreWebDesign from '@inkcre/web-design'
import "@inkcre/web-design/styles"

const app = createApp(App)
app.use(InKCreWebDesign)
\`\`\`

### TypeScript Configuration

\`\`\`json
// tsconfig.json
{
  "compilerOptions": {
    "types": ["@inkcre/web-design"]
  }
}
\`\`\`

### UnoCSS Configuration

\`\`\`typescript
// uno.config.ts
export default defineConfig({
  safelist: [
    'i-mdi-menu',
    'i-mdi-loading',
    'i-mdi-refresh',
    'i-mdi-chevron-right',
    'i-mdi-chevron-down',
    'i-mdi-alert-circle-outline',
    'i-mdi-inbox-outline',
    'animate-spin'
  ]
})
\`\`\`

`;
}

/**
 * Generate router integration section
 */
function generateRouterIntegration(): string {
  const routerContent = readFileSafe(join(PACKAGE_ROOT, "src/router.ts"));
  
  const routerInterface = routerContent || `// Router interface not available
export interface InkRouter {
  currentPath: ComputedRef<string>;
  currentName: ComputedRef<string | null>;
}`;

  return `## Router Integration

Some components (like InkHeader) require router capabilities. The design system uses a provider pattern that works with any router.

### Interface

\`\`\`typescript
${routerInterface}
\`\`\`

### Setup with Vue Router

\`\`\`typescript
// your-router.ts
import { computed } from "vue";
import type { Router, RouteLocationNormalizedLoaded } from "vue-router";
import type { InkRouter } from "@inkcre/web-design";

export function createInkRouterAdapter(
  router: Router,
  route: RouteLocationNormalizedLoaded
): InkRouter {
  return {
    currentPath: computed(() => route.path),
    currentName: computed(() => route.name),
  };
}
\`\`\`

\`\`\`typescript
// App.vue
<script setup lang="ts">
import { INK_ROUTER_KEY } from "@inkcre/web-design";
import { createInkRouterAdapter } from "./your-router";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

provide(INK_ROUTER_KEY, createInkRouterAdapter(router, route));
</script>
\`\`\`

`;
}

/**
 * Generate i18n integration section
 */
function generateI18nIntegration(): string {
  const i18nContent = readFileSafe(join(PACKAGE_ROOT, "src/i18n.ts"));
  
  const i18nInterface = i18nContent || `// i18n interface not available
export interface InkI18n {
  t: (key: string) => string;
  locale: Ref<string>;
}`;
  
  return `## Internationalization (i18n)

The design system supports internationalization through a provider pattern that works with any i18n library.

### Interface

\`\`\`typescript
${i18nInterface}
\`\`\`

### Setup with vue-i18n

1. Install vue-i18n:
\`\`\`bash
pnpm add vue-i18n
\`\`\`

2. Extend provided locales:
\`\`\`typescript
// locales/en.ts
import { en } from "@inkcre/web-design/locales";

export default {
  ...en,
  // Your custom translations
}
\`\`\`

3. Configure vue-i18n:
\`\`\`typescript
// locales/index.ts
import { createI18n } from "vue-i18n";
import en from "./en";
import zhCN from "./zhCN";

const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages: { en, zhCN },
});

export default i18n;
\`\`\`

4. Provide to design system:
\`\`\`typescript
// App.vue
<script setup lang="ts">
import { INK_I18N_KEY } from "@inkcre/web-design";
import i18n from "./locales";

provide(INK_I18N_KEY, {
  t: i18n.global.t,
  locale: i18n.global.locale,
});
</script>
\`\`\`

**Note**: Components fall back to English if no i18n provider is configured.

`;
}

/**
 * Generate styling system section
 */
function generateStylingSystem(): string {
  return `## Styling System

The design system provides a comprehensive styling system with design tokens, mixins, and utilities.

### Using SCSS Utilities

\`\`\`scss
// Your component styles
@use "@inkcre/web-design/styles/mixins" as *;
@use "@inkcre/web-design/styles/functions" as *;
@use "@inkcre/web-design/tokens/ref" as ref;
@use "@inkcre/web-design/tokens/sys" as sys;
@use "@inkcre/web-design/tokens/comp" as comp;
\`\`\`

### Design Tokens

Design tokens are organized in three layers:

1. **Reference Tokens** (\`ref\`): Primitive values (colors, spacing, etc.)
2. **System Tokens** (\`sys\`): Semantic tokens that reference primitives
3. **Component Tokens** (\`comp\`): Component-specific tokens

#### Example Usage

\`\`\`scss
.my-component {
  // Using system tokens
  color: fn.map-deep-get(sys.$color-light, "text", "base");
  padding: fn.map-deep-get(ref.$space, "md");
  border-radius: fn.map-deep-get(ref.$radius, "sm");
  
  // Using component tokens
  background: fn.map-deep-get(comp.$light, "button", "bg-primary");
}
\`\`\`

### Theme Support

The design system supports light and dark modes through CSS custom properties.

\`\`\`scss
// Light mode
[data-theme="light"] {
  --color-text-base: #{fn.map-deep-get(sys.$color-light, "text", "base")};
}

// Dark mode
[data-theme="dark"] {
  --color-text-base: #{fn.map-deep-get(sys.$color-dark, "text", "base")};
}
\`\`\`

### Available Token Categories

- **Colors**: \`ref.$color\`, \`sys.$color-light\`, \`sys.$color-dark\`
- **Spacing**: \`ref.$space\` (xs, sm, md, lg, xl, etc.)
- **Typography**: \`ref.$typo\` (font sizes, weights, line heights)
- **Border Radius**: \`ref.$radius\`
- **Elevation**: \`ref.$elevation\` (shadows)
- **Breakpoints**: \`ref.$breakpoint\` (sm, md, lg, xl)
- **Opacity**: \`ref.$opacity\`

`;
}

/**
 * Generate components section
 */
function generateComponentsSection(components: ComponentInfo[]): string {
  let output = `## Components

The design system includes ${components.length} components, each designed for specific use cases.

### Component List

${components.map(c => `- **${c.name}**`).join("\n")}

`;

  // Generate detailed documentation for each component
  for (const component of components) {
    output += `\n---\n\n### ${component.name}\n\n`;

    // Add story.md documentation if available
    if (component.documentation) {
      const cleanDoc = cleanDocumentation(component.documentation);
      output += `${cleanDoc}\n\n`;
    }

    // Add props if available
    if (component.props) {
      output += `#### Props Definition\n\n\`\`\`typescript\n${component.props}\n\`\`\`\n\n`;
    }

    // Add emits if available
    if (component.emits) {
      output += `#### Events\n\n\`\`\`typescript\n${component.emits}\n\`\`\`\n\n`;
    }

    // Add types if available
    if (component.types) {
      output += `#### Types\n\n\`\`\`typescript\n${component.types}\n\`\`\`\n\n`;
    }

    // Add import example
    output += `#### Import\n\n\`\`\`typescript\nimport { ${component.name} } from '@inkcre/web-design';\n// or\nimport ${component.name} from '@inkcre/web-design/components/${component.name}/${component.name}.vue';\n\`\`\`\n\n`;
  }

  return output;
}

/**
 * Generate best practices section
 */
function generateBestPractices(): string {
  return `## Best Practices

### Component Development

1. **Single Responsibility Principle**: Each component should do one thing well
2. **High Cohesion, Low Coupling**: Keep related code together, minimize dependencies
3. **Clear and Consistent API**: Props and events should be intuitive
4. **Avoid Prop Drilling**: Use provide/inject for deeply nested data
5. **Easy to Test and Maintain**: Write testable, readable code

### Naming Conventions

- **Components**: \`camelCase\` (e.g., \`inkButton\`)
- **CSS Classes**: \`kebab-case\` (e.g., \`ink-button\`)
- **Props/Variables**: \`camelCase\` (e.g., \`isLoading\`)
- **Events**: \`kebab-case\` (e.g., \`update:modelValue\`)

### Error Handling

- Use graceful degradation
- Provide user-friendly error messages
- Log errors appropriately
- Validate inputs and provide defaults

### Accessibility

- Use semantic HTML elements
- Provide ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers
- Maintain proper color contrast

### Performance

- Use \`v-if\` vs \`v-show\` appropriately
- Avoid unnecessary watchers
- Use \`computed\` for derived state
- Lazy load components when possible
- Optimize large lists with virtual scrolling

## Coding Guidelines

### Code for Human Brains

Write code that's easy to understand and maintain:

- **Keep it simple**: Prefer straightforward solutions
- **Limit cognitive load**: Keep functions and conditions simple (≤4 concepts)
- **Use meaningful names**: Variables and functions should be self-documenting
- **Prefer early returns**: Avoid deeply nested conditions
- **Comment the "why"**: Explain motivation, not just what the code does

### Example: Complex vs Simple

❌ Hard to understand:
\`\`\`typescript
if (val > someConstant && (condition2 || condition3) && (condition4 && !condition5)) {
  // What are we checking here?
}
\`\`\`

✅ Easy to understand:
\`\`\`typescript
const isValid = val > someConstant;
const isAllowed = condition2 || condition3;
const isSecure = condition4 && !condition5;

if (isValid && isAllowed && isSecure) {
  // Clear what each condition means
}
\`\`\`

`;
}

/**
 * Generate utilities section
 */
function generateUtilitiesSection(): string {
  return `## Utilities

The design system provides several utility functions and composables.

### Vue Props Utilities

\`\`\`typescript
import { makeStringProp, makeBooleanProp, makeNumberProp } from '@inkcre/web-design/utils';

// Create props with defaults and type safety
const props = {
  text: makeStringProp("Default text"),
  isActive: makeBooleanProp(false),
  count: makeNumberProp(0),
};
\`\`\`

### Composables

Use the router and i18n composables to access provided instances:

\`\`\`typescript
import { useOptionalRouter, useOptionalI18n } from '@inkcre/web-design';

const router = useOptionalRouter(); // Returns null if not provided
const i18n = useOptionalI18n();     // Returns null if not provided

if (router) {
  console.log(router.currentPath.value);
}

if (i18n) {
  console.log(i18n.t('common.save'));
}
\`\`\`

`;
}

// ============================================================================
// Main Execution
// ============================================================================

async function main() {
  const startTime = Date.now();
  process.stdout.write("📚 Building Claude Skill documentation...\n\n");

  try {
    // Collect all component information
    const componentDirs = getComponentDirs();
    process.stdout.write(`Found ${componentDirs.length} components\n`);

    const components: ComponentInfo[] = [];
    for (const dir of componentDirs) {
      process.stdout.write(`  Processing ${dir}...\n`);
      const info = collectComponentInfo(dir);
      components.push(info);
    }

    // Sort components alphabetically
    components.sort((a, b) => a.name.localeCompare(b.name));

    // Generate complete documentation
    let skillContent = generateIntroduction();
    skillContent += generateRouterIntegration();
    skillContent += generateI18nIntegration();
    skillContent += generateStylingSystem();
    skillContent += generateComponentsSection(components);
    skillContent += generateUtilitiesSection();
    skillContent += generateBestPractices();

    // Add footer
    skillContent += `\n---\n\n*This documentation was auto-generated by build-claude-skill.ts*\n`;

    // Write output file
    writeFileSync(OUTPUT_FILE, skillContent, "utf-8");

    const elapsed = Date.now() - startTime;
    process.stdout.write("\n✅ Claude Skill documentation built successfully!\n");
    process.stdout.write(`📁 Output file: ${OUTPUT_FILE}\n`);
    process.stdout.write(`⏱️  Completed in ${elapsed}ms\n`);
  } catch (error) {
    process.stderr.write("\n❌ Error building Claude Skill documentation:\n");
    process.stderr.write(String(error) + "\n");
    if (error instanceof Error && error.stack) {
      process.stderr.write(error.stack + "\n");
    }
    process.exit(1);
  }
}

main();
