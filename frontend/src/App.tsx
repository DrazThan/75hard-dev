import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from '@/components/Layout'
import Login from '@/pages/Login'
import Today from '@/pages/Today'
import History from '@/pages/History'
import Stats from '@/pages/Stats'
import { useAuthStore } from '@/stores/auth'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token)
  return token ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/today" replace />} />
          <Route path="/today"   element={<Today />} />
          <Route path="/history" element={<History />} />
          <Route path="/stats"   element={<Stats />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
