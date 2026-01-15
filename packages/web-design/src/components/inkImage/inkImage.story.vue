<script setup lang="ts">
import { ref } from "vue";
import InkImage from "./inkImage.vue";
</script>

<template>
  <Story title="Media/Image" :layout="{ type: 'grid', width: '100%' }">
    <!-- [Basic] Default -->
    <Variant title="Basic Usage">
      <InkImage
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
        alt="Mountain landscape"
      />
    </Variant>

    <!-- [Visual] With title -->
    <Variant title="With Title">
      <InkImage
        src="https://images.unsplash.com/photo-1469022563149-aa64dbd37daf?w=400&h=300&fit=crop"
        alt="Ocean sunset"
        title="Beautiful Ocean Sunset"
      />
    </Variant>

    <!-- [Size] Size Constraints -->
    <Variant title="Custom Width & Height">
      <InkImage
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
        alt="Mountain landscape"
        max-width="250px"
        max-height="200px"
      />
    </Variant>

    <!-- [Slot] Custom Thumbnail -->
    <Variant title="Custom Thumbnail Slot">
      <InkImage
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
        alt="Mountain landscape"
        max-width="280px"
        max-height="200px"
      >
        <template #thumbnail>
          <div class="relative overflow-hidden rounded-lg group">
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
              alt="Mountain landscape"
              class="w-full h-auto"
            />
            <div
              class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center"
            >
              <span
                class="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                >View Full</span
              >
            </div>
          </div>
        </template>
      </InkImage>
    </Variant>

    <!-- [State] Lazy Loading Disabled -->
    <Variant title="Eager Loading (lazy: false)">
      <InkImage
        src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop"
        alt="City skyline"
        :lazy="false"
      />
    </Variant>

    <!-- [Slot] With Footer -->
    <Variant title="With Expanded Footer">
      <InkImage
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
        alt="Mountain landscape"
        title="Mountain Adventure"
      >
        <template #expanded-footer>
          <div class="flex gap-2">
            <button
              class="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
            >
              Download
            </button>
            <button
              class="px-3 py-1 bg-gray-300 text-gray-800 text-xs rounded hover:bg-gray-400"
            >
              Share
            </button>
          </div>
        </template>
      </InkImage>
    </Variant>

    <!-- [Edge] Various sizes -->
    <Variant title="Thumbnail Grid">
      <div class="grid grid-cols-3 gap-3">
        <InkImage
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop"
          alt="Mountain"
          max-width="100%"
          max-height="120px"
        />
        <InkImage
          src="https://images.unsplash.com/photo-1469022563149-aa64dbd37daf?w=300&h=200&fit=crop"
          alt="Sunset"
          max-width="100%"
          max-height="120px"
        />
        <InkImage
          src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=300&h=200&fit=crop"
          alt="City"
          max-width="100%"
          max-height="120px"
        />
      </div>
    </Variant>

    <!-- [State] With Header Slot -->
    <Variant title="With Custom Header">
      <InkImage
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
        alt="Mountain landscape"
      >
        <template #expanded-header>
          <span class="text-sm text-gray-600">📸 Photo Details</span>
        </template>
      </InkImage>
    </Variant>
  </Story>
</template>
