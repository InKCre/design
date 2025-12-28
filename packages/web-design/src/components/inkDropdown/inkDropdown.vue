<script setup lang="ts">
import { computed, inject, ref, watch, onMounted } from "vue";
import { createReusableTemplate } from "@vueuse/core";
import {
  inkDropdownProps,
  inkDropdownEmits,
  type DropdownOption,
} from "./inkDropdown";
import InkField from "../inkField/inkField.vue";
import InkButton from "../inkButton/inkButton.vue";
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

const currentIndex = computed(() => {
  return optionsModel.value.findIndex((opt) => opt.value === props.modelValue);
});

const isSteppingDisabled = computed(() => {
  return !props.editable || optionsModel.value.length === 0;
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

const onPrev = () => {
  if (isSteppingDisabled.value) return;
  const len = optionsModel.value.length;
  const nextIdx = (currentIndex.value - 1 + len) % len;
  onOptionSelect(optionsModel.value[nextIdx].value);
};

const onNext = () => {
  if (isSteppingDisabled.value) return;
  const len = optionsModel.value.length;
  const nextIdx = (currentIndex.value + 1) % len;
  onOptionSelect(optionsModel.value[nextIdx].value);
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

// Load lazy options immediately if modelValue is set
onMounted(() => {
  const hasModelValue =
    props.modelValue !== undefined &&
    props.modelValue !== null &&
    props.modelValue !== "";
  const hasRefresher = props.refresher !== undefined;
  const hasNoOptions = optionsModel.value.length === 0;

  if (hasModelValue && hasRefresher && hasNoOptions) {
    loadOptionsIfNeeded();
  }
});

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

      <!-- Stepping Buttons -->
      <template v-if="enableStepping">
        <InkButton
          icon="i-mdi-chevron-left"
          :disabled="isSteppingDisabled"
          @click="onPrev"
          type="square"
          title="Previous"
        />
        <InkButton
          icon="i-mdi-chevron-right"
          :disabled="isSteppingDisabled"
          type="square"
          @click="onNext"
          title="Next"
        />
      </template>

      <!-- Refresh Button -->
      <InkButton
        v-if="props.refresher"
        class="ink-dropdown__refresh"
        :icon="`i-mdi-refresh ${isRefreshing ? 'animate-spin' : ''}`"
        :disabled="isRefreshing"
        type="square"
        @click="onRefresh"
        title="Refresh options"
      />

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
