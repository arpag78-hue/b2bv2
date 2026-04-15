import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { aiSmartMatch, aiMarketInsight } from '../hooks/useAI'
import { Search, MessageSquare, TrendingUp, Crown, ArrowRight, Sparkles, Brain, Eye, RefreshCw, Phone, MapPin } from 'lucide-react'

const ICONS = {Clothing:'👕',Grocery:'🛒',Hardware:'🔧',Dairy:'🥛',Automobile:'🚗',Pharma:'💊',Electronics:'💻',Agriculture:'🌾',Furniture:'🪑',Construction:'🏗️','Food & Beverages':'🍱',Other:'📦'}

export default function Dashboard() {
  const { profile } = useAuth()
  const [stats, setStats] = useState({ sent:0, received:0 })
  const [recents, setRecents] = useState([])
  const [aiMatches, setAiMatches] = useState([])
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(true)
  const [aiMatchLoad, setAiMatchLoad] = useState(false)
  const [insightLoad, setInsightLoad] = useState(false)

  useEffect(() => { if (profile) load() }, [profile])

  async function load() {
    const targetRole = profile.role === 'retailer' ? 'wholesaler' : 'retailer'
    const [{ count: sent }, { count: received }, { data: enqs }, { data: candidates }] = await Promise.all([
      supabase.from('enquiries').select('*',{count:'exact',head:true}).eq('from_id', profile.id),
      supabase.from('enquiries').select('*',{count:'exact',head:true}).eq('to_id', profile.id),
      supabase.from('enquiries').select('*, from:from_id(business_name,role), to:to_id(business_name,role)').or(`from_id.eq.${profile.id},to_id.eq.${profile.id}`).order('created_at',{ascending:false}).limit(5),
      supabase.from('profiles').select('id,business_name,category,address,role,plan').eq('role', targetRole).eq('city','Belgaum').neq('id', profile.id).limit(20),
    ])
    setStats({ sent: sent||0, received: received||0 })
    setRecents(enqs||[])
    setLoading(false)
    if (candidates?.length) loadAIMatches(candidates)
    loadInsights()
  }

  async function loadAIMatches(candidates) {
    setAiMatchLoad(true)
    const m = await aiSmartMatch(profile, candidates||[])
    setAiMatches(m||[])
    setAiMatchLoad(false)
  }

  async function loadInsights() {
    setInsightLoad(true)
    const tips = await aiMarketInsight(profile.category, profile.role)
    setInsights(tips||[])
    setInsightLoad(false)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-s-200 border-t-s-500 rounded-full animate-spin"/></div>

  const isPro = profile?.plan === 'pro' || profile?.plan === 'premium'
  const hour = new Date().getHours()
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="wrap py-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-k-400 text-sm font-medium">{greet} 👋</p>
          <h1 className="font-display text-3xl font-bold text-k-900 mt-0.5">{profile?.business_name}</h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={profile?.role==='retailer'?'badge-r':'badge-w'}>{profile?.role}</span>
            <span className={`badge-${profile?.plan||'free'}`}>{profile?.plan||'free'} plan</span>
            <span className="text-xs text-k-400">· {profile?.category}</span>
            {profile?.phone && <span className="flex items-center gap-1 text-xs text-k-400"><Phone size={10}/>{profile.phone}</span>}
          </div>
        </div>
        <Link to="/directory" className="btn-primary btn-sm self-start sm:self-auto">
          <Search size={14}/>Browse Directory
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {[
          {icon:MessageSquare,label:'Enquiries Sent',val:stats.sent,bg:'bg-blue-50',ic:'text-blue-500'},
          {icon:TrendingUp,label:'Enquiries Received',val:stats.received,bg:'bg-e-50',ic:'text-e-500'},
          {icon:Eye,label:'Profile Views',val:isPro?'—':'🔒',bg:'bg-s-50',ic:'text-s-500',locked:!isPro},
        ].map(s => (
          <div key={s.label} className="card p-5 flex items-center gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className={`w-10 h-10 ${s.bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
              <s.icon size={18} className={s.ic}/>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-k-900">{s.val}</p>
              <p className="text-xs text-k-400">{s.label}</p>
              {s.locked && <Link to="/pricing" className="text-xs text-s-500 font-bold hover:underline">Upgrade →</Link>}
            </div>
          </div>
        ))}
      </div>

      {/* AI Section */}
      <div className="grid lg:grid-cols-2 gap-5 mb-6">
        {/* AI Smart Match */}
        <div className="card p-5 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-v-400 to-v-600 rounded-xl flex items-center justify-center shadow-md shadow-v-500/30">
                <Brain size={15} className="text-white"/>
              </div>
              <h2 className="font-bold text-k-900 text-sm">AI Smart Match</h2>
              <span className="badge-ai text-[10px] py-0.5">AI #1</span>
            </div>
            <button onClick={() => load()} className="p-1.5 text-k-300 hover:text-v-500 rounded-lg hover:bg-v-50 transition-all">
              <RefreshCw size={13}/>
            </button>
          </div>
          {aiMatchLoad ? (
            <div className="space-y-2">{[1,2,3].map(i=><div key={i} className="h-14 skel"/>)}</div>
          ) : aiMatches.length > 0 ? (
            <div className="space-y-2">
              {aiMatches.map((m,i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-v-50/60 border border-v-100/60 hover:border-v-200 hover:bg-v-50 transition-all group cursor-default">
                  <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-sm border border-v-100 flex-shrink-0">{ICONS[profile.category]||'📦'}</div>
                  <div>
                    <p className="font-bold text-k-900 text-xs">{m.name}</p>
                    <p className="text-xs text-k-500 mt-0.5 leading-relaxed">{m.reason}</p>
                  </div>
                </div>
              ))}
              <Link to="/directory" className="flex items-center gap-1 text-xs text-v-600 font-bold mt-2 hover:underline">Find them in directory <ArrowRight size={11}/></Link>
            </div>
          ) : (
            <div className="text-center py-5">
              <p className="text-k-400 text-xs">Add <code className="bg-k-100 px-1.5 py-0.5 rounded text-k-600">VITE_CLAUDE_KEY</code> in Vercel to enable AI</p>
            </div>
          )}
        </div>

        {/* AI Market Insights */}
        <div className="card p-5 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-s-400 to-s-600 rounded-xl flex items-center justify-center shadow-md shadow-s-500/30">
                <Sparkles size={15} className="text-white"/>
              </div>
              <h2 className="font-bold text-k-900 text-sm">AI Market Insights</h2>
              <span className="badge-ai text-[10px] py-0.5">AI #4</span>
            </div>
            <button onClick={loadInsights} className="p-1.5 text-k-300 hover:text-s-500 rounded-lg hover:bg-s-50 transition-all">
              <RefreshCw size={13} className={insightLoad?'animate-spin':''}/>
            </button>
          </div>
          {insightLoad ? (
            <div className="space-y-2">{[1,2,3].map(i=><div key={i} className="h-14 skel"/>)}</div>
          ) : insights.length > 0 ? (
            <div className="space-y-2">
              {insights.map((tip,i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-s-50/60 border border-s-100/60 hover:border-s-200 transition-all">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5 ${tip.impact==='high'?'bg-s-500':'bg-amber-400'}`}>{i+1}</div>
                  <div>
                    <p className="text-sm text-k-700 leading-relaxed">{tip.tip}</p>
                    {tip.impact && <span className={`text-xs font-bold mt-1 inline-block ${tip.impact==='high'?'text-s-500':'text-amber-500'}`}>{tip.impact} impact</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <p className="text-k-400 text-xs">Add <code className="bg-k-100 px-1.5 py-0.5 rounded text-k-600">VITE_CLAUDE_KEY</code> in Vercel to enable AI</p>
            </div>
          )}
        </div>
      </div>

      {/* Upgrade banner */}
      {!isPro && (
        <div className="bg-gradient-to-r from-k-900 to-k-800 rounded-3xl p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-s-500/10 to-v-500/10 pointer-events-none"/>
          <div className="relative flex items-center gap-3">
            <Crown size={22} className="text-s-400 flex-shrink-0"/>
            <div>
              <p className="font-bold text-white">Upgrade to Pro — ₹499/month</p>
              <p className="text-xs text-k-200/80 mt-0.5">Unlimited enquiries · Profile views · Top search placement</p>
            </div>
          </div>
          <Link to="/pricing" className="relative btn-primary btn-sm flex-shrink-0">Upgrade Now <ArrowRight size={13}/></Link>
        </div>
      )}

      {/* Recent enquiries */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-k-100 flex items-center justify-between">
          <h2 className="font-bold text-k-900">Recent Enquiries</h2>
          <span className="text-xs text-k-400">{recents.length} recent</span>
        </div>
        {recents.length===0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 bg-k-100 rounded-2xl flex items-center justify-center mx-auto mb-3"><MessageSquare size={20} className="text-k-400"/></div>
            <p className="text-k-500 font-medium text-sm">No enquiries yet</p>
            <Link to="/directory" className="text-s-500 text-sm font-bold hover:underline mt-1 inline-block">Browse directory →</Link>
          </div>
        ) : (
          <div className="divide-y divide-k-100/60">
            {recents.map(e => (
              <div key={e.id} className="px-6 py-4 flex items-start gap-3 hover:bg-s-50/20 transition-colors">
                <div className="w-8 h-8 bg-s-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MessageSquare size={14} className="text-s-400"/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-k-900">{e.from_id===profile.id?`→ ${e.to?.business_name}`:`← ${e.from?.business_name}`}</p>
                  <p className="text-xs text-k-400 truncate mt-0.5">{e.message}</p>
                </div>
                <span className="text-xs text-k-300 flex-shrink-0">{new Date(e.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
