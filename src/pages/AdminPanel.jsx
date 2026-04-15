import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Shield, Users, Store, Search, TrendingUp, MessageSquare, RefreshCw, Phone } from 'lucide-react'

const TABS = [
  {id:'overview',label:'📊 Overview'},
  {id:'r_search',label:'🛒 Retailer Searches'},
  {id:'w_search',label:'🏭 Wholesaler Searches'},
  {id:'enquiries',label:'💬 Enquiries'},
  {id:'businesses',label:'🏢 All Businesses'},
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
      {count:tR},{count:tW},{count:tE},
      {data:rS},{data:wS},{data:enqs},{data:bizs},
    ] = await Promise.all([
      supabase.from('profiles').select('*',{count:'exact',head:true}).eq('role','retailer'),
      supabase.from('profiles').select('*',{count:'exact',head:true}).eq('role','wholesaler'),
      supabase.from('enquiries').select('*',{count:'exact',head:true}),
      supabase.from('search_logs').select('*, u:user_id(business_name,role,category,phone)').eq('role_searched','wholesaler').order('created_at',{ascending:false}).limit(300),
      supabase.from('search_logs').select('*, u:user_id(business_name,role,category,phone)').eq('role_searched','retailer').order('created_at',{ascending:false}).limit(300),
      supabase.from('enquiries').select('*, f:from_id(business_name,role,phone), t:to_id(business_name,role,phone)').order('created_at',{ascending:false}).limit(300),
      supabase.from('profiles').select('*').order('created_at',{ascending:false}).limit(500),
    ])
    setD({tR,tW,tE,rS:rS||[],wS:wS||[],enqs:enqs||[],bizs:bizs||[]})
    setLoading(false)
  }

  if (profile?.role !== 'admin') return (
    <div className="wrap max-w-lg py-20 text-center">
      <div className="w-16 h-16 bg-k-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
        <Shield size={28} className="text-k-400"/>
      </div>
      <h2 className="font-display text-2xl font-bold text-k-900 mb-3">Admin Access Only</h2>
      <p className="text-k-500 text-sm mb-4">Run this in Supabase SQL Editor to grant access:</p>
      <pre className="text-left text-xs bg-k-900 text-green-400 p-5 rounded-2xl leading-relaxed overflow-x-auto">
{`update profiles set role = 'admin'
where id = (
  select id from auth.users
  where email = 'your@email.com'
);`}
      </pre>
    </div>
  )

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-s-200 border-t-s-500 rounded-full animate-spin"/></div>

  // derived stats
  const allSearches = [...d.rS, ...d.wS]
  const catMap = {}
  allSearches.forEach(s => { if(s.category) catMap[s.category] = (catMap[s.category]||0)+1 })
  const topCats = Object.entries(catMap).sort((a,b)=>b[1]-a[1]).slice(0,8)
  const maxCat = topCats[0]?.[1]||1
  const planMap = {free:0,pro:0,premium:0}
  d.bizs.forEach(b => planMap[b.plan||'free']++)
  const mrr = (planMap.pro*499) + (planMap.premium*999)

  return (
    <div className="wrap py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-k-900 rounded-2xl flex items-center justify-center shadow-lg">
            <Shield size={20} className="text-s-400"/>
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-k-900">Admin Panel</h1>
            <p className="text-xs text-k-400">Real-time platform intelligence</p>
          </div>
        </div>
        <button onClick={loadAll} className="flex items-center gap-2 text-sm text-k-500 hover:text-k-900 bg-white border border-k-200 px-4 py-2 rounded-xl transition-all hover:border-k-400 hover:-translate-y-0.5">
          <RefreshCw size={14}/>Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto no-sb pb-2 mb-7">
        {TABS.map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)}
            className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${tab===t.id?'bg-k-900 text-white shadow-lg':'bg-white border border-k-200 text-k-600 hover:border-k-400 hover:-translate-y-0.5'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab==='overview' && (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {icon:Store,label:'Retailers',val:d.tR||0,bg:'bg-blue-50',ic:'text-blue-500',border:'border-blue-100'},
              {icon:Users,label:'Wholesalers',val:d.tW||0,bg:'bg-amber-50',ic:'text-amber-500',border:'border-amber-100'},
              {icon:Search,label:'Total Searches',val:allSearches.length,bg:'bg-e-50',ic:'text-e-500',border:'border-e-100'},
              {icon:MessageSquare,label:'Enquiries',val:d.tE||0,bg:'bg-s-50',ic:'text-s-500',border:'border-s-100'},
            ].map(s => (
              <div key={s.label} className={`card p-5 border ${s.border} hover:-translate-y-1 hover:shadow-lg transition-all duration-200`}>
                <div className={`w-10 h-10 ${s.bg} rounded-2xl flex items-center justify-center mb-3`}>
                  <s.icon size={18} className={s.ic}/>
                </div>
                <p className="text-3xl font-display font-bold text-k-900">{s.val}</p>
                <p className="text-xs text-k-400 mt-0.5 font-medium">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Top categories bar chart */}
            <div className="card p-6 hover:shadow-md transition-all">
              <h3 className="font-bold text-k-900 mb-5 flex items-center gap-2">
                <TrendingUp size={16} className="text-s-400"/>Top Searched Categories
              </h3>
              {topCats.length===0 ? <p className="text-k-400 text-sm">No searches yet</p> : (
                <div className="space-y-3">
                  {topCats.map(([cat,count]) => (
                    <div key={cat} className="flex items-center gap-3 group">
                      <span className="text-xs font-bold text-k-700 w-28 flex-shrink-0 truncate">{cat}</span>
                      <div className="flex-1 bg-k-100 rounded-full h-2.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-s-400 to-s-500 h-2.5 rounded-full transition-all duration-700 group-hover:from-s-500 group-hover:to-s-600"
                          style={{width:`${(count/maxCat)*100}%`}}/>
                      </div>
                      <span className="text-xs font-bold text-k-600 w-7 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Plan breakdown + MRR */}
            <div className="card p-6 hover:shadow-md transition-all">
              <h3 className="font-bold text-k-900 mb-5 flex items-center gap-2">
                <Users size={16} className="text-v-400"/>Revenue Overview
              </h3>
              <div className="space-y-3 mb-5">
                {[
                  {plan:'free',label:'Free',count:planMap.free,color:'bg-k-300'},
                  {plan:'pro',label:'Pro (₹499)',count:planMap.pro,color:'bg-s-400'},
                  {plan:'premium',label:'Premium (₹999)',count:planMap.premium,color:'bg-v-400'},
                ].map(p => (
                  <div key={p.plan} className="flex items-center gap-3">
                    <span className={`badge-${p.plan} w-24 justify-center text-[10px]`}>{p.label}</span>
                    <div className="flex-1 bg-k-100 rounded-full h-2.5 overflow-hidden">
                      <div className={`${p.color} h-2.5 rounded-full transition-all duration-700`}
                        style={{width:d.bizs.length?`${(p.count/d.bizs.length)*100}%`:'0%'}}/>
                    </div>
                    <span className="text-xs font-bold text-k-600 w-6 text-right">{p.count}</span>
                  </div>
                ))}
              </div>
              <div className="bg-k-50 rounded-2xl p-4 border border-k-100">
                <p className="text-xs text-k-500 mb-1">Estimated Monthly Revenue</p>
                <p className="font-display text-2xl font-bold text-k-900">₹{mrr.toLocaleString('en-IN')}<span className="text-sm font-normal text-k-400">/mo</span></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH LOGS */}
      {(tab==='r_search'||tab==='w_search') && (
        <SearchTable
          data={tab==='r_search'?d.rS:d.wS}
          title={tab==='r_search'?'Retailers searching for wholesalers':'Wholesalers searching for retailers'}
        />
      )}

      {/* ENQUIRIES */}
      {tab==='enquiries' && (
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-k-100 flex items-center justify-between">
            <h2 className="font-bold text-k-900">All Enquiries</h2>
            <span className="badge-free">{d.enqs.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-k-50 border-b border-k-100 text-left">
                  {['From','Phone','To','Phone','Message','Date'].map(h=>(
                    <th key={h} className="px-5 py-3 text-xs font-bold text-k-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-k-100/60">
                {d.enqs.map(e => (
                  <tr key={e.id} className="hover:bg-s-50/20 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-k-900 text-xs">{e.f?.business_name}</p>
                      <span className={e.f?.role==='retailer'?'badge-r':'badge-w'} style={{fontSize:'9px',padding:'1px 5px'}}>{e.f?.role}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 text-xs text-k-500">
                        <Phone size={10}/>{e.f?.phone||'—'}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-k-900 text-xs">{e.t?.business_name}</p>
                      <span className={e.t?.role==='retailer'?'badge-r':'badge-w'} style={{fontSize:'9px',padding:'1px 5px'}}>{e.t?.role}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 text-xs text-k-500">
                        <Phone size={10}/>{e.t?.phone||'—'}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 max-w-[180px]"><p className="text-xs text-k-500 truncate">{e.message}</p></td>
                    <td className="px-5 py-3.5 text-xs text-k-400 whitespace-nowrap">{new Date(e.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {d.enqs.length===0&&<p className="text-center py-12 text-k-400 text-sm">No enquiries yet</p>}
          </div>
        </div>
      )}

      {/* ALL BUSINESSES */}
      {tab==='businesses' && (
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-k-100 flex items-center justify-between">
            <h2 className="font-bold text-k-900">All Businesses</h2>
            <span className="badge-free">{d.bizs.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-k-50 border-b border-k-100 text-left">
                  {['Business','Role','Category','Phone','Area','Plan','Joined'].map(h=>(
                    <th key={h} className="px-5 py-3 text-xs font-bold text-k-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-k-100/60">
                {d.bizs.map(b => (
                  <tr key={b.id} className="hover:bg-s-50/20 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-k-900 text-sm">{b.business_name}</td>
                    <td className="px-5 py-3.5"><span className={b.role==='retailer'?'badge-r':'badge-w'}>{b.role}</span></td>
                    <td className="px-5 py-3.5 text-xs text-k-600">{b.category}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 text-xs text-k-600 font-medium">
                        <Phone size={10}/>{b.phone||'—'}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-k-500 max-w-[120px] truncate">{b.address||'—'}</td>
                    <td className="px-5 py-3.5"><span className={`badge-${b.plan||'free'}`}>{b.plan||'free'}</span></td>
                    <td className="px-5 py-3.5 text-xs text-k-400 whitespace-nowrap">{new Date(b.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</td>
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
      <div className="px-6 py-4 border-b border-k-100">
        <h2 className="font-bold text-k-900">{title}</h2>
        <p className="text-xs text-k-400 mt-0.5">{data?.length} search events</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-k-50 border-b border-k-100 text-left">
              {['Business','Phone','Category','Search Query','Filter','Date'].map(h=>(
                <th key={h} className="px-5 py-3 text-xs font-bold text-k-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-k-100/60">
            {data?.map(s => (
              <tr key={s.id} className="hover:bg-s-50/20 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="font-bold text-k-900 text-xs">{s.u?.business_name||'—'}</p>
                  <p className="text-xs text-k-400 capitalize">{s.u?.role}</p>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1 text-xs text-k-600">
                    <Phone size={10}/>{s.u?.phone||'—'}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-xs text-k-500">{s.u?.category||'—'}</td>
                <td className="px-5 py-3.5">
                  {s.query
                    ? <span className="bg-s-50 text-s-700 text-xs px-2.5 py-1 rounded-full font-bold border border-s-200">"{s.query}"</span>
                    : <span className="text-k-300 text-xs italic">browsing</span>}
                </td>
                <td className="px-5 py-3.5 text-xs text-k-500 font-medium">{s.category||'All'}</td>
                <td className="px-5 py-3.5 text-xs text-k-400 whitespace-nowrap">
                  {new Date(s.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}{' '}
                  {new Date(s.created_at).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data?.length===0&&<p className="text-center py-12 text-k-400 text-sm">No searches logged yet. Browse the directory to generate data.</p>}
      </div>
    </div>
  )
}
