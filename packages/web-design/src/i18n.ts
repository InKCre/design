import type { InjectionKey } from "vue";
import { inject } from "vue";
import type { Composer } from "vue-i18n";

export type InkI18n = Composer;

export const INK_I18N_KEY: InjectionKey<InkI18n> = Symbol("INK_I18N");

export function useOptionalI18n(): InkI18n | null {
  return inject(INK_I18N_KEY, null);
}
