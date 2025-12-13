<script setup lang="ts">
import { ref } from "vue";
import InkPopup from "./inkPopup.vue";
import InkButton from "../inkButton/inkButton.vue";

const visible = ref(false);
</script>

<template>
  <Story
    title="Feedback/Popup/[Semantic] Basic"
    :layout="{ type: 'single', iframe: false }"
  >
    <Variant title="Default Popup">
      <InkButton text="Open Popup" type="primary" @click="visible = true" />
      <InkPopup v-model:visible="visible">
        <div style="padding: 20px;">
          <h3>Popup Content</h3>
          <p>This is the popup content.</p>
          <InkButton text="Close" type="subtle" @click="visible = false" />
        </div>
      </InkPopup>
    </Variant>
  </Story>
</template>
