import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FileText, Search, Calendar, ShoppingBag,
  Briefcase, Sparkles, ArrowRight, Star,
  Shield, Zap, Globe, ChevronDown,
} from 'lucide-react'

const features = [
  { icon: FileText, title: 'Notes Sharing', desc: 'Upload and discover study materials from fellow students', color: 'from-indigo-500 to-blue-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
  { icon: Search, title: 'Lost & Found', desc: 'Report and recover lost items on your campus', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { icon: Calendar, title: 'Events', desc: 'Discover and attend exciting campus events', color: 'from-green-500 to-teal-500', bg: 'bg-green-50 dark:bg-green-900/20' },
  { icon: ShoppingBag, title: 'Marketplace', desc: 'Buy and sell within your college community', color: 'from-pink-500 to-rose-500', bg: 'bg-pink-50 dark:bg-pink-900/20' },
  { icon: Briefcase, title: 'Placement', desc: 'Share jobs, internships and interview experiences', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { icon: Sparkles, title: 'AI Assistant', desc: 'Powered by Claude AI for study and career guidance', color: 'from-purple-500 to-pink-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
]

const stats = [
  { value: '10K+', label: 'Students' },
  { value: '500+', label: 'Notes Shared' },
  { value: '200+', label: 'Events' },
  { value: '50+', label: 'Colleges' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white font-bold text-sm">
              CC
            </div>
            <span className="font-bold text-white">CampusConnect</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login"
              className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">
              Sign in
            </Link>
            <Link to="/register"
              className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-all duration-200"
              style={{ boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          {/* Grid */}
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        </div>

        <motion.div
          className="relative z-10 text-center max-w-5xl mx-auto px-6"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-indigo-500/30 text-sm text-indigo-300">
              <Sparkles size={14} className="text-indigo-400" />
              Powered by Claude AI · Built for Students
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-6"
          >
            Your College
            <br />
            <span className="gradient-text">Community Hub</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Connect with classmates, share notes, discover events, buy & sell, and get AI-powered study help — all in one platform built for Indian colleges.
          </motion.p>

          {/* CTA buttons */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/register"
              className="btn-primary text-base px-8 py-4 rounded-2xl"
              style={{ boxShadow: '0 8px 30px rgba(99,102,241,0.4)' }}>
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link to="/login"
              className="btn-secondary text-base px-8 py-4 rounded-2xl border-white/10 text-gray-300 bg-white/5 hover:bg-white/10">
              Sign In
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto"
          >
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold gradient-text">{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            variants={fadeUp}
            className="flex justify-center mt-16"
          >
            <div className="animate-bounce text-gray-600">
              <ChevronDown size={24} />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-indigo-400 text-sm font-semibold tracking-wider uppercase mb-3">Everything you need</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              One platform for your entire
              <span className="gradient-text"> college life</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              From notes to placements, we've got every aspect of your campus experience covered.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color, bg }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="glass rounded-2xl p-6 border border-white/5 cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 sm:p-12 border border-indigo-500/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-4">
                  <Sparkles size={12} /> AI-Powered
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Study smarter with
                  <span className="gradient-text"> Claude AI</span>
                </h2>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Get instant help with your studies, generate practice quizzes, analyze your career path, and summarize complex notes — all powered by Anthropic's Claude.
                </p>
                <div className="space-y-3">
                  {[
                    { icon: '🤖', text: 'AI Study Assistant — chat about any topic' },
                    { icon: '📝', text: 'Quiz Generator — MCQs on any subject instantly' },
                    { icon: '🎯', text: 'Career Assistant — personalized roadmaps' },
                    { icon: '📚', text: 'Note Summarizer — flashcards, mind maps' },
                  ].map(item => (
                    <div key={item.text} className="flex items-center gap-3 text-sm text-gray-300">
                      <span className="text-base">{item.icon}</span>
                      {item.text}
                    </div>
                  ))}
                </div>
                <Link to="/register"
                  className="inline-flex items-center gap-2 mt-8 btn-primary rounded-xl">
                  Try AI Features <ArrowRight size={16} />
                </Link>
              </div>

              {/* AI Chat preview */}
              <div className="flex-1 w-full max-w-md">
                <div className="glass rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs text-gray-500 ml-2">AI Study Assistant</span>
                  </div>
                  {[
                    { role: 'user', text: 'Explain deadlocks in OS with example' },
                    { role: 'ai', text: 'A deadlock occurs when 4 conditions hold simultaneously: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait...' },
                    { role: 'user', text: 'Generate 3 MCQs on this topic' },
                    { role: 'ai', text: 'Q1. Which condition is NOT necessary for deadlock?\nA) Mutual Exclusion\nB) Preemption ✓\nC) Hold & Wait...' },
                  ].map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.2 }}
                      className={`flex gap-2 mb-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0
                        ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-gradient-to-br from-purple-500 to-indigo-600'}`}>
                        {msg.role === 'user' ? 'U' : 'AI'}
                      </div>
                      <div className={`text-xs rounded-xl px-3 py-2 max-w-[75%] leading-relaxed
                        ${msg.role === 'user'
                          ? 'bg-indigo-600/80 text-white rounded-tr-sm'
                          : 'bg-white/5 text-gray-300 rounded-tl-sm border border-white/5'}`}>
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="gradient-bg rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20 rounded-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to join your campus community?
              </h2>
              <p className="text-white/80 mb-8">
                Join thousands of students already using CampusConnect
              </p>
              <Link to="/register"
                className="inline-flex items-center gap-2 bg-white text-indigo-600 font-bold px-8 py-4 rounded-2xl hover:bg-gray-50 transition-all duration-200 text-base"
                style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}>
                Get Started Free <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md gradient-bg" />
            <span className="text-sm font-semibold text-gray-400">CampusConnect</span>
          </div>
          <p className="text-xs text-gray-600">
            Built with ❤️ for Indian college students · Powered by Claude AI
          </p>
        </div>
      </footer>
    </div>
  )
}