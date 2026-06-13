import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import useThemeStore from './store/themeStore'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Notes from './pages/Notes'
import LostFound from './pages/LostFound'
import Events from './pages/Events'
import Marketplace from './pages/Marketplace'
import Placement from './pages/Placement'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Notifications from './pages/Notifications'
import PlacementDashboard from './pages/PlacementDashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import AIStudyAssistant from './pages/AIStudyAssistant'
import AIQuizGenerator from './pages/AIQuizGenerator'
import AICareerAssistant from './pages/AICareerAssistant'
import AINoteSummarizer from './pages/AINoteSummarizer'
import AdminRoute from './components/AdminRoute'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminNotes from './pages/admin/AdminNotes'
import AdminComments from './pages/admin/AdminComments'

export default function App() {
  const { initTheme } = useThemeStore()

  useEffect(() => {
    initTheme()
  }, [])

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
        <Route path="/lost-found" element={<ProtectedRoute><LostFound /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
        <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
        <Route path="/placement" element={<ProtectedRoute><Placement /></ProtectedRoute>} />
        <Route path="/placement-dashboard" element={<ProtectedRoute><PlacementDashboard /></ProtectedRoute>} />
        <Route path="/resume-builder" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/ai-study" element={<ProtectedRoute><AIStudyAssistant /></ProtectedRoute>} />
        <Route path="/ai-quiz" element={<ProtectedRoute><AIQuizGenerator /></ProtectedRoute>} />
        <Route path="/ai-career" element={<ProtectedRoute><AICareerAssistant /></ProtectedRoute>} />
        <Route path="/ai-notes" element={<ProtectedRoute><AINoteSummarizer /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/notes" element={<AdminRoute><AdminNotes /></AdminRoute>} />
        <Route path="/admin/comments" element={<AdminRoute><AdminComments /></AdminRoute>} />

        {/* Catch-all Route (Keep at the bottom) */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}