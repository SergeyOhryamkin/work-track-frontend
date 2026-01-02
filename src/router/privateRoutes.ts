import type { RouteRecordRaw } from 'vue-router'
import PageHome from '@/views/PageHome/PageHome.vue'
import PageProfileSettings from '@/views/PageProfileSettings'

const privateRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: PageHome,
  },
  {
    path: '/profile-settings',
    name: 'profile-settings',
    component: PageProfileSettings,
  },
]

export default privateRoutes
