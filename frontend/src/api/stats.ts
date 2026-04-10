import { http } from './client'
import type { StatsResponse } from '@/types'

export async function getStats(): Promise<StatsResponse> {
  const { data } = await http.get<StatsResponse>('/stats')
  return data
}
