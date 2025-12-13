<script setup lang="ts">
import { ref } from "vue";
import InkSwitch from "./inkSwitch.vue";

const switchMd = ref(false);
</script>

<template>
  <Story
    title="Controls/Switch/[Semantic] Sizes"
    :layout="{ type: 'grid', width: '200px' }"
  >
    <Variant title="Extra Small">
      <InkSwitch
        v-model="switchMd"
        size="xs"
        label="Enable"
      />
    </Variant>

    <Variant title="Small">
      <InkSwitch
        v-model="switchMd"
        size="sm"
        label="Feature"
      />
    </Variant>

    <Variant title="Medium">
      <InkSwitch
        v-model="switchMd"
        size="md"
        label="Setting"
      />
    </Variant>

    <Variant title="Large">
      <InkSwitch
        v-model="switchMd"
        size="lg"
        label="Option"
      />
    </Variant>
  </Story>

  <Story
    title="Controls/Switch/[State] Toggle States"
    :layout="{ type: 'grid', width: '200px' }"
  >
    <Variant title="Off">
      <InkSwitch
        modelValue="off"
        size="md"
        label="Disabled"
      />
    </Variant>

    <Variant title="On">
      <InkSwitch
        modelValue="on"
        size="md"
        label="Enabled"
      />
    </Variant>
  </Story>
</template>
