/**
 * InKCre Web Design System
 *
 * This package provides design tokens and styles for InKCre web projects.
 *
 * @example
 * // Import styles in your CSS/SCSS
 * @import '@inkcre/web-design/styles';
 *
 * // Or use the compiled CSS
 * import '@inkcre/web-design/styles.css';
 */

// Export any JavaScript utilities or constants if needed in the future
export const DESIGN_SYSTEM_VERSION = "0.1.0";

// Export styles
import "./styles/index.scss";

// Export components
export { default as InkButton } from "./components/inkButton/inkButton.vue";
export { default as InkHeader } from "./components/inkHeader/inkHeader.vue";
export { default as InkDatetimePickerView } from "./components/inkDatetimePickerView/inkDatetimePickerView.vue";
export { default as InkDoubleCheck } from "./components/inkDoubleCheck/inkDoubleCheck.vue";
export { default as InkDropdown } from "./components/inkDropdown/inkDropdown.vue";
export { default as InkField } from "./components/inkField/inkField.vue";
export { default as InkForm } from "./components/inkForm/inkForm.vue";
export { default as InkInput } from "./components/inkInput/inkInput.vue";
export { default as InkJsonEditor } from "./components/inkJsonEditor/inkJsonEditor.vue";
export { default as InkLoading } from "./components/inkLoading/inkLoading.vue";
export { default as InkPicker } from "./components/inkPicker/inkPicker.vue";
export { default as InkPopup } from "./components/inkPopup/inkPopup.vue";
export { default as InkSwitch } from "./components/inkSwitch/inkSwitch.vue";
export { default as InkTextarea } from "./components/inkTextarea/inkTextarea.vue";
export { default as InkTooltip } from "./components/inkTooltip/inkTooltip.vue";

// Export component props and types
export { inkButtonProps, inkButtonEmits } from "./components/inkButton/inkButton";
export { inkHeaderProps } from "./components/inkHeader/inkHeader";
export { inkDatetimePickerViewProps, inkDatetimePickerViewEmits } from "./components/inkDatetimePickerView/inkDatetimePickerView";
export { inkDoubleCheckProps, inkDoubleCheckEmits } from "./components/inkDoubleCheck/inkDoubleCheck";
export { inkDropdownProps, inkDropdownEmits } from "./components/inkDropdown/inkDropdown";
export { inkFieldProps, inkFieldEmits, type FieldLayout } from "./components/inkField/inkField";
export { inkFormProps, formControlCommonProps, INK_FORM_CONTEXT_KEY, type InkFormContext } from "./components/inkForm/inkForm";
export { inkInputProps, inkInputEmits } from "./components/inkInput/inkInput";
export { inkJsonEditorProps, inkJsonEditorEmits } from "./components/inkJsonEditor/inkJsonEditor";
export { inkLoadingProps } from "./components/inkLoading/inkLoading";
export { inkPickerProps, inkPickerEmits, type InkPickerValue } from "./components/inkPicker/inkPicker";
export { inkPopupProps, inkPopupEmits } from "./components/inkPopup/inkPopup";
export { inkSwitchProps, inkSwitchEmits } from "./components/inkSwitch/inkSwitch";
export { inkTextareaProps, inkTextareaEmits } from "./components/inkTextarea/inkTextarea";
export { inkTooltipProps } from "./components/inkTooltip/inkTooltip";

// Export utilities
export * from "./utils/vue-props";
export * from "./utils/token-types";

// Library install function for Vue
export default {
  install(app, options = {}) {
    // Register global components here when we add them
    // app.component('InkButton', Button)
  },
};

