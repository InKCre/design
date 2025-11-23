import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const outputDir = resolve(rootDir, 'packages/web-design/src/styles/tokens');

// Ensure output directory exists
mkdirSync(outputDir, { recursive: true });

// Read the W3C DTCG JSON file
const tokensPath = resolve(rootDir, 'inkcre.tokens.json');
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

// Generate SCSS files for each top-level group
for (const [groupName, tokens] of Object.entries(tokenGroups)) {
  let scssContent = '';
  
  // Handle special cases like 'sys' which has light/dark modes
  if (groupName === 'sys') {
    // Generate separate exports for light, dark, and component tokens
    if (tokens.light) {
      scssContent += `$light: ${objectToScssMap(tokens.light)};\n\n`;
    }
    if (tokens.dark) {
      scssContent += `$dark: ${objectToScssMap(tokens.dark)};\n\n`;
    }
    
    // Component tokens (empty for now, but structure in place)
    scssContent += `$component-tokens: ();\n`;
  } else if (groupName === 'ref') {
    // For ref tokens, organize by category
    const categories = {};
    
    // Map token types to categories expected by index.scss
    const categoryMapping = {
      'color': 'palette',
      'shape': 'shape',
      'space': 'space',
    };
    
    for (const [category, categoryTokens] of Object.entries(tokens)) {
      const mappedCategory = categoryMapping[category] || category;
      categories[mappedCategory] = categoryTokens;
    }
    
    // Generate SCSS variables for each category
    for (const [category, categoryTokens] of Object.entries(categories)) {
      scssContent += `$${category}: ${objectToScssMap(categoryTokens)};\n\n`;
    }
    
    // Add empty placeholders for categories expected by index.scss
    const expectedCategories = ['font', 'elevation', 'opacity', 'layout'];
    for (const cat of expectedCategories) {
      if (!categories[cat]) {
        scssContent += `$${cat}: ();\n\n`;
      }
    }
  } else {
    // Skip font, effect, and typography groups as they're not part of the ref/sys structure
    // These may be added in future iterations if needed
    continue;
  }
  
  // Write SCSS file
  const outputPath = resolve(outputDir, `_${groupName}.scss`);
  writeFileSync(outputPath, scssContent, 'utf-8');
  console.log(`Generated: ${outputPath}`);
}

console.log('Token transformation complete!');
