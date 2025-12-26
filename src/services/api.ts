import type {
    AuthResponse,
    LoginCredentials,
    RegisterData,
    LogoutRequest,
    TrackItem,
    CreateTrackItemData,
    UpdateTrackItemData,
    DateRange,
    ApiError
} from '../types/api'

class ApiService {
    private baseUrl: string

    constructor() {
        const apiUrl = import.meta.env.VITE_API_URL
        if (!apiUrl) {
            throw new Error('VITE_API_URL is not defined')
        }
        this.baseUrl = apiUrl.replace(/\/$/, '')
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Request failed' })) as ApiError
            throw new Error(error.error || `HTTP ${response.status}`)
        }

        return response.json()
    }

    private getAuthHeaders(token: string): HeadersInit {
        return {
            Authorization: `Bearer ${token}`
        }
    }

    // Auth endpoints
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        return this.request<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        })
    }

    async register(data: RegisterData): Promise<AuthResponse> {
        return this.request<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data)
        })
    }

    async logout(token: string, request: LogoutRequest): Promise<{ message: string }> {
        return this.request<{ message: string }>('/auth/logout', {
            method: 'POST',
            headers: this.getAuthHeaders(token),
            body: JSON.stringify(request)
        })
    }

    // Track Items endpoints
    async getTrackItems(token: string, dateRange?: DateRange): Promise<TrackItem[]> {
        const queryString = dateRange
            ? `?start_date=${dateRange.start_date}&end_date=${dateRange.end_date}`
            : ''

        return this.request<TrackItem[]>(`/track-items${queryString}`, {
            headers: this.getAuthHeaders(token)
        })
    }

    async getTrackItem(token: string, id: number): Promise<TrackItem> {
        return this.request<TrackItem>(`/track-items/${id}`, {
            headers: this.getAuthHeaders(token)
        })
    }

    async createTrackItem(token: string, data: CreateTrackItemData): Promise<TrackItem> {
        return this.request<TrackItem>('/track-items', {
            method: 'POST',
            headers: this.getAuthHeaders(token),
            body: JSON.stringify(data)
        })
    }

    async updateTrackItem(
        token: string,
        id: number,
        data: UpdateTrackItemData
    ): Promise<TrackItem> {
        return this.request<TrackItem>(`/track-items/${id}`, {
            method: 'PUT',
            headers: this.getAuthHeaders(token),
            body: JSON.stringify(data)
        })
    }

    async deleteTrackItem(token: string, id: number): Promise<void> {
        await fetch(`${this.baseUrl}/track-items/${id}`, {
            method: 'DELETE',
            headers: this.getAuthHeaders(token)
        })
    }
}

// Export singleton instance
export const api = new ApiService()
