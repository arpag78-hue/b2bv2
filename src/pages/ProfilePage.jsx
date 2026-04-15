import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { aiWriteEnquiry, aiNegotiationOpener } from '../hooks/useAI'
import { MapPin, Phone, Tag, MessageSquare, ArrowLeft, CheckCircle, Lock, Sparkles, Calendar, DollarSign } from 'lucide-react'

const ICONS = {Clothing:'👕',Grocery:'🛒',Hardware:'🔧',Dairy:'🥛',Automobile:'🚗',Pharma:'💊',Electronics:'💻',Agriculture:'🌾',Furniture:'🪑',Construction:'🏗️','Food & Beverages':'🍱',Other:'📦'}

export default function ProfilePage() {
  const { id } = useParams()
  const { profile: mine } = useAuth()
  const [biz, setBiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const [product, setProduct] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [sentCount, setSentCount] = useState(0)
  const [aiLoad, setAiLoad] = useState(false)
  const [negLoad, setNegLoad] = useState(false)
  const [activeTab, setActiveTab] = useState('enquiry') // 'enquiry' | 'negotiate'

  useEffect(() => {
    async function load() {
      const [{ data }, { count }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', id).single(),
        supabase.from('enquiries').select('*',{count:'exact',head:true}).eq('from_id', mine?.id),
      ])
      setBiz(data); setSentCount(count||0); setLoading(false)
    }
    load()
  }, [id, mine?.id])

  const canEnquire = mine?.plan !== 'free' || sentCount < 5

  const handleAIEnquiry = async () => {
    if (!mine || !biz) return
    setAiLoad(true)
    const text = await aiWriteEnquiry(mine, biz)
    if (text) setMsg(text)
    setAiLoad(false)
  }

  const handleAINegotiate = async () => {
    if (!mine || !biz) return
    setNegLoad(true)
    const text = await aiNegotiationOpener(mine, biz, product)
    if (text) setMsg(text)
    setNegLoad(false)
  }

  const send = async () => {
    if (!msg.trim()) return
    if (!canEnquire) return setError('Free plan: 5 enquiries/month. Upgrade to Pro for unlimited.')
    setSending(true); setError('')
    const { error: err } = await supabase.from('enquiries').insert({ from_id:mine.id, to_id:id, message:msg.trim() })
    if (err) { setError('Failed. Try again.'); setSending(false); return }
    setSent(true); setSending(false)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-s-200 border-t-s-500 rounded-full animate-spin"/></div>
  if (!biz) return <div className="text-center py-20 text-k-400">Business not found</div>

  return (
    <div className="wrap max-w-2xl py-8">
      <Link to="/directory" className="inline-flex items-center gap-1.5 text-sm text-k-400 hover:text-k-900 mb-6 transition-colors font-medium group">
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform"/>Back to directory
      </Link>

      {/* Profile card */}
      <div className="card p-7 mb-5 relative overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-br from-s-50 via-amber-50 to-v-50 rounded-t-3xl pointer-events-none"/>
        <div className="relative">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-lg border border-s-100 flex-shrink-0 mt-2 hover:scale-105 transition-transform">
              {ICONS[biz.category]||'📦'}
            </div>
            <div className="flex-1 mt-2">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="font-display text-2xl font-bold text-k-900">{biz.business_name}</h1>
                {biz.plan!=='free' && <span className={`badge-${biz.plan}`}>{biz.plan==='premium'?'⭐ Premium':'✦ Pro'}</span>}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={biz.role==='retailer'?'badge-r':'badge-w'}>{biz.role}</span>
                <span className="flex items-center gap-1 text-xs text-k-400"><Tag size={10}/>{biz.category}</span>
              </div>
            </div>
          </div>

          {biz.description && (
            <div className="bg-k-50 rounded-2xl p-4 mb-5 border border-k-100">
              <p className="text-sm text-k-600 leading-relaxed italic">"{biz.description}"</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {biz.phone && (
              <a href={`tel:+91${biz.phone}`} className="flex items-center gap-2.5 text-sm text-k-600 hover:text-s-500 transition-colors group p-2.5 rounded-xl hover:bg-s-50">
                <div className="w-7 h-7 bg-e-50 rounded-lg flex items-center justify-center border border-e-200 group-hover:border-e-400 transition-colors flex-shrink-0"><Phone size={13} className="text-e-500"/></div>
                +91 {biz.phone}
              </a>
            )}
            {biz.address && (
              <div className="flex items-center gap-2.5 text-sm text-k-500 p-2.5 rounded-xl">
                <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-200 flex-shrink-0"><MapPin size={13} className="text-blue-500"/></div>
                {biz.address}, Belgaum
              </div>
            )}
          </div>
          <p className="text-xs text-k-300 mt-3 flex items-center gap-1.5">
            <Calendar size={10}/>Member since {new Date(biz.created_at).toLocaleDateString('en-IN',{month:'long',year:'numeric'})}
          </p>
        </div>
      </div>

      {/* Enquiry/Negotiation panel */}
      {mine?.id !== id && (
        <div className="card p-6">
          {/* Tabs */}
          {mine && (
            <div className="flex gap-2 mb-5">
              {[
                {id:'enquiry',icon:MessageSquare,label:'Send Enquiry',ai:'AI #2'},
                {id:'negotiate',icon:DollarSign,label:'Price Negotiation',ai:'AI #6'},
              ].map(t => (
                <button key={t.id} onClick={() => { setActiveTab(t.id); setMsg(''); setSent(false); setError('') }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab===t.id?'bg-k-900 text-white shadow-lg':'bg-k-50 text-k-600 hover:bg-k-100'}`}>
                  <t.icon size={14}/>{t.label}
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${activeTab===t.id?'bg-white/20 text-white':'bg-v-100 text-v-600'}`}>{t.ai}</span>
                </button>
              ))}
            </div>
          )}

          {sent ? (
            <div className="flex items-start gap-3 bg-e-50 border border-e-200 rounded-2xl p-4">
              <CheckCircle size={20} className="text-e-500 flex-shrink-0 mt-0.5"/>
              <div>
                <p className="font-bold text-e-800 text-sm">Sent successfully!</p>
                <p className="text-xs text-e-600 mt-0.5">{biz.business_name} will be notified. They'll contact you at your registered phone.</p>
              </div>
            </div>
          ) : !canEnquire ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <Lock size={16} className="text-amber-600 flex-shrink-0 mt-0.5"/>
              <div>
                <p className="font-bold text-amber-800 text-sm">Free limit reached (5/5)</p>
                <p className="text-xs text-amber-700 mt-0.5"><Link to="/pricing" className="underline font-bold">Upgrade to Pro (₹499/mo)</Link> for unlimited enquiries.</p>
              </div>
            </div>
          ) : (
            <>
              {error && <p className="text-red-600 text-sm mb-3 bg-red-50 px-4 py-2 rounded-xl border border-red-200">{error}</p>}
              {mine?.plan==='free' && <p className="text-xs text-k-400 mb-3">{Math.max(0,5-sentCount)} of 5 free enquiries remaining</p>}

              {/* Negotiate tab extras */}
              {activeTab==='negotiate' && (
                <div className="mb-3">
                  <label className="label">Product / Item (optional)</label>
                  <input value={product} onChange={e=>setProduct(e.target.value)} className="input text-sm" placeholder="e.g. Cotton fabric, 100kg bulk order"/>
                </div>
              )}

              {/* AI write buttons */}
              <div className="flex items-center justify-between mb-2">
                <label className="label mb-0">Message</label>
                <button
                  type="button"
                  onClick={activeTab==='enquiry'?handleAIEnquiry:handleAINegotiate}
                  disabled={aiLoad||negLoad}
                  className="flex items-center gap-1.5 text-xs font-bold text-v-600 hover:text-v-700 bg-v-50 hover:bg-v-100 px-3 py-1.5 rounded-full border border-v-200 transition-all disabled:opacity-60 hover:-translate-y-0.5">
                  <Sparkles size={11}/>
                  {(aiLoad||negLoad)?'Writing...':activeTab==='enquiry'?'AI Write (Feature #2)':'AI Negotiate (Feature #6)'}
                </button>
              </div>
              <textarea value={msg} onChange={e=>setMsg(e.target.value)} className="input resize-none h-32 text-sm leading-relaxed"
                placeholder={activeTab==='enquiry'?`Hi ${biz.business_name.split(' ')[0]}, I'm interested in connecting...`:`Hi ${biz.business_name.split(' ')[0]}, I'd like to discuss bulk pricing...`}/>
              {msg.length>15 && <p className="text-xs text-e-500 mt-1 flex items-center gap-1"><CheckCircle size={11}/>Ready to send</p>}
              <button onClick={send} disabled={sending||!msg.trim()} className="btn-primary w-full mt-4 py-3.5">
                {sending?<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Sending...</>:<><MessageSquare size={15}/>Send to {biz.business_name.split(' ')[0]}</>}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
