<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <h1>Work Track Dashboard</h1>
      <div class="user-info">
        <span>Welcome, {{ username }}</span>
        <Button label="Logout" icon="pi pi-sign-out" @click="handleLogout" class="p-button-text" />
      </div>
    </header>

    <main class="dashboard-content">
      <Card>
        <template #title>Overview</template>
        <template #content>
          <p>Welcome to your work tracking dashboard. This is a protected area.</p>
        </template>
      </Card>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '../composables/useAuth'

const auth = useAuth()

const username = computed(() => {
  if (auth.currentUser.value) {
    const { first_name, last_name, login } = auth.currentUser.value
    if (first_name && last_name) {
      return `${first_name} ${last_name}`
    }
    if (first_name) return first_name
    return login
  }
  return 'User'
})

const handleLogout = async () => {
  await auth.logout()
}
</script>

<style scoped lang="scss">
$surface: #ffffff;
$muted-bg: #f8f9fa;
$shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
$text: #333;

.dashboard-container {
  min-height: 100vh;
  background-color: $muted-bg;

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: $surface;
    box-shadow: $shadow;

    h1 {
      margin: 0;
      font-size: 1.5rem;
      color: $text;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
  }

  .dashboard-content {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
}
</style>
