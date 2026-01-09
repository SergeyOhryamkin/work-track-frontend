<template>
  <div class="base-page" :class="`base-page--${variant}`">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'auth'
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<style scoped lang="scss">
.base-page {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &--default {
    @include laptop-up {
      width: min(800px, 100%);
      margin: 0 auto;
    }
  }

  &--auth {
    justify-content: center;
    align-items: center;
  }
}
</style>
