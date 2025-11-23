import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '../../..');
const outputDir = resolve(__dirname, '../src/styles/tokens');

// Ensure output directory exists
mkdirSync(outputDir, { recursive: true });

// Read the W3C DTCG JSON file
// Accept file path as command-line argument, otherwise use default
const tokensPath = process.argv[2] 
  ? resolve(rootDir, process.argv[2])
  : resolve(rootDir, 'inkcre.tokens.json');
const tokensJson = JSON.parse(readFileSync(tokensPath, 'utf-8'));

// Helper function to convert nested object to SCSS map string
function objectToScssMap(obj, indent = 0) {
  const spaces = '  '.repeat(indent);
  const nextSpaces = '  '.repeat(indent + 1);
  
  if (typeof obj !== 'object' || obj === null) {
    return formatValue(obj);
  }
  
  const entries = Object.entries(obj);
  if (entries.length === 0) {
    return '()';
  }
  
  const lines = entries.map(([key, value]) => {
    const scssKey = key.replace(/[^a-zA-Z0-9_-]/g, '-');
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return `${nextSpaces}"${scssKey}": ${objectToScssMap(value, indent + 1)}`;
    }
    return `${nextSpaces}"${scssKey}": ${formatValue(value)}`;
  });
  
  return `(\n${lines.join(',\n')}\n${spaces})`;
}

// Helper function to format values for SCSS
function formatValue(value) {
  if (value === null || value === undefined) {
    return 'null';
  }
  if (typeof value === 'string') {
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
  if (typeof value === 'number') {
    return value.toString();
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  return JSON.stringify(value);
}

// Build a flat reference map for resolving token references
function buildReferenceMap(obj, path = []) {
  const refMap = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = [...path, key];
    
    if (value && typeof value === 'object') {
      if ('type' in value && 'value' in value) {
        // This is a token - store its resolved value
        const pathKey = currentPath.join('.');
        refMap[pathKey] = value.value;
      } else {
        // Recurse into nested objects
        Object.assign(refMap, buildReferenceMap(value, currentPath));
      }
    }
  }
  
  return refMap;
}

// Resolve references in token values
function resolveReferences(value, refMap) {
  if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
    const refPath = value.slice(1, -1);
    if (refMap[refPath] !== undefined) {
      // Recursively resolve in case the reference points to another reference
      return resolveReferences(refMap[refPath], refMap);
    }
  }
  return value;
}

// Helper to normalize color values
function normalizeColor(value) {
  // Remove alpha channel from color values if present
  if (typeof value === 'string' && /^#[0-9a-f]{8}$/i.test(value)) {
    return value.substring(0, 7);
  }
  return value;
}

// Helper to recursively process tokens and extract values
function extractTokenValues(obj, refMap, path = []) {
  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === 'object') {
      // Check if this is a token definition (has 'type' and 'value' properties)
      if ('type' in value && 'value' in value) {
        // Extract and resolve the actual value
        let tokenValue = resolveReferences(value.value, refMap);
        
        // Handle complex values like font styles or shadows
        if (typeof tokenValue === 'object' && !Array.isArray(tokenValue)) {
          const extracted = {};
          for (const [prop, propVal] of Object.entries(tokenValue)) {
            extracted[prop] = resolveReferences(propVal, refMap);
          }
          tokenValue = extracted;
        }
        
        // Add px unit for dimension types if value is a number
        if (value.type === 'dimension' && typeof tokenValue === 'number') {
          tokenValue = `${tokenValue}px`;
        }
        
        // Normalize color values using shared utility
        if (value.type === 'color') {
          tokenValue = normalizeColor(tokenValue);
        }
        
        result[key] = tokenValue;
      } else {
        // Recursively process nested objects
        result[key] = extractTokenValues(value, refMap, [...path, key]);
      }
    }
  }
  
  return result;
}

// Build reference map first
const refMap = buildReferenceMap(tokensJson);

// Process tokens and organize by top-level groups
const tokenGroups = {};

for (const [topLevelKey, topLevelValue] of Object.entries(tokensJson)) {
  if (topLevelValue && typeof topLevelValue === 'object') {
    tokenGroups[topLevelKey] = extractTokenValues(topLevelValue, refMap);
  }
}

// Organize tokens for output
const refTokens = {
  palette: {},
  font: {},
  space: {},
  shape: {},
  elevation: {},
  opacity: {},
  layout: {}
};

// Map top-level groups to ref categories
if (tokenGroups.ref) {
  for (const [category, categoryTokens] of Object.entries(tokenGroups.ref)) {
    if (category === 'color') {
      refTokens.palette = categoryTokens;
    } else if (category === 'shape') {
      refTokens.shape = categoryTokens;
    } else if (category === 'space') {
      refTokens.space = categoryTokens;
    }
  }
}

// Add top-level font and effect groups to ref tokens
if (tokenGroups.font) {
  refTokens.font = tokenGroups.font;
}

if (tokenGroups.effect) {
  refTokens.elevation = tokenGroups.effect;
}

// Generate _ref.scss
let refScssContent = '';
for (const [category, categoryTokens] of Object.entries(refTokens)) {
  refScssContent += `$${category}: ${objectToScssMap(categoryTokens)};\n\n`;
}

const refPath = resolve(outputDir, '_ref.scss');
writeFileSync(refPath, refScssContent, 'utf-8');
console.log(`Generated: ${refPath}`);

// Generate _sys.scss
if (tokenGroups.sys) {
  let sysScssContent = '';
  
  if (tokenGroups.sys.light) {
    sysScssContent += `$light: ${objectToScssMap(tokenGroups.sys.light)};\n\n`;
  }
  if (tokenGroups.sys.dark) {
    sysScssContent += `$dark: ${objectToScssMap(tokenGroups.sys.dark)};\n\n`;
  }
  
  sysScssContent += `$component-tokens: ();\n`;
  
  const sysPath = resolve(outputDir, '_sys.scss');
  writeFileSync(sysPath, sysScssContent, 'utf-8');
  console.log(`Generated: ${sysPath}`);
}

console.log('Token transformation complete!');
