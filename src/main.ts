import { createApp } from 'vue'
import './styles/style.scss'
import App from './App.vue'

// PrimeVue imports
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import { registerPrimeVueComponents } from './plugins/primevue'
import 'primeicons/primeicons.css'
import { createAppRouter } from './router'

const app = createApp(App)
const router = createAppRouter()

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.my-app-dark',
    },
  },
})
app.use(router)

registerPrimeVueComponents(app)

app.mount('#app')
