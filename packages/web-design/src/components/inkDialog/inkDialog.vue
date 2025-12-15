<script setup lang="ts">
import { computed, watch, provide, readonly } from "vue";
import { useAsyncState } from "@vueuse/core";
import {
  inkDialogProps,
  inkDialogEmits,
  type DialogPosition,
} from "./inkDialog";
import InkButton from "../inkButton/inkButton.vue";
import InkPopup from "../inkPopup/inkPopup.vue";

const props = defineProps(inkDialogProps);
const emit = defineEmits(inkDialogEmits);

const {
  state: currentValue,
  isLoading: isDialogLoading,
  execute,
} = useAsyncState(
  async () => {
    const value = props.modelValue;
    return value instanceof Promise ? await value : value;
  },
  false,
  {
    immediate: true,
    resetOnExecute: false,
  }
);

watch(
  () => props.modelValue,
  async () => {
    if (props.modelValue instanceof Promise) {
      await execute();
    } else {
      currentValue.value = props.modelValue;
    }
  }
);

const open = computed({
  get: () => currentValue.value,
  set: (val: boolean) => {
    emit("update:modelValue", val);
  },
});

const isLoading = computed(() => isDialogLoading.value);

// Provide loading state to buttons via inject
provide("isLoading", readonly(isLoading));

const handleCancel = () => {
  if (!isLoading.value) {
    emit("cancel");
    open.value = false;
  }
};

const handleConfirm = () => {
  if (!isLoading.value) {
    emit("confirm");
  }
};
</script>

<template>
  <InkPopup
    v-model:open="open"
    :position="props.position"
    :close-on-scrim="props.closeOnScrim"
  >
    <div class="ink-dialog">
      <div v-if="$slots.header || title || subtitle" class="ink-dialog__header">
        <slot name="header">
          <h2 v-if="title" class="ink-dialog__title">{{ title }}</h2>
          <p v-if="subtitle" class="ink-dialog__subtitle">{{ subtitle }}</p>
        </slot>
      </div>

      <div class="ink-dialog__content">
        <slot
          :cancel="handleCancel"
          :confirm="handleConfirm"
          :isLoading="isLoading"
        ></slot>
      </div>

      <div
        v-if="$slots.footer || showCancel || showConfirm"
        class="ink-dialog__footer"
      >
        <slot name="footer">
          <InkButton
            v-if="showCancel"
            :text="cancelText"
            type="subtle"
            @click="handleCancel"
          />
          <InkButton
            v-if="showConfirm"
            :text="confirmText"
            type="primary"
            @click="handleConfirm"
          />
        </slot>
      </div>
    </div>
  </InkPopup>
</template>

<style lang="scss" scoped src="./inkDialog.scss" />
