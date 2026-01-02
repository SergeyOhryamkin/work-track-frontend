// API Types
export interface User {
  id: number
  login: string
  first_name: string
  last_name: string
  avatar: string
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  token: string
  user: User
  session_id: number
}

export interface LoginCredentials {
  login: string
  password: string
}

export interface RegisterData {
  login: string
  password: string
  first_name?: string
  last_name?: string
}

export interface UpdateUserData {
  first_name?: string
  last_name?: string
  login?: string
}

export interface LogoutRequest {
  session_id: number
}

export interface TrackItem {
  id: number
  user_id: number
  type: string
  emergency_call: boolean
  holiday_call: boolean
  working_hours: number
  working_shifts: number
  date: string
  created_at: string
  updated_at: string
}

export interface CreateTrackItemData {
  type: string
  emergency_call: boolean
  holiday_call: boolean
  working_hours: number
  working_shifts: number
  date: string
}

export interface UpdateTrackItemData {
  type?: string
  emergency_call?: boolean
  holiday_call?: boolean
  working_hours?: number
  working_shifts?: number
  date?: string
}

export interface DateRange {
  start_date: string
  end_date: string
}

export interface ApiError {
  error: string
}
