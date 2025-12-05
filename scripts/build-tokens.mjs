import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname, sep } from "path";
import { fileURLToPath } from "url";
import StyleDictionary from "style-dictionary";
import { transformTypes, transforms } from "style-dictionary/enums";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const outputDir = resolve(
  __dirname,
  "../packages/web-design/src/styles/tokens"
);

// Ensure output directory exists
mkdirSync(outputDir, { recursive: true });

// Read the W3C DTCG JSON file
// Accept file path as command-line argument, otherwise use default
const tokensPath = process.argv[2]
  ? resolve(rootDir, process.argv[2])
  : resolve(rootDir, "tokens/inkcre.tokens.json");
const tokensJson = JSON.parse(readFileSync(tokensPath, "utf-8"));

// Helper function to convert camelCase to kebab-case
function toKebabCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

// Helper function to convert nested object to SCSS map string
function objectToScssMap(obj, indent = 0) {
  const spaces = "  ".repeat(indent);
  const nextSpaces = "  ".repeat(indent + 1);

  if (typeof obj !== "object" || obj === null) {
    return formatValue(obj);
  }

  const entries = Object.entries(obj);
  if (entries.length === 0) {
    return "()";
  }

  const lines = entries.map(([key, value]) => {
    const scssKey = toKebabCase(key.replace(/[^a-zA-Z0-9_-]/g, "-"));
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      return `${nextSpaces}"${scssKey}": ${objectToScssMap(value, indent + 1)}`;
    }
    return `${nextSpaces}"${scssKey}": ${formatValue(value, scssKey)}`;
  });

  return `(\n${lines.join(",\n")}\n${spaces})`;
}

