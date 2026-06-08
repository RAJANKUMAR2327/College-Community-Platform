import { NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import {
  LayoutDashboard, FileText, Search, Calendar,
  ShoppingBag, Briefcase, User, Bell, Settings, LogOut,
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
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all
     ${isActive
       ? 'bg-indigo-50 text-indigo-600 font-medium'
       : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`

  return (
    <aside className="w-52 shrink-0 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-gray-100">
        <p className="text-sm font-semibold text-gray-900">🎓 CampusConnect</p>
        <p className="text-xs text-gray-400 mt-0.5">{user?.college || 'Your College'}</p>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">
          Main
        </p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={linkClass}>
            <Icon size={16} />
            {label}
          </NavLink>
        ))}

        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 mt-4 mb-2">
          You
        </p>
        {bottomItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={linkClass}>
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-xs font-semibold text-indigo-600">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-[10px] text-gray-400">{user?.branch} · {user?.year}rd Year</p>
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
    </aside>
  )
}