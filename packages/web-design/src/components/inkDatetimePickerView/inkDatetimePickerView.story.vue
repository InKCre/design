<script setup lang="ts">
import InkDatetimePickerView from "./inkDatetimePickerView.vue";
</script>

<template>
  <Story
    title="Specialized/DatetimePickerView/[Semantic] Views"
    :layout="{ type: 'single', iframe: false }"
  >
    <Variant title="Date View">
      <InkDatetimePickerView type="date" />
    </Variant>
  </Story>
</template>
