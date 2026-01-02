import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'
import type { User, LoginCredentials, RegisterData } from '../types/api'

const STORAGE_KEYS = {
  TOKEN: 'authToken',
  USER: 'currentUser',
  SESSION_ID: 'sessionId',
} as const

const hasBrowserStorage = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

const readStorage = (key: (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]): string | null => {
  if (!hasBrowserStorage) return null
  try {
    return window.localStorage.getItem(key)
  } catch (error) {
    console.warn(`Failed to read localStorage key "${key}"`, error)
    return null
  }
}

const writeStorage = (key: (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS], value: string) => {
  if (!hasBrowserStorage) return
  try {
    window.localStorage.setItem(key, value)
  } catch (error) {
    console.warn(`Failed to write localStorage key "${key}"`, error)
  }
}

const removeStorage = (key: (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]) => {
  if (!hasBrowserStorage) return
  try {
    window.localStorage.removeItem(key)
  } catch (error) {
    console.warn(`Failed to remove localStorage key "${key}"`, error)
  }
}

const safeParseJson = <T>(value: string | null): T | null => {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch (error) {
    console.warn('Failed to parse JSON from storage', error)
    return null
  }
}

const safeParseNumber = (value: string | null): number | null => {
  if (!value) return null
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

// Shared state across all instances
const authToken = ref<string | null>(readStorage(STORAGE_KEYS.TOKEN))
const currentUser = ref<User | null>(safeParseJson<User>(readStorage(STORAGE_KEYS.USER)))
const sessionId = ref<number | null>(safeParseNumber(readStorage(STORAGE_KEYS.SESSION_ID)))

export function useAuth() {
  const router = useRouter()
  const isLoading = ref(false)
  const error = ref<string>('')

  const isAuthenticated = computed(() => !!authToken.value)

  const setAuthData = (token: string, user: User, sessionIdValue: number) => {
    authToken.value = token
    currentUser.value = user
    sessionId.value = sessionIdValue

    writeStorage(STORAGE_KEYS.TOKEN, token)
    writeStorage(STORAGE_KEYS.USER, JSON.stringify(user))
    writeStorage(STORAGE_KEYS.SESSION_ID, String(sessionIdValue))
  }

  const clearAuth = () => {
    authToken.value = null
    currentUser.value = null
    sessionId.value = null

    removeStorage(STORAGE_KEYS.TOKEN)
    removeStorage(STORAGE_KEYS.USER)
    removeStorage(STORAGE_KEYS.SESSION_ID)
  }

  const login = async (credentials: LoginCredentials) => {
    error.value = ''
    isLoading.value = true

    try {
      const response = await api.login(credentials)
      setAuthData(response.token, response.user, response.session_id)
      await router.push({ name: 'home' })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      error.value = message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = async (data: RegisterData) => {
    error.value = ''
    isLoading.value = true

    try {
      const response = await api.register(data)
      setAuthData(response.token, response.user, response.session_id)
      await router.push({ name: 'home' })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed'
      error.value = message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    if (isLoading.value) return

    isLoading.value = true

    try {
      // Only call API if we have token and session
      if (authToken.value && sessionId.value && !Number.isNaN(sessionId.value)) {
        await api.logout(authToken.value, { session_id: sessionId.value })
      }
    } catch (err) {
      console.error('Logout API call failed:', err)
      // Continue with local cleanup even if API call fails
    } finally {
      clearAuth()
      isLoading.value = false
      await router.push({ name: 'login' })
    }
  }

  return {
    // State
    authToken,
    currentUser,
    sessionId,
    isAuthenticated,
    isLoading,
    error,

    // Methods
    login,
    register,
    logout,
    clearAuth,
  }
}
