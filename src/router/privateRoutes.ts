import type { RouteRecordRaw } from 'vue-router'
import PageHome from '@/views/PageHome/PageHome.vue'
import PageProfileSettings from '@/views/PageProfileSettings'
import PageStats from '@/views/PageStats'
import PageCalendar from '@/views/PageCalendar'

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
  {
    path: '/stats',
    name: 'stats',
    component: PageStats,
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: PageCalendar,
  },
]

export default privateRoutes
