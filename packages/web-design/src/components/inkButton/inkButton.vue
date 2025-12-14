<script setup lang="ts">
import { computed, inject } from "vue";
import { inkButtonProps, inkButtonEmits } from "./inkButton";

const props = defineProps(inkButtonProps);
const emit = defineEmits(inkButtonEmits);

const injectedIsLoading = inject<boolean>("isLoading", false);

const isLoading = computed(() => props.isLoading || injectedIsLoading);

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
