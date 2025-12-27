<template>
  <div class="base-page">
    <slot />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.base-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  @include laptop-up {
    width: min(800px, 100%);
    margin: 0 auto;
  }
}
</style>
