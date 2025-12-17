import { defineConfig } from "histoire";
import { HstVue } from "@histoire/plugin-vue";
import { resolve } from "path";
import { readFileSync, writeFileSync } from "fs";
import { visualizer } from "rollup-plugin-visualizer";
import type { Plugin } from "vite";
import MarkdownIt from "markdown-it";

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
 * Vite plugin to completely exclude Shiki from the bundle
 * This prevents any Shiki imports, reducing bundle size significantly
 */
const excludeShikiPlugin = (): Plugin => {
  return {
    name: 'exclude-shiki',
    enforce: 'pre',
    
    resolveId(id) {
      // Block all Shiki-related imports
      if (id.includes('shiki') || id.includes('@shikijs')) {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`[Exclude Shiki] Blocking: ${id}`);
        }
        return '\0shiki-excluded';
      }
      return null;
    },
    
    load(id) {
      // Return empty module for all Shiki imports
      if (id === '\0shiki-excluded') {
        return `
// Shiki excluded - using plain markdown rendering
export default {};
export const getHighlighter = () => Promise.resolve({});
export const createHighlighter = () => Promise.resolve({});
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
  // Configure markdown rendering without Shiki syntax highlighting
  // This completely removes Shiki from the bundle (~5MB savings)
  markdown: (env) => {
    // Use markdown-it without any Shiki or syntax highlighting plugins
    const md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
    });
    // Code blocks will render as plain <pre><code>...</code></pre>
    return md;
  },
  vite: {
    plugins: [
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true
      }),
      excludeShikiPlugin(),
      cdnExternalsPlugin()
    ],
    build: {
      sourcemap: false,
      minify: 'terser',
      cssMinify: true
    }
  }
});
