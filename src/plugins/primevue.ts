/* eslint-disable vue/multi-word-component-names, vue/no-reserved-component-names */
import type { App } from 'vue'
import Button from 'primevue/button'

export function registerPrimeVueComponents(app: App) {
  app.component('Button', Button)
}
