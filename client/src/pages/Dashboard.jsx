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

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 rounded-2xl p-6 text-white overflow-hidden mb-6">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-xl mb-1">Welcome to CampusConnect! 🎉</h3>
              <p className="text-indigo-100 text-sm max-w-md">
                Your all-in-one college community platform. Share notes, find lost items,
                discover events, buy & sell, and explore placement opportunities.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link to="/notes"
                className="bg-white text-indigo-600 text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors whitespace-nowrap">
                Upload Notes
              </Link>
              <Link to="/events"
                className="border border-white/30 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors whitespace-nowrap">
                Browse Events
              </Link>
            </div>
          </div>

          {/* Mini stats row inside banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { label: 'Notes', value: stats.notes, emoji: '📚' },
              { label: 'Lost Items', value: stats.lostFound, emoji: '🔍' },
              { label: 'Events', value: stats.events, emoji: '📅' },
              { label: 'Listings', value: stats.listings, emoji: '🛍️' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
                <div className="text-lg mb-0.5">{s.emoji}</div>
                <div className="text-xl font-bold">{s.value}</div>
                <div className="text-xs text-indigo-200">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick access modules */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
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
    </Layout>
  )
}