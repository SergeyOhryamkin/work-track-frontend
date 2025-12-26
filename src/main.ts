import { createApp } from 'vue'
import './style.scss'
import App from './App.vue'

// PrimeVue imports
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import 'primeicons/primeicons.css'
import router from './router'
import { registerPrimeVueComponents } from './plugins/primevue'

const app = createApp(App)

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
})
app.use(router)

registerPrimeVueComponents(app)

app.mount('#app')
