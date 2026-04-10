import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap } from 'lucide-react'
import * as authApi from '@/api/auth'
import { useAuthStore } from '@/stores/auth'

export default function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const token = await authApi.login(username, password)
      const user  = await authApi.me(token.access_token)
      setAuth(token.access_token, user)
      navigate('/today', { replace: true })
    } catch {
      setError('Invalid username or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6
                    bg-slate-50 dark:bg-mid-bg animate-fade-in">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Zap size={24} className="text-white" fill="white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-none">75 Hard</h1>
          <p className="text-xs text-slate-500 dark:text-mid-muted font-medium">Dev Edition</p>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm card p-6 space-y-5 shadow-xl shadow-black/5 dark:shadow-black/30">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Welcome back</h2>
          <p className="text-sm text-slate-500 dark:text-mid-muted mt-0.5">Sign in to track your streak</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Username
            </label>
            <input
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 dark:border-mid-border
                         bg-white dark:bg-mid-surface text-slate-900 dark:text-white
                         placeholder-slate-400 dark:placeholder-mid-muted
                         px-3.5 py-2.5 text-sm outline-none
                         focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                         transition-shadow duration-150"
              placeholder="your username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 dark:border-mid-border
                         bg-white dark:bg-mid-surface text-slate-900 dark:text-white
                         placeholder-slate-400 dark:placeholder-mid-muted
                         px-3.5 py-2.5 text-sm outline-none
                         focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                         transition-shadow duration-150"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>
          )}

          <button type="submit" className="btn-primary mt-1" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
