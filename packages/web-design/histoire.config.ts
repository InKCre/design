import { defineConfig } from "histoire";
import { HstVue } from "@histoire/plugin-vue";
import { resolve } from "path";
import { readFileSync, writeFileSync } from "fs";
import type { Plugin } from "vite";

const cdnModules = {
  '@codemirror/view': 'https://esm.sh/@codemirror/view@6.38.8',
  '@codemirror/state': 'https://esm.sh/@codemirror/state@6.5.2',
  '@codemirror/lang-json': 'https://esm.sh/@codemirror/lang-json@6.0.2',
  '@codemirror/commands': 'https://esm.sh/@codemirror/commands@6.10.0',
  '@codemirror/autocomplete': 'https://esm.sh/@codemirror/autocomplete@6.20.0',
  '@codemirror/lint': 'https://esm.sh/@codemirror/lint@6.9.2',
  'vscode-json-languageservice': 'https://esm.sh/vscode-json-languageservice@5.6.4',
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
      if (isBuild && (id.startsWith('\0@codemirror/') || id.startsWith('\0vscode-json-languageservice'))) {
        const originalId = id.slice(1);
        const cdnUrl = cdnModules[originalId as keyof typeof cdnModules];
        // Return a proxy module that imports from CDN
        return `export * from '${cdnUrl}';`;
      }
      return null;
    },
    
    closeBundle() {
      if (isBuild && !htmlTransformed) {
        try {
          const htmlPath = resolve(outDir, 'index.html');
          let html = readFileSync(htmlPath, 'utf-8');
          
          // Check if import map already exists
          if (html.includes('type="importmap"')) {
            htmlTransformed = true;
            return;
          }
          
          const importMapScript = `  <script type="importmap">
    {
      "imports": {
${Object.entries(cdnModules).map(([name, url]) => `        "${name}": "${url}"`).join(',\n')}
      }
    }
  </script>
`;
          html = html.replace('</head>', importMapScript + '</head>');
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
    plugins: [cdnExternalsPlugin()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@inkcre/web-design/styles': resolve(__dirname, 'styles'),
      },
    },
  },
});
