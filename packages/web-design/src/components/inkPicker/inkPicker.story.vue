<script setup lang="ts">
import { ref } from "vue";
import InkPicker from "./inkPicker.vue";

const selectedDate = ref(null);
</script>

<template>
  <Story
    title="Forms/Picker/[Semantic] Date Selection"
    :layout="{ type: 'single', iframe: false }"
  >
    <Variant title="Date Picker">
      <InkPicker
        v-model="selectedDate"
        label="Select Date"
        type="date"
        layout="col"
      />
    </Variant>
  </Story>

  <Story
    title="Forms/Picker/[State] Required"
    :layout="{ type: 'single', iframe: false }"
  >
    <Variant title="Required Field">
      <InkPicker
        v-model="selectedDate"
        label="Birth Date"
        type="date"
        :required="true"
        layout="col"
      />
    </Variant>
  </Story>
</template>
