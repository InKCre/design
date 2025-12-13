<script setup lang="ts">
import InkHeader from "./inkHeader.vue";
</script>

<template>
  <Story title="Controls/Header" :layout="{ type: 'single', iframe: true }">
    <!-- [Semantic] Default -->
    <Variant title="Basic Header">
      <InkHeader title="InKCre" pageTitle="Dashboard" />
    </Variant>

    <!-- [State] With Logo -->
    <Variant title="With Logo">
      <InkHeader title="InKCre" logoSrc="./src/logo.svg" />
    </Variant>

    <Variant title="Without Logo">
      <InkHeader title="InKCre" />
    </Variant>
  </Story>
</template>