// Helper function to format values for SCSS
function formatValue(value, key) {
  if (value === null || value === undefined) {
    return "null";
  }
  if (typeof value === "string") {
    // If it's a color hex, return without quotes and remove alpha channel
    if (/^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(value)) {
      return value.toLowerCase().substring(0, 7);
    }
    // If it's a CSS value with units, return without quotes
    if (/^\d+(\.\d+)?(px|rem|em|%)$/.test(value)) {
      return value;
    }
    return `"${value}"`;
  }
  if (typeof value === "number") {
    // Add px for font-size and line-height
    if (key === "font-size" || key === "line-height") {
      return `${value}px`;
    }
    return value.toString();
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  return JSON.stringify(value);
}

// Register custom transforms
StyleDictionary.registerTransform({
  name: "attribute/kebab-path",
  type: transformTypes.attribute,
  transform: (token) => {
    token.path = token.path.map((segment) =>
      segment
        .replace(/[^a-zA-Z0-9_-]/g, "-")
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .toLowerCase()
    );
    return token;
  },
});

StyleDictionary.registerTransform({
  name: "color/hex-no-alpha",
  type: transformTypes.value,
  filter: (token) => token.type === "color",
  transform: (token) => {
    let value = token.value;
    if (typeof value === "string" && /^#[0-9a-f]{8}$/i.test(value)) {
      return value.substring(0, 7);
    }
    return value;
  },
});

StyleDictionary.registerTransform({
  name: "size/px",
  type: transformTypes.value,
  filter: (token) =>
    token.type === "dimension" && typeof token.value === "number",
  transform: (token) => `${token.value}px`,
});

// Register custom formats
StyleDictionary.registerFormat({
  name: "scss/map-ref",
  format: ({ dictionary }) => {
    const refTokens = {};
    const fontTokens = {};
    const categoryMap = {
      color: "color",
      space: "space",
      radius: "radius",
      opacity: "opacity",
      layout: "layout",
      typo: "typo",
      breakpoint: "breakpoint",
    };

    dictionary.allTokens.forEach((token) => {
      if (token.path[0] === "ref" && categoryMap[token.path[1]]) {
        const cat = categoryMap[token.path[1]];
        if (!refTokens[cat]) refTokens[cat] = {};
        const subPath = token.path.slice(2);
        let current = refTokens[cat];
        for (let i = 0; i < subPath.length - 1; i++) {
          if (!current[subPath[i]]) current[subPath[i]] = {};
          current = current[subPath[i]];
        }
        current[subPath[subPath.length - 1]] = token.value;
      } else if (token.path[0] === "effect" && token.path[1] === "elevation") {
        const cat = "elevation";
        if (!refTokens[cat]) refTokens[cat] = {};
        const subPath = token.path.slice(2);
        let current = refTokens[cat];
        for (let i = 0; i < subPath.length - 1; i++) {
          if (!current[subPath[i]]) current[subPath[i]] = {};
          current = current[subPath[i]];
        }
        current[subPath[subPath.length - 1]] = token.value;
      } else if (token.path[0] === "font") {
        // Font tokens go to ref
        const subPath = token.path.slice(1);
        let current = fontTokens;
        for (let i = 0; i < subPath.length - 1; i++) {
          if (!current[subPath[i]]) current[subPath[i]] = {};
          current = current[subPath[i]];
        }
        current[subPath[subPath.length - 1]] = token.value;
      }
    });

    // Ensure all mapped categories are always present
    Object.values(categoryMap).forEach((cat) => {
      if (!refTokens[cat]) refTokens[cat] = {};
    });
    // Also ensure elevation is present
    if (!refTokens.elevation) refTokens.elevation = {};

    let content = "";
    for (const [category, tokens] of Object.entries(refTokens)) {
      content += `$${category}: ${objectToScssMap(tokens)};\n\n`;
    }
    // Add font tokens
    if (Object.keys(fontTokens).length > 0) {
      content += `$font: ${objectToScssMap(fontTokens)};\n\n`;
    } else {
      content += `$font: ();\n\n`;
    }

    // Generate $all map that aggregates all ref maps
    const allCategories = Object.keys(refTokens);
    if (Object.keys(fontTokens).length > 0) {
      allCategories.push("font");
    }
    if (allCategories.length > 0) {
      const allEntries = allCategories
        .map((cat) => `  "${cat}": $${cat}`)
        .join(",\n");
      content += `$all: (\n${allEntries}\n);\n`;
    } else {
      content += `$all: ();\n`;
    }

    return content;
  },
});

// Helper function to convert ref token reference to map-deep-get call
function refToMapDeepGet(refPath) {
  // refPath is like "ref.color.neutral.98" -> map-deep-get(ref.$color, "neutral", "98")
  const parts = refPath.split(".");
  if (parts[0] !== "ref" || parts.length < 3) {
    return null;
  }

  const refCategory = parts[1];
  const categoryMap = {
    color: "color",
    space: "space",
    shape: "shape",
    opacity: "opacity",
    layout: "layout",
    typo: "typo",
    breakpoint: "breakpoint",
  };

  const scssVar = categoryMap[refCategory];
  if (!scssVar) {
    return null;
  }

  const keyPath = parts
    .slice(2)
    .map((k) => `"${toKebabCase(k)}"`)
    .join(", ");
  return `fn.map-deep-get(ref.$${scssVar}, ${keyPath})`;
}

// Helper function to convert nested object to SCSS map string with reference support
function objectToScssMapWithRefs(obj, indent = 0) {
  const spaces = "  ".repeat(indent);
  const nextSpaces = "  ".repeat(indent + 1);

  if (typeof obj !== "object" || obj === null) {
    return formatValueWithRef(obj);
  }

  const entries = Object.entries(obj);
  if (entries.length === 0) {
    return "()";
  }

  const lines = entries.map(([key, value]) => {
    const scssKey = toKebabCase(key.replace(/[^a-zA-Z0-9_-]/g, "-"));
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      // Check if this is a token object with __ref property
      if (value.__ref) {
        const mapDeepGet = refToMapDeepGet(value.__ref);
        if (mapDeepGet) {
          return `${nextSpaces}"${scssKey}": ${mapDeepGet}`;
        }
      }
      return `${nextSpaces}"${scssKey}": ${objectToScssMapWithRefs(
        value,
        indent + 1
      )}`;
    }
    return `${nextSpaces}"${scssKey}": ${formatValueWithRef(value)}`;
  });

  return `(\n${lines.join(",\n")}\n${spaces})`;
}

// Helper function to format values for SCSS with reference support
function formatValueWithRef(value) {
  if (value === null || value === undefined) {
    return "null";
  }
  if (typeof value === "object" && value.__ref) {
    const mapDeepGet = refToMapDeepGet(value.__ref);
    if (mapDeepGet) {
      return mapDeepGet;
    }
  }
  return formatValue(value);
}

