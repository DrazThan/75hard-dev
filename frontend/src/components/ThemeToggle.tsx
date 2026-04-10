import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '@/stores/theme'

export default function ThemeToggle() {
  const { isDark, toggle } = useThemeStore()

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="p-2 rounded-xl text-slate-500 dark:text-slate-400
                 hover:bg-slate-100 dark:hover:bg-mid-card
                 transition-colors duration-150"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}
