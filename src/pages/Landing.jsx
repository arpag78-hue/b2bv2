import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Sparkles, Users, Store, TrendingUp, Brain, MessageSquare, Zap, CheckCircle, Star } from 'lucide-react'

const CATS = [
  {e:'👕',n:'Clothing'},{e:'🛒',n:'Grocery'},{e:'🔧',n:'Hardware'},{e:'🥛',n:'Dairy'},
  {e:'🚗',n:'Automobile'},{e:'💊',n:'Pharma'},{e:'💻',n:'Electronics'},{e:'🌾',n:'Agriculture'},
  {e:'🪑',n:'Furniture'},{e:'🏗️',n:'Construction'},{e:'🍱',n:'Food & Bev'},{e:'⚗️',n:'Chemicals'},
]

const TICKER = ['Clothing wholesalers in Belgaum','Grocery retailers near Camp','Hardware dealers','Dairy suppliers','Automobile spare parts','Pharma distributors','Electronics wholesalers','Agriculture suppliers']

const AI_FEATURES = [
  { icon:Brain, title:'Smart Match', desc:'AI finds the 3 best businesses to contact based on your category', color:'from-v-400 to-v-600', glow:'shadow-v-500/30' },
  { icon:MessageSquare, title:'Enquiry Writer', desc:'One-click AI writes a professional first message for you', color:'from-s-400 to-s-600', glow:'shadow-s-500/30' },
  { icon:Sparkles, title:'Profile AI', desc:'AI generates your business description automatically', color:'from-e-400 to-e-600', glow:'shadow-e-500/30' },
  { icon:TrendingUp, title:'Market Insights', desc:'Weekly AI tips specific to your industry in Belgaum', color:'from-blue-400 to-blue-600', glow:'shadow-blue-500/30' },
  { icon:Zap, title:'Search Assist', desc:'AI suggests related search terms as you type', color:'from-amber-400 to-amber-600', glow:'shadow-amber-500/30' },
  { icon:Star, title:'Price Opener', desc:'AI writes the perfect negotiation opener for bulk deals', color:'from-pink-400 to-pink-600', glow:'shadow-pink-500/30' },
]

const STATS = [
  {v:'500+',l:'Businesses'},{v:'12',l:'Industries'},{v:'₹0',l:'To join'},{v:'AI',l:'Powered'},
]

