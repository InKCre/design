import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],

  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "InKCreWebDesign",
      fileName: "index",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "vue",
        "vue-router",
        "@vueuse/core",
        "@codemirror/state",
        "@codemirror/view",
        "@codemirror/autocomplete",
        "@codemirror/commands",
        "@codemirror/lang-json",
        "dayjs",
      ],
    },
    cssCodeSplit: false,
    outDir: "dist",
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: (source, file) => {
          if (file.includes("src/components/")) {
            // Calculate relative path from component to styles directory
            // All components are at src/components/X/X.scss
            return `@use "../../styles/_mixins" as *;@use "../../styles/_functions" as *;${source}`;
          }
          return source;
        },
      },
    },
  },

  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
