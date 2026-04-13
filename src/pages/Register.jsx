import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Store, Users, Eye, EyeOff, Sparkles, CheckCircle } from 'lucide-react'
import { generateBusinessDescription } from '../hooks/useAI'

const CATS = ['Clothing','Grocery','Hardware','Dairy','Automobile','Pharma','Electronics','Agriculture','Furniture','Construction','Food & Beverages','Plastics','Chemicals','Stationery','Other']

export default function Register() {
  const [params] = useSearchParams()
  const [role, setRole] = useState(params.get('role') || 'retailer')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [error, setError] = useState('')
  const [aiDesc, setAiDesc] = useState('')
  const [form, setForm] = useState({ email:'', password:'', business_name:'', phone:'', category:'', address:'' })
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const set = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  // AI generate description when name + category filled
  const handleAIDesc = async () => {
    if (!form.business_name || !form.category) return
    setAiLoading(true)
    const desc = await generateBusinessDescription(form.business_name, form.category, role)
    setAiDesc(desc || '')
    setAiLoading(false)
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.business_name || !form.category || !form.phone) return setError('Please fill all required fields.')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    setLoading(true)
    try {
      await signUp(form.email, form.password, {
        role,
        business_name: form.business_name,
        phone: form.phone,
        category: form.category,
        address: form.address,
        description: aiDesc || null,
      })
      navigate('/dashboard')
    } catch (err) {
      if (err.message?.includes('rate limit')) {
        setError('Too many signups. Please wait 1 minute and try again, OR go to Supabase → Auth → Settings → disable "Email confirmations".')
      } else if (err.message?.includes('already registered')) {
        setError('This email is already registered. Try logging in.')
      } else {
        setError(err.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-ink-900">Join BelgaumB2B</h1>
          <p className="text-ink-500 mt-2 text-sm">Free forever · Belgaum businesses only</p>
        </div>

        {/* Role selector */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { id:'retailer', icon:Store, label:'Retailer', sub:'I sell to customers' },
            { id:'wholesaler', icon:Users, label:'Wholesaler', sub:'I supply to retailers' },
          ].map(r => (
            <button key={r.id} onClick={() => setRole(r.id)} type="button"
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${role === r.id ? 'border-saffron-400 bg-saffron-50 shadow-md shadow-saffron-100' : 'border-ink-200 bg-white hover:border-ink-300'}`}>
              <r.icon size={24} className={role === r.id ? 'text-saffron-500' : 'text-ink-400'} />
              <span className={`text-sm font-bold ${role === r.id ? 'text-saffron-600' : 'text-ink-700'}`}>{r.label}</span>
              <span className="text-xs text-ink-400 text-center">{r.sub}</span>
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="card p-6 space-y-4 shadow-xl shadow-ink-900/5">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-2xl border border-red-200 leading-relaxed">
              {error}
            </div>
          )}

          <div>
            <label className="label">Business Name *</label>
            <input name="business_name" value={form.business_name} onChange={set} className="input" placeholder="e.g. Sharma Textiles" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Email *</label>
              <input type="email" name="email" value={form.email} onChange={set} className="input" placeholder="you@email.com" required />
            </div>
            <div>
              <label className="label">Phone *</label>
              <input name="phone" value={form.phone} onChange={set} className="input" placeholder="9XXXXXXXXX" required />
            </div>
          </div>

          <div>
            <label className="label">Category *</label>
            <select name="category" value={form.category} onChange={set} className="input" required>
              <option value="">Select your industry</option>
              {CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="label">Area / Address</label>
            <input name="address" value={form.address} onChange={set} className="input" placeholder="e.g. Camp Area, Belgaum" />
          </div>

          {/* AI Description */}
          {form.business_name && form.category && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label mb-0">AI Business Description</label>
                <button type="button" onClick={handleAIDesc} disabled={aiLoading}
                  className="flex items-center gap-1.5 text-xs font-semibold text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-full transition-all">
                  <Sparkles size={12} />
                  {aiLoading ? 'Generating...' : 'Generate with AI'}
                </button>
              </div>
              <textarea value={aiDesc} onChange={e => setAiDesc(e.target.value)} className="input resize-none h-20 text-xs"
                placeholder="Click 'Generate with AI' or write your own description..." />
              {aiDesc && <p className="text-xs text-violet-500 mt-1 flex items-center gap-1"><CheckCircle size={11} />AI-generated description ready</p>}
            </div>
          )}

          <div>
            <label className="label">Password *</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} name="password" value={form.password} onChange={set} className="input pr-10" placeholder="Min 6 characters" required />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-600 transition-colors">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base mt-2">
            {loading
              ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating account...</>
              : `Create Free ${role === 'retailer' ? 'Retailer' : 'Wholesaler'} Account →`
            }
          </button>
        </form>

        <p className="text-center text-sm text-ink-500 mt-5">
          Already have an account? <Link to="/login" className="text-saffron-500 font-bold hover:underline">Log in →</Link>
        </p>
      </div>
    </div>
  )
}
