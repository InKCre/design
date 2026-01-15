<script setup lang="ts">
import { inkScrimProps, inkScrimEmits } from "./inkScrim";

const props = defineProps(inkScrimProps);
const emit = defineEmits(inkScrimEmits);

const open = defineModel<boolean>("open", { default: false });

const onScrimClick = () => {
  if (props.closeOnScrim) {
    open.value = false;
  }
  emit("scrim-click");
};
</script>

<template>
  <Teleport to="body">
    <Transition name="ink-scrim-fade">
      <div
        v-if="open"
        class="ink-scrim"
        data-testid="ink-scrim"
        @click="onScrimClick"
      ></div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped src="./inkScrim.scss"></style>
