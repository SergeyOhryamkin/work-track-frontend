import { createRouter, createWebHistory, type RouteRecordRaw, type Router } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import Dashboard from '../views/Dashboard.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard
  }
]

const router: Router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
