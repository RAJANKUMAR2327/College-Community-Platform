import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import GlobalSearch from './GlobalSearch'
import NotificationBell from './NotificationBell'

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#0a0a0f] dark:bg-[#0a0a0f]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <div className="sticky top-0 z-30 glass border-b border-white/5 px-4 md:px-6 py-3 flex items-center justify-end gap-3 mt-12 md:mt-0">
          <GlobalSearch />
          <NotificationBell />
        </div>

        {/* Page content */}
        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 p-4 md:p-6 overflow-y-auto"
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}