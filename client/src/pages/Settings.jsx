import { useSection } from '../hooks/useSection'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Layout from '../components/Layout'
import useAuthStore from '../store/authStore'
import useThemeStore from '../store/themeStore'
import toast from 'react-hot-toast'
import {
  Lock, Trash2, Moon, Sun, Bell,
  Shield, ChevronRight, Eye, EyeOff,
  LogOut, Monitor,
} from 'lucide-react'

function Section({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 mb-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">{title}</h3>
      {children}
    </div>
  )
}

function SettingRow({ icon: Icon, label, description, children, danger }) {
  return (
    <div className={`flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800 last:border-0
      ${danger ? 'text-red-500' : ''}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${danger ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
          <Icon size={15} className={danger ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'} />
        </div>
        <div>
          <p className={`text-sm font-medium ${danger ? 'text-red-500' : 'text-gray-900 dark:text-gray-100'}`}>
            {label}
          </p>
          {description && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}

export default function Settings() {
  useSection('dashboard')
  const { user, logout, setAuth } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const navigate = useNavigate()

  // Change password
  const [pwForm, setPwForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false, new: false, confirm: false
  })
  const [pwLoading, setPwLoading] = useState(false)
  const [showPwForm, setShowPwForm] = useState(false)

  // Delete account
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Notification preferences (local only for now)
  const [notifications, setNotifications] = useState({
    events: true,
    placement: true,
    marketplace: false,
    lostFound: true,
  })

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      return toast.error('New passwords do not match.')
    }
    if (pwForm.newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters.')
    }
    setPwLoading(true)
    try {
      await api.patch('/auth/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      })
      toast.success('Password changed successfully!')
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setShowPwForm(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setPwLoading(false)
    }
  }

  const handleDeleteAccount = async (e) => {
    e.preventDefault()
    setDeleteLoading(true)
    try {
      await api.delete('/auth/delete-account', {
        data: { password: deletePassword }
      })
      toast.success('Account deleted.')
      logout()
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
    toast.success('Logged out successfully!')
  }

  const PasswordInput = ({ field, placeholder, value, onChange }) => (
    <div className="relative">
      <input
        type={showPasswords[field] ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
      />
      <button
        type="button"
        onClick={() => setShowPasswords(s => ({ ...s, [field]: !s[field] }))}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        {showPasswords[field] ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  )

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Settings</h1>

        {/* Account info */}
        <Section title="Account">
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl mb-2">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-400 overflow-hidden shrink-0">
              {user?.avatar
                ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                : user?.name?.charAt(0)
              }
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.name}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="ml-auto text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              Edit <ChevronRight size={13} />
            </button>
          </div>
        </Section>

        {/* Appearance */}
        <Section title="Appearance">
          <SettingRow
            icon={theme === 'light' ? Moon : Sun}
            label="Dark Mode"
            description={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          >
            <button
              onClick={toggleTheme}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200
                ${theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
                ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
          </SettingRow>

          <SettingRow
            icon={Monitor}
            label="System Theme"
            description="Use your device's theme preference"
          >
            <button
              onClick={() => {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
                if (prefersDark && theme !== 'dark') toggleTheme()
                if (!prefersDark && theme !== 'light') toggleTheme()
                toast.success('Synced with system theme!')
              }}
              className="text-xs text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
            >
              Sync
            </button>
          </SettingRow>
        </Section>

        {/* Notifications */}
        <Section title="Notifications">
          {[
            { key: 'events', label: 'Event Reminders', desc: 'Get notified about upcoming events' },
            { key: 'placement', label: 'Placement Updates', desc: 'New jobs and internships' },
            { key: 'marketplace', label: 'Marketplace Activity', desc: 'Interest in your listings' },
            { key: 'lostFound', label: 'Lost & Found Matches', desc: 'When someone finds your item' },
          ].map(({ key, label, desc }) => (
            <SettingRow key={key} icon={Bell} label={label} description={desc}>
              <button
                onClick={() => setNotifications(n => ({ ...n, [key]: !n[key] }))}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200
                  ${notifications[key] ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
                  ${notifications[key] ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </button>
            </SettingRow>
          ))}
        </Section>

        {/* Security */}
        <Section title="Security">
          <SettingRow
            icon={Lock}
            label="Change Password"
            description="Update your account password"
          >
            <button
              onClick={() => setShowPwForm(!showPwForm)}
              className="text-xs text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
            >
              {showPwForm ? 'Cancel' : 'Change'}
            </button>
          </SettingRow>

          {showPwForm && (
            <form onSubmit={handleChangePassword} className="mt-4 space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <PasswordInput
                field="current"
                placeholder="Current password"
                value={pwForm.currentPassword}
                onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
              />
              <PasswordInput
                field="new"
                placeholder="New password (min 6 chars)"
                value={pwForm.newPassword}
                onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
              />
              <PasswordInput
                field="confirm"
                placeholder="Confirm new password"
                value={pwForm.confirmPassword}
                onChange={e => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))}
              />
              <button
                type="submit" disabled={pwLoading}
                className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {pwLoading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          )}

          <SettingRow
            icon={Shield}
            label="Two-Factor Authentication"
            description="Coming soon"
          >
            <span className="text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-2 py-1 rounded-full">
              Soon
            </span>
          </SettingRow>
        </Section>

        {/* Session */}
        <Section title="Session">
          <SettingRow
            icon={LogOut}
            label="Sign Out"
            description="Log out of your account"
          >
            <button
              onClick={handleLogout}
              className="text-xs text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Sign Out
            </button>
          </SettingRow>
        </Section>

        {/* Danger Zone */}
        <Section title="Danger Zone">
          <SettingRow
            icon={Trash2}
            label="Delete Account"
            description="Permanently delete your account and all data"
            danger
          >
            <button
              onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
              className="text-xs text-red-500 border border-red-200 dark:border-red-900 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              {showDeleteConfirm ? 'Cancel' : 'Delete'}
            </button>
          </SettingRow>

          {showDeleteConfirm && (
            <form onSubmit={handleDeleteAccount} className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900">
              <p className="text-sm text-red-600 dark:text-red-400 mb-3 font-medium">
                ⚠️ This action is irreversible. All your notes, posts, and listings will be deleted.
              </p>
              <input
                type="password"
                placeholder="Enter your password to confirm"
                value={deletePassword}
                onChange={e => setDeletePassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 text-sm border border-red-200 dark:border-red-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 mb-3"
              />
              <button
                type="submit" disabled={deleteLoading}
                className="w-full bg-red-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting...' : 'Yes, Delete My Account'}
              </button>
            </form>
          )}
        </Section>
      </div>
    </Layout>
  )
}