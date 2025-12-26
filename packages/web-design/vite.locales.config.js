import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    dts({
      rollupTypes: true,
      include: ["src/locales/**/*.ts"],
      outDir: "dist",
    }),
  ],
  
  build: {
    lib: {
      entry: resolve(__dirname, "src/locales/index.ts"),
      name: "InKCreWebDesignLocales",
      fileName: "locales/index",
      formats: ["es"],
    },
    outDir: "dist",
    emptyOutDir: false,
  },
});
