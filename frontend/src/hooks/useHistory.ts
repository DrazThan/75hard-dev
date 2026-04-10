import { useQuery } from '@tanstack/react-query'
import { getHistory } from '@/api/logs'

export function useHistory(year: number, month: number) {
  return useQuery({
    queryKey: ['history', year, month],
    queryFn: () => getHistory(year, month),
  })
}
