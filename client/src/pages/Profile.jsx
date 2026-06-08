import { useState } from 'react'
import api from '../api/axios'
import Layout from '../components/Layout'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'
import { User, Mail, BookOpen, GraduationCap, Edit3, Save, X } from 'lucide-react'

const branches = ['CSE', 'ECE', 'EEE', 'Mechanical', 'Chemical', 'Civil', 'Pharmacy', 'Other']

export default function Profile() {
  const { user, setAuth } = useAuthStore()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    branch: user?.branch || '',
    year: user?.year || '',
    college: user?.college || '',
  })
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      const { data } = await api.patch('/auth/update-profile', form)
      setAuth(localStorage.getItem('token'), data.user)
      toast.success('Profile updated!')
      setEditing(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update')
    } finally {
      setLoading(false)
    }
  }

  const initials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Layout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>

        {/* Avatar + name card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-600">
              {initials}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{user?.name}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full mt-1 inline-block capitalize">
                {user?.role}
              </span>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="ml-auto flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors"
            >
              {editing ? <><X size={14} /> Cancel</> : <><Edit3 size={14} /> Edit</>}
            </button>
          </div>

          {/* Info fields */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail size={16} className="text-gray-400 shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm text-gray-900">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User size={16} className="text-gray-400 shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-1">Full Name</p>
                {editing ? (
                  <input value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                ) : (
                  <p className="text-sm text-gray-900">{user?.name}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <GraduationCap size={16} className="text-gray-400 shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-1">College</p>
                {editing ? (
                  <input value={form.college}
                    onChange={e => setForm(f => ({ ...f, college: e.target.value }))}
                    className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                ) : (
                  <p className="text-sm text-gray-900">{user?.college}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <BookOpen size={16} className="text-gray-400 shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">Branch</p>
                  {editing ? (
                    <select value={form.branch}
                      onChange={e => setForm(f => ({ ...f, branch: e.target.value }))}
                      className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      {branches.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  ) : (
                    <p className="text-sm text-gray-900">{user?.branch}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <GraduationCap size={16} className="text-gray-400 shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">Year</p>
                  {editing ? (
                    <select value={form.year}
                      onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
                      className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      {[1,2,3,4,5].map(y => <option key={y} value={y}>Year {y}</option>)}
                    </select>
                  ) : (
                    <p className="text-sm text-gray-900">Year {user?.year}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {editing && (
            <button onClick={handleSave} disabled={loading}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50">
              <Save size={15} />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </div>

        {/* Stats card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Your Activity</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: 'Notes Uploaded', value: '—' },
              { label: 'Events Attended', value: '—' },
              { label: 'Listings Posted', value: '—' },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xl font-bold text-indigo-600">{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}