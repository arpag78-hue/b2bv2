import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X, LogOut, LayoutDashboard, Search, Shield, Sparkles, ChevronDown } from 'lucide-react'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location])

  const handleSignOut = async () => { await signOut(); navigate('/') }
  const isActive = (p) => location.pathname === p

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-cream/95 backdrop-blur-lg shadow-sm shadow-ink-900/5' : 'bg-transparent'}`}>
      <div className="section">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-saffron-400 to-saffron-600 rounded-xl flex items-center justify-center shadow-lg shadow-saffron-500/30 group-hover:scale-105 transition-transform">
              <span className="text-white font-display font-bold text-base">B</span>
            </div>
            <div>
              <span className="font-display font-bold text-ink-900 text-lg leading-none block">BelgaumB2B</span>
              <span className="text-[10px] text-ink-400 leading-none">Belgaum's B2B Marketplace</span>
            </div>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {!user ? (
              <>
                <Link to="/pricing" className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive('/pricing') ? 'text-saffron-500 bg-saffron-50' : 'text-ink-500 hover:text-ink-900 hover:bg-ink-100/60'}`}>Pricing</Link>
                <Link to="/login" className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive('/login') ? 'text-saffron-500 bg-saffron-50' : 'text-ink-500 hover:text-ink-900 hover:bg-ink-100/60'}`}>Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-5 ml-2">Join Free →</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive('/dashboard') ? 'text-saffron-500 bg-saffron-50' : 'text-ink-500 hover:text-ink-900 hover:bg-ink-100/60'}`}>
                  <LayoutDashboard size={14} />Dashboard
                </Link>
                <Link to="/directory" className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive('/directory') ? 'text-saffron-500 bg-saffron-50' : 'text-ink-500 hover:text-ink-900 hover:bg-ink-100/60'}`}>
                  <Search size={14} />Directory
                </Link>
                {profile?.role === 'admin' && (
                  <Link to="/admin" className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-violet-600 hover:bg-violet-50 transition-all">
                    <Shield size={14} />Admin
                  </Link>
                )}
                {/* User pill */}
                <div className="flex items-center gap-2 ml-2 pl-3 border-l border-ink-200">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                    {profile?.business_name?.[0] || 'B'}
                  </div>
                  <div className="text-left leading-tight">
                    <p className="text-xs font-semibold text-ink-900 max-w-[100px] truncate">{profile?.business_name}</p>
                    <div className="flex items-center gap-1">
                      <span className={profile?.role === 'retailer' ? 'badge-retailer' : 'badge-wholesaler'} style={{fontSize:'9px',padding:'1px 6px'}}>{profile?.role}</span>
                    </div>
                  </div>
                  <button onClick={handleSignOut} className="p-1.5 text-ink-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50" title="Sign out">
                    <LogOut size={14} />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 text-ink-700 rounded-xl hover:bg-ink-100/60 transition-colors" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 border-t border-ink-100 mt-1 pt-4 flex flex-col gap-1 animate-fade-in">
            {!user ? (
              <>
                <Link to="/pricing" className="px-4 py-3 rounded-xl text-sm font-medium text-ink-700 hover:bg-ink-100/60">Pricing</Link>
                <Link to="/login" className="px-4 py-3 rounded-xl text-sm font-medium text-ink-700 hover:bg-ink-100/60">Login</Link>
                <Link to="/register" className="btn-primary text-center mt-2">Join Free →</Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-ink-100/40 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center text-white font-bold">
                    {profile?.business_name?.[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-ink-900 text-sm">{profile?.business_name}</p>
                    <p className="text-xs text-ink-400 capitalize">{profile?.role} · {profile?.plan} plan</p>
                  </div>
                </div>
                <Link to="/dashboard" className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-ink-700 hover:bg-ink-100/60"><LayoutDashboard size={16} />Dashboard</Link>
                <Link to="/directory" className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-ink-700 hover:bg-ink-100/60"><Search size={16} />Directory</Link>
                {profile?.role === 'admin' && <Link to="/admin" className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-violet-600"><Shield size={16} />Admin Panel</Link>}
                <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-500 mt-2"><LogOut size={16} />Sign Out</button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
