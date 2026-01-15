<script setup lang="ts">
import { computed } from "vue";
import {
  inkImageProps,
  inkImageEmits,
  type InkImageErrorPayload,
} from "./inkImage";
import InkScrim from "../inkScrim/inkScrim.vue";

const props = defineProps(inkImageProps);
const emit = defineEmits(inkImageEmits);

const expanded = defineModel<boolean>("expanded", { default: false });

// --- Computed ---

const thumbnailStyle = computed(() => ({
  maxWidth: props.maxWidth,
  maxHeight: props.maxHeight,
}));

const lazyLoadAttr = computed(() => {
  return props.lazy ? { loading: "lazy" as const } : {};
});

// --- Methods ---

const handleThumbnailClick = () => {
  expanded.value = true;
  emit("expand");
};

const handleClose = () => {
  expanded.value = false;
  emit("close");
};

const handleImageError = (error: Event) => {
  const payload: InkImageErrorPayload = {
    error,
    src: props.src,
  };
  emit("error", payload);
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape" && expanded.value) {
    handleClose();
  }
};

const handleScrimClick = () => {
  handleClose();
};
</script>

<template>
  <div class="ink-image" @keydown="handleKeydown" tabindex="0">
    <!-- Thumbnail -->
    <div
      class="ink-image__thumbnail"
      data-testid="ink-image-thumbnail"
      @click="handleThumbnailClick"
    >
      <slot name="thumbnail">
        <img
          :src="props.src"
          :alt="props.alt"
          :title="props.title"
          :style="thumbnailStyle"
          v-bind="lazyLoadAttr"
          class="ink-image__img"
          data-testid="ink-image-img"
          @error="handleImageError"
        />
      </slot>
    </div>

    <!-- Scrim overlay -->
    <InkScrim
      v-model:open="expanded"
      :close-on-scrim="true"
      @scrim-click="handleScrimClick"
    />

    <!-- Expanded view container (teleported to body via Teleport) -->
    <Teleport v-if="expanded" to="body">
      <div class="ink-image__expanded" data-testid="ink-image-expanded">
        <!-- Header with close button -->
        <div class="ink-image__expanded-header">
          <slot name="expanded-header">
            <div class="ink-image__expanded-title" v-if="props.title">
              {{ props.title }}
            </div>
          </slot>
          <button
            class="ink-image__close-btn"
            data-testid="ink-image-close-btn"
            aria-label="Close image"
            @click="handleClose"
          >
            <span class="i-mdi-close"></span>
          </button>
        </div>

        <!-- Image -->
        <div class="ink-image__expanded-content">
          <img
            :src="props.src"
            :alt="props.alt"
            :title="props.title"
            class="ink-image__img-expanded"
            data-testid="ink-image-img-expanded"
            @error="handleImageError"
          />
        </div>

        <!-- Footer -->
        <div
          v-if="$slots['expanded-footer']"
          class="ink-image__expanded-footer"
        >
          <slot name="expanded-footer"></slot>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped src="./inkImage.scss"></style>
