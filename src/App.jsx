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
  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" replace />
  return children
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cr gap-4">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-s-100 animate-spin-slow" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-s-500 animate-spin" />
        <div className="absolute inset-2 bg-gradient-to-br from-s-400 to-s-600 rounded-full flex items-center justify-center">
          <span className="text-white font-display font-bold text-lg">B</span>
        </div>
      </div>
      <p className="text-k-400 text-sm font-medium animate-pulse">Loading BelgaumB2B...</p>
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-cr">
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
