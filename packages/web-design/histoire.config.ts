import { defineConfig } from "histoire";
import { HstVue } from "@histoire/plugin-vue";

export default defineConfig({
  plugins: [HstVue()],
  setupFile: "./src/histoire.setup.ts",
  theme: {
    title: "InKCre Web Design",
    logo: {
      square: "./public/logo.svg",
      light: "./public/logo.svg",
      dark: "./public/logo.svg",
    },
  },
  tree: {
    groups: [
      {
        id: "top",
        title: "",
      },
      {
        id: "controls",
        title: "Controls",
      },
      {
        id: "forms",
        title: "Forms",
      },
      {
        id: "feedback",
        title: "Feedback",
      },
      {
        id: "specialized",
        title: "Specialized",
      },
    ],
  },
});
