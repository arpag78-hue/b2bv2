import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { generateEnquiryMessage } from '../hooks/useAI'
import { MapPin, Phone, Tag, MessageSquare, ArrowLeft, CheckCircle, Lock, Sparkles, Building2, Calendar } from 'lucide-react'

const ICONS = { Clothing:'👕',Grocery:'🛒',Hardware:'🔧',Dairy:'🥛',Automobile:'🚗',Pharma:'💊',Electronics:'💻',Agriculture:'🌾',Furniture:'🪑',Construction:'🏗️','Food & Beverages':'🍱',Other:'📦' }

export default function ProfilePage() {
  const { id } = useParams()
  const { profile: mine } = useAuth()
  const [biz, setBiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [sentCount, setSentCount] = useState(0)
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    async function load() {
      const [{ data }, { count }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', id).single(),
        supabase.from('enquiries').select('*', { count:'exact', head:true }).eq('from_id', mine?.id),
      ])
      setBiz(data); setSentCount(count || 0); setLoading(false)
    }
    load()
  }, [id, mine?.id])

  const canEnquire = mine?.plan !== 'free' || sentCount < 5

  const handleAIMessage = async () => {
    if (!mine || !biz) return
    setAiLoading(true)
    const text = await generateEnquiryMessage(mine, biz)
    if (text) setMsg(text)
    setAiLoading(false)
  }

  const send = async () => {
    if (!msg.trim()) return
    if (!canEnquire) return setError('Free plan: 5 enquiries/month. Upgrade to Pro for unlimited.')
    setSending(true); setError('')
    const { error: err } = await supabase.from('enquiries').insert({ from_id: mine.id, to_id: id, message: msg.trim() })
    if (err) { setError('Failed to send. Try again.'); setSending(false); return }
    setSent(true); setSending(false)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-saffron-200 border-t-saffron-500 rounded-full animate-spin" />
    </div>
  )
  if (!biz) return <div className="text-center py-20 text-ink-400">Business not found</div>

  return (
    <div className="section max-w-2xl py-8">
      <Link to="/directory" className="inline-flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink-900 mb-6 transition-colors font-medium">
        <ArrowLeft size={14} />Back to directory
      </Link>

      {/* Hero card */}
      <div className="card p-7 mb-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-saffron-50 to-amber-50 rounded-t-3xl" />
        <div className="relative">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-md border border-saffron-100 flex-shrink-0 mt-2">
              {ICONS[biz.category] || '📦'}
            </div>
            <div className="flex-1 mt-2">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="font-display text-2xl font-bold text-ink-900">{biz.business_name}</h1>
                {biz.plan !== 'free' && <span className={`badge-${biz.plan}`}>{biz.plan === 'premium' ? '⭐ Premium' : '✦ Pro'}</span>}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={biz.role === 'retailer' ? 'badge-retailer' : 'badge-wholesaler'}>{biz.role}</span>
                <span className="flex items-center gap-1 text-xs text-ink-400"><Tag size={11} />{biz.category}</span>
              </div>
            </div>
          </div>

          {biz.description && (
            <div className="bg-ink-50 rounded-2xl p-4 mb-5 border border-ink-100/60">
              <p className="text-sm text-ink-600 leading-relaxed italic">"{biz.description}"</p>
            </div>
          )}

          <div className="space-y-2.5">
            {biz.phone && (
              <a href={`tel:+91${biz.phone}`} className="flex items-center gap-2.5 text-sm text-ink-600 hover:text-saffron-500 transition-colors group">
                <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center border border-green-100 group-hover:border-green-300 transition-colors">
                  <Phone size={13} className="text-green-500" />
                </div>
                +91 {biz.phone}
              </a>
            )}
            {biz.address && (
              <div className="flex items-center gap-2.5 text-sm text-ink-500">
                <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
                  <MapPin size={13} className="text-blue-500" />
                </div>
                {biz.address}, Belgaum, Karnataka
              </div>
            )}
            <div className="flex items-center gap-2.5 text-xs text-ink-400">
              <div className="w-7 h-7 bg-ink-50 rounded-lg flex items-center justify-center border border-ink-100">
                <Calendar size={11} className="text-ink-400" />
              </div>
              Member since {new Date(biz.created_at).toLocaleDateString('en-IN', { month:'long', year:'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry form */}
      {mine?.id !== id && (
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-9 h-9 bg-saffron-50 rounded-xl flex items-center justify-center border border-saffron-200">
              <MessageSquare size={16} className="text-saffron-500" />
            </div>
            <div>
              <h2 className="font-semibold text-ink-900 text-sm">Send an Enquiry</h2>
              {mine?.plan === 'free' && <p className="text-xs text-ink-400">{Math.max(0, 5 - sentCount)} free enquiries remaining</p>}
            </div>
          </div>

          {sent ? (
            <div className="flex items-start gap-3 text-green-700 bg-green-50 rounded-2xl p-4 border border-green-200">
              <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Enquiry sent!</p>
                <p className="text-xs mt-0.5 text-green-600">{biz.business_name} will receive your message. They may contact you at your registered phone number.</p>
              </div>
            </div>
          ) : !canEnquire ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <Lock size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-800">Free plan limit reached (5/5)</p>
                <p className="text-xs text-amber-700 mt-1">
                  <Link to="/pricing" className="underline font-bold">Upgrade to Pro (₹499/mo)</Link> for unlimited enquiries.
                </p>
              </div>
            </div>
          ) : (
            <>
              {error && <p className="text-red-600 text-sm mb-3 bg-red-50 px-4 py-2 rounded-xl border border-red-200">{error}</p>}

              {/* AI write button */}
              <div className="flex items-center justify-between mb-2">
                <label className="label mb-0 text-xs">Your message</label>
                <button onClick={handleAIMessage} disabled={aiLoading} type="button"
                  className="flex items-center gap-1.5 text-xs font-semibold text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-full transition-all border border-violet-200 disabled:opacity-60">
                  <Sparkles size={11} />
                  {aiLoading ? 'Writing...' : 'Write with AI'}
                </button>
              </div>
              <textarea value={msg} onChange={e => setMsg(e.target.value)} className="input resize-none h-32 text-sm leading-relaxed"
                placeholder={`Hi ${biz.business_name.split(' ')[0]}, I'm interested in connecting about your ${biz.category} business...`} />
              {msg && msg.length > 20 && (
                <p className="text-xs text-ink-400 mt-1.5 flex items-center gap-1">
                  <CheckCircle size={11} className="text-green-500" />Message looks good
                </p>
              )}
              <button onClick={send} disabled={sending || !msg.trim()} className="btn-primary w-full mt-4 flex items-center justify-center gap-2 py-3.5">
                {sending
                  ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Sending...</>
                  : <><MessageSquare size={16} />Send Enquiry to {biz.business_name.split(' ')[0]}</>
                }
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
