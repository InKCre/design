import { makeStringProp, makeBooleanProp } from "../../utils/vue-props";

// --- Types ---
type ButtonType = "subtle" | "primary" | "danger";
type ButtonSize = "md" | "sm";

// --- Props ---
export const inkButtonProps = {
	text: makeStringProp("Button Text"),
	type: makeStringProp<ButtonType>("subtle"),
	size: makeStringProp<ButtonSize>("md"),
	isLoading: makeBooleanProp(false),
} as const;

// --- Emits ---
export const inkButtonEmits = {
	click: () => true,
} as const;
