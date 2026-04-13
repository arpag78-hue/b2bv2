import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { smartSearchSuggest } from '../hooks/useAI'
import { Search, MapPin, Phone, ChevronRight, X, Sparkles, SlidersHorizontal } from 'lucide-react'

const CATS = ['All','Clothing','Grocery','Hardware','Dairy','Automobile','Pharma','Electronics','Agriculture','Furniture','Construction','Food & Beverages','Plastics','Chemicals','Stationery','Other']
const ICONS = { Clothing:'👕',Grocery:'🛒',Hardware:'🔧',Dairy:'🥛',Automobile:'🚗',Pharma:'💊',Electronics:'💻',Agriculture:'🌾',Furniture:'🪑',Construction:'🏗️','Food & Beverages':'🍱',Plastics:'♻️',Chemicals:'⚗️',Stationery:'📎',Other:'📦' }
const PLAN_ORDER = { premium:0, pro:1, free:2 }

export default function Directory() {
  const { profile } = useAuth()
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [viewRole, setViewRole] = useState(profile?.role === 'retailer' ? 'wholesaler' : 'retailer')
  const [aiSuggestions, setAiSuggestions] = useState([])
  const [logTimer, setLogTimer] = useState(null)
  const [suggestTimer, setSuggestTimer] = useState(null)

  const fetch = useCallback(async (q, cat, role) => {
    setLoading(true)
    let query = supabase.from('profiles').select('*').eq('role', role).eq('city', 'Belgaum').neq('id', profile?.id)
    if (cat !== 'All') query = query.eq('category', cat)
    if (q) query = query.ilike('business_name', `%${q}%`)
    const { data } = await query.limit(50)
    const sorted = (data || []).sort((a, b) => (PLAN_ORDER[a.plan] || 2) - (PLAN_ORDER[b.plan] || 2))
    setBusinesses(sorted)
    setLoading(false)
  }, [profile?.id])

  useEffect(() => { fetch(search, category, viewRole) }, [viewRole, category])

  const handleSearch = (val) => {
    setSearch(val)
    clearTimeout(logTimer); clearTimeout(suggestTimer)
    const lt = setTimeout(async () => {
      fetch(val, category, viewRole)
      if (val && profile) {
        await supabase.from('search_logs').insert({ user_id: profile.id, query: val, category: category === 'All' ? null : category, role_searched: viewRole })
      }
    }, 500)
    setLogTimer(lt)
    // AI suggestions after 800ms
    const st = setTimeout(async () => {
      if (val.length > 2) {
        const suggestions = await smartSearchSuggest(val, profile?.role)
        try { setAiSuggestions(Array.isArray(suggestions) ? suggestions : JSON.parse(suggestions) || []) }
        catch { setAiSuggestions([]) }
      } else { setAiSuggestions([]) }
    }, 800)
    setSuggestTimer(st)
  }

  const handleCat = async (cat) => {
    setCategory(cat); setAiSuggestions([])
    if (profile) await supabase.from('search_logs').insert({ user_id: profile.id, query: search || null, category: cat === 'All' ? null : cat, role_searched: viewRole })
  }

  return (
    <div className="section py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-ink-900">Business Directory</h1>
        <p className="text-ink-500 text-sm mt-1">All verified businesses in Belgaum</p>
      </div>

      {/* Role toggle */}
      <div className="flex gap-2 mb-5">
        {['wholesaler','retailer'].map(r => (
          <button key={r} onClick={() => setViewRole(r)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all capitalize ${viewRole === r ? 'bg-ink-900 text-white shadow-lg' : 'bg-white border border-ink-200 text-ink-600 hover:border-ink-400'}`}>
            {r === 'wholesaler' ? '🏭' : '🏪'} {r}s
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" />
        <input value={search} onChange={e => handleSearch(e.target.value)} className="input pl-10 pr-10 py-4"
          placeholder={`Search ${viewRole}s by business name...`} />
        {search && <button onClick={() => { setSearch(''); setAiSuggestions([]); fetch('', category, viewRole) }} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-700 p-1"><X size={15} /></button>}
      </div>

      {/* AI search suggestions */}
      {aiSuggestions.length > 0 && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <div className="flex items-center gap-1 text-xs text-violet-500 font-semibold">
            <Sparkles size={12} />AI suggests:
          </div>
          {aiSuggestions.map(s => (
            <button key={s} onClick={() => { setSearch(s); fetch(s, category, viewRole); setAiSuggestions([]) }}
              className="text-xs bg-violet-50 text-violet-700 border border-violet-200 px-3 py-1 rounded-full hover:bg-violet-100 transition-colors font-medium">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-5">
        {CATS.map(c => (
          <button key={c} onClick={() => handleCat(c)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${category === c ? 'bg-saffron-500 text-white shadow-md shadow-saffron-500/25' : 'bg-white border border-ink-200 text-ink-600 hover:border-saffron-400 hover:text-saffron-600'}`}>
            {ICONS[c] && <span>{ICONS[c]}</span>}{c}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-xs text-ink-400 mb-4 font-medium">{loading ? 'Searching...' : `${businesses.length} ${viewRole}${businesses.length !== 1 ? 's' : ''} found`}</p>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="card p-5 h-40 shimmer-bg" />)}
        </div>
      ) : businesses.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <p className="font-display text-xl font-bold text-ink-700">No results found</p>
          <p className="text-sm text-ink-400 mt-2">Try a different category or clear the search</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {businesses.map(b => (
            <Link key={b.id} to={`/profile/${b.id}`} className="card-hover p-5 group relative">
              {b.plan !== 'free' && (
                <div className={`absolute top-3 right-3 badge ${b.plan === 'premium' ? 'badge-premium' : 'badge-pro'}`} style={{fontSize:'10px',padding:'2px 8px'}}>
                  {b.plan === 'premium' ? '⭐ Premium' : '✦ Pro'}
                </div>
              )}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-saffron-50 to-amber-50 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 border border-saffron-100">
                  {ICONS[b.category] || '📦'}
                </div>
                <div className="flex-1 min-w-0 mt-0.5">
                  <h3 className="font-bold text-ink-900 group-hover:text-saffron-600 transition-colors text-sm leading-tight truncate">{b.business_name}</h3>
                  <p className="text-xs text-ink-400 mt-0.5">{b.category}</p>
                </div>
              </div>
              {b.address && (
                <div className="flex items-center gap-1.5 text-xs text-ink-400 mb-2">
                  <MapPin size={11} className="flex-shrink-0" /><span className="truncate">{b.address}</span>
                </div>
              )}
              {b.description && <p className="text-xs text-ink-500 mb-3 line-clamp-2 leading-relaxed">{b.description}</p>}
              <div className="flex items-center justify-between pt-2.5 border-t border-ink-100/60">
                <span className={b.role === 'retailer' ? 'badge-retailer' : 'badge-wholesaler'} style={{fontSize:'10px'}}>
                  {b.role}
                </span>
                <div className="flex items-center gap-1 text-saffron-500 text-xs font-semibold group-hover:gap-2 transition-all">
                  Enquire <ChevronRight size={13} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
