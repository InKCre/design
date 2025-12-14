<script setup lang="ts">
import InkDatetimePickerView from "./inkDatetimePickerView.vue";
</script>

<template>
  <Story
    title="Specialized/DatetimePickerView"
    :layout="{ type: 'single', iframe: false }"
  >
    <Variant title="Basic">
      <InkDatetimePickerView type="date" />
    </Variant>
  </Story>
</template>
