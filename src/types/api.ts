// API Types

// Work Types Enums
export enum WorkType {
  SHIFT_LEAD = 'shift_lead',
  INBOUND = 'inbound',
  OUTBOUND = 'outbound'
}

export enum OutboundSubtype {
  REGULAR = 'regular',
  EXTRA = 'extra'
}

export enum InboundRule {
  RULE_101 = '101',
  RULE_102 = '102',
  RULE_103 = '103',
  RULE_104 = '104',
  RULE_105 = '105',
  RULE_106 = '106',
  RULE_107 = '107'
}

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
  refresh_token: string
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
  type: WorkType
  subtype?: OutboundSubtype
  inbound_rule?: InboundRule
  emergency_call: boolean
  holiday_call: boolean
  working_hours: number
  working_shifts: number
  date: string
  created_at: string
  updated_at: string
}

export interface CreateTrackItemData {
  type: WorkType
  subtype?: OutboundSubtype
  inbound_rule?: InboundRule
  emergency_call: boolean
  holiday_call: boolean
  working_hours: number
  working_shifts: number
  date: string
}

export interface UpdateTrackItemData {
  type?: WorkType
  subtype?: OutboundSubtype
  inbound_rule?: InboundRule
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
