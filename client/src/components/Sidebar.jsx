import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useAuthStore from '../store/authStore'
import useThemeStore from '../store/themeStore'
import useSectionStore from '../store/sectionStore'
import { Rss } from 'lucide-react'
import { MessageCircle } from 'lucide-react'

import {
  LayoutDashboard, FileText, Search, Calendar,
  ShoppingBag, Briefcase, User, Settings,
  LogOut, Sun, Moon, Menu, X, TrendingUp,
  Sparkles, BookOpen, Bot, Award, Shield,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', section: 'dashboard', dot: 'bg-indigo-500' },
  { to: '/notes', icon: FileText, label: 'Notes', section: 'notes', dot: 'bg-indigo-500' },
  { to: '/lost-found', icon: Search, label: 'Lost & Found', section: 'lostfound', dot: 'bg-amber-500' },
  { to: '/events', icon: Calendar, label: 'Events', section: 'events', dot: 'bg-green-500' },
  { to: '/marketplace', icon: ShoppingBag, label: 'Marketplace', section: 'marketplace', dot: 'bg-pink-500' },
  { to: '/placement', icon: Briefcase, label: 'Placement', section: 'placement', dot: 'bg-blue-500' },
  { to: '/placement-dashboard', icon: TrendingUp, label: 'Stats', section: 'placement', dot: 'bg-blue-500' },
  { to: '/resume-builder', icon: FileText, label: 'Resume', section: 'placement', dot: 'bg-blue-500' },
  { to: '/feed', icon: Rss, label: 'Campus Feed', section: 'dashboard', dot: 'bg-indigo-500' },
  { to: '/chat', icon: MessageCircle, label: 'Messages', section: 'dashboard', dot: 'bg-green-500' },
]

const aiItems = [
  { to: '/ai-study', icon: Bot, label: 'Study AI', section: 'notes', dot: 'bg-purple-500' },
  { to: '/ai-quiz', icon: Sparkles, label: 'Quiz AI', section: 'notes', dot: 'bg-purple-500' },
  { to: '/ai-career', icon: TrendingUp, label: 'Career AI', section: 'placement', dot: 'bg-purple-500' },
  { to: '/ai-notes', icon: BookOpen, label: 'Note AI', section: 'notes', dot: 'bg-purple-500' },
]

const bottomItems = [
  { to: '/profile', icon: User, label: 'Profile', section: 'dashboard', dot: 'bg-gray-400' },
  { to: '/settings', icon: Settings, label: 'Settings', section: 'dashboard', dot: 'bg-gray-400' },
  { to: '/certificate', icon: Award, label: 'Certificate', section: 'dashboard', dot: 'bg-amber-400' },
]

const sectionActiveStyles = {
  dashboard: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
  notes: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
  lostfound: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  events: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  marketplace: 'bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
  placement: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
}

function NavGroup({ title, items, setSection, onClose, user }) {
  const { currentSection } = useSectionStore()

  return (
    <>
      <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider px-3 mb-1 mt-4 first:mt-2">
        {title}
      </p>
      {items.map(({ to, icon: Icon, label, section, dot }) => (
        <NavLink
          key={to} to={to}
          onClick={() => { setSection(section); onClose() }}
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2.5 mx-1 rounded-xl text-sm transition-all duration-200 relative group
             ${isActive
               ? sectionActiveStyles[section] + ' font-medium'
               : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'}`
          }
        >
          {({ isActive }) => (
            <>
              {/* Colored dot indicator */}
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-200 ${isActive ? dot : 'bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400'}`} />
              <Icon size={15} className="shrink-0" />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </>
  )
}

function SidebarInner({ user, theme, toggleTheme, handleLogout, onClose }) {
  const { setSection } = useSectionStore()

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs shadow-lg">
            CC
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">CampusConnect</p>
            <p className="text-[9px] text-gray-400 truncate max-w-[110px]">{user?.college}</p>
          </div>
        </div>
        <button onClick={onClose} className="md:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <X size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-1 py-2 overflow-y-auto">
        <NavGroup title="Main" items={navItems} setSection={setSection} onClose={onClose} user={user} />
        <NavGroup title="AI Tools" items={aiItems} setSection={setSection} onClose={onClose} user={user} />
        <NavGroup title="You" items={bottomItems} setSection={setSection} onClose={onClose} user={user} />

        {user?.role === 'admin' && (
          <>
            <p className="text-[10px] font-semibold text-red-400/60 uppercase tracking-wider px-3 mb-1 mt-4">
              Admin
            </p>
            <NavLink to="/admin"
              onClick={() => { setSection('dashboard'); onClose() }}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 mx-1 rounded-xl text-sm transition-all duration-200
                 ${isActive ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`
              }>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <Shield size={15} />
              Admin Panel
            </NavLink>
          </>
        )}
      </nav>

      {/* Theme toggle */}
      <div className="px-3 py-2 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          {theme === 'light'
            ? <Moon size={14} className="text-indigo-400" />
            : <Sun size={14} className="text-amber-400" />
          }
          {theme === 'light' ? 'Dark mode' : 'Light mode'}
        </button>
      </div>

      {/* User footer */}
      <div className="px-3 py-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 px-2 mb-2">
          <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 ring-2 ring-indigo-100 dark:ring-indigo-900">
            {user?.avatar
              ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold">{user?.name?.charAt(0)}</div>
            }
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">{user?.name}</p>
            <p className="text-[9px] text-gray-400">{user?.branch} · Y{user?.year}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-red-500 transition-colors w-full px-2 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10"
        >
          <LogOut size={12} /> Logout
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
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">CC</div>
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">CampusConnect</span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 p-1">
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
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
            transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
            className="md:hidden fixed top-0 left-0 h-full w-60 z-50 shadow-2xl"
          >
            <SidebarInner {...props} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden md:block w-56 shrink-0 h-screen sticky top-0 shadow-sm">
        <SidebarInner {...props} />
      </aside>
    </>
  )
}