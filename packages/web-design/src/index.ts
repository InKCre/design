import type { App } from "vue";

import "../styles/index.scss";

// Import components for global registration
import InkAutoForm from "./components/inkAutoForm/inkAutoForm.vue";
import InkButton from "./components/inkButton/inkButton.vue";
import InkHeader from "./components/inkHeader/inkHeader.vue";
import InkDatetimePickerView from "./components/inkDatetimePickerView/inkDatetimePickerView.vue";
import InkDialog from "./components/inkDialog/inkDialog.vue";
import InkDoubleCheck from "./components/inkDoubleCheck/inkDoubleCheck.vue";
import InkDropdown from "./components/inkDropdown/inkDropdown.vue";
import InkField from "./components/inkField/inkField.vue";
import InkForm from "./components/inkForm/inkForm.vue";
import InkImage from "./components/inkImage/inkImage.vue";
import InkInput from "./components/inkInput/inkInput.vue";
import InkJsonEditor from "./components/inkJsonEditor/inkJsonEditor.vue";
import InkLoading from "./components/inkLoading/inkLoading.vue";
import InkPagination from "./components/inkPagination/inkPagination.vue";
import InkPicker from "./components/inkPicker/inkPicker.vue";
import InkPlaceholder from "./components/inkPlaceholder/inkPlaceholder.vue";
import InkPopup from "./components/inkPopup/inkPopup.vue";
import InkScrim from "./components/inkScrim/inkScrim.vue";
import InkSwitch from "./components/inkSwitch/inkSwitch.vue";
import InkTextarea from "./components/inkTextarea/inkTextarea.vue";
import InkTooltip from "./components/inkTooltip/inkTooltip.vue";

export default {
  install(app: App, options: any = {}) {
    // Register global components
    app.component("InkAutoForm", InkAutoForm);
    app.component("InkButton", InkButton);
    app.component("InkHeader", InkHeader);
    app.component("InkDatetimePickerView", InkDatetimePickerView);
    app.component("InkDialog", InkDialog);
    app.component("InkDoubleCheck", InkDoubleCheck);
    app.component("InkDropdown", InkDropdown);
    app.component("InkField", InkField);
    app.component("InkForm", InkForm);
    app.component("InkImage", InkImage);
    app.component("InkInput", InkInput);
    app.component("InkJsonEditor", InkJsonEditor);
    app.component("InkLoading", InkLoading);
    app.component("InkPagination", InkPagination);
    app.component("InkPicker", InkPicker);
    app.component("InkPlaceholder", InkPlaceholder);
    app.component("InkPopup", InkPopup);
    app.component("InkScrim", InkScrim);
    app.component("InkSwitch", InkSwitch);
    app.component("InkTextarea", InkTextarea);
    app.component("InkTooltip", InkTooltip);
  },
};

export {
  InkAutoForm,
  InkButton,
  InkHeader,
  InkDatetimePickerView,
  InkDialog,
  InkDoubleCheck,
  InkDropdown,
  InkField,
  InkForm,
  InkImage,
  InkInput,
  InkJsonEditor,
  InkLoading,
  InkPagination,
  InkPicker,
  InkPlaceholder,
  InkPopup,
  InkScrim,
  InkSwitch,
  InkTextarea,
  InkTooltip,
};

// Others

import { INK_ROUTER_KEY } from "./router";
import { INK_I18N_KEY } from "./i18n";

import type { DropdownOption } from "./components/inkDropdown/inkDropdown";
import type {
  JSONSchema,
  JSONSchemaProperty,
} from "./components/inkAutoForm/inkAutoForm";

// others
import type { InkRouter } from "./router";
import type { InkI18n } from "./i18n";

export {
  DropdownOption,
  JSONSchema,
  JSONSchemaProperty,
  InkRouter,
  INK_ROUTER_KEY,
  InkI18n,
  INK_I18N_KEY,
};
