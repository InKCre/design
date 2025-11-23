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
  : resolve(rootDir, "inkcre.tokens.json");
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
    return `${nextSpaces}"${scssKey}": ${formatValue(value)}`;
  });

  return `(\n${lines.join(",\n")}\n${spaces})`;
}

// Helper function to format values for SCSS
function formatValue(value) {
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
    const categoryMap = {
      color: "palette",
      space: "space",
      shape: "shape",
      opacity: "opacity",
      layout: "layout",
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
      } else if (token.path[0] === "font") {
        const cat = "font";
        if (!refTokens[cat]) refTokens[cat] = {};
        const subPath = token.path.slice(1);
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
      }
    });

    let content = "";
    for (const [category, tokens] of Object.entries(refTokens)) {
      content += `$${category}: ${objectToScssMap(tokens)};\n\n`;
    }
    return content;
  },
});

StyleDictionary.registerFormat({
  name: "scss/map-sys",
  format: ({ dictionary }) => {
    const sysTokens = {};
    const categoryMap = {
      light: "light",
      dark: "dark",
    };

    dictionary.allTokens.forEach((token) => {
      if (token.path[0] === "sys" && categoryMap[token.path[1]]) {
        const cat = categoryMap[token.path[1]];
        if (!sysTokens[cat]) sysTokens[cat] = {};
        const subPath = token.path.slice(2);
        let current = sysTokens[cat];
        for (let i = 0; i < subPath.length - 1; i++) {
          if (!current[subPath[i]]) current[subPath[i]] = {};
          current = current[subPath[i]];
        }
        current[subPath[subPath.length - 1]] = token.value;
      }
    });

    let content = "";
    if (sysTokens.light) {
      content += `$light: ${objectToScssMap(sysTokens.light)};\n\n`;
    }
    if (sysTokens.dark) {
      content += `$dark: ${objectToScssMap(sysTokens.dark)};\n\n`;
    }
    content += `$component-tokens: ();\n`;
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
  },
});

// Build the tokens
await sd.buildAllPlatforms();

console.log("Token transformation complete!");