StyleDictionary.registerFormat({
  name: "scss/map-sys",
  format: ({ dictionary }) => {
    const sysTokens = {};

    dictionary.allTokens.forEach((token) => {
      if (
        token.path[0] === "sys" &&
        (token.path[1] === "light" || token.path[1] === "dark")
      ) {
        const mode = token.path[1];
        const cat = `color-${mode}`;
        if (!sysTokens[cat]) sysTokens[cat] = {};
        const subPath = token.path.slice(2);
        if (subPath[0] === "color") {
          let current = sysTokens[cat];
          for (let i = 1; i < subPath.length - 1; i++) {
            const key = subPath[i];
            if (!current[key]) current[key] = {};
            current = current[key];
          }
          // Check if the original value is a reference
          const originalValue = token.original?.value || token.$value;
          if (
            typeof originalValue === "string" &&
            originalValue.startsWith("{") &&
            originalValue.endsWith("}")
          ) {
            // Store reference path along with resolved value
            const refPath = originalValue.slice(1, -1);
            current[subPath[subPath.length - 1]] = {
              __ref: refPath,
              value: token.value,
            };
          } else {
            current[subPath[subPath.length - 1]] = token.value;
          }
        }
      }
    });

    let content = '@use "../functions" as fn;\n@use "./ref" as ref;\n\n';
    if (sysTokens["color-light"]) {
      content += `$color-light: ${objectToScssMapWithRefs(
        sysTokens["color-light"]
      )};\n\n`;
    }
    if (sysTokens["color-dark"]) {
      content += `$color-dark: ${objectToScssMapWithRefs(
        sysTokens["color-dark"]
      )};\n\n`;
    }
    // Generate $base map aggregating ref elevation, radius, space, typo, breakpoint, opacity, layout, and font
    content += `$base: (
  "elevation": ref.$elevation,
  "radius": ref.$radius,
  "space": ref.$space,
  "typo": ref.$typo,
  "breakpoint": ref.$breakpoint,
  "opacity": ref.$opacity,
  "layout": ref.$layout,
  "font": ref.$font
);\n\n`;
    return content;
  },
});

StyleDictionary.registerFormat({
  name: "scss/map-comp",
  format: ({ dictionary }) => {
    const compTokens = {};

    dictionary.allTokens.forEach((token) => {
      if (token.path[0] === "comp") {
        // First level after "comp" is the component name (e.g., "ink-button")
        const componentName = token.path[1];
        if (!componentName) return;

        if (!compTokens[componentName]) compTokens[componentName] = {};

        const subPath = token.path.slice(2);
        if (subPath.length === 0) {
          // Direct value on component level
          compTokens[componentName] = token.value;
        } else {
          let current = compTokens[componentName];
          for (let i = 0; i < subPath.length - 1; i++) {
            if (!current[subPath[i]]) current[subPath[i]] = {};
            current = current[subPath[i]];
          }
          current[subPath[subPath.length - 1]] = token.value;
        }
      }
    });

    let content = "";
    const componentNames = [];

    // Generate individual component variables at root level
    for (const [componentName, tokens] of Object.entries(compTokens)) {
      const scssVarName = toKebabCase(
        componentName.replace(/[^a-zA-Z0-9_-]/g, "-")
      );
      componentNames.push(scssVarName);
      content += `$${scssVarName}: ${objectToScssMap(tokens)};\n\n`;
    }

    // Generate $all map that aggregates all component maps
    if (componentNames.length > 0) {
      const allEntries = componentNames
        .map((name) => `  "${name}": $${name}`)
        .join(",\n");
      content += `$all: (\n${allEntries}\n);\n`;
    } else {
      content += `$all: ();\n`;
    }

    return content;
  },
});

// Create Style Dictionary instance
const sd = new StyleDictionary({
  source: [tokensPath],
  platforms: {
    ref: {
      transforms: [
        transforms.attributeCti,
        "attribute/kebab-path",
        transforms.nameKebab,
        "color/hex-no-alpha",
        "size/px",
      ],
      buildPath: outputDir + sep,
      files: [
        {
          destination: "_ref.scss",
          format: "scss/map-ref",
        },
      ],
    },
    sys: {
      transforms: [
        transforms.attributeCti,
        "attribute/kebab-path",
        transforms.nameKebab,
        "color/hex-no-alpha",
        "size/px",
      ],
      buildPath: outputDir + sep,
      files: [
        {
          destination: "_sys.scss",
          format: "scss/map-sys",
        },
      ],
    },
    comp: {
      transforms: [
        transforms.attributeCti,
        "attribute/kebab-path",
        transforms.nameKebab,
        "color/hex-no-alpha",
        "size/px",
      ],
      buildPath: outputDir + sep,
      files: [
        {
          destination: "_comp.scss",
          format: "scss/map-comp",
        },
      ],
    },
  },
});

// Build the tokens
await sd.buildAllPlatforms();

console.log("Token transformation complete!");
