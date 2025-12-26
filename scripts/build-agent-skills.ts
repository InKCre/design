import { readFileSync, readdirSync, writeFileSync, statSync, mkdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================================================
// Constants
// ============================================================================

const COMPONENTS_DIR = resolve(__dirname, "../packages/web-design/src/components");
const SKILLS_OUTPUT_DIR = resolve(__dirname, "../packages/web-design/.github/skills");
const PACKAGE_ROOT = resolve(__dirname, "../packages/web-design");

// ============================================================================
// Types
// ============================================================================

interface ComponentInfo {
  name: string;
  props?: string;
  emits?: string;
  types?: string;
  documentation?: string;
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
 */
function extractComponentInfo(tsContent: string): {
  props?: string;
  emits?: string;
  types?: string;
} {
  const result: { props?: string; emits?: string; types?: string } = {};

  // Extract props definition
  const propsMatch = tsContent.match(/export const \w+Props = \{[\s\S]*?\} as const;/);
  if (propsMatch) {
    result.props = propsMatch[0].trim();
  }

  // Extract emits definition
  const emitsMatch = tsContent.match(/export const \w+Emits = \{[\s\S]*?\} as const;/);
  if (emitsMatch) {
    result.emits = emitsMatch[0].trim();
  }

  // Extract type definitions
  const typeMatches = tsContent.match(/(?:type|interface) \w+[^;{]*[;{][^}]*}?/g);
  if (typeMatches) {
    result.types = typeMatches.join("\n");
  }

  return result;
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
    // Clean Histoire-specific syntax
    info.documentation = storyMdContent
      .replace(/import .* from ['"]@histoire\/plugin-vue['"]/g, "")
      .replace(/import .* from ['"]\.\/.*\.vue['"]/g, "")
      .replace(/<Story[^>]*>/g, "")
      .replace(/<\/Story>/g, "")
      .replace(/<Variant[^>]*>/g, "")
      .replace(/<\/Variant>/g, "")
      .trim();
  }

  return info;
}

/**
 * Ensure directory exists
 */
function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

// ============================================================================
// Skill Generators
// ============================================================================

/**
 * Generate main components skill
 */
function generateComponentsSkill(components: ComponentInfo[]): string {
  let content = `---
name: web-design-components
description: Use @inkcre/web-design Vue 3 components. Includes all 19 components with props, events, and usage examples.
---

# @inkcre/web-design Components

Use this skill when working with the @inkcre/web-design Vue 3 component library.

## Overview

@inkcre/web-design provides 19 UI components for Vue 3 applications:
${components.map(c => `- **${c.name}**`).join("\n")}

## Installation

\`\`\`bash
npm install @inkcre/web-design
# or
pnpm add @inkcre/web-design
\`\`\`

## Setup

\`\`\`typescript
// main.ts
import { createApp } from 'vue'
import InKCreWebDesign from '@inkcre/web-design'
import "@inkcre/web-design/styles"

const app = createApp(App)
app.use(InKCreWebDesign)
\`\`\`

## Components

`;

  // Add detailed info for each component
  for (const component of components) {
    content += `### ${component.name}\n\n`;

    if (component.documentation) {
      content += `${component.documentation}\n\n`;
    }

    if (component.props) {
      content += `**Props:**\n\`\`\`typescript\n${component.props}\n\`\`\`\n\n`;
    }

    if (component.emits) {
      content += `**Events:**\n\`\`\`typescript\n${component.emits}\n\`\`\`\n\n`;
    }

    if (component.types) {
      content += `**Types:**\n\`\`\`typescript\n${component.types}\n\`\`\`\n\n`;
    }

    content += `**Import:**\n\`\`\`typescript\nimport { ${component.name} } from '@inkcre/web-design';\n\`\`\`\n\n---\n\n`;
  }

  return content;
}

/**
 * Generate router integration skill
 */
function generateRouterSkill(): string {
  const routerContent = readFileSafe(join(PACKAGE_ROOT, "src/router.ts"));
  const routerInterface = routerContent || `export interface InkRouter {
  currentPath: ComputedRef<string>;
  currentName: ComputedRef<string | null>;
}`;

  return `---
name: web-design-router
description: Integrate @inkcre/web-design with Vue Router. Provides router adapter pattern for components that need routing.
---

# Router Integration

Use this skill when integrating @inkcre/web-design components with Vue Router.

## Overview

Some components (like InkHeader) need router capabilities. The design system uses a provider pattern that works with any router implementation.

## Interface

\`\`\`typescript
${routerInterface}
\`\`\`

## Setup

1. Create a router adapter:

\`\`\`typescript
// router-adapter.ts
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

2. Provide in your app:

\`\`\`typescript
// App.vue
<script setup lang="ts">
import { INK_ROUTER_KEY } from "@inkcre/web-design";
import { createInkRouterAdapter } from "./router-adapter";
import { useRoute, useRouter } from "vue-router";

provide(
  INK_ROUTER_KEY,
  createInkRouterAdapter(useRouter(), useRoute())
);
</script>
\`\`\`

## Usage in Components

\`\`\`typescript
import { useOptionalRouter } from "@inkcre/web-design";

const router = useOptionalRouter();
if (router) {
  console.log(router.currentPath.value);
}
\`\`\`
`;
}

/**
 * Generate i18n integration skill
 */
function generateI18nSkill(): string {
  const i18nContent = readFileSafe(join(PACKAGE_ROOT, "src/i18n.ts"));
  const i18nInterface = i18nContent || `export interface InkI18n {
  t: (key: string) => string;
  locale: Ref<string>;
}`;

  return `---
name: web-design-i18n
description: Integrate @inkcre/web-design with vue-i18n. Provides i18n adapter pattern for internationalized components.
---

# Internationalization (i18n)

Use this skill when setting up internationalization for @inkcre/web-design components.

## Overview

The design system supports i18n through a provider pattern compatible with vue-i18n.

## Interface

\`\`\`typescript
${i18nInterface}
\`\`\`

## Setup

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

## Usage

Components will automatically use translations if i18n is provided. They fall back to English if not configured.

\`\`\`typescript
import { useOptionalI18n } from "@inkcre/web-design";

const i18n = useOptionalI18n();
if (i18n) {
  console.log(i18n.t('common.save'));
}
\`\`\`
`;
}

/**
 * Generate styling system skill
 */
function generateStylingSkill(): string {
  return `---
name: web-design-styling
description: Use @inkcre/web-design styling system with design tokens, SCSS mixins, and theming. Includes token categories and usage examples.
---

# Styling System

Use this skill when working with the @inkcre/web-design styling system.

## Overview

The design system provides:
- Design tokens (colors, spacing, typography, etc.)
- SCSS mixins and functions
- Theme support (light/dark modes)
- CSS custom properties

## Import SCSS Utilities

\`\`\`scss
@use "@inkcre/web-design/styles/mixins" as *;
@use "@inkcre/web-design/styles/functions" as fn;
@use "@inkcre/web-design/tokens/ref" as ref;
@use "@inkcre/web-design/tokens/sys" as sys;
@use "@inkcre/web-design/tokens/comp" as comp;
\`\`\`

## Design Tokens

### Token Layers

1. **Reference Tokens** (\`ref\`): Primitive values
2. **System Tokens** (\`sys\`): Semantic tokens
3. **Component Tokens** (\`comp\`): Component-specific tokens

### Token Categories

- **Colors**: \`ref.$color\`, \`sys.$color-light\`, \`sys.$color-dark\`
- **Spacing**: \`ref.$space\` (xs, sm, md, lg, xl, etc.)
- **Typography**: \`ref.$typo\` (font sizes, weights, line heights)
- **Border Radius**: \`ref.$radius\`
- **Elevation**: \`ref.$elevation\` (shadows)
- **Breakpoints**: \`ref.$breakpoint\` (sm, md, lg, xl)
- **Opacity**: \`ref.$opacity\`

## Usage Examples

\`\`\`scss
.my-component {
  // Use system tokens
  color: fn.map-deep-get(sys.$color-light, "text", "base");
  padding: fn.map-deep-get(ref.$space, "md");
  border-radius: fn.map-deep-get(ref.$radius, "sm");
  
  // Use component tokens
  background: fn.map-deep-get(comp.$light, "button", "bg-primary");
}
\`\`\`

## Theme Support

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

## UnoCSS Configuration

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
 * Generate best practices skill
 */
function generateBestPracticesSkill(): string {
  return `---
name: web-design-best-practices
description: Best practices for developing with @inkcre/web-design. Includes coding guidelines, naming conventions, and accessibility tips.
---

# Best Practices

Use this skill for guidance on developing with @inkcre/web-design.

## Component Development

1. **Single Responsibility**: Each component does one thing well
2. **High Cohesion, Low Coupling**: Keep related code together, minimize dependencies
3. **Clear API**: Props and events should be intuitive
4. **Avoid Prop Drilling**: Use provide/inject for deeply nested data
5. **Testable**: Write components that are easy to test

## Naming Conventions

- **Components**: \`camelCase\` (e.g., \`inkButton\`)
- **CSS Classes**: \`kebab-case\` (e.g., \`ink-button\`)
- **Props/Variables**: \`camelCase\` (e.g., \`isLoading\`)
- **Events**: \`kebab-case\` (e.g., \`update:modelValue\`)

## Error Handling

- Use graceful degradation
- Provide user-friendly error messages
- Log errors appropriately
- Validate inputs and provide defaults

## Accessibility

- Use semantic HTML elements
- Provide ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers
- Maintain proper color contrast

## Performance

- Use \`v-if\` vs \`v-show\` appropriately
- Avoid unnecessary watchers
- Use \`computed\` for derived state
- Lazy load components when possible
- Optimize large lists with virtual scrolling

## Code for Human Brains

Write code that's easy to understand:

- **Keep it simple**: Prefer straightforward solutions
- **Limit cognitive load**: Keep functions simple (≤4 concepts to hold in memory)
- **Use meaningful names**: Variables should be self-documenting
- **Prefer early returns**: Avoid deeply nested conditions
- **Comment the "why"**: Explain motivation, not just what

### Example

❌ Hard to understand:
\`\`\`typescript
if (val > someConstant && (condition2 || condition3) && (condition4 && !condition5)) {
  // What are we checking?
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

// ============================================================================
// Main Execution
// ============================================================================

async function main() {
  const startTime = Date.now();
  process.stdout.write("📚 Building Agent Skills...\n\n");

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

    // Ensure skills directory exists
    ensureDir(SKILLS_OUTPUT_DIR);

    // Generate skills
    const skills = [
      { name: "web-design-components", content: generateComponentsSkill(components) },
      { name: "web-design-router", content: generateRouterSkill() },
      { name: "web-design-i18n", content: generateI18nSkill() },
      { name: "web-design-styling", content: generateStylingSkill() },
      { name: "web-design-best-practices", content: generateBestPracticesSkill() },
    ];

    // Write each skill
    for (const skill of skills) {
      const skillDir = join(SKILLS_OUTPUT_DIR, skill.name);
      ensureDir(skillDir);
      
      const skillFile = join(skillDir, "SKILL.md");
      writeFileSync(skillFile, skill.content, "utf-8");
      process.stdout.write(`  ✓ Created ${skill.name}/SKILL.md\n`);
    }

    const elapsed = Date.now() - startTime;
    process.stdout.write("\n✅ Agent Skills built successfully!\n");
    process.stdout.write(`📁 Output directory: ${SKILLS_OUTPUT_DIR}/\n`);
    process.stdout.write(`📊 Created ${skills.length} skills\n`);
    process.stdout.write(`⏱️  Completed in ${elapsed}ms\n`);
  } catch (error) {
    process.stderr.write("\n❌ Error building Agent Skills:\n");
    process.stderr.write(String(error) + "\n");
    if (error instanceof Error && error.stack) {
      process.stderr.write(error.stack + "\n");
    }
    process.exit(1);
  }
}

main();
