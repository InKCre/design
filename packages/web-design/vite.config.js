import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import UnoCSS from "unocss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue(), UnoCSS(), dts({ rollupTypes: true })],

  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "InKCreWebDesign",
      fileName: "index",
      formats: ["es"],
    },
    sourcemap: "inline",
    outDir: "dist",
    rollupOptions: {
      external: ["vue", "vue-router", "vue-i18n", "dayjs"],

      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
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
      "@inkcre/web-design/styles": resolve(__dirname, "styles"),
    },
  },
});
