import type { App } from "vue";

import "./styles/index.scss";

// Import components for global registration
import InkButton from "./components/inkButton/inkButton.vue";
import InkHeader from "./components/inkHeader/inkHeader.vue";
import InkDatetimePickerView from "./components/inkDatetimePickerView/inkDatetimePickerView.vue";
import InkDoubleCheck from "./components/inkDoubleCheck/inkDoubleCheck.vue";
import InkDropdown from "./components/inkDropdown/inkDropdown.vue";
import InkField from "./components/inkField/inkField.vue";
import InkForm from "./components/inkForm/inkForm.vue";
import InkInput from "./components/inkInput/inkInput.vue";
import InkJsonEditor from "./components/inkJsonEditor/inkJsonEditor.vue";
import InkLoading from "./components/inkLoading/inkLoading.vue";
import InkPicker from "./components/inkPicker/inkPicker.vue";
import InkPopup from "./components/inkPopup/inkPopup.vue";
import InkSwitch from "./components/inkSwitch/inkSwitch.vue";
import InkTextarea from "./components/inkTextarea/inkTextarea.vue";
import InkTooltip from "./components/inkTooltip/inkTooltip.vue";

export default {
  install(app: App, options: any = {}) {
    // Register global components
    app.component("InkButton", InkButton);
    app.component("InkHeader", InkHeader);
    app.component("InkDatetimePickerView", InkDatetimePickerView);
    app.component("InkDoubleCheck", InkDoubleCheck);
    app.component("InkDropdown", InkDropdown);
    app.component("InkField", InkField);
    app.component("InkForm", InkForm);
    app.component("InkInput", InkInput);
    app.component("InkJsonEditor", InkJsonEditor);
    app.component("InkLoading", InkLoading);
    app.component("InkPicker", InkPicker);
    app.component("InkPopup", InkPopup);
    app.component("InkSwitch", InkSwitch);
    app.component("InkTextarea", InkTextarea);
    app.component("InkTooltip", InkTooltip);
  },
};

export {
  InkButton,
  InkHeader,
  InkDatetimePickerView,
  InkDoubleCheck,
  InkDropdown,
  InkField,
  InkForm,
  InkInput,
  InkJsonEditor,
  InkLoading,
  InkPicker,
  InkPopup,
  InkSwitch,
  InkTextarea,
  InkTooltip,
};
