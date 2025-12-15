import type { GlobalComponents } from "vue";

declare module "vue" {
  export interface GlobalComponents {
    InkButton: typeof import("./index")["InkButton"];
    InkHeader: typeof import("./index")["InkHeader"];
    InkDatetimePickerView: typeof import("./index")["InkDatetimePickerView"];
    InkDoubleCheck: typeof import("./index")["InkDoubleCheck"];
    InkDropdown: typeof import("./index")["InkDropdown"];
    InkField: typeof import("./index")["InkField"];
    InkForm: typeof import("./index")["InkForm"];
    InkInput: typeof import("./index")["InkInput"];
    InkJsonEditor: typeof import("./index")["InkJsonEditor"];
    InkLoading: typeof import("./index")["InkLoading"];
    InkPicker: typeof import("./index")["InkPicker"];
    InkPopup: typeof import("./index")["InkPopup"];
    InkDialog: typeof import("./index")["InkDialog"];
    InkSwitch: typeof import("./index")["InkSwitch"];
    InkTextarea: typeof import("./index")["InkTextarea"];
    InkTooltip: typeof import("./index")["InkTooltip"];
  }
}
