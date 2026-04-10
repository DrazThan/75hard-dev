import { format } from 'date-fns'
import {
  Apple, BookOpen, Camera, Dumbbell, Droplets, Github,
  type LucideIcon,
} from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { checkCommit } from '@/api/github'
import StreakBanner from '@/components/StreakBanner'
import TaskCard from '@/components/TaskCard'
import ThemeToggle from '@/components/ThemeToggle'
import { useToday, useToggleTask } from '@/hooks/useToday'
import { useStats } from '@/hooks/useStats'
import type { TaskType } from '@/types'

interface TaskMeta {
  label: string
  Icon: LucideIcon
  iconColor: string
  isAuto?: boolean
}

const TASK_META: Record<TaskType, TaskMeta> = {
  workout: { label: 'Workout',        Icon: Dumbbell,  iconColor: 'text-orange-400' },
  water:   { label: 'Water',          Icon: Droplets,  iconColor: 'text-blue-400'   },
  diet:    { label: 'Clean Diet',     Icon: Apple,     iconColor: 'text-green-400'  },
  commit:  { label: 'GitHub Commit',  Icon: Github,    iconColor: 'text-purple-400', isAuto: true },
  study:   { label: 'Study 10 min',   Icon: BookOpen,  iconColor: 'text-yellow-400' },
  photo:   { label: 'Progress Photo', Icon: Camera,    iconColor: 'text-pink-400'   },
}

const TASK_ORDER: TaskType[] = ['workout', 'water', 'diet', 'commit', 'study', 'photo']

export default function Today() {
  const { data: log, isLoading } = useToday()
  const { data: stats } = useStats()
  const toggleTask = useToggleTask()
  const qc = useQueryClient()

  const syncCommit = useMutation({
    mutationFn: checkCommit,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['today'] })
      qc.invalidateQueries({ queryKey: ['stats'] })
    },
  })

  const completedCount = log?.task_completions.filter((t) => t.is_complete).length ?? 0
  const allDone = log?.is_complete ?? false

  return (
    <div className="page">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-none">
            {format(new Date(), 'EEE, MMM d')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-mid-muted mt-0.5 font-medium">
            {allDone ? '✅ All done today!' : `${completedCount} / 6 complete`}
          </p>
        </div>
        <ThemeToggle />
      </div>

      {/* Streak */}
      <div className="mb-5">
        <StreakBanner streak={stats?.current_streak ?? 0} />
      </div>

      {/* All-done celebration */}
      {allDone && (
        <div className="card p-4 mb-5 text-center
                        bg-gradient-to-br from-emerald-500/10 to-blue-500/10
                        dark:from-emerald-500/15 dark:to-blue-500/15
                        border-emerald-200 dark:border-emerald-700/30 animate-fade-in">
          <p className="text-2xl mb-1">🎉</p>
          <p className="font-bold text-emerald-700 dark:text-emerald-300">Day complete!</p>
          <p className="text-xs text-slate-500 dark:text-mid-muted mt-0.5">
            Streak preserved — see you tomorrow.
          </p>
        </div>
      )}

      {/* Task list */}
      <div className="space-y-2.5">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card h-[58px] animate-pulse bg-slate-100 dark:bg-mid-card" />
            ))
          : TASK_ORDER.map((taskType) => {
              const meta = TASK_META[taskType]
              const tc = log?.task_completions.find((t) => t.task_type === taskType)
              return (
                <TaskCard
                  key={taskType}
                  taskType={taskType}
                  label={meta.label}
                  Icon={meta.Icon}
                  iconColor={meta.iconColor}
                  isComplete={tc?.is_complete ?? false}
                  isAuto={meta.isAuto}
                  isSyncing={syncCommit.isPending}
                  onToggle={(complete) =>
                    toggleTask.mutate({ taskType, isComplete: complete })
                  }
                  onSync={() => syncCommit.mutate()}
                />
              )
            })}
      </div>

      {/* GitHub sync status message */}
      {syncCommit.isSuccess && (
        <p className={`mt-3 text-center text-xs font-medium animate-fade-in
          ${syncCommit.data.commit_found
            ? 'text-emerald-500 dark:text-emerald-400'
            : 'text-slate-500 dark:text-mid-muted'
          }`}>
          {syncCommit.data.message}
        </p>
      )}
    </div>
  )
}
