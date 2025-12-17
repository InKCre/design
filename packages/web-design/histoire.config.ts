import { defineConfig } from "histoire";
import { HstVue } from "@histoire/plugin-vue";
import { resolve } from "path";
import { readFileSync, writeFileSync } from "fs";
import { visualizer } from "rollup-plugin-visualizer";
import type { Plugin } from "vite";

const cdnModules = {
  '@codemirror/view': 'https://esm.sh/@codemirror/view@6.38.8',
  '@codemirror/state': 'https://esm.sh/@codemirror/state@6.5.2',
  '@codemirror/lang-json': 'https://esm.sh/@codemirror/lang-json@6.0.2',
  '@codemirror/commands': 'https://esm.sh/@codemirror/commands@6.10.0',
  '@codemirror/autocomplete': 'https://esm.sh/@codemirror/autocomplete@6.20.0',
  '@codemirror/lint': 'https://esm.sh/@codemirror/lint@6.9.2',
  'vscode-json-languageservice': 'https://esm.sh/vscode-json-languageservice@5.6.4',
  // Also externalize Vue and related libraries
  // Note: Versions match peerDependencies in package.json
  // This is only for Histoire build (dev tool), not production builds
  'vue': 'https://esm.sh/vue@3.5.25',
  'vue-router': 'https://esm.sh/vue-router@4.6.4',
  '@vueuse/core': 'https://esm.sh/@vueuse/core@14.1.0',
  'dayjs': 'https://esm.sh/dayjs@1.11.19',
};

const cdnExternalsPlugin = (): Plugin => {
  let isBuild = false;
  let outDir = '';
  let htmlTransformed = false;
  
  return {
    name: 'cdn-externals',
    enforce: 'pre',
    
    configResolved(config) {
      isBuild = config.command === 'build';
      outDir = config.build.outDir;
    },
    
    resolveId(id) {
      if (isBuild && Object.keys(cdnModules).includes(id)) {
        // Return a special virtual module ID
        return '\0' + id;
      }
      return null;
    },
    
    load(id) {
      if (isBuild && id.startsWith('\0')) {
        const originalId = id.slice(1);
        if (originalId in cdnModules) {
          const cdnUrl = cdnModules[originalId as keyof typeof cdnModules];
          // Return a proxy module that imports from CDN
          return `export * from '${cdnUrl}';`;
        }
      }
      return null;
    },
    
    closeBundle() {
      if (isBuild && !htmlTransformed) {
        try {
          const htmlPath = resolve(outDir, 'index.html');
          
          // Check if file exists
          try {
            readFileSync(htmlPath, 'utf-8');
          } catch {
            // HTML file doesn't exist yet, skip transformation
            return;
          }
          
          let html = readFileSync(htmlPath, 'utf-8');
          
          // Check if import map already exists using regex
          if (/<script[^>]*type=["']importmap["'][^>]*>/i.test(html)) {
            htmlTransformed = true;
            return;
          }
          
          // Create import map with proper JSON serialization
          const importMap = {
            imports: Object.fromEntries(
              Object.entries(cdnModules).map(([name, url]) => [name, url])
            )
          };
          const importMapScript = `  <script type="importmap">\n${JSON.stringify(importMap, null, 4)}\n  </script>\n`;
          
          html = html.replace(/<\/head>/i, importMapScript + '</head>');
          writeFileSync(htmlPath, html);
          htmlTransformed = true;
          console.log('[CDN] Added import map to HTML');
        } catch (err) {
          console.error('[CDN] Failed to transform HTML:', err);
        }
      }
    },
  };
};

/**
 * Vite plugin to filter Shiki.js languages to only include the ones we need
 * This reduces the bundle size by excluding unused language grammars (~7MB savings)
 */
const shikiLanguageFilterPlugin = (): Plugin => {
  // Languages we want to keep - only what's needed for our documentation
  const allowedLanguages = new Set([
    'javascript', 'js',
    'typescript', 'ts',
    'vue', 'vue-html',
    'html',
    'css', 'scss', 'sass', 'less', 'postcss',
    'json', 'jsonc',
    'markdown', 'md', 'mdx',
    'jsx', 'tsx',
  ]);

  return {
    name: 'shiki-language-filter',
    enforce: 'pre',
    
    resolveId(id, importer) {
      // Intercept ALL Shiki language imports - both static and dynamic
      // Pattern: node_modules/shiki/dist/langs/*.mjs or @shikijs/langs/*.mjs
      if ((id.includes('shiki') || id.includes('@shikijs')) && id.includes('/langs/')) {
        // Extract language name from various patterns:
        // - /langs/javascript.mjs
        // - /langs/typescript
        // - @shikijs/langs/python.mjs
        const langMatch = id.match(/\/langs\/([^/.]+)/);
        
        if (langMatch) {
          const langName = langMatch[1].toLowerCase();
          
          // Check if this language is in our allowed list
          const isAllowed = allowedLanguages.has(langName) || 
                           Array.from(allowedLanguages).some(allowed => 
                             langName.includes(allowed) || allowed.includes(langName)
                           );
          
          if (!isAllowed) {
            // Return a virtual empty module for excluded languages
            console.log(`[Shiki] ✗ Excluding: ${langName}`);
            return '\0shiki-excluded:' + langName;
          } else {
            console.log(`[Shiki] ✓ Including: ${langName}`);
          }
        }
      }
      return null;
    },
    
    load(id) {
      // Provide empty exports for excluded language modules
      if (id.startsWith('\0shiki-excluded:')) {
        return `
// Excluded Shiki language: ${id.replace('\0shiki-excluded:', '')}
export default {};
export const lang = {};
        `;
      }
      return null;
    },
  };
};

export default defineConfig({
  plugins: [HstVue()],
  setupFile: "./src/histoire.setup.ts",
  theme: {
    title: "InKCre Web Design",
    logo: {
      square: "./src/logo.svg",
      light: "./src/logo.svg",
      dark: "./src/logo.svg",
    },
  },
  vite: {
    plugins: [
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true
      }),
      shikiLanguageFilterPlugin(),
      cdnExternalsPlugin()
    ],
    build: {
      sourcemap: false,
      minify: 'terser',
      cssMinify: true
    }
  }
});
