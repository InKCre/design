import { makeNumberProp } from "../../utils/vue-props";

// --- Props ---
export const inkPaginationProps = {
	currentPage: makeNumberProp(1),
	totalPages: makeNumberProp(1),
} as const;

// --- Emits ---
export const inkPaginationEmits = {
	"page-change": (page: number) => true,
} as const;
