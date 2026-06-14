import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useAuthStore from '../store/authStore'
import useThemeStore from '../store/themeStore'
import {
  LayoutDashboard, FileText, Search, Calendar,
  ShoppingBag, Briefcase, User, Settings,
  LogOut, Sun, Moon, Menu, X, TrendingUp,
  Sparkles, BookOpen, Bot, Award, Shield,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/notes', icon: FileText, label: 'Notes' },
  { to: '/lost-found', icon: Search, label: 'Lost & Found' },
  { to: '/events', icon: Calendar, label: 'Events' },
  { to: '/marketplace', icon: ShoppingBag, label: 'Marketplace' },
  { to: '/placement', icon: Briefcase, label: 'Placement' },
  { to: '/placement-dashboard', icon: TrendingUp, label: 'Stats' },
  { to: '/resume-builder', icon: FileText, label: 'Resume' },
]

const aiItems = [
  { to: '/ai-study', icon: Bot, label: 'Study AI' },
  { to: '/ai-quiz', icon: Sparkles, label: 'Quiz AI' },
  { to: '/ai-career', icon: TrendingUp, label: 'Career AI' },
  { to: '/ai-notes', icon: BookOpen, label: 'Note AI' },
]

const bottomItems = [
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/certificate', icon: Award, label: 'Certificate' },
]

function SidebarContent({ user, theme, toggleTheme, handleLogout, onClose }) {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group relative
     ${isActive
       ? 'bg-indigo-500/10 text-indigo-400 font-medium'
       : 'text-gray-500 dark:text-gray-400 hover:bg-white/5 dark:hover:bg-white/5 hover:text-gray-200'}`

  const NavSection = ({ title, items }) => (
    <>
      <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-700 uppercase tracking-wider px-3 mb-1 mt-4">
        {title}
      </p>
      {items.map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to} className={linkClass} onClick={onClose}>
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-indigo-500/10 rounded-xl"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <Icon size={16} className="relative z-10 shrink-0" />
              <span className="relative z-10">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </>
  )

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center text-white font-bold text-xs animate-pulse-glow">
            CC
          </div>
          <div>
            <p className="text-sm font-bold text-white">CampusConnect</p>
            <p className="text-[10px] text-gray-600 truncate max-w-[110px]">{user?.college}</p>
          </div>
        </div>
        <button onClick={onClose} className="md:hidden text-gray-600 hover:text-gray-400 transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-0.5">
        <NavSection title="Main" items={navItems} />
        <NavSection title="AI Tools" items={aiItems} />
        <NavSection title="You" items={bottomItems} />
        {user?.role === 'admin' && (
          <>
            <p className="text-[10px] font-semibold text-red-500/60 uppercase tracking-wider px-3 mb-1 mt-4">
              Admin
            </p>
            <NavLink to="/admin" className={linkClass} onClick={onClose}>
              <Shield size={16} />
              Admin Panel
            </NavLink>
          </>
        )}
      </nav>

      {/* Theme toggle */}
      <div className="px-3 py-2 border-t border-white/5">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-white/5 hover:text-gray-300 transition-all duration-200"
        >
          {theme === 'light'
            ? <Moon size={15} className="text-indigo-400" />
            : <Sun size={15} className="text-amber-400" />
          }
          {theme === 'light' ? 'Dark mode' : 'Light mode'}
        </button>
      </div>

      {/* User footer */}
      <div className="px-3 py-3 border-t border-white/5">
        <div className="flex items-center gap-2.5 px-2 mb-2">
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 ring-2 ring-indigo-500/30">
            {user?.avatar
              ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              : (
                <div className="w-full h-full gradient-bg flex items-center justify-center text-white text-xs font-bold">
                  {user?.name?.charAt(0)}
                </div>
              )
            }
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-gray-200 truncate">{user?.name}</p>
            <p className="text-[10px] text-gray-600">{user?.branch} · Y{user?.year}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs text-gray-600 hover:text-red-400 transition-colors w-full px-2 py-1.5 rounded-lg hover:bg-red-500/5"
        >
          <LogOut size={13} /> Logout
        </button>
      </div>
    </div>
  )
}

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }

  const props = {
    user, theme, toggleTheme, handleLogout,
    onClose: () => setMobileOpen(false),
  }

  return (
    <>
      {/* Mobile topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 glass border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 gradient-bg rounded-lg flex items-center justify-center text-white font-bold text-xs">CC</div>
          <span className="text-sm font-bold text-white">CampusConnect</span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="text-gray-400 hover:text-white transition-colors">
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="md:hidden fixed top-0 left-0 h-full w-64 z-50 bg-[#0f0f17] border-r border-white/5"
          >
            <SidebarContent {...props} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 bg-[#0f0f17] border-r border-white/5 flex-col h-screen sticky top-0">
        <SidebarContent {...props} />
      </aside>
    </>
  )
}