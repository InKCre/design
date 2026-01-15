import { makeBooleanProp } from "../../utils/vue-props";

// --- Props ---
export const inkScrimProps = {
  closeOnScrim: makeBooleanProp(true),
} as const;

// --- Emits ---
export const inkScrimEmits = {
  "scrim-click": () => true,
} as const;
