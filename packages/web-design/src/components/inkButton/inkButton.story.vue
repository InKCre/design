<script setup lang="ts">
import InkButton from "./inkButton.vue";
</script>

<template>
  <Story title="Controls/Button" :layout="{ type: 'grid', width: '100%' }">
    <!-- [Semantic] Variants -->
    <Variant title="Subtle">
      <InkButton text="Subtle Button" type="subtle" />
    </Variant>

    <Variant title="Primary">
      <InkButton text="Primary Button" type="primary" />
    </Variant>

    <Variant title="Danger">
      <InkButton text="Danger Button" type="danger" />
    </Variant>

    <!-- [Semantic] Sizes -->
    <Variant title="Medium (Default)">
      <InkButton text="Medium Button" type="primary" size="md" />
    </Variant>

    <Variant title="Small">
      <InkButton text="Small Button" type="primary" size="sm" />
    </Variant>

    <!-- [Edge] Content Stress -->
    <Variant title="Very Long Text">
      <InkButton
        text="This is an extremely long button text that should not break the layout completely"
        type="primary"
      />
    </Variant>

    <Variant title="Short Text">
      <InkButton text="OK" type="primary" />
    </Variant>
  </Story>
</template>