export default function Landing() {
  const [ti, setTi] = useState(0)
  const [vis, setVis] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setTi(i => (i+1) % TICKER.length), 2200)
    setTimeout(() => setVis(true), 100)
    return () => clearInterval(t)
  }, [])

  return (
    <main className="overflow-hidden">
      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center">
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-s-400/10 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/3 -left-20 w-[300px] h-[300px] bg-v-500/6 rounded-full blur-3xl animate-float" style={{animationDelay:'2s'}} />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-amber-400/6 rounded-full blur-3xl animate-float" style={{animationDelay:'4s'}} />
          {/* Grid pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1a1108" strokeWidth="1"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="wrap relative w-full py-20">
          <div className="max-w-3xl">
            {/* Live badge */}
            <div className={`inline-flex items-center gap-2.5 bg-white/80 border border-k-200 rounded-full px-4 py-2 mb-8 shadow-sm transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="pulse-dot" />
              <MapPin size={12} className="text-s-500" />
              <span className="text-sm font-semibold text-k-700">Now live in Belgaum, Karnataka</span>
            </div>

            {/* Headline */}
            <h1 className={`font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-k-900 leading-[1.04] transition-all duration-700 delay-100 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              Connect Every<br />
              <span className="relative inline-block">
                <span className="text-s-500">Belgaum</span>
                <svg className="absolute -bottom-1 left-0 w-full overflow-visible" viewBox="0 0 300 8" fill="none">
                  <path d="M2 6C60 2 120 1 180 4C220 6 260 5 298 2" stroke="#fb923c" strokeWidth="3" strokeLinecap="round" className="animate-in" />
                </svg>
              </span>{' '}
              Business
            </h1>

            <p className={`mt-6 text-lg sm:text-xl text-k-500 max-w-xl leading-relaxed transition-all duration-700 delay-200 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              Belgaum's only AI-powered B2B marketplace. <strong className="text-k-800">Retailers</strong> find the best local wholesalers. <strong className="text-k-800">Wholesalers</strong> grow their retail network — instantly.
            </p>

            {/* Ticker */}
            <div className={`flex items-center gap-2 my-6 transition-all duration-700 delay-300 ${vis ? 'opacity-100' : 'opacity-0'}`}>
              <span className="text-xs text-k-400 font-medium">🔍 People searching:</span>
              <span className="text-xs font-bold text-s-600 bg-s-50 border border-s-200 px-3 py-1.5 rounded-full transition-all duration-500">
                {TICKER[ti]}
              </span>
            </div>

            {/* CTAs */}
            <div className={`flex flex-wrap gap-4 transition-all duration-700 delay-300 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Link to="/register?role=retailer" className="btn-primary text-base px-8 py-4 glow-hover">
                <Store size={18} />I'm a Retailer<ArrowRight size={16} />
              </Link>
              <Link to="/register?role=wholesaler" className="btn-ghost text-base px-8 py-4">
                <Users size={18} />I'm a Wholesaler
              </Link>
            </div>
            <p className="text-xs text-k-300 mt-3">Free forever · No credit card · Belgaum only</p>
          </div>

          {/* Floating stats */}
          <div className="hidden lg:grid absolute right-0 top-1/2 -translate-y-1/2 grid-cols-2 gap-3">
            {STATS.map((s, i) => (
              <div key={s.l} className={`card px-5 py-4 text-center animate-float shadow-lg hover:shadow-xl transition-shadow`} style={{animationDelay:`${i*0.7}s`}}>
                <p className="font-display text-2xl font-bold text-k-900">{s.v}</p>
                <p className="text-xs text-k-400 mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI FEATURES ── */}
      <section className="bg-k-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.15),transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(249,115,22,0.1),transparent_60%)] pointer-events-none" />
        <div className="wrap relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-4">
              <Sparkles size={14} className="text-v-400" />
              <span className="text-sm font-bold text-white/80 uppercase tracking-widest">6 AI-Powered Features</span>
            </div>
            <h2 className="font-display text-4xl font-bold text-white">Your unfair advantage</h2>
            <p className="text-k-200/70 mt-3 max-w-md mx-auto">Features no other B2B platform in Belgaum has</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {AI_FEATURES.map((f, i) => (
              <div key={f.title} className="group p-6 rounded-2xl border border-white/10 hover:border-white/25 hover:bg-white/5 transition-all duration-300 cursor-default">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg ${f.glow} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <f.icon size={20} className="text-white" />
                </div>
                <h3 className="font-bold text-white text-sm mb-1.5">{f.title}</h3>
                <p className="text-xs text-k-300/80 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 bg-white">
        <div className="wrap">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-bold text-k-900">Two sides. One city.</h2>
            <p className="text-k-500 mt-3">Built for Belgaum's unique B2B ecosystem</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { role:'Retailer', icon:Store, accent:'blue', steps:['Register your store for free','Search wholesalers by category','Get AI-matched top suggestions','Send AI-written enquiries in 1 click'] },
              { role:'Wholesaler', icon:TrendingUp, accent:'amber', steps:['List your wholesale business','Browse retailers looking for supply','Receive direct inbound enquiries','Track views with Pro analytics'] },
            ].map(s => (
              <div key={s.role} className={`card p-8 border-l-4 ${s.accent==='blue'?'border-l-blue-400':'border-l-amber-400'} hover:shadow-xl transition-all duration-300 group`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform ${s.accent==='blue'?'bg-blue-50':'bg-amber-50'}`}>
                    <s.icon size={22} className={s.accent==='blue'?'text-blue-500':'text-amber-500'} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-k-900">For {s.role}s</h3>
                </div>
                <div className="space-y-3">
                  {s.steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-3 group/item hover:translate-x-1 transition-transform duration-200">
                      <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${s.accent==='blue'?'bg-blue-100 text-blue-600':'bg-amber-100 text-amber-600'}`}>{i+1}</div>
                      <span className="text-sm text-k-700">{step}</span>
                    </div>
                  ))}
                </div>
                <Link to={`/register?role=${s.role.toLowerCase()}`}
                  className={`mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all hover:-translate-y-0.5 ${s.accent==='blue'?'bg-blue-50 text-blue-700 hover:bg-blue-100':'bg-amber-50 text-amber-700 hover:bg-amber-100'}`}>
                  Start as {s.role} <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-16 bg-cr">
        <div className="wrap">
          <h2 className="font-display text-3xl font-bold text-k-900 text-center mb-10">Every Belgaum industry, one place</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {CATS.map(c => (
              <Link to="/register" key={c.n} className="card group p-4 flex flex-col items-center gap-2 text-center hover:-translate-y-2 hover:shadow-lg hover:border-s-200 transition-all duration-300">
                <span className="text-2xl group-hover:scale-125 transition-transform duration-300 block">{c.e}</span>
                <span className="text-xs font-semibold text-k-600 group-hover:text-s-600 transition-colors">{c.n}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="py-16 bg-white">
        <div className="wrap">
          <h2 className="font-display text-3xl font-bold text-k-900 text-center mb-10">Why BelgaumB2B beats the rest</h2>
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { t:'Hyper-Local', d:'Only Belgaum businesses. No noise from Mumbai or Delhi. Every result is relevant.', e:'📍' },
              { t:'AI-First', d:'6 AI features that IndiaMart doesn\'t have. Smart matching, auto-messages, market insights.', e:'🤖' },
              { t:'Phone-First', d:'Built for mobile. Most businesses in Belgaum run on phones, not desktops.', e:'📱' },
            ].map(w => (
              <div key={w.t} className="card p-6 text-center group hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{w.e}</div>
                <h3 className="font-bold text-k-900 mb-2">{w.t}</h3>
                <p className="text-sm text-k-500 leading-relaxed">{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 wrap">
        <div className="bg-gradient-to-br from-k-900 via-k-800 to-k-900 rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.15),transparent_70%)] pointer-events-none" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6 border border-white/20">
              <CheckCircle size={13} className="text-e-400" />
              <span className="text-sm text-white/80 font-semibold">100% Free to start</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">Start growing in Belgaum today</h2>
            <p className="text-k-200/70 mb-8 max-w-sm mx-auto">Join hundreds of local businesses already connecting through BelgaumB2B.</p>
            <Link to="/register" className="btn-primary text-lg px-10 py-4 animate-glow">
              Join Free — Takes 2 minutes <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-k-100 py-8 bg-white">
        <div className="wrap flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-s-400 to-s-600 rounded-lg flex items-center justify-center shadow">
              <span className="text-white font-bold text-xs">B</span>
            </div>
            <span className="font-display font-bold text-k-900">BelgaumB2B</span>
          </div>
          <p className="text-xs text-k-400">© 2025 BelgaumB2B · Belgaum, Karnataka · Made with ❤️ for local businesses</p>
          <a href="https://wa.me/919611165008" target="_blank" rel="noreferrer" className="text-xs text-e-600 font-semibold hover:underline flex items-center gap-1">
            💬 WhatsApp Support
          </a>
        </div>
      </footer>
    </main>
  )
}
