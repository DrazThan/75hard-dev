import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export const http = axios.create({ baseURL: BASE })

// Attach JWT on every request
http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-logout on 401
http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(err)
  },
)
