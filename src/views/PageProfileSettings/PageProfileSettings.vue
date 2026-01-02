<template>
  <section class="page-profile-settings">
    <base-header />

    <div class="page-profile-settings__wrapper">
      <div class="page-profile-settings__header">
        <div>
          <p class="page-profile-settings__eyebrow">Preferences</p>
          <h1 class="page-profile-settings__title">Profile settings</h1>
          <p class="page-profile-settings__subtitle">
            Edit the details other people see across the app. Changes sync instantly once saved.
          </p>
        </div>

        <Button
          label="Reset"
          severity="secondary"
          outlined
          :disabled="isPristine || isSaving"
          @click="handleReset"
        />
      </div>

      <form
        class="profile-form"
        @submit.prevent="handleSubmit"
      >
        <div class="profile-form__grid">
          <div class="profile-field">
            <p class="profile-field__label">First name</p>
            <FloatLabel variant="on">
              <InputText
                v-model="form.firstName"
                input-id="first-name"
                name="firstName"
                fluid
                autocomplete="given-name"
                :invalid="!!fieldErrors.firstName"
              />
              <label for="first-name">Enter your first name</label>
            </FloatLabel>
            <small v-if="fieldErrors.firstName">{{ fieldErrors.firstName }}</small>
          </div>

          <div class="profile-field">
            <p class="profile-field__label">Last name</p>
            <FloatLabel variant="on">
              <InputText
                v-model="form.lastName"
                input-id="last-name"
                name="lastName"
                fluid
                autocomplete="family-name"
                :invalid="!!fieldErrors.lastName"
              />
              <label for="last-name">Enter your last name</label>
            </FloatLabel>
            <small v-if="fieldErrors.lastName">{{ fieldErrors.lastName }}</small>
          </div>
        </div>

        <div class="profile-field">
          <p class="profile-field__label">Username</p>
          <FloatLabel variant="on">
            <InputText
              v-model="form.login"
              input-id="username"
              name="username"
              fluid
              autocomplete="username"
              :invalid="!!fieldErrors.login"
            />
            <label for="username">Pick a unique username</label>
          </FloatLabel>
          <small v-if="fieldErrors.login">{{ fieldErrors.login }}</small>
        </div>

        <footer class="profile-form__actions">
          <Message
            v-if="statusMessage"
            :severity="statusType === 'success' ? 'success' : 'error'"
            :closable="false"
          >
            {{ statusMessage }}
          </Message>

          <Button
            class="profile-form__submit"
            type="submit"
            label="Save changes"
            icon="pi pi-save"
            :loading="isSaving"
            :disabled="isPristine || isSaving"
          />
        </footer>
      </form>
    </div>
    <Button
      label="Logout"
      severity="danger"
      outlined
      icon="pi pi-sign-out"
      @click="auth.logout"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'

import BaseHeader from '@/components/BaseHeader'
import { useAuth } from '@/composables/useAuth'
import { api } from '@/services/api'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import Button from 'primevue/button'
import Message from 'primevue/message'

const auth = useAuth()

interface FormState {
  firstName: string
  lastName: string
  login: string
}

const form = reactive<FormState>({
  firstName: '',
  lastName: '',
  login: '',
})

const baseline = ref<FormState>({ ...form })
const isSaving = ref(false)
const statusMessage = ref('')
const statusType = ref<'success' | 'error' | ''>('')

const fieldErrors = reactive({
  firstName: '',
  lastName: '',
  login: '',
})

const assignFromUser = () => {
  const user = auth.currentUser.value
  form.firstName = user?.first_name ?? ''
  form.lastName = user?.last_name ?? ''
  form.login = user?.login ?? ''
  baseline.value = { ...form }
}

watch(
  () => auth.currentUser.value,
  () => {
    assignFromUser()
  },
  { immediate: true }
)

const isPristine = computed(() => {
  return (
    form.firstName === baseline.value.firstName &&
    form.lastName === baseline.value.lastName &&
    form.login === baseline.value.login
  )
})

const validate = () => {
  fieldErrors.firstName = form.firstName.trim() ? '' : 'First name is required'
  fieldErrors.lastName = ''
  fieldErrors.login = form.login.trim() ? '' : 'Username cannot be empty'
  return !fieldErrors.firstName && !fieldErrors.login
}

const handleReset = () => {
  assignFromUser()
  statusMessage.value = ''
  statusType.value = ''
}

const handleSubmit = async () => {
  statusMessage.value = ''
  statusType.value = ''

  if (!validate()) return

  isSaving.value = true
  try {
    const token = auth.authToken.value
    if (!token) throw new Error('You need to be logged in to update profile data')

    const updatedUser = await api.updateUser(token, {
      first_name: form.firstName,
      last_name: form.lastName,
      login: form.login,
    })

    auth.currentUser.value = updatedUser
    baseline.value = {
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
      login: updatedUser.login,
    }
    statusMessage.value = 'Profile updated successfully'
    statusType.value = 'success'
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update profile'
    statusMessage.value = message
    statusType.value = 'error'
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped lang="scss">
.page-profile-settings {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
  min-height: 100dvh;

  &__wrapper {
    border-radius: 24px;
    background: var(--panel-bg);
    border: 1px solid var(--panel-border);
    box-shadow: var(--panel-shadow);
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  &__header {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: space-between;
    color: var(--panel-foreground);
  }

  &__eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 12px;
    margin-bottom: 4px;
    color: var(--palette-gray);
  }

  &__subtitle {
    color: var(--palette-gray);
  }
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 24px;

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
  }

  &__status {
    font-size: 14px;
    font-weight: 600;

    &--success {
      color: var(--palette-success, #22c55e);
    }

    &--error {
      color: var(--palette-danger, #ef4444);
    }
  }
}

@media (max-width: 720px) {
  .page-profile-settings__wrapper {
    padding: 24px;
  }

  .profile-form__actions {
    flex-direction: column;
    align-items: flex-start;
  }

  .profile-form__submit {
    width: 100%;
    text-align: center;
  }
}
</style>
