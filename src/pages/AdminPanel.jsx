import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Shield, Users, Store, Search, TrendingUp, MessageSquare, RefreshCw, Download } from 'lucide-react'

const TABS = [
  { id:'overview', label:'📊 Overview' },
  { id:'retailer_searches', label:'🛒 Retailer Searches' },
  { id:'wholesaler_searches', label:'🏭 Wholesaler Searches' },
  { id:'enquiries', label:'💬 Enquiries' },
  { id:'businesses', label:'🏢 All Businesses' },
]

export default function AdminPanel() {
  const { profile } = useAuth()
  const [tab, setTab] = useState('overview')
  const [d, setD] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (profile?.role === 'admin') loadAll() }, [profile])

  async function loadAll() {
    setLoading(true)
    const [
      { count: totalR }, { count: totalW }, { count: totalE },
      { data: rSearches }, { data: wSearches },
      { data: enquiries }, { data: businesses },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count:'exact', head:true }).eq('role','retailer'),
      supabase.from('profiles').select('*', { count:'exact', head:true }).eq('role','wholesaler'),
      supabase.from('enquiries').select('*', { count:'exact', head:true }),
      supabase.from('search_logs').select('*, user:user_id(business_name,role,category)').eq('role_searched','wholesaler').order('created_at',{ ascending:false }).limit(200),
      supabase.from('search_logs').select('*, user:user_id(business_name,role,category)').eq('role_searched','retailer').order('created_at',{ ascending:false }).limit(200),
      supabase.from('enquiries').select('*, from:from_id(business_name,role), to:to_id(business_name,role)').order('created_at',{ ascending:false }).limit(200),
      supabase.from('profiles').select('*').order('created_at',{ ascending:false }).limit(500),
    ])
    setD({ totalR, totalW, totalE, rSearches: rSearches||[], wSearches: wSearches||[], enquiries: enquiries||[], businesses: businesses||[] })
    setLoading(false)
  }

  if (profile?.role !== 'admin') return (
    <div className="section max-w-lg py-20 text-center">
      <div className="w-16 h-16 bg-ink-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
        <Shield size={28} className="text-ink-400" />
      </div>
      <h2 className="font-display text-2xl font-bold text-ink-900 mb-2">Admin Access Only</h2>
      <p className="text-ink-400 text-sm">Run this SQL in Supabase to grant yourself admin:</p>
      <code className="block mt-3 text-xs bg-ink-900 text-green-400 p-4 rounded-2xl text-left leading-relaxed">
        update profiles set role = 'admin'<br />
        where id = (select id from auth.users<br />
        where email = 'your@email.com');
      </code>
    </div>
  )

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-saffron-200 border-t-saffron-500 rounded-full animate-spin" />
    </div>
  )

  // Top categories chart data
  const allSearches = [...(d.rSearches||[]), ...(d.wSearches||[])]
  const catCounts = {}
  allSearches.forEach(s => { if(s.category) catCounts[s.category] = (catCounts[s.category]||0)+1 })
  const topCats = Object.entries(catCounts).sort((a,b)=>b[1]-a[1]).slice(0,8)
  const maxCat = topCats[0]?.[1] || 1

  // Plan breakdown
  const planCounts = { free:0, pro:0, premium:0 }
  d.businesses.forEach(b => planCounts[b.plan||'free']++)

  return (
    <div className="section py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-ink-900 rounded-2xl flex items-center justify-center shadow-lg">
            <Shield size={20} className="text-saffron-400" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-ink-900">Admin Panel</h1>
            <p className="text-xs text-ink-400">Real-time platform analytics</p>
          </div>
        </div>
        <button onClick={loadAll} className="flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 bg-white border border-ink-200 px-4 py-2 rounded-xl transition-all hover:border-ink-400">
          <RefreshCw size={14} />Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-7">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t.id ? 'bg-ink-900 text-white shadow-lg' : 'bg-white border border-ink-200 text-ink-600 hover:border-ink-400'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div className="space-y-6">
          {/* KPI cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon:Store, label:'Retailers', value:d.totalR||0, color:'text-blue-500', bg:'bg-blue-50', border:'border-blue-100' },
              { icon:Users, label:'Wholesalers', value:d.totalW||0, color:'text-amber-500', bg:'bg-amber-50', border:'border-amber-100' },
              { icon:Search, label:'Total Searches', value:(d.rSearches.length+d.wSearches.length), color:'text-emerald-500', bg:'bg-emerald-50', border:'border-emerald-100' },
              { icon:MessageSquare, label:'Enquiries', value:d.totalE||0, color:'text-saffron-500', bg:'bg-saffron-50', border:'border-saffron-100' },
            ].map(s => (
              <div key={s.label} className={`card p-5 border ${s.border}`}>
                <div className={`w-10 h-10 ${s.bg} rounded-2xl flex items-center justify-center mb-3`}>
                  <s.icon size={18} className={s.color} />
                </div>
                <p className="text-3xl font-display font-bold text-ink-900">{s.value}</p>
                <p className="text-xs text-ink-400 mt-0.5 font-medium">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Top searched categories */}
            <div className="card p-6">
              <h3 className="font-semibold text-ink-900 mb-5 flex items-center gap-2">
                <TrendingUp size={16} className="text-saffron-400" />Top Searched Categories
              </h3>
              {topCats.length === 0 ? <p className="text-ink-400 text-sm">No searches yet</p> : (
                <div className="space-y-3">
                  {topCats.map(([cat, count]) => (
                    <div key={cat} className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-ink-700 w-28 flex-shrink-0 truncate">{cat}</span>
                      <div className="flex-1 bg-ink-100 rounded-full h-2.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-saffron-400 to-saffron-500 h-2.5 rounded-full transition-all duration-700"
                          style={{ width:`${(count/maxCat)*100}%` }} />
                      </div>
                      <span className="text-xs font-bold text-ink-600 w-8 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Plan breakdown */}
            <div className="card p-6">
              <h3 className="font-semibold text-ink-900 mb-5 flex items-center gap-2">
                <Users size={16} className="text-violet-400" />Plan Breakdown
              </h3>
              <div className="space-y-4">
                {[
                  { plan:'free', label:'Free', count:planCounts.free, color:'bg-ink-300', badge:'badge-free' },
                  { plan:'pro', label:'Pro', count:planCounts.pro, color:'bg-saffron-400', badge:'badge-pro' },
                  { plan:'premium', label:'Premium', count:planCounts.premium, color:'bg-violet-400', badge:'badge-premium' },
                ].map(p => (
                  <div key={p.plan} className="flex items-center gap-3">
                    <span className={`${p.badge} w-20 justify-center`}>{p.label}</span>
                    <div className="flex-1 bg-ink-100 rounded-full h-2.5 overflow-hidden">
                      <div className={`${p.color} h-2.5 rounded-full transition-all duration-700`}
                        style={{ width: d.businesses.length ? `${(p.count/d.businesses.length)*100}%` : '0%' }} />
                    </div>
                    <span className="text-xs font-bold text-ink-600 w-8 text-right">{p.count}</span>
                  </div>
                ))}
                <p className="text-xs text-ink-400 pt-2 border-t border-ink-100">
                  MRR estimate: <strong className="text-ink-700">₹{(planCounts.pro * 499 + planCounts.premium * 999).toLocaleString('en-IN')}/mo</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH LOGS */}
      {(tab === 'retailer_searches' || tab === 'wholesaler_searches') && (
        <SearchTable
          data={tab === 'retailer_searches' ? d.rSearches : d.wSearches}
          title={tab === 'retailer_searches' ? 'Retailers searching for wholesalers' : 'Wholesalers searching for retailers'}
        />
      )}

      {/* ENQUIRIES */}
      {tab === 'enquiries' && (
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-ink-100 flex items-center justify-between">
            <h2 className="font-semibold text-ink-900">All Enquiries</h2>
            <span className="text-xs text-ink-400 font-medium">{d.enquiries.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ink-50 border-b border-ink-100">
                  {['From','To','Message','Date'].map(h => <th key={h} className="px-5 py-3 text-left text-xs font-bold text-ink-500 uppercase tracking-wide">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100/60">
                {d.enquiries.map(e => (
                  <tr key={e.id} className="hover:bg-saffron-50/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-ink-900 text-xs">{e.from?.business_name}</p>
                      <span className={e.from?.role === 'retailer' ? 'badge-retailer' : 'badge-wholesaler'} style={{fontSize:'9px',padding:'1px 6px'}}>{e.from?.role}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-ink-900 text-xs">{e.to?.business_name}</p>
                      <span className={e.to?.role === 'retailer' ? 'badge-retailer' : 'badge-wholesaler'} style={{fontSize:'9px',padding:'1px 6px'}}>{e.to?.role}</span>
                    </td>
                    <td className="px-5 py-3.5 max-w-[200px]"><p className="text-xs text-ink-500 truncate">{e.message}</p></td>
                    <td className="px-5 py-3.5 text-xs text-ink-400 whitespace-nowrap">{new Date(e.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {d.enquiries.length === 0 && <p className="text-center py-12 text-ink-400 text-sm">No enquiries yet</p>}
          </div>
        </div>
      )}

      {/* ALL BUSINESSES */}
      {tab === 'businesses' && (
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-ink-100 flex items-center justify-between">
            <h2 className="font-semibold text-ink-900">All Businesses</h2>
            <span className="text-xs text-ink-400 font-medium">{d.businesses.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ink-50 border-b border-ink-100">
                  {['Business','Role','Category','Plan','Phone','Joined'].map(h => <th key={h} className="px-5 py-3 text-left text-xs font-bold text-ink-500 uppercase tracking-wide">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100/60">
                {d.businesses.map(b => (
                  <tr key={b.id} className="hover:bg-saffron-50/30 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-ink-900 text-sm">{b.business_name}</td>
                    <td className="px-5 py-3.5"><span className={b.role === 'retailer' ? 'badge-retailer' : 'badge-wholesaler'}>{b.role}</span></td>
                    <td className="px-5 py-3.5 text-xs text-ink-600">{b.category}</td>
                    <td className="px-5 py-3.5"><span className={`badge-${b.plan||'free'}`}>{b.plan||'free'}</span></td>
                    <td className="px-5 py-3.5 text-xs text-ink-500">{b.phone}</td>
                    <td className="px-5 py-3.5 text-xs text-ink-400 whitespace-nowrap">{new Date(b.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function SearchTable({ data, title }) {
  return (
    <div className="card overflow-hidden">
      <div className="px-6 py-4 border-b border-ink-100 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-ink-900">{title}</h2>
          <p className="text-xs text-ink-400 mt-0.5">{data?.length} search events logged</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-ink-50 border-b border-ink-100">
              {['Business','Their Category','Search Query','Filter Used','Date & Time'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-bold text-ink-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100/60">
            {data?.map(s => (
              <tr key={s.id} className="hover:bg-saffron-50/30 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-ink-900 text-xs">{s.user?.business_name || '—'}</p>
                  <p className="text-xs text-ink-400 capitalize">{s.user?.role}</p>
                </td>
                <td className="px-5 py-3.5 text-xs text-ink-600">{s.user?.category || '—'}</td>
                <td className="px-5 py-3.5">
                  {s.query
                    ? <span className="bg-saffron-50 text-saffron-700 text-xs px-2.5 py-1 rounded-full font-semibold border border-saffron-200">"{s.query}"</span>
                    : <span className="text-ink-300 text-xs italic">browsing</span>}
                </td>
                <td className="px-5 py-3.5 text-xs text-ink-600 font-medium">{s.category || 'All categories'}</td>
                <td className="px-5 py-3.5 text-xs text-ink-400 whitespace-nowrap">
                  {new Date(s.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short'})} &nbsp;
                  {new Date(s.created_at).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data?.length === 0 && <p className="text-center py-12 text-ink-400 text-sm">No searches logged yet. Start browsing the directory to see data here.</p>}
      </div>
    </div>
  )
}
