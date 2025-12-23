<script setup lang="ts">
import { computed, inject, ref, watch } from "vue";
import { createReusableTemplate } from "@vueuse/core";
import {
  inkDropdownProps,
  inkDropdownEmits,
  type DropdownOption,
} from "./inkDropdown";
import InkField from "../inkField/inkField.vue";
import { INK_FORM_CONTEXT_KEY } from "../inkForm/inkForm";
import { useOptionalModel } from "../../composables/use-optional-model";

const props = defineProps(inkDropdownProps);
const emit = defineEmits(inkDropdownEmits);

const formContext = inject(INK_FORM_CONTEXT_KEY, null);

const useField = computed(() => formContext !== null && props.label);
const fieldLayout = computed(() => props.layout || formContext?.layout);

const showOptions = ref(false);
const isRefreshing = ref(false);

const optionsModel = useOptionalModel<DropdownOption[]>({
  props,
  emit,
  modelName: "options",
  defaultValue: [],
});

// --- computed ---
const displayValue = computed(() => {
  const option = optionsModel.value.find(
    (opt) => opt.value === props.modelValue
  );
  return option ? option.label : props.placeholder;
});

// --- methods ---
const loadOptionsIfNeeded = async (force: boolean = false) => {
  if (optionsModel.value.length > 0 && !force) {
    return;
  }
  isRefreshing.value = true;
  try {
    if (props.refresher) {
      const options = await props.refresher();
      optionsModel.value = options;
    } else {
      return; // No load needed
    }
  } finally {
    isRefreshing.value = false;
  }
};

const onRefresh = async () => {
  await loadOptionsIfNeeded(true);
};

const onDropdownClick = async () => {
  if (props.editable) {
    if (showOptions.value) {
      showOptions.value = false;
    } else {
      // Load options before showing dropdown
      await loadOptionsIfNeeded();
      showOptions.value = true;
    }
  }
};

const onOptionSelect = (value: DropdownOption["value"]) => {
  emit("update:modelValue", value);
  emit("change", value);
  showOptions.value = false;
};

const [DefineDropdown, ReuseDropdown] = createReusableTemplate();
</script>

<template>
  <DefineDropdown>
    <div class="ink-dropdown-container">
      <!-- Box -->
      <div
        :class="[
          'ink-dropdown',
          {
            'ink-dropdown--editable': editable,
            'ink-dropdown--active': showOptions,
          },
        ]"
        @click="onDropdownClick"
      >
        <span class="ink-dropdown__value">{{ displayValue }}</span>

        <span
          v-if="editable"
          :class="['i-mdi-chevron-down', 'ink-dropdown__chevron']"
        ></span>
      </div>

      <!-- Refresh Button -->
      <button
        v-if="props.refresher"
        :class="[
          'ink-dropdown__refresh',
          { 'ink-dropdown__refresh--loading': isRefreshing },
        ]"
        :disabled="isRefreshing"
        @click.stop="onRefresh"
        type="button"
        title="Refresh options"
      >
        <span
          :class="['i-mdi-refresh', { 'animate-spin': isRefreshing }]"
        ></span>
      </button>

      <!-- Options -->
      <div v-if="showOptions" class="ink-dropdown__options">
        <div v-if="isRefreshing" class="ink-dropdown__loading">
          <span class="i-mdi-loading animate-spin"></span>
          Loading...
        </div>
        <template v-else>
          <div v-for="option in optionsModel" :key="option.value">
            <div
              :class="[
                'ink-dropdown__option',
                {
                  'ink-dropdown__option--selected': option.value === modelValue,
                },
              ]"
              @click="onOptionSelect(option.value)"
            >
              <span class="option__label">{{ option.label }}</span>
              <span class="option__description" v-if="option.description">{{
                option.description
              }}</span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </DefineDropdown>

  <InkField
    v-if="useField"
    :label="label"
    :layout="fieldLayout"
    :required="required"
  >
    <ReuseDropdown />
  </InkField>

  <template v-else>
    <ReuseDropdown />
  </template>
</template>

<style lang="scss" scoped src="./inkDropdown.scss" />
