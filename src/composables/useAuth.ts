import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'
import type { User, LoginCredentials, RegisterData } from '../types/api'

const STORAGE_KEYS = {
    TOKEN: 'authToken',
    USER: 'currentUser',
    SESSION_ID: 'sessionId'
} as const

// Shared state across all instances
const authToken = ref<string | null>(localStorage.getItem(STORAGE_KEYS.TOKEN))
const currentUser = ref<User | null>(
    localStorage.getItem(STORAGE_KEYS.USER)
        ? JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)!)
        : null
)
const sessionId = ref<number | null>(
    localStorage.getItem(STORAGE_KEYS.SESSION_ID)
        ? Number(localStorage.getItem(STORAGE_KEYS.SESSION_ID))
        : null
)

export function useAuth() {
    const router = useRouter()
    const isLoading = ref(false)
    const error = ref<string>('')

    const isAuthenticated = computed(() => !!authToken.value)

    const setAuthData = (token: string, user: User, sessionIdValue: number) => {
        authToken.value = token
        currentUser.value = user
        sessionId.value = sessionIdValue

        localStorage.setItem(STORAGE_KEYS.TOKEN, token)
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
        localStorage.setItem(STORAGE_KEYS.SESSION_ID, String(sessionIdValue))
    }

    const clearAuth = () => {
        authToken.value = null
        currentUser.value = null
        sessionId.value = null

        localStorage.removeItem(STORAGE_KEYS.TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER)
        localStorage.removeItem(STORAGE_KEYS.SESSION_ID)
    }

    const login = async (credentials: LoginCredentials) => {
        error.value = ''
        isLoading.value = true

        try {
            const response = await api.login(credentials)
            setAuthData(response.token, response.user, response.session_id)
            await router.push({ name: 'dashboard' })
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
            await router.push({ name: 'dashboard' })
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
        clearAuth
    }
}
