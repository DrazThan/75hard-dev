import { http } from './client'
import type { CommitCheckResponse } from '@/types'

export async function checkCommit(): Promise<CommitCheckResponse> {
  const { data } = await http.post<CommitCheckResponse>('/github/check')
  return data
}
