<script setup lang="ts">
import { ref } from "vue";
import InkTextarea from "./inkTextarea.vue";

const textValue = ref("");
</script>

<template>
  <Story
    title="Forms/Textarea/[Semantic] Basic"
    :layout="{ type: 'single', iframe: false }"
  >
    <Variant title="Default">
      <InkTextarea
        v-model:value="textValue"
        label="Description"
        placeholder="Enter description..."
        layout="col"
      />
    </Variant>
  </Story>

  <Story
    title="Forms/Textarea/[State] Required"
    :layout="{ type: 'single', iframe: false }"
  >
    <Variant title="Optional">
      <InkTextarea
        v-model:value="textValue"
        label="Notes"
        placeholder="Optional notes"
        :required="false"
        layout="col"
      />
    </Variant>

    <Variant title="Required">
      <InkTextarea
        v-model:value="textValue"
        label="Comments"
        placeholder="Required field"
        :required="true"
        layout="col"
      />
    </Variant>
  </Story>

  <Story
    title="Forms/Textarea/[Semantic] Row Size"
    :layout="{ type: 'single', iframe: false }"
  >
    <Variant title="3 Rows">
      <InkTextarea
        v-model:value="textValue"
        label="Short Text"
        :rows="3"
        layout="col"
      />
    </Variant>

    <Variant title="10 Rows">
      <InkTextarea
        v-model:value="textValue"
        label="Long Text"
        :rows="10"
        layout="col"
      />
    </Variant>
  </Story>
</template>
