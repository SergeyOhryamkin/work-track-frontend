import { createRouter, createWebHistory, type Router } from 'vue-router'
import publicRoutes from './publicRoutes'
import privateRoutes from './privateRoutes'

const isAuthenticated = () => Boolean(localStorage.getItem('authToken'))

export function createAppRouter(): Router {
  const routes = [...publicRoutes, ...privateRoutes]
  const privateRouteNames = new Set(
    privateRoutes
      .map((route) => route.name)
      .filter((name): name is string => Boolean(name))
  )

  const router = createRouter({
    history: createWebHistory(),
    routes
  })

  router.beforeEach((to, from, next) => {
    const userIsAuthed = isAuthenticated()
    const isPrivate = to.matched.some((record) =>
      record.name ? privateRouteNames.has(record.name as string) : false
    )

    if (isPrivate && !userIsAuthed) {
      return next({ name: 'login', query: { redirect: to.fullPath } })
    }

    if (userIsAuthed && to.name === 'login') {
      return next({ name: 'dashboard' })
    }

    return next()
  })

  return router
}

export default createAppRouter()
