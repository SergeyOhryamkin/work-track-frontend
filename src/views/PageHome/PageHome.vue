<template>
  <section class="page-home">
    <base-header @open-settings="handleOpenSettings" />
    <div class="page-home__wrapper">
      <p class="page-home__placeholder">Dashboard content will live here.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import BaseHeader from '@/components/BaseHeader'

defineOptions({
  components: { BaseHeader },
})

const handleOpenSettings = () => {
  // Settings modal/route can be implemented later
  console.info('Open settings panel')
}
</script>

<style scoped lang="scss">
.page-home {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
  height: 100dvh;

  &__wrapper {
    min-height: 320px;
    border-radius: 24px;
    background: var(--panel-bg);
    border: 1px solid var(--panel-border);
    box-shadow: var(--panel-shadow);
    padding: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__placeholder {
    font-size: 16px;
    color: var(--palette-gray);
  }
}
</style>
