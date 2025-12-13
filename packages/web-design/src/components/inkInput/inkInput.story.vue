<script setup lang="ts">
import { ref } from "vue";
import InkInput from "./inkInput.vue";
</script>

<template>
  <Story
    title="Forms/Input"
    :layout="{ type: 'single', iframe: false }"
  >
    <Variant title="Basic Input">
      <template #default>
        <InkInput
          v-model="basicValue"
          placeholder="Enter text..."
        />
        <p style="margin-top: 8px; font-size: 12px; color: #666;">
          Value: {{ basicValue }}
        </p>
      </template>
    </Variant>

    <Variant title="With Label">
      <template #default>
        <InkInput
          v-model="labeledValue"
          label="Full Name"
          placeholder="John Doe"
          layout="col"
        />
      </template>
    </Variant>

    <Variant title="Required">
      <template #default>
        <InkInput
          v-model="requiredValue"
          label="Email Address"
          placeholder="email@example.com"
          :required="true"
          layout="col"
        />
      </template>
    </Variant>

    <Variant title="Inline Type">
      <template #default>
        <InkInput
          v-model="inlineValue"
          type="inline"
          placeholder="Click to edit"
        />
      </template>
    </Variant>
  </Story>
</template>

<script lang="ts">
export default {
  data() {
    return {
      basicValue: "",
      labeledValue: "",
      requiredValue: "",
      inlineValue: "Edit me",
    };
  },
};
</script>
