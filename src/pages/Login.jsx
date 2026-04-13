import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/dashboard')
    } catch (err) {
      if (err.message?.includes('Invalid login')) setError('Wrong email or password. Please try again.')
      else if (err.message?.includes('Email not confirmed')) setError('Please go to Supabase → Auth → Settings → disable "Email confirmations", then try again.')
      else setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-saffron-400 to-saffron-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-saffron-500/30">
            <span className="text-white font-display font-bold text-2xl">B</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-ink-900">Welcome back</h1>
          <p className="text-ink-500 mt-2 text-sm">Log in to your BelgaumB2B account</p>
        </div>

        <form onSubmit={submit} className="card p-7 space-y-4 shadow-xl shadow-ink-900/5">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-2xl border border-red-200 leading-relaxed">
              {error}
            </div>
          )}
          <div>
            <label className="label">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="you@email.com" required autoFocus />
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="input pr-10" placeholder="Your password" required />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-600 transition-colors">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base mt-2">
            {loading
              ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Logging in...</>
              : <>Log In <ArrowRight size={16} /></>
            }
          </button>
        </form>

        <p className="text-center text-sm text-ink-500 mt-5">
          New to BelgaumB2B? <Link to="/register" className="text-saffron-500 font-bold hover:underline">Join free →</Link>
        </p>
      </div>
    </div>
  )
}
