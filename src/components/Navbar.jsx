import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X, LogOut, LayoutDashboard, Search, Shield, Sparkles } from 'lucide-react'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  useEffect(() => setOpen(false), [loc])

  const isActive = p => loc.pathname === p
  const out = async () => { await signOut(); nav('/') }

  const NavLink = ({ to, children, icon: Icon }) => (
    <Link to={to} className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group
      ${isActive(to) ? 'text-s-500 bg-s-50' : 'text-k-500 hover:text-k-900 hover:bg-k-100/60'}`}>
      {Icon && <Icon size={14} className="transition-transform duration-200 group-hover:scale-110" />}
      {children}
      {isActive(to) && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-s-500 rounded-full" />}
    </Link>
  )

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-cr/95 backdrop-blur-xl shadow-sm shadow-k-900/5 border-b border-k-100/80' : 'bg-transparent'}`}>
      <div className="wrap">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 bg-s-500 rounded-xl opacity-20 group-hover:opacity-40 transition-opacity blur-md" />
              <div className="relative w-9 h-9 bg-gradient-to-br from-s-400 to-s-600 rounded-xl flex items-center justify-center shadow-lg shadow-s-500/30 group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-display font-bold text-base">B</span>
              </div>
            </div>
            <div className="leading-tight">
              <span className="font-display font-bold text-k-900 text-lg block">BelgaumB2B</span>
              <span className="text-[10px] text-k-400 font-medium">Belgaum's B2B Marketplace</span>
            </div>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {!user ? (
              <>
                <NavLink to="/pricing">Pricing</NavLink>
                <NavLink to="/login">Login</NavLink>
                <Link to="/register" className="btn-primary btn-sm ml-2 text-sm">Join Free →</Link>
              </>
            ) : (
              <>
                <NavLink to="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
                <NavLink to="/directory" icon={Search}>Directory</NavLink>
                {profile?.role === 'admin' && <NavLink to="/admin" icon={Shield}>Admin</NavLink>}
                <div className="flex items-center gap-2 ml-3 pl-3 border-l border-k-200">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-s-400 to-s-600 flex items-center justify-center text-white font-bold text-sm shadow-md cursor-default">
                      {profile?.business_name?.[0] || 'B'}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-e-500 rounded-full border-2 border-cr" />
                  </div>
                  <div className="leading-tight">
                    <p className="text-xs font-bold text-k-900 max-w-[90px] truncate">{profile?.business_name}</p>
                    <span className={profile?.role === 'retailer' ? 'badge-r' : 'badge-w'} style={{fontSize:'9px',padding:'1px 5px'}}>{profile?.role}</span>
                  </div>
                  <button onClick={out} title="Sign out" className="p-1.5 text-k-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                    <LogOut size={14} />
                  </button>
                </div>
              </>
            )}
          </div>

          <button className="md:hidden p-2 rounded-xl text-k-700 hover:bg-k-100/60 transition-colors" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile */}
        {open && (
          <div className="md:hidden pb-4 border-t border-k-100 pt-3 flex flex-col gap-1 animate-in">
            {!user ? (
              <>
                <Link to="/pricing" className="px-4 py-3 text-sm font-medium text-k-700 rounded-xl hover:bg-k-100/60">Pricing</Link>
                <Link to="/login" className="px-4 py-3 text-sm font-medium text-k-700 rounded-xl hover:bg-k-100/60">Login</Link>
                <Link to="/register" className="btn-primary text-center mt-2">Join Free →</Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 p-3 bg-k-50 rounded-2xl mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-s-400 to-s-600 flex items-center justify-center text-white font-bold">
                    {profile?.business_name?.[0]}
                  </div>
                  <div>
                    <p className="font-bold text-k-900 text-sm">{profile?.business_name}</p>
                    <p className="text-xs text-k-400 capitalize">{profile?.role} · {profile?.plan || 'free'} plan</p>
                  </div>
                </div>
                <Link to="/dashboard" className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-k-700 rounded-xl hover:bg-k-100/60"><LayoutDashboard size={15}/>Dashboard</Link>
                <Link to="/directory" className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-k-700 rounded-xl hover:bg-k-100/60"><Search size={15}/>Directory</Link>
                {profile?.role === 'admin' && <Link to="/admin" className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-v-600 rounded-xl hover:bg-v-50"><Shield size={15}/>Admin Panel</Link>}
                <button onClick={out} className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-500 rounded-xl hover:bg-red-50 mt-1"><LogOut size={15}/>Sign Out</button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
