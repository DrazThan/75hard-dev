import { http } from './client'
import type { DailyLog, DailyLogSummary, TaskType } from '@/types'

export async function getToday(): Promise<DailyLog> {
  const { data } = await http.get<DailyLog>('/logs/today')
  return data
}

export async function toggleTask(taskType: TaskType, isComplete: boolean): Promise<DailyLog> {
  const { data } = await http.patch<DailyLog>(`/logs/today/tasks/${taskType}`, {
    is_complete: isComplete,
  })
  return data
}

export async function getHistory(year?: number, month?: number): Promise<DailyLogSummary[]> {
  const params: Record<string, number> = {}
  if (year)  params.year  = year
  if (month) params.month = month
  const { data } = await http.get<DailyLogSummary[]>('/logs/history', { params })
  return data
}
