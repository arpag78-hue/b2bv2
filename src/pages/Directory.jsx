import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { aiSearchSuggest } from '../hooks/useAI'
import { Search, MapPin, Phone, ChevronRight, X, Sparkles } from 'lucide-react'

const CATS = ['All','Clothing','Grocery','Hardware','Dairy','Automobile','Pharma','Electronics','Agriculture','Furniture','Construction','Food & Beverages','Plastics','Chemicals','Stationery','Other']
const ICONS = {Clothing:'👕',Grocery:'🛒',Hardware:'🔧',Dairy:'🥛',Automobile:'🚗',Pharma:'💊',Electronics:'💻',Agriculture:'🌾',Furniture:'🪑',Construction:'🏗️','Food & Beverages':'🍱',Plastics:'♻️',Chemicals:'⚗️',Stationery:'📎',Other:'📦'}

export default function Directory() {
  const { profile } = useAuth()
  const [biz, setBiz] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const [vRole, setVRole] = useState(profile?.role==='retailer'?'wholesaler':'retailer')
  const [aiSugg, setAiSugg] = useState([])
  const [logT, setLogT] = useState(null)
  const [suggT, setSuggT] = useState(null)

  const fetch = useCallback(async (query, category, role) => {
    setLoading(true)
    let req = supabase.from('profiles').select('*').eq('role',role).eq('city','Belgaum').neq('id',profile?.id)
    if (category !== 'All') req = req.eq('category', category)
    if (query) req = req.ilike('business_name', `%${query}%`)
    const { data } = await req.limit(60)
    const sorted = (data||[]).sort((a,b) => {
      const o = {premium:0,pro:1,free:2}
      return (o[a.plan]||2) - (o[b.plan]||2)
    })
    setBiz(sorted); setLoading(false)
  }, [profile?.id])

  useEffect(() => { fetch(q,cat,vRole) }, [vRole,cat])

  const handleQ = val => {
    setQ(val); clearTimeout(logT); clearTimeout(suggT)
    const lt = setTimeout(async () => {
      fetch(val,cat,vRole)
      if (val && profile) await supabase.from('search_logs').insert({ user_id:profile.id, query:val, category:cat==='All'?null:cat, role_searched:vRole })
    }, 500)
    setLogT(lt)
    const st = setTimeout(async () => {
      if (val.length > 2) { const s = await aiSearchSuggest(val, profile?.role); setAiSugg(Array.isArray(s)?s:[]) }
      else setAiSugg([])
    }, 900)
    setSuggT(st)
  }

  const handleCat = async c => {
    setCat(c); setAiSugg([])
    if (profile) await supabase.from('search_logs').insert({ user_id:profile.id, query:q||null, category:c==='All'?null:c, role_searched:vRole })
  }

  return (
    <div className="wrap py-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-k-900">Business Directory</h1>
        <p className="text-k-400 text-sm mt-1">All Belgaum businesses</p>
      </div>

      {/* Role toggle */}
      <div className="flex gap-2 mb-5">
        {['wholesaler','retailer'].map(r => (
          <button key={r} onClick={() => setVRole(r)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 capitalize ${vRole===r?'bg-k-900 text-white shadow-lg':'bg-white border border-k-200 text-k-600 hover:border-k-400 hover:-translate-y-0.5'}`}>
            {r==='wholesaler'?'🏭':'🏪'} {r}s
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-k-300 pointer-events-none"/>
        <input value={q} onChange={e=>handleQ(e.target.value)} className="input pl-11 pr-10 py-4 text-base"
          placeholder={`Search ${vRole}s by name...`}/>
        {q && <button onClick={()=>{setQ('');setAiSugg([]);fetch('',cat,vRole)}} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-k-300 hover:text-k-700 transition-colors"><X size={15}/></button>}
      </div>

      {/* AI suggestions */}
      {aiSugg.length > 0 && (
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <div className="flex items-center gap-1 text-xs text-v-500 font-bold"><Sparkles size={11}/>AI suggests:</div>
          {aiSugg.map(s => (
            <button key={s} onClick={()=>{setQ(s);fetch(s,cat,vRole);setAiSugg([])}}
              className="text-xs bg-v-50 text-v-700 border border-v-200 px-3 py-1 rounded-full hover:bg-v-100 hover:-translate-y-0.5 transition-all font-semibold">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto no-sb pb-2 mb-5">
        {CATS.map(c => (
          <button key={c} onClick={()=>handleCat(c)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${cat===c?'bg-s-500 text-white shadow-md shadow-s-500/30':'bg-white border border-k-200 text-k-600 hover:border-s-400 hover:text-s-600 hover:-translate-y-0.5'}`}>
            {ICONS[c]&&<span>{ICONS[c]}</span>}{c}
          </button>
        ))}
      </div>

      <p className="text-xs text-k-400 mb-4 font-medium">{loading?'Searching...':`${biz.length} ${vRole}${biz.length!==1?'s':''} found`}</p>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_,i)=><div key={i} className="h-44 skel rounded-3xl"/>)}
        </div>
      ) : biz.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <p className="font-display text-xl font-bold text-k-700">No results found</p>
          <p className="text-sm text-k-400 mt-2">Try a different category or clear your search</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {biz.map(b => (
            <Link key={b.id} to={`/profile/${b.id}`}
              className="card group relative p-5 hover:-translate-y-2 hover:shadow-xl hover:shadow-k-900/8 hover:border-k-200 transition-all duration-300">
              {b.plan!=='free' && (
                <div className={`absolute top-3 right-3 ${b.plan==='premium'?'badge-premium':'badge-pro'}`} style={{fontSize:'9px',padding:'2px 7px'}}>
                  {b.plan==='premium'?'⭐ Premium':'✦ Pro'}
                </div>
              )}
              {/* Card header */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-s-50 to-amber-50 rounded-2xl flex items-center justify-center text-2xl border border-s-100/60 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  {ICONS[b.category]||'📦'}
                </div>
                <div className="flex-1 min-w-0 mt-1">
                  <h3 className="font-bold text-k-900 group-hover:text-s-600 transition-colors text-sm leading-tight truncate">{b.business_name}</h3>
                  <p className="text-xs text-k-400 mt-0.5">{b.category}</p>
                </div>
              </div>

              {b.description && <p className="text-xs text-k-500 mb-3 line-clamp-2 leading-relaxed italic">"{b.description}"</p>}

              {/* Contact info */}
              <div className="space-y-1 mb-3">
                {b.address && <div className="flex items-center gap-1.5 text-xs text-k-400"><MapPin size={10} className="flex-shrink-0"/><span className="truncate">{b.address}</span></div>}
                {b.phone && <div className="flex items-center gap-1.5 text-xs text-k-400"><Phone size={10} className="flex-shrink-0"/><span>{b.phone}</span></div>}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-k-100/60">
                <span className={b.role==='retailer'?'badge-r':'badge-w'} style={{fontSize:'9px',padding:'2px 6px'}}>{b.role}</span>
                <div className="flex items-center gap-1 text-xs font-bold text-s-500 group-hover:gap-2 transition-all duration-200">
                  Enquire<ChevronRight size={13}/>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
