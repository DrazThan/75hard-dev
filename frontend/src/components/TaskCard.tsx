import { type LucideIcon, Check, RefreshCw } from 'lucide-react'
import { useState } from 'react'

interface Props {
  taskType: string
  label: string
  Icon: LucideIcon
  iconColor: string
  isComplete: boolean
  isAuto?: boolean          // commit task — auto-checked, shows sync button
  isSyncing?: boolean       // loading state for sync button
  onToggle: (complete: boolean) => void
  onSync?: () => void
}

export default function TaskCard({
  label,
  Icon,
  iconColor,
  isComplete,
  isAuto,
  isSyncing,
  onToggle,
  onSync,
}: Props) {
  const [animating, setAnimating] = useState(false)

  function handleToggle() {
    if (isAuto) return  // commit is auto-managed; sync manually via button
    setAnimating(true)
    setTimeout(() => setAnimating(false), 300)
    onToggle(!isComplete)
  }

  return (
    <div
      className={`card flex items-center gap-4 px-4 py-3.5 transition-all duration-200 cursor-pointer
        ${animating ? 'animate-pop' : ''}
        ${isComplete
          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-700/40'
          : ''
        }`}
      onClick={handleToggle}
      role={isAuto ? undefined : 'button'}
    >
      {/* Icon */}
      <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center
                       ${isComplete ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-slate-100 dark:bg-mid-surface'}`}>
        <Icon size={18} className={isComplete ? 'text-emerald-500' : iconColor} strokeWidth={2} />
      </div>

      {/* Label */}
      <div className="flex-1 min-w-0">
        <p className={`font-medium text-sm truncate
          ${isComplete ? 'text-emerald-700 dark:text-emerald-300 line-through decoration-emerald-400/60' : 'text-slate-800 dark:text-slate-100'}`}>
          {label}
        </p>
        {isAuto && (
          <p className="text-xs text-slate-400 dark:text-mid-muted mt-0.5">Auto-checked via GitHub</p>
        )}
      </div>

      {/* Right side: sync button for auto, checkbox for manual */}
      {isAuto ? (
        <button
          onClick={(e) => { e.stopPropagation(); onSync?.() }}
          disabled={isSyncing}
          aria-label="Sync GitHub commit"
          className="p-2 rounded-lg text-slate-400 hover:text-blue-500 dark:hover:text-blue-400
                     hover:bg-slate-100 dark:hover:bg-mid-surface transition-colors disabled:opacity-40"
        >
          <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
        </button>
      ) : (
        <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-200
          ${isComplete
            ? 'bg-emerald-500 border-emerald-500 dark:bg-emerald-500 dark:border-emerald-500'
            : 'border-slate-300 dark:border-slate-600 bg-transparent'
          }`}>
          {isComplete && <Check size={14} className="text-white" strokeWidth={3} />}
        </div>
      )}
    </div>
  )
}
