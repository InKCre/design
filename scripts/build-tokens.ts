import StyleDictionary from "style-dictionary";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import type {
  Transform,
  Format,
  TransformedToken,
  Dictionary,
  Platform,
  File as SDFile,
} from "style-dictionary/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_TOKEN_FILE = "tokens/inkcre.tokens.json";
const OUTPUT_DIR = "packages/web-design/src/styles/tokens";

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Convert camelCase or other formats to kebab-case
 */
function toKebabCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_\.]+/g, "-")
    .toLowerCase();
}

/**
 * Convert token path array to SCSS reference using fn.map-deep-get()
 * Example: ['ref', 'color', 'neutral', '2'] → fn.map-deep-get(ref.$color, "neutral", "2")
 */
function tokenPathToScssRef(path: string[]): string {
  if (path.length < 2) {
    console.warn(`Token path too short for reference: ${path.join(".")}`);
    return "";
  }

  const [category, subcategory, ...keys] = path;

  // Determine the module and map name
  let module = category;
  let mapName = subcategory;

  // Special handling for sys tokens
  if (category === "sys") {
    // sys.light.color.text.base → fn.map-deep-get(sys.$color-light, "text", "base")
    const mode = subcategory; // 'light' or 'dark'
    const tokenCategory = keys[0]; // 'color'
    const tokenKeys = keys.slice(1); // ['text', 'base']

    if (tokenCategory === "color") {
      return `fn.map-deep-get(sys.$color-${mode}, ${tokenKeys
        .map((k) => `"${k}"`)
        .join(", ")})`;
    }
    // For non-color sys tokens, reference from base
    return `fn.map-deep-get(sys.$base, ${[tokenCategory, ...tokenKeys]
      .map((k) => `"${k}"`)
      .join(", ")})`;
  }

  // For ref tokens: ref.color.neutral.2 → fn.map-deep-get(ref.$color, "neutral", "2")
  return `fn.map-deep-get(${module}.$${mapName}, ${keys
    .map((k) => `"${k}"`)
    .join(", ")})`;
}

/**
 * Parse reference from token value like "{ref.color.neutral.2}"
 */
function parseTokenReference(value: string): string[] | null {
  const match = value.match(/^\{(.+)\}$/);
  if (!match) return null;
  return match[1].split(".");
}

/**
 * Convert token value to SCSS reference if it's a reference, otherwise return formatted value
 */
function resolveTokenValue(token: TransformedToken): string {
  const value = token.value;

  // Check original value for references (before transformation)
  const originalValue = token.original?.value || value;

  if (typeof originalValue === "string" && originalValue.startsWith("{")) {
    const refPath = parseTokenReference(originalValue);
    if (refPath) {
      return tokenPathToScssRef(refPath);
    }
  }

  // Use transformed value for output
  return formatScssValue(value);
}

/**
 * Format a value for SCSS output
 */
function formatScssValue(value: any): string {
  if (typeof value === "string") {
    // Don't quote SCSS function calls
    if (
      value.startsWith("fn.map-deep-get(") ||
      value.startsWith("ref.$") ||
      value.startsWith("sys.$")
    ) {
      return value;
    }
    // Quote strings unless they're already quoted or are color values
    if (
      value.startsWith("#") ||
      value.startsWith("rgb") ||
      value.startsWith("hsl")
    ) {
      return value;
    }
    // For values that contain commas (like font stacks), they need to be fully quoted
    // Only skip quoting if the ENTIRE value is already quoted
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      return value;
    }
    return `"${value}"`;
  }

  if (typeof value === "number") {
    return value.toString();
  }

  if (typeof value === "object" && value !== null) {
    return formatScssMap(value);
  }

  return String(value);
}

/**
 * Format an object as a SCSS map with proper indentation
 */
function formatScssMap(
  obj: Record<string, any>,
  indentLevel: number = 0
): string {
  const indent = "  ".repeat(indentLevel);
  const innerIndent = "  ".repeat(indentLevel + 1);

  const entries = Object.entries(obj).map(([key, value]) => {
    const scssKey = `"${toKebabCase(key)}"`;

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      return `${innerIndent}${scssKey}: ${formatScssMap(
        value,
        indentLevel + 1
      )}`;
    } else {
      return `${innerIndent}${scssKey}: ${formatScssValue(value)}`;
    }
  });

  return `(\n${entries.join(",\n")}\n${indent})`;
}

/**
 * Build a nested map structure from token array
 */
