import type { RouteRecordRaw } from 'vue-router'
import LoginView from '../views/LoginView.vue'

const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: LoginView
  }
]

export default publicRoutes
