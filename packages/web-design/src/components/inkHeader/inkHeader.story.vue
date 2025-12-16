<script setup lang="ts">
import InkHeader from "./inkHeader.vue";
</script>

<template>
  <Story title="Controls/Header" :layout="{ type: 'single', iframe: false }">
    <Variant title="Basic">
      <InkHeader title="InKCre" pageTitle="Dashboard" />
    </Variant>

    <Variant title="With Logo">
      <InkHeader
        title="InKCre"
        logoSrc="./src/logo.svg"
        pageTitle="Dashboard"
      />
    </Variant>

    <Variant title="Without Logo">
      <InkHeader title="InKCre" pageTitle="Dashboard" />
    </Variant>

    <Variant title="Auto Page Title">
      <InkHeader title="InKCre" />
    </Variant>
  </Story>
</template>