function buildNestedMap(
  tokens: TransformedToken[],
  pathOffset: number = 0
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const token of tokens) {
    const pathParts = token.path.slice(pathOffset);
    let current = result;

    // Navigate/create nested structure
    for (let i = 0; i < pathParts.length - 1; i++) {
      const key = pathParts[i];
      if (!current[key]) {
        current[key] = {};
      }
      current = current[key];
    }

    // Set the value
    const lastKey = pathParts[pathParts.length - 1];

    // Handle composite tokens (like font styles with nested properties)
    if (
      token.original?.value &&
      typeof token.original.value === "object" &&
      !Array.isArray(token.original.value)
    ) {
      current[lastKey] = token.original.value;
    } else {
      current[lastKey] = token.value;
    }
  }

  return result;
}

// ============================================================================
// Custom Transforms
// ============================================================================

const attributeKebabPath: Transform = {
  type: "attribute",
  name: "attribute/kebab-path",
  transform: (token) => {
    return {
      path: token.path.map(toKebabCase),
    };
  },
};

const colorHexNoAlpha: Transform = {
  type: "value",
  name: "color/hex-no-alpha",
  transitive: true,
  filter: (token) => token.type === "color",
  transform: (token) => {
    const value = token.value;
    if (typeof value === "string" && value.match(/^#[0-9a-fA-F]{8}$/)) {
      // Remove alpha channel (last 2 characters)
      return value.substring(0, 7);
    }
    return value;
  },
};

const sizePx: Transform = {
  type: "value",
  name: "size/px",
  transitive: true,
  filter: (token) => {
    return (
      token.type === "dimension" &&
      !token.path.includes("opacity") &&
      typeof token.value === "number"
    );
  },
  transform: (token) => {
    return `${token.value}px`;
  },
};

// ============================================================================
// Custom Formats
// ============================================================================

/**
 * Format for _ref.scss - Reference/primitive tokens
 */
const formatScssRef = ({ dictionary }: { dictionary: Dictionary }) => {
  const tokens = dictionary.allTokens;

  // Filter tokens by category
  const getTokensByPath = (pathPrefix: string[]) => {
    return tokens.filter(
      (t) =>
        t.path.length > pathPrefix.length &&
        pathPrefix.every((part, i) => t.path[i] === part)
    );
  };

  // Build individual maps
  const elevation = getTokensByPath(["effect", "elevation"]);
  const color = getTokensByPath(["ref", "color"]);
  const radius = getTokensByPath(["ref", "radius"]);
  const space = getTokensByPath(["ref", "space"]);
  const typo = getTokensByPath(["ref", "typo"]);
  const breakpoint = getTokensByPath(["ref", "breakpoint"]);
  const opacity = getTokensByPath(["ref", "opacity"]);
  const size = getTokensByPath(["ref", "size"]);
  const font = getTokensByPath(["typography"]);

  let output = "// Auto-generated by build-tokens.ts - DO NOT EDIT\n\n";

  // Elevation
  if (elevation.length > 0) {
    const elevationMap = buildNestedMap(elevation, 2); // Skip 'effect', 'elevation'
    output += `$elevation: ${formatScssMap(elevationMap)};\n\n`;
  }

  // Color
  if (color.length > 0) {
    const colorMap = buildNestedMap(color, 2); // Skip 'ref', 'color'
    output += `$color: ${formatScssMap(colorMap)};\n\n`;
  }

  // Radius
  if (radius.length > 0) {
    const radiusMap = buildNestedMap(radius, 2);
    output += `$radius: ${formatScssMap(radiusMap)};\n\n`;
  }

  // Space
  if (space.length > 0) {
    const spaceMap = buildNestedMap(space, 2);
    output += `$space: ${formatScssMap(spaceMap)};\n\n`;
  }

  // Typo
  if (typo.length > 0) {
    const typoMap = buildNestedMap(typo, 2);
    output += `$typo: ${formatScssMap(typoMap)};\n\n`;
  }

  // Breakpoint
  if (breakpoint.length > 0) {
    const breakpointMap = buildNestedMap(breakpoint, 2);
    output += `$breakpoint: ${formatScssMap(breakpointMap)};\n\n`;
  }

  // Opacity
  if (opacity.length > 0) {
    const opacityMap = buildNestedMap(opacity, 2);
    output += `$opacity: ${formatScssMap(opacityMap)};\n\n`;
  }

  // Size
  if (size.length > 0) {
    const sizeMap = buildNestedMap(size, 2);
    output += `$size: ${formatScssMap(sizeMap)};\n\n`;
  }

  // Layout (empty placeholder)
  output += `$layout: ();\n\n`;

  // Font (from typography)
  if (font.length > 0) {
    const fontMap = buildNestedMap(font, 1); // Skip 'typography'
    output += `$font: ${formatScssMap(fontMap)};\n\n`;
  }

  // All aggregate
  output += `$all: (\n`;
  output += `  "elevation": $elevation,\n`;
  output += `  "color": $color,\n`;
  output += `  "radius": $radius,\n`;
  output += `  "space": $space,\n`;
  output += `  "typo": $typo,\n`;
  output += `  "breakpoint": $breakpoint,\n`;
  output += `  "opacity": $opacity,\n`;
  output += `  "size": $size,\n`;
  output += `  "layout": $layout,\n`;
  output += `  "font": $font\n`;
  output += `);\n`;

  return output;
};

/**
 * Format for _sys.scss - System tokens
 */
const formatScssSys = ({ dictionary }: { dictionary: Dictionary }) => {
  const tokens = dictionary.allTokens;

  let output = "// Auto-generated by build-tokens.ts - DO NOT EDIT\n";
  output += '@use "../functions" as fn;\n';
  output += '@use "./ref" as ref;\n\n';

  // Build light and dark color maps
  const lightColorTokens = tokens.filter(
    (t) => t.path[0] === "sys" && t.path[1] === "light" && t.path[2] === "color"
  );
  const darkColorTokens = tokens.filter(
    (t) => t.path[0] === "sys" && t.path[1] === "dark" && t.path[2] === "color"
  );

  // Helper to build color map with references
  const buildColorMap = (colorTokens: TransformedToken[]) => {
    const map: Record<string, any> = {};

    for (const token of colorTokens) {
      const pathParts = token.path.slice(3); // Skip 'sys', 'light/dark', 'color'
      let current = map;

      for (let i = 0; i < pathParts.length - 1; i++) {
        const key = pathParts[i];
        if (!current[key]) {
          current[key] = {};
        }
        current = current[key];
      }

      const lastKey = pathParts[pathParts.length - 1];
      current[lastKey] = resolveTokenValue(token);
    }

    return map;
  };

  // Light colors
  if (lightColorTokens.length > 0) {
    const lightMap = buildColorMap(lightColorTokens);
    output += `$color-light: ${formatScssMap(lightMap)};\n\n`;
  }

  // Dark colors
  if (darkColorTokens.length > 0) {
    const darkMap = buildColorMap(darkColorTokens);
    output += `$color-dark: ${formatScssMap(darkMap)};\n\n`;
  }

  // Base map (references to ref tokens)
  output += `$base: (\n`;
  output += `  "elevation": ref.$elevation,\n`;
  output += `  "radius": ref.$radius,\n`;
  output += `  "space": ref.$space,\n`;
  output += `  "typo": ref.$typo,\n`;
  output += `  "breakpoint": ref.$breakpoint,\n`;
  output += `  "opacity": ref.$opacity,\n`;
  output += `  "layout": ref.$layout,\n`;
  output += `  "size": ref.$size,\n`;
  output += `  "font": ref.$font\n`;
  output += `);\n`;

  return output;
};

/**
 * Format for _comp.scss - Component tokens
 */
const formatScssComp = ({ dictionary }: { dictionary: Dictionary }) => {
  const tokens = dictionary.allTokens;

  let output = "// Auto-generated by build-tokens.ts - DO NOT EDIT\n";
  output += '@use "../functions" as fn;\n';
  output += '@use "./ref" as ref;\n';
  output += '@use "./sys" as sys;\n\n';

  // Get light and dark component tokens
  const lightTokens = tokens.filter(
    (t) => t.path[0] === "comp" && t.path[1] === "light"
  );
  const darkTokens = tokens.filter(
    (t) => t.path[0] === "comp" && t.path[1] === "dark"
  );

  // Helper to build component map with references
  const buildCompMap = (compTokens: TransformedToken[]) => {
    const map: Record<string, any> = {};

    for (const token of compTokens) {
      const pathParts = token.path.slice(2); // Skip 'comp', 'light/dark'
      let current = map;

      for (let i = 0; i < pathParts.length - 1; i++) {
        const key = pathParts[i];
        if (!current[key]) {
          current[key] = {};
        }
        current = current[key];
      }

      const lastKey = pathParts[pathParts.length - 1];
      current[lastKey] = resolveTokenValue(token);
    }

    return map;
  };

  // Light components
  if (lightTokens.length > 0) {
    const lightMap = buildCompMap(lightTokens);
    output += `$light: ${formatScssMap(lightMap)};\n\n`;
  } else {
    output += `$light: ();\n\n`;
  }

  // Dark components
  if (darkTokens.length > 0) {
    const darkMap = buildCompMap(darkTokens);
    output += `$dark: ${formatScssMap(darkMap)};\n\n`;
  } else {
    output += `$dark: ();\n\n`;
  }

  // All aggregate
  output += `$all: (\n`;
  output += `  "light": $light,\n`;
  output += `  "dark": $dark\n`;
  output += `);\n`;

  return output;
};

// ============================================================================
// Platform Configurations
// ============================================================================

interface PlatformConfig {
  name: string;
  buildPath: string;
  transformGroup?: string;
  transforms?: string[];
  files: SDFile[];
}

const scssPlatform: PlatformConfig = {
  name: "scss",
  buildPath: `${OUTPUT_DIR}/`,
  transforms: ["attribute/kebab-path", "color/hex-no-alpha", "size/px"],
  files: [
    {
      destination: "_ref.scss",
      format: "scss/ref",
      filter: (token) => {
        const path = token.path;
        return (
          path[0] === "ref" || path[0] === "effect" || path[0] === "typography"
        );
      },
    },
    {
      destination: "_sys.scss",
      format: "scss/sys",
      filter: (token) => token.path[0] === "sys",
    },
    {
      destination: "_comp.scss",
      format: "scss/comp",
      filter: (token) => token.path[0] === "comp",
    },
  ],
};

// Future platform configurations (placeholders)
// const dartPlatform: PlatformConfig = {
//   name: 'dart',
//   buildPath: 'packages/flutter-design/lib/tokens/',
//   transforms: ['attribute/kebab-path', 'color/hex-no-alpha', 'size/flutter'],
//   files: [
//     { destination: 'tokens.dart', format: 'dart/tokens' }
//   ]
// };

// const swiftPlatform: PlatformConfig = {
//   name: 'swift',
//   buildPath: 'packages/ios-design/Sources/Tokens/',
//   transforms: ['attribute/kebab-path', 'color/hex-no-alpha', 'size/swift'],
//   files: [
//     { destination: 'Tokens.swift', format: 'swift/tokens' }
//   ]
// };

// ============================================================================
// Main Execution
// ============================================================================

async function main() {
  const startTime = Date.now();
  process.stdout.write("🎨 Building design tokens...\n\n");

  // Parse CLI arguments
  const args = process.argv.slice(2);
  const tokenFile = args[0] || DEFAULT_TOKEN_FILE;
  const tokenPath = resolve(process.cwd(), tokenFile);

  process.stdout.write(`📖 Reading tokens from: ${tokenPath}\n`);

  try {
    // Create Style Dictionary instance with hooks configuration
    const sd = new StyleDictionary({
      source: [tokenPath],
      // Register hooks inline
      hooks: {
        transforms: {
          "attribute/kebab-path": attributeKebabPath,
          "color/hex-no-alpha": colorHexNoAlpha,
          "size/px": sizePx,
        },
        formats: {
          "scss/ref": formatScssRef,
          "scss/sys": formatScssSys,
          "scss/comp": formatScssComp,
        },
      },
      platforms: {
        scss: scssPlatform,
      },
      log: {
        verbosity: "default",
      },
    });

    // Build all platforms
    await sd.buildAllPlatforms();

    const elapsed = Date.now() - startTime;
    process.stdout.write("\n✅ Design tokens built successfully!\n");
    process.stdout.write(`📁 Output directory: ${OUTPUT_DIR}/\n`);
    process.stdout.write("\nGenerated files:\n");
    process.stdout.write("  - _ref.scss\n");
    process.stdout.write("  - _sys.scss\n");
    process.stdout.write("  - _comp.scss\n");
    process.stdout.write(`\n⏱️  Completed in ${elapsed}ms\n`);
  } catch (error) {
    process.stderr.write("\n❌ Error building design tokens:\n");
    process.stderr.write(String(error) + "\n");
    if (error instanceof Error && error.stack) {
      process.stderr.write(error.stack + "\n");
    }
    process.exit(1);
  }
}

main();
