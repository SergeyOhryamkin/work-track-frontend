<template>
  <span class="material-symbols-outlined" :style="style">
    <slot>
      {{ name }}
    </slot>
  </span>
</template>
<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'BaseIcon',
})

const props = withDefaults(
  defineProps<{
    name: string
    size?: number
  }>(),
  {
    size: 24,
  }
)

const style = computed(() => {
  return {
    fontSize: `${props.size.toString()}px`,
  }
})
</script>
<style scoped lang="scss"></style>
