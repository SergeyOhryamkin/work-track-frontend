<template>
  <div class="signup-container">
    <div class="signup-card">
      <div class="signup-header">
        <i class="pi pi-user-plus signup-icon"></i>
        <h1>Create Account</h1>
        <p>Join Work Track to start logging your work</p>
      </div>

      <form @submit.prevent="handleSignup" class="signup-form">
        <div class="form-grid">
          <div class="form-field">
            <label for="firstName">First name</label>
            <InputText id="firstName" v-model="form.first_name" placeholder="Optional" />
          </div>
          <div class="form-field">
            <label for="lastName">Last name</label>
            <InputText id="lastName" v-model="form.last_name" placeholder="Optional" />
          </div>
        </div>

        <div class="form-field">
          <label for="login">Login</label>
          <InputText id="login" v-model="form.login" placeholder="Choose a login" required />
        </div>

        <div class="form-field">
          <label for="password">Password</label>
          <Password
            id="password"
            v-model="form.password"
            placeholder="At least 6 characters"
            :feedback="false"
            toggleMask
            required
          />
        </div>

        <div v-if="auth.error.value" class="error-message">
          <i class="pi pi-exclamation-triangle" />
          <span>{{ auth.error.value }}</span>
        </div>

        <Button
          type="submit"
          label="Create account"
          icon="pi pi-check"
          class="signup-button"
          :loading="auth.isLoading.value"
        />
        <p class="hint">Already have an account? <RouterLink to="/login">Log in</RouterLink></p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { RouterLink } from 'vue-router'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import { useAuth } from '../composables/useAuth'

const auth = useAuth()

const form = reactive({
  first_name: '',
  last_name: '',
  login: '',
  password: ''
})

const handleSignup = async () => {
  await auth.register(form)
}
</script>

<style scoped lang="scss">
$surface: #ffffff;
$bg: linear-gradient(135deg, #6dd5ed 0%, #2193b0 100%);
$text: #1a202c;
$muted: #718096;
$shadow: 0 20px 60px rgba(0, 0, 0, 0.2);

.signup-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $bg;
  padding: 20px;
}

.signup-card {
  background: $surface;
  border-radius: 20px;
  padding: 40px;
  box-shadow: $shadow;
  width: 100%;
  max-width: 460px;
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.signup-header {
  text-align: center;
  margin-bottom: 28px;

  h1 {
    margin: 10px 0 6px;
    color: $text;
    font-size: 26px;
    font-weight: 700;
  }

  p {
    margin: 0;
    color: $muted;
  }
}

.signup-icon {
  font-size: 44px;
  color: #2193b0;
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-weight: 600;
    color: $text;
    font-size: 14px;
  }
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

.signup-button {
  width: 100%;
}

.hint {
  text-align: center;
  color: $muted;
  margin: 0;

  a {
    color: #2193b0;
    font-weight: 600;
  }
}

@media (max-width: 480px) {
  .signup-card {
    padding: 32px 24px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
