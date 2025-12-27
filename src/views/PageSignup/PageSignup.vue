<template>
  <div class="page-signup pa-4">
    <div class="page-signup__wrapper d-flex __column">
      <div class="d-flex gap-4 __justify-center">
        <div class="page-signup__input-wrapper">
          <p class="fw-600 mb-3">First name</p>
          <FloatLabel variant="on">
            <InputText v-model="form.first_name" input-id="first_name_label" fluid />
            <label for="first_name_label">Optional</label>
          </FloatLabel>
        </div>

        <div class="page-signup__input-wrapper">
          <p class="fw-600 mb-3">Last name</p>
          <FloatLabel variant="on">
            <InputText v-model="form.last_name" input-id="last_name_label" fluid />
            <label for="last_name_label">Optional</label>
          </FloatLabel>
        </div>
      </div>

      <p class="fw-600 mb-3 mt-4">Login</p>
      <FloatLabel variant="on">
        <InputText v-model="form.login" input-id="login_label" fluid required />
        <label for="login_label">Choose a login</label>
      </FloatLabel>

      <p class="fw-600 mb-3 mt-4">Password</p>
      <FloatLabel variant="on">
        <Password v-model="form.password" input-id="password_label" toggle-mask fluid :feedback="false" required />
        <label for="password_label">At least 6 characters</label>
      </FloatLabel>

      <div v-if="auth.error.value" class="error-message mt-6">
        <i class="pi pi-exclamation-triangle" />
        <span>{{ auth.error.value }}</span>
      </div>

      <Button
        type="submit"
        label="Create account"
        icon="pi pi-check"
        class="page-signup__button mt-10"
        :loading="auth.isLoading.value"
        fluid
        @click="handleSignup"
      />

      <p class="page-signup__hint mt-6">
        Already have an account?
        <RouterLink to="/login">Log in</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { RouterLink } from 'vue-router'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import FloatLabel from 'primevue/floatlabel'
import { useAuth } from '@/composables/useAuth.ts'

const auth = useAuth()

const form = reactive({
  first_name: '',
  last_name: '',
  login: '',
  password: '',
})

const handleSignup = async () => {
  await auth.register(form)
}
</script>

<style scoped lang="scss">
.page-signup {
  padding-top: 80px;
  &__wrapper {
    width: min(520px, 100%);
    margin: 0 auto;
  }
  &__input-wrapper {
    width: 100%;
  }

  &__button {
    align-self: flex-start;
  }

  &__hint {
    text-align: center;
    font-size: 14px;
  }

  &__hint a {
    font-weight: 600;
    text-decoration: none;
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
