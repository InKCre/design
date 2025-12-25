<script setup lang="ts">
import { computed } from "vue";
import { inkPlaceholderProps } from "./inkPlaceholder";
import { useOptionalI18n } from "../../i18n";

const props = defineProps(inkPlaceholderProps);
const i18n = useOptionalI18n();

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
  
  if (i18n) {
    const key = props.state === "error" 
      ? "placeholder.error.title" 
      : "placeholder.empty.title";
    return i18n.t(key);
  }
  
  return props.state === "error" ? "Something went wrong" : "No data";
});

const defaultDescription = computed(() => {
  if (props.description) return props.description;
  
  if (i18n) {
    const key = props.state === "error" 
      ? "placeholder.error.description" 
      : "placeholder.empty.description";
    return i18n.t(key);
  }
  
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
