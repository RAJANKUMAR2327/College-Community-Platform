import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import useAuthStore from '../store/authStore'
import Layout from '../components/Layout'
import { FileText, Search, Calendar, ShoppingBag, Briefcase } from 'lucide-react'

const modules = [
  { label: 'Notes', icon: FileText, to: '/notes', color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/30' },
  { label: 'Lost & Found', icon: Search, to: '/lost-found', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/30' },
  { label: 'Events', icon: Calendar, to: '/events', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/30' },
  { label: 'Marketplace', icon: ShoppingBag, to: '/marketplace', color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-900/30' },
  { label: 'Placement', icon: Briefcase, to: '/placement', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/30' },
]

export default function Dashboard() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState({ notes: 0, events: 0, listings: 0, lostFound: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [notes, events, listings, lostFound] = await Promise.all([
          api.get('/notes?limit=1'),
          api.get('/events?limit=1'),
          api.get('/listings?limit=1'),
          api.get('/lost-found?limit=1'),
        ])
        setStats({
          notes: notes.data.pagination.total,
          events: events.data.pagination.total,
          listings: listings.data.pagination.total,
          lostFound: lostFound.data.pagination.total,
        })
      } catch {}
    }
    fetchStats()
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {greeting}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {user?.college} · {user?.branch} · Year {user?.year}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Notes shared', value: stats.notes },
          { label: 'Open lost items', value: stats.lostFound },
          { label: 'Upcoming events', value: stats.events },
          { label: 'Marketplace listings', value: stats.listings },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Quick access */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {modules.map(({ label, icon: Icon, to, color, bg }) => (
            <Link
              key={to} to={to}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all group"
            >
              <div className={`${bg} p-3 rounded-lg`}>
                <Icon size={20} className={color} />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
        <h3 className="font-semibold text-lg mb-1">Welcome to CampusConnect! 🎉</h3>
        <p className="text-indigo-100 text-sm mb-4">
          Share notes, find lost items, discover events, buy & sell, and explore placement opportunities — all in one place.
        </p>
        <div className="flex gap-3">
          <Link to="/notes"
            className="bg-white text-indigo-600 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors">
            Upload Notes
          </Link>
          <Link to="/events"
            className="border border-indigo-400 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-indigo-400 transition-colors">
            Browse Events
          </Link>
        </div>
      </div>
    </Layout>
  )
}