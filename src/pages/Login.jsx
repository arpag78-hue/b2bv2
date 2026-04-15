import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, ArrowRight, Mail, Lock, CheckCircle } from 'lucide-react'

export default function Login() {
  const [mode, setMode] = useState('login') // 'login' | 'forgot'
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { signIn, forgotPassword } = useAuth()
  const nav = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try { await signIn(email, pw); nav('/dashboard') }
    catch (err) {
      if (err.message?.includes('Invalid login')) setError('Wrong email or password.')
      else if (err.message?.includes('not confirmed')) setError('Go to Supabase → Auth → Settings → disable "Email confirmations", then retry.')
      else setError(err.message || 'Login failed.')
    } finally { setLoading(false) }
  }

  const handleForgot = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      await forgotPassword(email)
      setSuccess(`Password reset link sent to ${email}. Check your inbox.`)
    } catch (err) { setError(err.message || 'Failed to send reset email.') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {/* Background blob */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-s-400/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-v-500/6 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-s-400 to-s-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-s-500/30 animate-float">
            <span className="text-white font-display font-bold text-2xl">B</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-k-900">
            {mode === 'forgot' ? 'Reset password' : 'Welcome back'}
          </h1>
          <p className="text-k-400 text-sm mt-2">
            {mode === 'forgot' ? 'We\'ll send a reset link to your email' : 'Sign in to your BelgaumB2B account'}
          </p>
        </div>

        <div className="card p-7 shadow-2xl shadow-k-900/8">
          {/* Error/success */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-2xl mb-4 leading-relaxed">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-e-50 border border-e-200 flex items-start gap-2 px-4 py-3 rounded-2xl mb-4">
              <CheckCircle size={16} className="text-e-500 flex-shrink-0 mt-0.5" />
              <p className="text-e-700 text-sm leading-relaxed">{success}</p>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="label">Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-k-300" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input pl-10" placeholder="you@email.com" required autoFocus />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label mb-0">Password</label>
                  <button type="button" onClick={() => { setMode('forgot'); setError(''); setSuccess('') }}
                    className="text-xs font-semibold text-s-500 hover:text-s-600 hover:underline transition-colors">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-k-300" />
                  <input type={show ? 'text' : 'password'} value={pw} onChange={e => setPw(e.target.value)} className="input pl-10 pr-10" placeholder="Your password" required />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-k-300 hover:text-k-600 transition-colors">
                    {show ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base mt-2">
                {loading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>Signing in...</> : <>Log In <ArrowRight size={16}/></>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgot} className="space-y-4">
              <div>
                <label className="label">Your email address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-k-300" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input pl-10" placeholder="you@email.com" required autoFocus />
                </div>
              </div>
              <button type="submit" disabled={loading || !!success} className="btn-primary w-full py-4 text-base">
                {loading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>Sending...</> : 'Send Reset Link'}
              </button>
              <button type="button" onClick={() => { setMode('login'); setError(''); setSuccess('') }}
                className="w-full text-sm text-k-500 hover:text-k-900 transition-colors py-2 font-medium">
                ← Back to login
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-k-500 mt-5">
          New to BelgaumB2B?{' '}
          <Link to="/register" className="text-s-500 font-bold hover:text-s-600 u-link">Join free →</Link>
        </p>
      </div>
    </div>
  )
}
