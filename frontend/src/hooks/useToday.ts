import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as logsApi from '@/api/logs'
import type { DailyLog, TaskType } from '@/types'

export function useToday() {
  return useQuery({
    queryKey: ['today'],
    queryFn: logsApi.getToday,
  })
}

export function useToggleTask() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ taskType, isComplete }: { taskType: TaskType; isComplete: boolean }) =>
      logsApi.toggleTask(taskType, isComplete),

    // Optimistic update — flips the checkbox instantly before the server responds
    onMutate: async ({ taskType, isComplete }) => {
      await qc.cancelQueries({ queryKey: ['today'] })
      const prev = qc.getQueryData<DailyLog>(['today'])

      qc.setQueryData<DailyLog>(['today'], (old) => {
        if (!old) return old
        const updated = old.task_completions.map((tc) =>
          tc.task_type === taskType ? { ...tc, is_complete: isComplete } : tc,
        )
        const allDone = updated.every((tc) => tc.is_complete)
        return { ...old, task_completions: updated, is_complete: allDone }
      })

      return { prev }
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(['today'], ctx.prev)
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['today'] })
      qc.invalidateQueries({ queryKey: ['stats'] })
    },
  })
}
