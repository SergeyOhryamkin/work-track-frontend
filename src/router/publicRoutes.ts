import type { RouteRecordRaw } from 'vue-router'
import PageLogin from '@/views/PageLogin'
import PageSignup from '@/views/PageSignup'

const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: PageLogin,
  },
  {
    path: '/signup',
    name: 'signup',
    component: PageSignup,
  },
]

export default publicRoutes
