<template>
  <base-page>
    <base-header v-if="!isAuthRoute" />
    <div class="base-navigation__content py-8">
      <slot />
    </div>
    <div v-if="!isAuthRoute" class="base-navigation">
      <RouterLink
        v-for="item in navItems"
        :key="item.name"
        :to="{ name: item.name }"
        class="nav-button"
        :class="{ 'nav-button--active': isActive(item.name) }"
      >
        {{ item.label }}
      </RouterLink>
    </div>
  </base-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import BasePage from '@/components/BasePage'
import BaseHeader from '@/components/BaseHeader'

const route = useRoute()

const navItems = [
  { name: 'stats', label: 'STATS' },
  { name: 'home', label: 'HOME' },
  { name: 'calendar', label: 'CALENDAR' },
]

const isAuthRoute = computed(() => {
  return route.name === 'login' || route.name === 'signup'
})

const isActive = (name: string) => {
  return route.name === name
}
</script>

<style scoped lang="scss">
.base-navigation {
  display: flex;
  gap: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--panel-border);
  &__content {
    flex: 1;
  }
}

.nav-button {
  padding: 12px 24px;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  width: 100%;
  text-align: center;
  color: var(--text-primary);
  border: none;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;

  &:not(:last-child) {
    border-right: 1px solid var(--panel-border);
  }

  &:hover {
    background: var(--p-neutral-800);
  }

  &--active {
    background: var(--primary-color, #0ea5e9);
    color: #fff;
  }
}
</style>
