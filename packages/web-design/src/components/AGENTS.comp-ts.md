# `compName.ts` guide

`compName.ts` holds component props, emits, models, constants, types and utils. Read this file will enable the user to use this component.

## Scaffold

```typescript
import type { PropType } from "vue";
import { makeStringProp } from "@/utils/props";  // use utils/vue-props.ts

// --- Types ---

// --- Constants ---

// --- Props ---
export const compNameProps = {
  propName: makeStringProp<"option1" | "option2">("option1"),
  requiredProp: {
    type: Object as PropType<SomeInterface>,
    required: true,
  },
};

// --- Models ---
// If mutable, and the component tends to be state-less, use prop `value` rather than model.

// --- Emits ---
export const compNameEmits = {
  eventName: (param: ParamType) => true;
};

// --- Utilities ---
export function helperFunction() {
  // ...
}
```
