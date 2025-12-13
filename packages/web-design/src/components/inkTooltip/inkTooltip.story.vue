<script setup lang="ts">
import InkTooltip from "./inkTooltip.vue";
</script>

<template>
  <Story
    title="Feedback/Tooltip"
    :layout="{ type: 'grid', width: '200px' }"
  >
    <Variant title="Top">
      <InkTooltip content="This is a tooltip" position="top">
        <button style="padding: 8px 16px; cursor: pointer;">
          Hover me (Top)
        </button>
      </InkTooltip>
    </Variant>

    <Variant title="Bottom">
      <InkTooltip content="Bottom tooltip" position="bottom">
        <button style="padding: 8px 16px; cursor: pointer;">
          Hover me (Bottom)
        </button>
      </InkTooltip>
    </Variant>

    <Variant title="Left">
      <InkTooltip content="Left tooltip" position="left">
        <button style="padding: 8px 16px; cursor: pointer;">
          Hover me (Left)
        </button>
      </InkTooltip>
    </Variant>

    <Variant title="Right">
      <InkTooltip content="Right tooltip" position="right">
        <button style="padding: 8px 16px; cursor: pointer;">
          Hover me (Right)
        </button>
      </InkTooltip>
    </Variant>
  </Story>
</template>
