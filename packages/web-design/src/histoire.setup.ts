import { defineSetupVue3 } from "@histoire/plugin-vue";
import "../styles/index.scss";
import "virtual:uno.css";
import { INK_ROUTER_KEY } from "./router";

export const setupVue3 = defineSetupVue3(({ app, story, variant }) => {
  app.provide(INK_ROUTER_KEY, {
    // @ts-ignore
    currentPath: { value: "/dashboard" },
    // @ts-ignore
    currentName: { value: "Dashboard" },
  });
});
