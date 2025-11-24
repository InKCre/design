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

// Export Vue components (when we add them)
// export { default as Button } from './components/Button.vue'

// Export design tokens
export { default as tokens } from "./tokens/index.js";

// Library install function for Vue
export default {
  install(app, options = {}) {
    // Register global components here when we add them
    // app.component('InkButton', Button)
  },
};
