interface Props {
  streak: number
}

export default function StreakBanner({ streak }: Props) {
  if (streak === 0) {
    return (
      <div className="card px-4 py-3 flex items-center gap-3">
        <span className="text-2xl">🌱</span>
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-100">Start your streak!</p>
          <p className="text-xs text-slate-500 dark:text-mid-muted">Complete all 6 tasks today.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card px-4 py-3 flex items-center gap-3 bg-gradient-to-r from-orange-500/10 to-yellow-500/10
                    dark:from-orange-500/15 dark:to-yellow-500/15 border-orange-200 dark:border-orange-500/20">
      <span className="text-3xl animate-pop">{streak >= 7 ? '🔥' : '⚡'}</span>
      <div>
        <p className="font-bold text-lg text-slate-900 dark:text-white leading-none">
          {streak} day{streak !== 1 ? 's' : ''}
        </p>
        <p className="text-xs text-slate-500 dark:text-mid-muted mt-0.5">
          {streak >= 30
            ? 'Legendary! Keep going.'
            : streak >= 7
            ? "You're on fire! Don't stop now."
            : 'Building momentum!'}
        </p>
      </div>
    </div>
  )
}
