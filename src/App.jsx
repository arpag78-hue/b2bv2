import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Directory from './pages/Directory'
import ProfilePage from './pages/ProfilePage'
import AdminPanel from './pages/AdminPanel'
import Pricing from './pages/Pricing'

function Protected({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Loader />
  if (!user) return <Navigate to="/login" replace />
  return children
}

function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-saffron-200 border-t-saffron-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-ink-400 text-sm font-medium">Loading BelgaumB2B...</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        <Route path="/directory" element={<Protected><Directory /></Protected>} />
        <Route path="/profile/:id" element={<Protected><ProfilePage /></Protected>} />
        <Route path="/admin" element={<Protected><AdminPanel /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
