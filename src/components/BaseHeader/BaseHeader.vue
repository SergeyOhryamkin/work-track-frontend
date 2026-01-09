<template>
  <header class="base-header">
    <div class="base-header__info">
      <div class="base-header__avatar" :style="{ backgroundColor: avatarColor }" aria-hidden="true">
        <span>{{ avatarInitial }}</span>
      </div>
      <div class="base-header__text">
        <p class="base-header__greeting">Good to see you</p>
        <p class="base-header__username">{{ username }}</p>
      </div>
    </div>
    <RouterLink class="base-header__settings" :to="{ name: 'profile-settings' }">
      <base-icon name="manage_accounts" />
    </RouterLink>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import BaseIcon from '@/components/BaseIcon'

const auth = useAuth()

const username = computed(() => {
  const user = auth.currentUser.value
  if (!user) return 'Guest'

  const { first_name: firstName, last_name: lastName, login } = user
  if (firstName && lastName) return `${firstName} ${lastName}`
  if (firstName) return firstName
  return login || 'User'
})

const avatarInitial = computed(() => {
  const login = auth.currentUser.value?.login
  return login ? (login[0]?.toUpperCase() ?? '?') : '?'
})

const palette = ['#0ea5e9', '#2563eb', '#f97316', '#f43f5e', '#10b981', '#8b5cf6', '#14b8a6', '#facc15'] as const

const avatarColor = computed(() => {
  const login = auth.currentUser.value?.login
  if (!login) return palette[0]
  const hash = login.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return palette[hash % palette.length]
})
</script>

<style scoped lang="scss">
.base-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-radius: 0 0 20px 20px;
  background: var(--panel-bg);
  box-shadow: var(--panel-shadow);
  color: var(--panel-foreground);

  &__info {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &__avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: 700;
    font-size: 24px;
    text-transform: uppercase;
    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.2);
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__greeting {
    font-size: 14px;
    color: var(--palette-gray);
  }

  &__username {
    font-size: 20px;
    font-weight: 700;
    color: var(--panel-foreground);
  }

  &__settings {
    width: 46px;
    height: 46px;
    border-radius: 16px;
    border: 1px solid var(--panel-border);
    background: transparent;
    color: var(--panel-foreground);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    cursor: pointer;
    transition:
      background 0.2s ease,
      color 0.2s ease,
      transform 0.15s ease;

    &:hover {
      background: color-mix(in srgb, var(--palette-primary) 12%, transparent);
      color: var(--palette-primary);
    }

    &:active {
      transform: scale(0.96);
    }
  }
}
</style>
