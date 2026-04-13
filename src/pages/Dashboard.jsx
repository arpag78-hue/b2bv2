import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { getSmartMatches, getMarketInsight } from '../hooks/useAI'
import { Search, MessageSquare, TrendingUp, Crown, ArrowRight, Sparkles, Brain, Eye, Users, RefreshCw } from 'lucide-react'

const CAT_ICONS = { Clothing:'👕',Grocery:'🛒',Hardware:'🔧',Dairy:'🥛',Automobile:'🚗',Pharma:'💊',Electronics:'💻',Agriculture:'🌾',Furniture:'🪑',Construction:'🏗️','Food & Beverages':'🍱',Other:'📦' }

export default function Dashboard() {
  const { profile } = useAuth()
  const [stats, setStats] = useState({ sent:0, received:0 })
  const [recents, setRecents] = useState([])
  const [aiMatches, setAiMatches] = useState([])
  const [aiInsight, setAiInsight] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [insightLoading, setInsightLoading] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (profile) load() }, [profile])

  async function load() {
    const targetRole = profile.role === 'retailer' ? 'wholesaler' : 'retailer'
    const [{ count: sent }, { count: received }, { data: enqs }, { data: suggestions }] = await Promise.all([
      supabase.from('enquiries').select('*', { count:'exact', head:true }).eq('from_id', profile.id),
      supabase.from('enquiries').select('*', { count:'exact', head:true }).eq('to_id', profile.id),
      supabase.from('enquiries').select('*, from:from_id(business_name,role), to:to_id(business_name,role)').or(`from_id.eq.${profile.id},to_id.eq.${profile.id}`).order('created_at', { ascending:false }).limit(5),
      supabase.from('profiles').select('*').eq('role', targetRole).eq('category', profile.category).neq('id', profile.id).limit(20),
    ])
    setStats({ sent: sent || 0, received: received || 0 })
    setRecents(enqs || [])
    // AI matches
    if (suggestions?.length) {
      setAiLoading(true)
      const matches = await getSmartMatches(profile, suggestions)
      setAiMatches(matches || [])
      setAiLoading(false)
    }
    setLoading(false)
    // AI insight
    loadInsight()
  }

  async function loadInsight() {
    setInsightLoading(true)
    const insight = await getMarketInsight(profile.category, profile.role)
    setAiInsight(insight || '')
    setInsightLoading(false)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-saffron-200 border-t-saffron-500 rounded-full animate-spin" />
    </div>
  )

  const isPro = profile?.plan === 'pro' || profile?.plan === 'premium'
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="section py-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-ink-400 text-sm font-medium">{greeting} 👋</p>
          <h1 className="font-display text-3xl font-bold text-ink-900 mt-0.5">{profile?.business_name}</h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={profile?.role === 'retailer' ? 'badge-retailer' : 'badge-wholesaler'}>{profile?.role}</span>
            <span className={`badge-${profile?.plan || 'free'}`}>{profile?.plan || 'free'} plan</span>
            <span className="text-xs text-ink-300">{profile?.category} · {profile?.address || 'Belgaum'}</span>
          </div>
        </div>
        <Link to="/directory" className="btn-primary flex items-center gap-2 self-start text-sm">
          <Search size={15} />Browse Directory
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {[
          { icon:MessageSquare, label:'Sent', value:stats.sent, color:'text-blue-500', bg:'bg-blue-50' },
          { icon:TrendingUp, label:'Received', value:stats.received, color:'text-emerald-500', bg:'bg-emerald-50' },
          { icon:Eye, label:'Profile Views', value:isPro ? '—' : '🔒', color:'text-saffron-500', bg:'bg-saffron-50', locked:!isPro },
        ].map(s => (
          <div key={s.label} className="card p-5 flex items-center gap-3">
            <div className={`w-10 h-10 ${s.bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
              <s.icon size={18} className={s.color} />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-ink-900">{s.value}</p>
              <p className="text-xs text-ink-400">{s.label}</p>
              {s.locked && <Link to="/pricing" className="text-xs text-saffron-500 font-semibold">Upgrade</Link>}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* AI Smart Matches */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-violet-600 rounded-xl flex items-center justify-center">
              <Brain size={14} className="text-white" />
            </div>
            <h2 className="font-semibold text-ink-900">AI Smart Matches</h2>
            <span className="text-xs bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full font-medium border border-violet-100">AI</span>
          </div>
          {aiLoading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-14 shimmer-bg rounded-2xl" />)}
            </div>
          ) : aiMatches.length > 0 ? (
            <div className="space-y-3">
              {aiMatches.map((m, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-violet-50/50 border border-violet-100/60">
                  <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-sm border border-violet-100 flex-shrink-0">
                    {CAT_ICONS[profile.category] || '📦'}
                  </div>
                  <div>
                    <p className="font-semibold text-ink-900 text-sm">{m.name}</p>
                    <p className="text-xs text-ink-500 mt-0.5 leading-relaxed">{m.reason}</p>
                  </div>
                </div>
              ))}
              <Link to="/directory" className="flex items-center gap-1 text-xs text-violet-600 font-semibold mt-1 hover:underline">
                See all in directory <ArrowRight size={11} />
              </Link>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-ink-400 text-sm">Add your Claude API key to enable AI matching</p>
              <p className="text-xs text-ink-300 mt-1">Set VITE_CLAUDE_KEY in Vercel env vars</p>
            </div>
          )}
        </div>

        {/* AI Market Insight */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-saffron-400 to-saffron-600 rounded-xl flex items-center justify-center">
                <Sparkles size={14} className="text-white" />
              </div>
              <h2 className="font-semibold text-ink-900">AI Market Tips</h2>
              <span className="text-xs bg-saffron-50 text-saffron-600 px-2 py-0.5 rounded-full font-medium border border-saffron-200">AI</span>
            </div>
            <button onClick={loadInsight} disabled={insightLoading} className="p-1.5 text-ink-300 hover:text-saffron-500 transition-colors rounded-lg hover:bg-saffron-50">
              <RefreshCw size={14} className={insightLoading ? 'animate-spin' : ''} />
            </button>
          </div>
          {insightLoading ? (
            <div className="space-y-3">
              <div className="h-16 shimmer-bg rounded-2xl" />
              <div className="h-16 shimmer-bg rounded-2xl" />
            </div>
          ) : aiInsight ? (
            <div className="space-y-3">
              {aiInsight.split('\n').filter(l => l.trim()).map((line, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-saffron-50/60 border border-saffron-100/60">
                  <div className="w-5 h-5 bg-saffron-400 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">{i+1}</div>
                  <p className="text-sm text-ink-700 leading-relaxed">{line.replace(/^[0-9]+\.\s*/, '')}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-ink-400 text-sm">Add your Claude API key for AI market tips</p>
              <p className="text-xs text-ink-300 mt-1">Set VITE_CLAUDE_KEY in Vercel env vars</p>
            </div>
          )}
        </div>
      </div>

      {/* Upgrade banner */}
      {!isPro && (
        <div className="bg-gradient-to-r from-ink-900 to-ink-800 rounded-3xl p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-saffron-500/10 to-violet-500/10 pointer-events-none" />
          <div className="relative flex items-center gap-3">
            <Crown size={22} className="text-saffron-400 flex-shrink-0" />
            <div>
              <p className="font-bold text-white">Upgrade to Pro — ₹499/month</p>
              <p className="text-xs text-ink-200/80 mt-0.5">Unlimited enquiries · Profile views · Top search placement</p>
            </div>
          </div>
          <Link to="/pricing" className="relative btn-primary text-sm py-2 flex-shrink-0 flex items-center gap-2">
            Upgrade Now <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Recent enquiries */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-ink-100 flex items-center justify-between">
          <h2 className="font-semibold text-ink-900">Recent Enquiries</h2>
          <span className="text-xs text-ink-300">{recents.length} shown</span>
        </div>
        {recents.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 bg-ink-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <MessageSquare size={20} className="text-ink-400" />
            </div>
            <p className="text-ink-500 font-medium text-sm">No enquiries yet</p>
            <Link to="/directory" className="text-saffron-500 text-sm font-semibold hover:underline mt-1 inline-block">Browse directory →</Link>
          </div>
        ) : (
          <div className="divide-y divide-ink-100/60">
            {recents.map(e => (
              <div key={e.id} className="px-6 py-4 flex items-start gap-3 hover:bg-saffron-50/30 transition-colors">
                <div className="w-8 h-8 bg-saffron-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MessageSquare size={14} className="text-saffron-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink-900">
                    {e.from_id === profile.id ? `→ ${e.to?.business_name}` : `← ${e.from?.business_name}`}
                  </p>
                  <p className="text-xs text-ink-400 mt-0.5 truncate">{e.message}</p>
                </div>
                <span className="text-xs text-ink-300 flex-shrink-0">{new Date(e.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
