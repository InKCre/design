<script setup lang="ts">
import { computed, inject, type ComputedRef } from "vue";
import { inkButtonProps, inkButtonEmits } from "./inkButton";

const props = defineProps(inkButtonProps);
const emit = defineEmits(inkButtonEmits);

const injectedIsLoading = inject<ComputedRef<boolean> | boolean>("isLoading", false);

const isLoading = computed(() => {
  if (typeof injectedIsLoading === 'boolean') {
    return props.isLoading || injectedIsLoading;
  }
  return props.isLoading || injectedIsLoading.value;
});

const buttonClass = computed(() => [
  "ink-button",
  `ink-button--${props.type}`,
  `ink-button--${props.size}`,
  { "ink-button--loading": isLoading.value },
]);

const handleClick = () => {
  if (!isLoading.value) {
    emit('click');
  }
};
</script>

<template>
  <button :class="buttonClass" :disabled="isLoading" @click="handleClick">
    <span v-if="isLoading" class="i-mdi-loading animate-spin ink-button__spinner"></span>
    <slot v-else>
      <span>{{ text }}</span>
    </slot>
  </button>
</template>

<style lang="scss" scoped src="./inkButton.scss"></style>
