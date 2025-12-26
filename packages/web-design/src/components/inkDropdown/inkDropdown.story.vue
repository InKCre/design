<script setup lang="ts">
import { ref } from "vue";
import InkDropdown from "./inkDropdown.vue";

const selectedValue = ref("");
const asyncValue = ref("");
const counter = ref(0);
const options = ref([
  { label: "Option 1", value: 1 },
  { label: "Option 2", value: 2 },
  { label: "Option 3", value: 3 },
]);
const optionsWithDescription = [
  { label: "Option 1", value: 1, description: "First choice" },
  { label: "Option 2", value: 2, description: "Second choice" },
  { label: "Option 3", value: 3, description: "Third choice" },
];

const asyncOptionsLoader = async () => {
  // Simulate async loading
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [
    { label: "Async Option 1", value: "a1" },
    { label: "Async Option 2", value: "a2" },
    { label: "Async Option 3", value: "a3" },
  ];
};

const preselectedAsyncValue = ref("a2");

// Dummy operation to simulate refresh
const onRefresh = () => {
  return Promise.resolve(
    options.value.map((opt) => {
      opt.label = `${opt.label.split(" ")[0]} ${++counter.value}`;
      return opt;
    })
  );
};
</script>

<template>
  <Story title="Forms/Dropdown" :layout="{ type: 'single', iframe: false }">
    <!-- Basic Usage -->
    <Variant title="Basic">
      <InkDropdown v-model="selectedValue" :options="options" />
    </Variant>

    <!-- [Feature] Refresh -->
    <Variant title="With Refresh">
      <InkDropdown
        v-model="selectedValue"
        v-model:options="options"
        :refresher="onRefresh"
      />
    </Variant>

    <!-- [Feature] Async Options -->
    <Variant title="Async Options">
      <InkDropdown v-model="asyncValue" :refresher="asyncOptionsLoader" />
    </Variant>

    <!-- [Feature] Options with Description -->
    <Variant title="With Descriptions">
      <InkDropdown v-model="selectedValue" :options="optionsWithDescription" />
    </Variant>

    <!-- [Feature] Preselected Async Value -->
    <Variant title="Preselected Async Value">
      <p>
        The dropdown should immediately load options and display "Async Option
        2" instead of placeholder
      </p>
      <InkDropdown
        v-model="preselectedAsyncValue"
        :refresher="asyncOptionsLoader"
      />
    </Variant>
  </Story>
</template>
