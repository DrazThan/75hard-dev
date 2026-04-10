export type TaskType = 'workout' | 'water' | 'diet' | 'commit' | 'study' | 'photo'

export interface TaskCompletion {
  id: number
  daily_log_id: number
  task_type: TaskType
  is_complete: boolean
  completed_at: string | null
}

export interface DailyLog {
  id: number
  user_id: number
  date: string          // "YYYY-MM-DD"
  is_complete: boolean
  created_at: string
  task_completions: TaskCompletion[]
}

export interface DailyLogSummary {
  date: string          // "YYYY-MM-DD"
  is_complete: boolean
}

export interface StatsResponse {
  current_streak: number
  longest_streak: number
  total_complete_days: number
  total_logged_days: number
  task_completion_rates: Record<TaskType, number>
}

export interface User {
  id: number
  username: string
  github_username: string | null
  created_at: string
}

export interface Token {
  access_token: string
  token_type: string
}

export interface CommitCheckResponse {
  commit_found: boolean
  message: string
}
