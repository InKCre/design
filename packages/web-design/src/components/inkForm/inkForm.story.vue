<script setup lang="ts">
import { ref } from "vue";
import InkForm from "./inkForm.vue";
import InkInput from "../inkInput/inkInput.vue";

const formData = ref({
  name: "",
  email: "",
});
</script>

<template>
  <Story
    title="Forms/Form/[Semantic] Layouts"
    :layout="{ type: 'single', iframe: false }"
  >
    <Variant title="Column Layout">
      <InkForm v-model="formData" layout="col">
        <InkInput prop="name" label="Name" placeholder="Enter name" />
        <InkInput prop="email" label="Email" placeholder="Enter email" />
      </InkForm>
    </Variant>

    <Variant title="Inline Layout">
      <InkForm v-model="formData" layout="inline">
        <InkInput prop="name" label="Name" placeholder="Enter name" />
        <InkInput prop="email" label="Email" placeholder="Enter email" />
      </InkForm>
    </Variant>
  </Story>
</template>
