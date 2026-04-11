import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const _raw = import.meta.env.VITE_API_URL as string | undefined
if (!_raw) {
  throw new Error('[75Hard] VITE_API_URL is not set — add it to your .env or Railway env vars')
}

// Strip trailing slash so every endpoint path can start with "/"
const BASE = _raw.replace(/\/$/, '')

const DEBUG = import.meta.env.VITE_LOG_LEVEL === 'debug'

export const http = axios.create({ baseURL: BASE })

// Attach JWT + optional debug logging on every request
http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`

  if (DEBUG) {
    console.debug(
      `[API →] ${config.method?.toUpperCase()} ${BASE}${config.url}`,
      '\nHeaders:', config.headers,
      '\nBody:', config.data ?? '(none)',
    )
  }

  return config
})

// Auto-logout on 401 + optional debug logging on every response
http.interceptors.response.use(
  (res) => {
    if (DEBUG) {
      console.debug(
        `[API ←] ${res.status} ${res.config.url}`,
        '\nData:', res.data,
      )
    }
    return res
  },
  (err) => {
    if (DEBUG) {
      console.debug(
        `[API ✕] ${err.response?.status ?? 'network error'} ${err.config?.url}`,
        '\nError:', err.response?.data ?? err.message,
      )
    }
    if (err.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(err)
  },
)
