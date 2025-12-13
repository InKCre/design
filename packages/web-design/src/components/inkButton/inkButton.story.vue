<script setup lang="ts">
import InkButton from "./inkButton.vue";
</script>

<template>
  <Story
    title="Controls/Button"
    :layout="{ type: 'grid', width: '100%' }"
  >
    <Variant title="Subtle">
      <InkButton text="Subtle Button" type="subtle" size="md" />
    </Variant>

    <Variant title="Primary">
      <InkButton text="Primary Button" type="primary" size="md" />
    </Variant>

    <Variant title="Danger">
      <InkButton text="Danger Button" type="danger" size="md" />
    </Variant>

    <Variant title="Small Size">
      <InkButton text="Small Button" type="primary" size="sm" />
    </Variant>

    <Variant title="Interactive">
      <template #default>
        <InkButton text="Click Me" type="primary" @click="() => alert('Clicked!')" />
      </template>
    </Variant>
  </Story>
</template>
