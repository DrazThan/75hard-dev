import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-mid-bg">
      <Outlet />
      <NavBar />
    </div>
  )
}
