import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Stores & Sockets
import useThemeStore from './store/themeStore'
import useAuthStore from './store/authStore'
import useSocketStore from './store/socketStore'
import useCallStore from './store/callStore'
import { initSocket } from './socket/socket'

// Components
import PWAInstallBanner from './components/PWAInstallBanner'
import PushPermissionBanner from './components/PushPermissionBanner'
import IncomingCallBanner from './components/IncomingCallBanner'
import VideoCallWindow from './components/VideoCallWindow'
import ProtectedRoute from './components/Protecte' // Check spelling if it's meant to be ProtectedRoute
import AdminRoute from './components/AdminRoute'  // Added assuming it exists

// Pages - Auth & General
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Notifications from './pages/Notifications'

// Pages - Features
import Feed from './pages/Feed'
import Chat from './pages/Chat'
import Notes from './pages/Notes'
import LostFound from './pages/LostFound'
import Events from './pages/Events'
import EventTicket from './pages/EventTicket'
import Marketplace from './pages/Marketplace'
import Placement from './pages/Placement'
import PlacementDashboard from './pages/PlacementDashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import StudyGroups from './pages/StudyGroups'
import QuestionBank from './pages/QuestionBank'
import Clubs from './pages/Clubs'
import Mentorship from './pages/Mentorship'
import Leaderboard from './pages/Leaderboard'
import Calendar from './pages/Calendar'
import ApplicationTracker from './pages/ApplicationTracker'
import ConfessionBoard from './pages/ConfessionBoard'
import LibraryBooking from './pages/LibraryBooking'
import SkillsHub from './pages/SkillsHub'
import VerifyCredential from './pages/VerifyCredential'
import CertificateGenerator from './pages/CertificateGenerator'
import ReferralPortal from './pages/ReferralPortal'
import RideShare from './pages/RideShare'

// Pages - AI Tools
import AIStudyAssistant from './pages/AIStudyAssistant'
import AIQuizGenerator from './pages/AIQuizGenerator'
import AICareerAssistant from './pages/AICareerAssistant'
import AINoteSummarizer from './pages/AINoteSummarizer'
import AIToolsHub from './pages/AIToolsHub'
import AIConceptExplainer from './pages/AIConceptExplainer'
import AIEssayHelper from './pages/AIEssayHelper'
import AITranslator from './pages/AITranslator'

// Pages - Admin
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import AdminNotes from './pages/AdminNotes'
import AdminComments from './pages/AdminComments'

function RootRedirect() {
  const { token } = useAuthStore()
  return <Navigate to={token ? '/dashboard' : '/landing'} replace />
}

export default function App() {
  const { initTheme } = useThemeStore()
  const { token } = useAuthStore()
  const { setSocket, setOnlineUsers, addOnlineUser, removeOnlineUser, incrementUnread } = useSocketStore()
  const { setIncomingCall } = useCallStore()

  useEffect(() => { initTheme() }, [])

  useEffect(() => {
    if (!token) return
    const socket = initSocket(token)
    setSocket(socket)
    socket.emit('get_online_users')

    socket.on('online_users', (users) => setOnlineUsers(users))
    socket.on('user_online', ({ userId }) => addOnlineUser(userId))
    socket.on('user_offline', ({ userId }) => removeOnlineUser(userId))
    socket.on('new_message', () => incrementUnread())
    socket.on('incoming_call', (callData) => setIncomingCall(callData))

    return () => {
      socket.off('online_users')
      socket.off('user_online')
      socket.off('user_offline')
      socket.off('new_message')
      socket.off('incoming_call')
    }
  }, [token])

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <PWAInstallBanner />
      <PushPermissionBanner />
      <IncomingCallBanner />
      <VideoCallWindow />
      
      <Routes>
        {/* Core & Auth Routes */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify/:code" element={<VerifyCredential />} />

        {/* Protected User Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        
        {/* Protected Feature Routes */}
        <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/chat/:conversationId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
        <Route path="/lost-found" element={<ProtectedRoute><LostFound /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
        <Route path="/events/:id/ticket" element={<ProtectedRoute><EventTicket /></ProtectedRoute>} />
        <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
        <Route path="/placement" element={<ProtectedRoute><Placement /></ProtectedRoute>} />
        <Route path="/placement-dashboard" element={<ProtectedRoute><PlacementDashboard /></ProtectedRoute>} />
        <Route path="/resume-builder" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
        <Route path="/study-groups" element={<ProtectedRoute><StudyGroups /></ProtectedRoute>} />
        <Route path="/question-bank" element={<ProtectedRoute><QuestionBank /></ProtectedRoute>} />
        <Route path="/clubs" element={<ProtectedRoute><Clubs /></ProtectedRoute>} />
        <Route path="/mentorship" element={<ProtectedRoute><Mentorship /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
        <Route path="/applications" element={<ProtectedRoute><ApplicationTracker /></ProtectedRoute>} />
        <Route path="/confessions" element={<ProtectedRoute><ConfessionBoard /></ProtectedRoute>} />
        <Route path="/library" element={<ProtectedRoute><LibraryBooking /></ProtectedRoute>} />
        <Route path="/skills" element={<ProtectedRoute><SkillsHub /></ProtectedRoute>} />
        <Route path="/certificate" element={<ProtectedRoute><CertificateGenerator /></ProtectedRoute>} />
        <Route path="/surveys" element={<ProtectedRoute><Surveys /></ProtectedRoute>} />
        <Route path="/rides" element={<ProtectedRoute><RideShare /></ProtectedRoute>} />

        {/* Protected AI Tool Routes */}
        <Route path="/ai-study" element={<ProtectedRoute><AIStudyAssistant /></ProtectedRoute>} />
        <Route path="/ai-quiz" element={<ProtectedRoute><AIQuizGenerator /></ProtectedRoute>} />
        <Route path="/ai-career" element={<ProtectedRoute><AICareerAssistant /></ProtectedRoute>} />
        <Route path="/ai-notes" element={<ProtectedRoute><AINoteSummarizer /></ProtectedRoute>} />
        <Route path="/ai-tools" element={<ProtectedRoute><AIToolsHub /></ProtectedRoute>} />
        <Route path="/ai-explain" element={<ProtectedRoute><AIConceptExplainer /></ProtectedRoute>} />
        <Route path="/ai-essay" element={<ProtectedRoute><AIEssayHelper /></ProtectedRoute>} />
        <Route path="/ai-translate" element={<ProtectedRoute><AITranslator /></ProtectedRoute>} />
        <Route path="/ai-resume-score" element={<ProtectedRoute><AIResumeScorer /></ProtectedRoute>} />
        <Route path="/ai-mock-interview" element={<ProtectedRoute><AIMockInterview /></ProtectedRoute>} />
        <Route path="/referrals" element={<ProtectedRoute><ReferralPortal /></ProtectedRoute>} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/notes" element={<AdminRoute><AdminNotes /></AdminRoute>} />
        <Route path="/admin/comments" element={<AdminRoute><AdminComments /></AdminRoute>} />

        {/* Catch-all Wildcard Route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}