<script setup lang="ts">
import { ref } from "vue";
import InkSwitch from "./inkSwitch.vue";
</script>

<template>
  <Story
    title="Controls/Switch"
    :layout="{ type: 'grid', width: '200px' }"
  >
    <Variant title="Small">
      <template #default>
        <InkSwitch
          v-model="switchSm"
          size="sm"
          label="Enable"
        />
        <p style="margin-top: 8px; font-size: 12px;">State: {{ switchSm }}</p>
      </template>
    </Variant>

    <Variant title="Medium">
      <template #default>
        <InkSwitch
          v-model="switchMd"
          size="md"
          label="Feature"
        />
        <p style="margin-top: 8px; font-size: 12px;">State: {{ switchMd }}</p>
      </template>
    </Variant>

    <Variant title="Large">
      <template #default>
        <InkSwitch
          v-model="switchLg"
          size="lg"
          label="Setting"
        />
        <p style="margin-top: 8px; font-size: 12px;">State: {{ switchLg }}</p>
      </template>
    </Variant>

    <Variant title="Initially On">
      <template #default>
        <InkSwitch
          v-model="switchOn"
          size="md"
          label="Active"
        />
      </template>
    </Variant>
  </Story>
</template>

<script lang="ts">
export default {
  data() {
    return {
      switchSm: false,
      switchMd: false,
      switchLg: false,
      switchOn: true,
    };
  },
};
</script>
