<script setup lang="ts">
import InkHeader from "./inkHeader.vue";
</script>

<template>
  <Story
    title="Controls/Header/[Semantic] Default"
    :layout="{ type: 'single', iframe: true }"
  >
    <Variant title="Basic Header">
      <InkHeader
        title="InKCre"
        pageTitle="Dashboard"
      />
    </Variant>
  </Story>

  <Story
    title="Controls/Header/[State] With Logo"
    :layout="{ type: 'single', iframe: true }"
  >
    <Variant title="With Logo">
      <InkHeader
        title="InKCre"
        logoSrc="https://via.placeholder.com/32"
      />
    </Variant>

    <Variant title="Without Logo">
      <InkHeader
        title="InKCre"
      />
    </Variant>
  </Story>
</template>
