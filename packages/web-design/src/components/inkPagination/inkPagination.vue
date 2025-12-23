<script setup lang="ts">
import { computed } from "vue";
import { inkPaginationProps, inkPaginationEmits } from "./inkPagination";
import InkButton from "../inkButton/inkButton.vue";

const props = defineProps(inkPaginationProps);
const emit = defineEmits(inkPaginationEmits);

const isPrevDisabled = computed(() => props.currentPage <= 1);
const isNextDisabled = computed(() => props.currentPage >= props.totalPages);

const visiblePages = computed(() => {
  const pages: (number | string)[] = [];
  const total = props.totalPages;
  const current = props.currentPage;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    return pages;
  }

  pages.push(1);

  const showLeftEllipsis = current > 3;
  const showRightEllipsis = current < total - 2;

  if (showLeftEllipsis) {
    pages.push("...");
  }

  const startPage = Math.max(2, current - 1);
  const endPage = Math.min(total - 1, current + 1);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (showRightEllipsis) {
    pages.push("...");
  }

  pages.push(total);

  return pages;
});

const handlePageClick = (page: number | string) => {
  if (typeof page === "number" && page !== props.currentPage) {
    emit("page-change", page);
  }
};

const handlePrev = () => {
  if (!isPrevDisabled.value) {
    emit("page-change", props.currentPage - 1);
  }
};

const handleNext = () => {
  if (!isNextDisabled.value) {
    emit("page-change", props.currentPage + 1);
  }
};

const getPageButtonClass = (page: number | string) => {
  const isActive = typeof page === "number" && page === props.currentPage;
  return [
    "ink-pagination__page",
    { "ink-pagination__page--active": isActive },
    { "ink-pagination__page--ellipsis": page === "..." },
  ];
};
</script>

<template>
  <div class="ink-pagination">
    <InkButton
      class="ink-pagination__nav ink-pagination__nav--prev"
      :disabled="isPrevDisabled"
      size="md"
      type="icon"
      @click="handlePrev"
    >
      <div class="i-mdi-chevron-left" />
    </InkButton>

    <button
      v-for="(page, index) in visiblePages"
      :key="index"
      :class="getPageButtonClass(page)"
      :disabled="page === '...'"
      @click="handlePageClick(page)"
    >
      {{ page }}
    </button>

    <InkButton
      class="ink-pagination__nav ink-pagination__nav--next"
      :disabled="isNextDisabled"
      size="md"
      type="icon"
      @click="handleNext"
    >
      <span class="i-mdi-chevron-right" />
    </InkButton>
  </div>
</template>

<style lang="scss" scoped src="./inkPagination.scss"></style>
