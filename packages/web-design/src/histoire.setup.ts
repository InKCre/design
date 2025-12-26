import { defineSetupVue3 } from "@histoire/plugin-vue";
import "../styles/index.scss";
import "virtual:uno.css";
import { INK_ROUTER_KEY } from "./router";
import { INK_I18N_KEY } from "./i18n";
import { ref, computed } from "vue";
import { locales } from "./locales";

export const setupVue3 = defineSetupVue3(({ app, story, variant }) => {
  app.provide(INK_ROUTER_KEY, {
    // @ts-ignore
    currentPath: { value: "/dashboard" },
    // @ts-ignore
    currentName: { value: "Dashboard" },
  });

  // Simple i18n implementation for Histoire
  const currentLocale = ref("en");
  
  app.provide(INK_I18N_KEY, {
    t: (key: string) => {
      const keys = key.split(".");
      let value: any = locales[currentLocale.value as keyof typeof locales];
      for (const k of keys) {
        value = value?.[k];
      }
      return value || key;
    },
    locale: currentLocale,
  });
});
