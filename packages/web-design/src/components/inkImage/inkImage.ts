import { makeStringProp, makeBooleanProp } from "../../utils/vue-props";
import type { PropType } from "vue";

// --- Types ---
export interface InkImageErrorPayload {
  error: Event;
  src: string;
}

// --- Props ---
export const inkImageProps = {
  /** Image source URL */
  src: makeStringProp(),
  /** Alternative text for accessibility */
  alt: makeStringProp(),
  /** Image title or caption */
  title: makeStringProp(""),
  /** Maximum width of thumbnail (CSS value, e.g., "200px", "100%") */
  maxWidth: makeStringProp("100%"),
  /** Maximum height of thumbnail (CSS value, e.g., "200px") */
  maxHeight: makeStringProp(""),
  /** Whether to lazy load the image */
  lazy: makeBooleanProp(true),
} as const;

// --- Emits ---
export const inkImageEmits = {
  /** Triggered when image is clicked to expand */
  expand: () => true,
  /** Triggered when expanded view is closed */
  close: () => true,
  /** Triggered when image fails to load */
  error: (payload: InkImageErrorPayload) => true,
} as const;
