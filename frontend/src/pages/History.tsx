import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isToday, parseISO } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useHistory } from '@/hooks/useHistory'
import ThemeToggle from '@/components/ThemeToggle'
import type { DailyLogSummary } from '@/types'

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function buildCalendar(year: number, month: number, summaries: DailyLogSummary[]) {
  const logMap = new Map(summaries.map((s) => [s.date, s.is_complete]))
  const first = startOfMonth(new Date(year, month - 1))
  const last  = endOfMonth(first)
  const days  = eachDayOfInterval({ start: first, end: last })
  const leadingBlanks = getDay(first)   // 0 = Sun
  return { days, leadingBlanks, logMap }
}

export default function History() {
  const now = new Date()
  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() + 1 })

  const { data: summaries = [], isLoading } = useHistory(cursor.year, cursor.month)
  const { days, leadingBlanks, logMap } = buildCalendar(cursor.year, cursor.month, summaries)

  function prev() {
    setCursor(({ year, month }) =>
      month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 },
    )
  }
  function next() {
    setCursor(({ year, month }) =>
      month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 },
    )
  }

  const isCurrentMonth =
    cursor.year === now.getFullYear() && cursor.month === now.getMonth() + 1

  return (
    <div className="page">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">History</h1>
        <ThemeToggle />
      </div>

      {/* Month navigation */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prev} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-mid-surface transition-colors">
            <ChevronLeft size={20} className="text-slate-500 dark:text-slate-400" />
          </button>
          <h2 className="font-semibold text-slate-900 dark:text-white">
            {format(new Date(cursor.year, cursor.month - 1), 'MMMM yyyy')}
          </h2>
          <button
            onClick={next}
            disabled={isCurrentMonth}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-mid-surface transition-colors disabled:opacity-30"
          >
            <ChevronRight size={20} className="text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-2">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-center text-xs font-semibold text-slate-400 dark:text-mid-muted py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        {isLoading ? (
          <div className="h-48 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-y-1.5">
            {/* Leading blanks */}
            {Array.from({ length: leadingBlanks }).map((_, i) => (
              <div key={`blank-${i}`} />
            ))}

            {/* Day cells */}
            {days.map((day) => {
              const key    = format(day, 'yyyy-MM-dd')
              const hasLog = logMap.has(key)
              const done   = logMap.get(key) ?? false
              const today  = isToday(day)
              const future = day > now && !isSameMonth(day, now)

              return (
                <div key={key} className="flex items-center justify-center py-0.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                      transition-colors
                      ${today ? 'ring-2 ring-blue-500 ring-offset-1 ring-offset-white dark:ring-offset-mid-card' : ''}
                      ${hasLog && done  ? 'bg-emerald-500 text-white'                               : ''}
                      ${hasLog && !done ? 'bg-red-400/80 dark:bg-red-500/60 text-white'              : ''}
                      ${!hasLog && !future ? 'text-slate-400 dark:text-mid-muted'                   : ''}
                      ${future ? 'text-slate-200 dark:text-slate-700'                               : ''}
                    `}
                  >
                    {format(day, 'd')}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 mt-4 text-xs text-slate-500 dark:text-mid-muted">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Complete
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400 inline-block" /> Missed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600 inline-block" /> No log
        </span>
      </div>
    </div>
  )
}
