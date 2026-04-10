import {
  Apple, BookOpen, Camera, Dumbbell, Droplets, Github,
  Flame, Trophy, CalendarCheck, type LucideIcon,
} from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'
import { useStats } from '@/hooks/useStats'
import type { TaskType } from '@/types'

interface TaskMeta { label: string; Icon: LucideIcon; color: string; bar: string }

const TASK_META: Record<TaskType, TaskMeta> = {
  workout: { label: 'Workout',        Icon: Dumbbell, color: 'text-orange-400', bar: 'bg-orange-400' },
  water:   { label: 'Water',          Icon: Droplets, color: 'text-blue-400',   bar: 'bg-blue-400'   },
  diet:    { label: 'Clean Diet',     Icon: Apple,    color: 'text-green-400',  bar: 'bg-green-400'  },
  commit:  { label: 'GitHub Commit',  Icon: Github,   color: 'text-purple-400', bar: 'bg-purple-400' },
  study:   { label: 'Study 10 min',   Icon: BookOpen, color: 'text-yellow-400', bar: 'bg-yellow-400' },
  photo:   { label: 'Progress Photo', Icon: Camera,   color: 'text-pink-400',   bar: 'bg-pink-400'   },
}

const TASK_ORDER: TaskType[] = ['workout', 'water', 'diet', 'commit', 'study', 'photo']

interface StatTileProps { icon: React.ReactNode; value: number | string; label: string }
function StatTile({ icon, value, label }: StatTileProps) {
  return (
    <div className="card p-4 flex flex-col items-center gap-1 text-center">
      <div className="mb-1">{icon}</div>
      <p className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none">{value}</p>
      <p className="text-xs text-slate-500 dark:text-mid-muted font-medium">{label}</p>
    </div>
  )
}

export default function Stats() {
  const { data: stats, isLoading } = useStats()

  return (
    <div className="page">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Stats</h1>
        <ThemeToggle />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        </div>
      ) : !stats ? null : (
        <>
          {/* Streak tiles */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <StatTile
              icon={<Flame size={24} className="text-orange-400" />}
              value={stats.current_streak}
              label="Current streak"
            />
            <StatTile
              icon={<Trophy size={24} className="text-yellow-400" />}
              value={stats.longest_streak}
              label="Longest streak"
            />
          </div>

          {/* Days tile */}
          <div className="card p-4 mb-5 flex items-center gap-4">
            <CalendarCheck size={28} className="text-blue-400 shrink-0" />
            <div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white leading-none">
                {stats.total_complete_days}
                <span className="text-sm font-medium text-slate-400 dark:text-mid-muted ml-1.5">
                  / {stats.total_logged_days} logged
                </span>
              </p>
              <p className="text-xs text-slate-500 dark:text-mid-muted mt-0.5">Complete days</p>
            </div>
          </div>

          {/* Per-task completion rates */}
          <h2 className="text-sm font-semibold text-slate-500 dark:text-mid-muted uppercase tracking-wider mb-3">
            Task completion rates
          </h2>
          <div className="space-y-3">
            {TASK_ORDER.map((taskType) => {
              const meta = TASK_META[taskType]
              const pct  = stats.task_completion_rates[taskType] ?? 0
              return (
                <div key={taskType} className="card px-4 py-3">
                  <div className="flex items-center gap-3 mb-2">
                    <meta.Icon size={16} className={meta.color} strokeWidth={2} />
                    <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                      {meta.label}
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {pct}%
                    </span>
                  </div>
                  {/* Bar */}
                  <div className="h-1.5 rounded-full bg-slate-100 dark:bg-mid-surface overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${meta.bar}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
