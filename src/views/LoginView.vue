<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <i class="pi pi-user login-icon"></i>
        <h1>Welcome Back</h1>
        <p>Please login to your account</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-field">
          <label for="login">Login</label>
          <InputText 
            id="login" 
            v-model="loginData.login" 
            placeholder="Enter your login"
            required
          />
        </div>

        <div class="form-field">
          <label for="password">Password</label>
          <Password 
            id="password" 
            v-model="loginData.password" 
            placeholder="Enter your password"
            :feedback="false"
            toggleMask
          />
        </div>

        <div v-if="auth.error.value" class="error-message">
          <i class="pi pi-exclamation-triangle" />
          <span>{{ auth.error.value }}</span>
        </div>

        <Button 
          type="submit" 
          label="Login" 
          icon="pi pi-sign-in" 
          class="login-button"
          :loading="auth.isLoading.value"
        />
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import { useAuth } from '../composables/useAuth'

const auth = useAuth()

const loginData = ref({
  login: '',
  password: ''
})

const handleLogin = async () => {
  await auth.login(loginData.value)
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 420px;
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-icon {
  font-size: 48px;
  color: #667eea;
  margin-bottom: 16px;
}

.login-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px 0;
}

.login-header p {
  color: #718096;
  margin: 0;
  font-size: 14px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-field label {
  font-weight: 600;
  color: #2d3748;
  font-size: 14px;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(255, 76, 76, 0.08);
  color: #c53030;
  font-size: 14px;
}

.login-button {
  margin-top: 8px;
}

/* Responsive design */
@media (max-width: 480px) {
  .login-card {
    padding: 30px 24px;
  }
  
  .login-header h1 {
    font-size: 24px;
  }
}
</style>
