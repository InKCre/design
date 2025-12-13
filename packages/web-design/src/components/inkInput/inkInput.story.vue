<script setup lang="ts">
import { ref } from "vue";
import InkInput from "./inkInput.vue";

const basicValue = ref("");
const requiredValue = ref("");
</script>

<template>
  <Story
    title="Forms/Input/[Semantic] With Label"
    :layout="{ type: 'single', iframe: false }"
  >
    <Variant title="Column Layout">
      <InkInput
        v-model="basicValue"
        label="Full Name"
        placeholder="Enter your name"
        layout="col"
      />
    </Variant>

    <Variant title="Inline Layout">
      <InkInput
        v-model="basicValue"
        label="Email"
        placeholder="email@example.com"
        layout="inline"
      />
    </Variant>
  </Story>

  <Story
    title="Forms/Input/[State] Required"
    :layout="{ type: 'single', iframe: false }"
  >
    <Variant title="Optional">
      <InkInput
        v-model="basicValue"
        label="Nickname"
        placeholder="Optional field"
        :required="false"
        layout="col"
      />
    </Variant>

    <Variant title="Required">
      <InkInput
        v-model="requiredValue"
        label="Email Address"
        placeholder="email@example.com"
        :required="true"
        layout="col"
      />
    </Variant>
  </Story>

  <Story
    title="Forms/Input/[Edge] Inline Edit Type"
    :layout="{ type: 'single', iframe: false }"
  >
    <Variant title="Inline Editable">
      <InkInput
        modelValue="Click to edit this text"
        type="inline"
        placeholder="Enter text"
      />
    </Variant>
  </Story>
</template>
