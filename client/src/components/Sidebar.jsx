import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import useThemeStore from '../store/themeStore'
import {
  LayoutDashboard, FileText, Search, Calendar,
  ShoppingBag, Briefcase, User, Settings,
  LogOut, Sun, Moon, Menu, X,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/notes', icon: FileText, label: 'Notes' },
  { to: '/lost-found', icon: Search, label: 'Lost & Found' },
  { to: '/events', icon: Calendar, label: 'Events' },
  { to: '/marketplace', icon: ShoppingBag, label: 'Marketplace' },
  { to: '/placement', icon: Briefcase, label: 'Placement' },
]

const bottomItems = [
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all
     ${isActive
       ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium'
       : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'}`

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-4 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">🎓 CampusConnect</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate max-w-[140px]">
            {user?.college || 'Your College'}
          </p>
        </div>
        {/* Close button on mobile */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider px-2 mb-2">
          Main
        </p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to} to={to}
            className={linkClass}
            onClick={() => setMobileOpen(false)}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}

        <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider px-2 mt-4 mb-2">
          You
        </p>
        {bottomItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to} to={to}
            className={linkClass}
            onClick={() => setMobileOpen(false)}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Dark mode toggle */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
          {theme === 'light' ? 'Dark mode' : 'Light mode'}
        </button>
      </div>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/50 flex items-center justify-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 shrink-0">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">{user?.name}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">{user?.branch} · {user?.year}rd Year</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-red-500 transition-colors w-full"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">🎓 CampusConnect</p>
        <button
          onClick={() => setMobileOpen(true)}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside className={`
        md:hidden fixed top-0 left-0 h-full w-64 z-50 flex flex-col
        bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800
        transform transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-52 shrink-0 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex-col h-screen sticky top-0">
        <SidebarContent />
      </aside>
    </>
  )
}