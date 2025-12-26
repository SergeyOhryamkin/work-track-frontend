<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('User') // Placeholder

const handleLogout = () => {
  // In a real app, clear auth tokens here
  router.push('/login')
}
</script>

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

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.dashboard-header h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.dashboard-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
