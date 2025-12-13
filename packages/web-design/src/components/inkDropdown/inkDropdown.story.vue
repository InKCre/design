<script setup lang="ts">
import { ref } from "vue";
import InkDropdown from "./inkDropdown.vue";

const selectedValue = ref("");
const options = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" },
  { label: "Option 3", value: "3" },
];
</script>

<template>
  <Story
    title="Forms/Dropdown/[Semantic] Basic"
    :layout="{ type: 'single', iframe: false }"
  >
    <Variant title="With Label">
      <InkDropdown
        v-model="selectedValue"
        label="Select Option"
        :options="options"
        layout="col"
      />
    </Variant>
  </Story>

  <Story
    title="Forms/Dropdown/[State] Required"
    :layout="{ type: 'single', iframe: false }"
  >
    <Variant title="Optional">
      <InkDropdown
        v-model="selectedValue"
        label="Category"
        :options="options"
        :required="false"
        layout="col"
      />
    </Variant>

    <Variant title="Required">
      <InkDropdown
        v-model="selectedValue"
        label="Required Field"
        :options="options"
        :required="true"
        layout="col"
      />
    </Variant>
  </Story>
</template>
