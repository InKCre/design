<script setup lang="ts">
import { computed, getCurrentInstance } from "vue";
import { inkHeaderProps, inkHeaderEmits } from "./inkHeader";

const props = defineProps(inkHeaderProps);
const emit = defineEmits(inkHeaderEmits);

// Try to use vue-router if available
const instance = getCurrentInstance();
const router = instance?.appContext.config.globalProperties.$router;
const route = instance?.appContext.config.globalProperties.$route;

// --- computed ---
const displayPageTitle = computed(() => props.pageTitle ?? route?.name);

// --- methods ---
const onMenuClick = () => {
  emit("menu-click");
};

const onTitleClick = () => {
  emit("title-click");
};
</script>

<template>
  <header class="ink-header">
    <div class="ink-header__logo" @click="onTitleClick">
      <img
        v-if="logoSrc"
        class="ink-header__logo-icon"
        :src="logoSrc"
        alt="InKCre Logo"
      />
      <span class="ink-header__logo-text">{{ title }}</span>
    </div>
    <div class="ink-header__right">
      <span v-if="displayPageTitle" class="ink-header__page-title">{{
        displayPageTitle
      }}</span>
      <slot name="right-icon">
        <span
          class="i-mdi-menu ink-header__menu-icon"
          @click="onMenuClick"
        ></span>
      </slot>
    </div>
  </header>
</template>

<style lang="scss" scoped src="./inkHeader.scss"></style>
