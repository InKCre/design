<script setup lang="ts">
import { computed } from "vue";
import { inkPlaceholderProps } from "./inkPlaceholder";

const props = defineProps(inkPlaceholderProps);

const placeholderClass = computed(() => [
  "ink-placeholder",
  `ink-placeholder--${props.state}`,
]);

const defaultIllustration = computed(() => {
  if (props.illustration) return props.illustration;
  return props.state === "error" ? "i-mdi-alert-circle-outline" : "i-mdi-inbox-outline";
});

const defaultTitle = computed(() => {
  if (props.title) return props.title;
  return props.state === "error" ? "Something went wrong" : "No data";
});

const defaultDescription = computed(() => {
  if (props.description) return props.description;
  return props.state === "error" 
    ? "An error occurred. Please try again." 
    : "There's nothing here yet.";
});
</script>

<template>
  <div :class="placeholderClass">
    <div class="ink-placeholder__illustration">
      <slot name="illustration">
        <span :class="defaultIllustration" />
      </slot>
    </div>
    
    <div class="ink-placeholder__title">
      <slot name="title">
        <span>{{ defaultTitle }}</span>
      </slot>
    </div>
    
    <div class="ink-placeholder__description">
      <slot name="description">
        <span>{{ defaultDescription }}</span>
      </slot>
    </div>
    
    <div v-if="$slots.actions" class="ink-placeholder__actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./inkPlaceholder.scss"></style>
