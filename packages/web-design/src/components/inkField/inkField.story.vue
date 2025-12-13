<script setup lang="ts">
import { ref } from "vue";
import InkField from "./inkField.vue";
</script>

<template>
  <Story
    title="Forms/Field"
    :layout="{ type: 'single', iframe: false }"
  >
    <Variant title="Column Layout">
      <InkField
        label="Username"
        value="john.doe"
        layout="col"
      />
    </Variant>

    <Variant title="Inline Layout">
      <InkField
        label="Email"
        value="john@example.com"
        layout="inline"
      />
    </Variant>

    <Variant title="Row Layout">
      <InkField
        label="Status"
        value="Active"
        layout="row"
      />
    </Variant>

    <Variant title="Required Field">
      <InkField
        label="Password"
        value="********"
        layout="col"
        :required="true"
      />
    </Variant>

    <Variant title="Editable (Inline)">
      <InkField
        label="Bio"
        value="Click to edit"
        layout="inline"
        :editable="true"
      />
    </Variant>
  </Story>
</template>
