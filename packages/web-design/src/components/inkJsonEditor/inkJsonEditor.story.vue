<script setup lang="ts">
import { ref } from "vue";
import InkJsonEditor from "./inkJsonEditor.vue";

const jsonData = ref(
  JSON.stringify(
    {
      name: "InKCre Design System",
      version: "1.0.0",
      components: ["inkButton", "inkForm", "inkLoading", "inkJsonEditor"],
    },
    null,
    2
  )
);

const jsonSchema = ref({
  type: "object",
  properties: {
    name: { type: "string" },
    version: { type: "string" },
    components: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: ["name", "version", "components"],
});
</script>

<template>
  <Story
    title="Specialized/JsonEditor"
    :layout="{ iframe: false, type: 'single' }"
  >
    <Variant title="Basic">
      <InkJsonEditor v-model="jsonData" />
    </Variant>
    <Variant title="JSON Schema">
      <InkJsonEditor v-model="jsonData" :schema="jsonSchema" />
    </Variant>
  </Story>
</template>
