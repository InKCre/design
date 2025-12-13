<script setup lang="ts">
import { ref } from "vue";
import InkJsonEditor from "./inkJsonEditor.vue";

const jsonData = ref('{\n  "name": "InKCre",\n  "type": "organization"\n}');
</script>

<template>
  <Story
    title="Specialized/JsonEditor/[Semantic] Basic"
    :layout="{ type: 'single', iframe: false }"
  >
    <Variant title="JSON Editor">
      <InkJsonEditor
        v-model:value="jsonData"
        label="Configuration"
        layout="col"
      />
    </Variant>
  </Story>
</template>
