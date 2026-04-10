import { NavLink } from 'react-router-dom'
import { BarChart2, CalendarDays, CheckSquare } from 'lucide-react'

const tabs = [
  { to: '/today',   Icon: CheckSquare, label: 'Today'   },
  { to: '/history', Icon: CalendarDays, label: 'History' },
  { to: '/stats',   Icon: BarChart2,   label: 'Stats'   },
]

export default function NavBar() {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 h-16 flex items-center
                 bg-white/80 dark:bg-mid-surface/90 backdrop-blur-md
                 border-t border-slate-200 dark:border-mid-border"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {tabs.map(({ to, Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-0.5 py-1 text-xs font-medium transition-colors
            ${isActive
              ? 'text-blue-500 dark:text-blue-400'
              : 'text-slate-400 dark:text-mid-muted'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
