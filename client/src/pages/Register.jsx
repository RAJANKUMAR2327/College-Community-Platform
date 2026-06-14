import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { Mail, Lock, User, BookOpen, GraduationCap, ArrowRight, Eye, EyeOff } from 'lucide-react'

const branches = ['CSE', 'ECE', 'EEE', 'Mechanical', 'Chemical', 'Civil', 'Pharmacy', 'Other']

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    branch: '', year: '', college: '',
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/register', form)
      toast.success('Account created! Please sign in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl" />
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow"
          >
            <span className="text-white font-bold text-2xl">CC</span>
          </motion.div>
          <h1 className="text-2xl font-bold text-white">Create account</h1>
          <p className="text-gray-500 text-sm mt-1">Join your college community</p>
        </div>

        <div className="glass rounded-3xl p-8 border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="text" value={form.name} required
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Rajan Kumar"
                  className="input-premium pl-11 bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-indigo-500" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="email" value={form.email} required
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@college.ac.in"
                  className="input-premium pl-11 bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-indigo-500" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type={showPassword ? 'text' : 'password'}
                  value={form.password} required minLength={6}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Min. 6 characters"
                  className="input-premium pl-11 pr-11 bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-indigo-500" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* College */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">College Name</label>
              <div className="relative">
                <GraduationCap size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="text" value={form.college} required
                  onChange={e => setForm(f => ({ ...f, college: e.target.value }))}
                  placeholder="BITS Pilani"
                  className="input-premium pl-11 bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-indigo-500" />
              </div>
            </div>

            {/* Branch + Year */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Branch</label>
                <select value={form.branch} required
                  onChange={e => setForm(f => ({ ...f, branch: e.target.value }))}
                  className="input-premium bg-white/5 border-white/10 text-white focus:border-indigo-500">
                  <option value="" className="bg-gray-900">Select</option>
                  {branches.map(b => <option key={b} value={b} className="bg-gray-900">{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Year</label>
                <select value={form.year} required
                  onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
                  className="input-premium bg-white/5 border-white/10 text-white focus:border-indigo-500">
                  <option value="" className="bg-gray-900">Select</option>
                  {[1,2,3,4,5].map(y => <option key={y} value={y} className="bg-gray-900">Year {y}</option>)}
                </select>
              </div>
            </div>

            <motion.button
              type="submit" disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-primary rounded-xl py-3.5 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}