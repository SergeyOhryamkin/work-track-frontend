<template>
  <div class="page-login d-flex __column">
    <div class="page-login__wrapper d-flex __column">
      <p class="mb-3 fw-600">Login</p>
      <FloatLabel variant="on">
        <InputText v-model="loginData.login" input-id="login_label" fluid />
        <label for="login_label">Enter your login</label>
      </FloatLabel>
      <p class="mb-3 mt-4 fw-600">Password</p>
      <FloatLabel variant="on">
        <Password v-model="loginData.password" input-id="on_label" toggle-mask fluid :feedback="false" />
        <label for="on_label">Enter your password</label>
      </FloatLabel>
      <div v-if="auth.error.value" class="error-message">
        <i class="pi pi-exclamation-triangle" />
        <span>{{ auth.error.value }}</span>
      </div>
      <Button
        type="submit"
        label="Login"
        icon="pi pi-sign-in"
        class="page-login__button mt-10"
        :loading="auth.isLoading.value"
        @click="handleLogin"
      />
      <p class="page-login__hint mt-6 d-flex __justify-center">
        <span class="mr-2">New here?</span>
        <RouterLink to="/signup">Sign up</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import FloatLabel from 'primevue/floatlabel'
import { useAuth } from '@/composables/useAuth.ts'

const auth = useAuth()

const loginData = ref({
  login: '',
  password: '',
})

const handleLogin = async () => {
  await auth.login(loginData.value)
}
</script>

<style scoped lang="scss">
.page-login {
  padding: var(--sp-4);
  &__wrapper {
    width: min(520px, 100%);
    margin: 0 auto;
  }
  &__hint {
    text-align: center;
    font-size: 14px;
  }
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  color: #c53030;
  font-size: 14px;
}
</style>
