import type { RouteRecordRaw } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'

const privateRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard,
  },
]

export default privateRoutes
