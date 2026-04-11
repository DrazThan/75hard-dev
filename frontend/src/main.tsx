import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'

// Initialise dark mode before first paint to avoid flash
const stored = localStorage.getItem('theme-store')
const isDark = stored ? JSON.parse(stored)?.state?.isDark ?? true : true
document.documentElement.classList.toggle('dark', isDark)

// Debug: confirm resolved API URL on startup
if (import.meta.env.VITE_LOG_LEVEL === 'debug') {
  console.debug('[75Hard] API URL:', import.meta.env.VITE_API_URL ?? '⚠️  NOT SET')
  console.debug('[75Hard] Log level: debug')
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
