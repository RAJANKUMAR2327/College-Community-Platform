import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../api/axios'
import useAuthStore from '../store/authStore'
import Layout from '../components/Layout'
import {
  FileText, Search, Calendar, ShoppingBag,
  Briefcase, ArrowRight, TrendingUp, Sparkles,
} from 'lucide-react'

const modules = [
  { label: 'Notes', icon: FileText, to: '/notes', gradient: 'from-indigo-500 to-blue-500', desc: 'Study materials' },
  { label: 'Lost & Found', icon: Search, to: '/lost-found', gradient: 'from-amber-500 to-orange-500', desc: 'Report items' },
  { label: 'Events', icon: Calendar, to: '/events', gradient: 'from-green-500 to-teal-500', desc: 'Campus events' },
  { label: 'Marketplace', icon: ShoppingBag, to: '/marketplace', gradient: 'from-pink-500 to-rose-500', desc: 'Buy & sell' },
  { label: 'Placement', icon: Briefcase, to: '/placement', gradient: 'from-blue-500 to-cyan-500', desc: 'Jobs & internships' },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function Dashboard() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState({ notes: 0, events: 0, listings: 0, lostFound: 0 })
  const [animatedStats, setAnimatedStats] = useState({ notes: 0, events: 0, listings: 0, lostFound: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [notes, events, listings, lostFound] = await Promise.all([
          api.get('/notes?limit=1'),
          api.get('/events?limit=1'),
          api.get('/listings?limit=1'),
          api.get('/lost-found?limit=1'),
        ])
        const newStats = {
          notes: notes.data.pagination.total,
          events: events.data.pagination.total,
          listings: listings.data.pagination.total,
          lostFound: lostFound.data.pagination.total,
        }
        setStats(newStats)
        // Animate counters
        Object.keys(newStats).forEach(key => {
          let start = 0
          const end = newStats[key]
          const duration = 1000
          const increment = end / (duration / 16)
          const timer = setInterval(() => {
            start += increment
            if (start >= end) {
              start = end
              clearInterval(timer)
            }
            setAnimatedStats(prev => ({ ...prev, [key]: Math.floor(start) }))
          }, 16)
        })
      } catch {}
    }
    fetchStats()
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const statCards = [
    { label: 'Notes Shared', value: animatedStats.notes, icon: '📚', color: 'from-indigo-500/10 to-blue-500/10', border: 'border-indigo-500/20' },
    { label: 'Lost Items', value: animatedStats.lostFound, icon: '🔍', color: 'from-amber-500/10 to-orange-500/10', border: 'border-amber-500/20' },
    { label: 'Upcoming Events', value: animatedStats.events, icon: '📅', color: 'from-green-500/10 to-teal-500/10', border: 'border-green-500/20' },
    { label: 'Marketplace', value: animatedStats.listings, icon: '🛍️', color: 'from-pink-500/10 to-rose-500/10', border: 'border-pink-500/20' },
  ]

  return (
    <Layout>
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={item} className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {greeting}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {user?.college} · {user?.branch} · Year {user?.year}
          </p>
        </motion.div>

        {/* Hero Banner */}
        <motion.div variants={item} className="relative rounded-3xl overflow-hidden mb-8">
          <div className="gradient-bg absolute inset-0" />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />

          <div className="relative z-10 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs mb-3">
                  <Sparkles size={12} /> AI-Powered Platform
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                  Welcome to CampusConnect!
                </h2>
                <p className="text-white/70 text-sm max-w-md">
                  Share notes, find lost items, discover events, buy & sell, and get AI-powered career guidance.
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <Link to="/notes"
                  className="flex items-center gap-2 bg-white text-indigo-600 text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-all whitespace-nowrap">
                  Upload Notes <ArrowRight size={14} />
                </Link>
                <Link to="/ai-study"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all whitespace-nowrap border border-white/20">
                  <Sparkles size={14} /> Try AI
                </Link>
              </div>
            </div>

            {/* Mini stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              {statCards.map(s => (
                <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
                  <div className="text-xl mb-0.5">{s.icon}</div>
                  <div className="text-xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-white/60">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Access */}
        <motion.div variants={item} className="mb-8">
          <h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Quick Access</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {modules.map(({ label, icon: Icon, to, gradient, desc }) => (
              <motion.div
                key={to}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Link to={to}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl glass border border-white/5 hover:border-indigo-500/30 transition-all duration-300 group text-center">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-200 group-hover:text-white transition-colors">{label}</p>
                    <p className="text-[10px] text-gray-600 mt-0.5">{desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Tools promo */}
        <motion.div variants={item}>
          <h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">AI Tools</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { to: '/ai-study', icon: '🤖', label: 'Study Assistant', desc: 'Chat with AI' },
              { to: '/ai-quiz', icon: '📝', label: 'Quiz Generator', desc: 'Practice MCQs' },
              { to: '/ai-career', icon: '🎯', label: 'Career AI', desc: 'Get guidance' },
              { to: '/ai-notes', icon: '📚', label: 'Note Summarizer', desc: 'Summarize notes' },
            ].map(tool => (
              <motion.div
                key={tool.to}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
              >
                <Link to={tool.to}
                  className="flex items-center gap-3 p-4 rounded-2xl glass border border-white/5 hover:border-purple-500/30 transition-all duration-300 group">
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{tool.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-gray-200 group-hover:text-white transition-colors">{tool.label}</p>
                    <p className="text-[10px] text-gray-600">{tool.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  )
}