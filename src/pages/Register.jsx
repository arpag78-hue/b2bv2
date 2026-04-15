import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Sparkles, CheckCircle, Store, Users } from 'lucide-react'
import { aiGenerateDescription } from '../hooks/useAI'

const CATS = ['Clothing','Grocery','Hardware','Dairy','Automobile','Pharma','Electronics','Agriculture','Furniture','Construction','Food & Beverages','Plastics','Chemicals','Stationery','Other']

export default function Register() {
  const [params] = useSearchParams()
  const [role, setRole] = useState(params.get('role') || 'retailer')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [aiLoad, setAiLoad] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email:'', password:'', business_name:'', phone:'', category:'', address:'', description:'' })
  const { signUp } = useAuth()
  const nav = useNavigate()

  const set = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const genAI = async () => {
    if (!form.business_name || !form.category) return
    setAiLoad(true)
    const d = await aiGenerateDescription(form.business_name, form.category, role, form.address)
    if (d) setForm(p => ({ ...p, description: d }))
    setAiLoad(false)
  }

  const submit = async e => {
    e.preventDefault(); setError('')
    if (!form.business_name || !form.category || !form.phone) return setError('Please fill all required fields.')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    setLoading(true)
    try {
      await signUp(form.email, form.password, { role, business_name:form.business_name, phone:form.phone, category:form.category, address:form.address, description:form.description||null })
      nav('/dashboard')
    } catch (err) {
      if (err.message?.includes('rate limit')) setError('Email rate limit hit. Go to Supabase → Auth → Settings → disable "Email confirmations" and try again.')
      else if (err.message?.includes('already registered')) setError('Email already registered. Try logging in.')
      else setError(err.message || 'Something went wrong.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      <div className="absolute top-20 right-20 w-72 h-72 bg-s-400/8 rounded-full blur-3xl pointer-events-none" />
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-k-900">Join BelgaumB2B</h1>
          <p className="text-k-400 text-sm mt-2">Free forever · Only Belgaum businesses</p>
        </div>

        {/* Role selector */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { id:'retailer', icon:Store, label:'Retailer', sub:'I sell to customers' },
            { id:'wholesaler', icon:Users, label:'Wholesaler', sub:'I supply to retailers' },
          ].map(r => (
            <button key={r.id} type="button" onClick={() => setRole(r.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 ${role===r.id ? 'border-s-400 bg-s-50 shadow-lg shadow-s-500/15' : 'border-k-200 bg-white hover:border-k-300 hover:-translate-y-0.5'}`}>
              <r.icon size={22} className={role===r.id ? 'text-s-500' : 'text-k-400'} />
              <span className={`text-sm font-bold ${role===r.id ? 'text-s-600' : 'text-k-700'}`}>{r.label}</span>
              <span className="text-xs text-k-400">{r.sub}</span>
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="card p-6 space-y-4 shadow-2xl shadow-k-900/8">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-2xl leading-relaxed">{error}</div>}

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
              <input name="phone" value={form.phone} onChange={set} className="input" placeholder="9XXXXXXXXX" required maxLength={10} />
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
            <label className="label">Area / Address in Belgaum</label>
            <input name="address" value={form.address} onChange={set} className="input" placeholder="e.g. Camp Area, Belgaum" />
          </div>

          {/* AI Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label mb-0">Business Description</label>
              {form.business_name && form.category && (
                <button type="button" onClick={genAI} disabled={aiLoad}
                  className="flex items-center gap-1.5 text-xs font-bold text-v-600 hover:text-v-700 bg-v-50 hover:bg-v-100 px-3 py-1.5 rounded-full border border-v-200 transition-all disabled:opacity-60">
                  <Sparkles size={11} />{aiLoad ? 'Writing...' : 'AI Generate'}
                </button>
              )}
            </div>
            <textarea name="description" value={form.description} onChange={set} className="input resize-none h-20 text-sm"
              placeholder="Describe your business (or click AI Generate above)" />
            {form.description && <p className="text-xs text-e-600 mt-1 flex items-center gap-1"><CheckCircle size={11}/>Description ready</p>}
          </div>

          <div>
            <label className="label">Password *</label>
            <div className="relative">
              <input type={show ? 'text' : 'password'} name="password" value={form.password} onChange={set} className="input pr-10" placeholder="Min 6 characters" required />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-k-300 hover:text-k-600 transition-colors">
                {show ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base mt-2">
            {loading
              ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>Creating account...</>
              : `Create Free ${role==='retailer'?'Retailer':'Wholesaler'} Account →`}
          </button>
        </form>

        <p className="text-center text-sm text-k-500 mt-5">
          Already registered?{' '}<Link to="/login" className="text-s-500 font-bold hover:underline">Log in →</Link>
        </p>
      </div>
    </div>
  )
}
