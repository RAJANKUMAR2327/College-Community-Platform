import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import useThemeStore from './store/themeStore'
import useAuthStore from './store/authStore'
import useSocketStore from './store/socketStore'
import { initSocket, disconnectSocket } from './socket/socket'
import PWAInstallBanner from './components/PWAInstallBanner'
import ProtectedRoute from './components/Protecte
import QuestionBank from './pages/QuestionBank'


// ... all your page imports ..
import Chat from './pages/Chat'
import Feed from './pages/Feed'

function RootRedirect() {
  const { token } = useAuthStore()
  return <Navigate to={token ? '/dashboard' : '/landing'} replace />
}

export default function App() {
  const { initTheme } = useThemeStore()
  const { token } = useAuthStore()
  const { setSocket, setOnlineUsers, addOnlineUser, removeOnlineUser, incrementUnread } = useSocketStore()

  useEffect(() => { initTheme() }, [])

  // Init socket when logged in
  useEffect(() => {
    if (!token) return

    const socket = initSocket(token)
    setSocket(socket)

    socket.emit('get_online_users')

    socket.on('online_users', (users) => setOnlineUsers(users))
    socket.on('user_online', ({ userId }) => addOnlineUser(userId))
    socket.on('user_offline', ({ userId }) => removeOnlineUser(userId))
    socket.on('new_message', () => incrementUnread())

    return () => {
      socket.off('online_users')
      socket.off('user_online')
      socket.off('user_offline')
      socket.off('new_message')
    }
  }, [token])

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <PWAInstallBanner />
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
        <Route path="/lost-found" element={<ProtectedRoute><LostFound /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
        <Route path="/events/:id/ticket" element={<ProtectedRoute><EventTicket /></ProtectedRoute>} />
        <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
        <Route path="/placement" element={<ProtectedRoute><Placement /></ProtectedRoute>} />
        <Route path="/placement-dashboard" element={<ProtectedRoute><PlacementDashboard /></ProtectedRoute>} />
        <Route path="/resume-builder" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
        <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/chat/:conversationId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/ai-study" element={<ProtectedRoute><AIStudyAssistant /></ProtectedRoute>} />
        <Route path="/ai-quiz" element={<ProtectedRoute><AIQuizGenerator /></ProtectedRoute>} />
        <Route path="/ai-career" element={<ProtectedRoute><AICareerAssistant /></ProtectedRoute>} />
        <Route path="/ai-notes" element={<ProtectedRoute><AINoteSummarizer /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/certificate" element={<ProtectedRoute><CertificateGenerator /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/notes" element={<AdminRoute><AdminNotes /></AdminRoute>} />
        <Route path="/admin/comments" element={<AdminRoute><AdminComments /></AdminRoute>} />
        <Route path="/study-groups" element={<ProtectedRoute><StudyGroups /></ProtectedRoute>} />
        <Route path="/question-bank" element={<ProtectedRoute><QuestionBank /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}