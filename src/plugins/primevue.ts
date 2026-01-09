/* eslint-disable vue/multi-word-component-names, vue/no-reserved-component-names */
import type { App } from 'vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Dialog from 'primevue/dialog'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import Checkbox from 'primevue/checkbox'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import Tag from 'primevue/tag'

export function registerPrimeVueComponents(app: App) {
  app.component('Button', Button)
  app.component('Card', Card)
  app.component('Dialog', Dialog)
  app.component('Select', Select)
  app.component('InputNumber', InputNumber)
  app.component('Checkbox', Checkbox)
  app.component('ProgressSpinner', ProgressSpinner)
  app.component('Message', Message)
  app.component('Tag', Tag)
}
