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
      external: [],
    },
    cssCodeSplit: false,
    outDir: "dist",
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: (source, file) => {
          if (file.includes("src/components/")) {
            return `@use "@inkcre/web-design/styles/mixins" as *;@use "@inkcre/web-design/styles/functions" as *;${source}`;
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
