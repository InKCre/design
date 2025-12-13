<script setup lang="ts">
import InkLoading from "./inkLoading.vue";
</script>

<template>
  <Story
    title="Feedback/Loading/[Semantic] Default"
    :layout="{ type: 'single', iframe: false }"
  >
    <Variant title="Loading Indicator">
      <div style="padding: 40px; display: flex; justify-content: center;">
        <InkLoading />
      </div>
    </Variant>
  </Story>
</template>
