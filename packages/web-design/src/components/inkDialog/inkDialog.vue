<script setup lang="ts">
import { computed, watch, provide, readonly } from "vue";
import { useAsyncState } from "@vueuse/core";
import { inkDialogProps, inkDialogEmits, type DialogPosition } from "./inkDialog";
import InkButton from "../inkButton/inkButton.vue";

const props = defineProps(inkDialogProps);
const emit = defineEmits(inkDialogEmits);

const {
  state: currentValue,
  isLoading: isDialogLoading,
  execute,
} = useAsyncState(
  async () => {
    const v = props.modelValue;
    return v instanceof Promise ? await v : v;
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
    await execute();
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

const positionClasses = computed(() => {
  const pos = props.position;
  if (typeof pos === "string") {
    return `ink-dialog--${pos}`;
  }
  return "";
});

const positionStyles = computed(() => {
  const pos = props.position;
  if (!Array.isArray(pos)) {
    return {};
  }

  const [top, right, bottom, left] = pos;
  const styles: Record<string, string | number> = {};

  if (top !== undefined && top !== null) styles.top = `${top}px`;
  if (right !== undefined && right !== null) styles.right = `${right}px`;
  if (bottom !== undefined && bottom !== null) styles.bottom = `${bottom}px`;
  if (left !== undefined && left !== null) styles.left = `${left}px`;

  return styles;
});

const onScrimClick = () => {
  if (props.closeOnScrim && !isLoading.value) {
    open.value = false;
  }
};

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
  <Teleport to="body">
    <Transition name="ink-dialog-fade">
      <div v-if="open" class="ink-dialog-overlay" @click="onScrimClick"></div>
    </Transition>

    <Transition name="ink-dialog-slide">
      <div
        v-if="open"
        :class="['ink-dialog', positionClasses]"
        :style="positionStyles"
      >
        <div v-if="$slots.header || title || subtitle" class="ink-dialog__header">
          <slot name="header">
            <h2 v-if="title" class="ink-dialog__title">{{ title }}</h2>
            <p v-if="subtitle" class="ink-dialog__subtitle">{{ subtitle }}</p>
          </slot>
        </div>

        <div class="ink-dialog__content">
          <slot :cancel="handleCancel" :confirm="handleConfirm" :isLoading="isLoading"></slot>
        </div>

        <div v-if="$slots.footer || showCancel || showConfirm" class="ink-dialog__footer">
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
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped src="./inkDialog.scss" />
