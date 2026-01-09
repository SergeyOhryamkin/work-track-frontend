import { createApp } from 'vue'
import './styles/style.scss'
import App from './App.vue'

// PrimeVue imports
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import { registerPrimeVueComponents } from './plugins/primevue'
import 'primeicons/primeicons.css'
import { createAppRouter } from './router'
import { api } from './services/api'

const app = createApp(App)
const router = createAppRouter()

// Set up global 401 error handler
api.setUnauthorizedHandler(() => {
  // Clear auth data from localStorage
  localStorage.removeItem('authToken')
  localStorage.removeItem('currentUser')
  localStorage.removeItem('sessionId')
  
  // Redirect to login page
  void router.push({ name: 'login' })
})

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
