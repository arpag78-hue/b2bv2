import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Sparkles, Users, Store, TrendingUp, CheckCircle, Star, Zap, Brain, MessageSquare } from 'lucide-react'

const CATS = [
  { icon:'👕', name:'Clothing' },{ icon:'🛒', name:'Grocery' },{ icon:'🔧', name:'Hardware' },
  { icon:'🥛', name:'Dairy' },{ icon:'🚗', name:'Automobile' },{ icon:'💊', name:'Pharma' },
  { icon:'💻', name:'Electronics' },{ icon:'🌾', name:'Agriculture' },{ icon:'🪑', name:'Furniture' },
  { icon:'🏗️', name:'Construction' },{ icon:'🍱', name:'Food & Bev' },{ icon:'⚗️', name:'Chemicals' },
]

const TICKER = ['Clothing wholesalers', 'Grocery retailers', 'Hardware dealers', 'Dairy suppliers', 'Auto parts', 'Pharma distributors', 'Electronics stores', 'Furniture shops']

const AI_FEATURES = [
  { icon: Brain, title: 'AI Smart Matching', desc: 'Claude AI finds the best business matches for you based on your category and needs.', color: 'from-violet-400 to-violet-600' },
  { icon: MessageSquare, title: 'AI Enquiry Writer', desc: 'Auto-generate professional first-contact messages with one click.', color: 'from-saffron-400 to-saffron-600' },
  { icon: Sparkles, title: 'AI Business Profile', desc: 'AI writes your business description automatically when you register.', color: 'from-emerald-400 to-emerald-600' },
  { icon: TrendingUp, title: 'AI Market Insights', desc: 'Get weekly AI-powered tips specific to your industry in Belgaum.', color: 'from-blue-400 to-blue-600' },
]

export default function Landing() {
  const [tickerIdx, setTickerIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setTickerIdx(i => (i + 1) % TICKER.length), 2000)
    return () => clearInterval(t)
  }, [])

  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-saffron-400/8 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-violet-500/6 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-400/4 rounded-full blur-3xl" />
        </div>

        <div className="section relative py-20 w-full">
          <div className="max-w-4xl">
            {/* Location badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-ink-200 rounded-full px-4 py-2 mb-8 shadow-sm animate-fade-up">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-slow" />
              <MapPin size={13} className="text-saffron-500" />
              <span className="text-sm font-medium text-ink-700">Now live in Belgaum, Karnataka</span>
            </div>

            {/* Main headline */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-ink-900 leading-[1.05] mb-6 animate-fade-up delay-100">
              Connect Every<br />
              <span className="text-saffron-500">Belgaum</span><br />
              <span className="relative">
                Business
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 9C50 4 100 2 150 5C200 8 250 6 298 3" stroke="#f97316" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-ink-500 max-w-xl leading-relaxed mb-3 animate-fade-up delay-200">
              Belgaum's only B2B marketplace. <strong className="text-ink-700">Retailers</strong> find local wholesalers. <strong className="text-ink-700">Wholesalers</strong> discover retailers — powered by AI.
            </p>

            {/* Live ticker */}
            <div className="flex items-center gap-2 mb-10 animate-fade-up delay-200">
              <span className="text-sm text-ink-400">People searching:</span>
              <span className="text-sm font-semibold text-saffron-600 bg-saffron-50 border border-saffron-200 px-3 py-1 rounded-full transition-all duration-500">
                {TICKER[tickerIdx]}
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 animate-fade-up delay-300">
              <Link to="/register?role=retailer" className="btn-primary flex items-center gap-2 text-base px-7 py-4">
                <Store size={18} />I'm a Retailer<ArrowRight size={16} />
              </Link>
              <Link to="/register?role=wholesaler" className="btn-ghost flex items-center gap-2 text-base px-7 py-4">
                <Users size={18} />I'm a Wholesaler
              </Link>
            </div>
            <p className="text-xs text-ink-300 mt-4 animate-fade-up delay-400">Free forever · No card needed · Only Belgaum businesses</p>
          </div>

          {/* Floating stats card */}
          <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-3">
            {[
              { n: '500+', l: 'Businesses' }, { n: '12', l: 'Categories' }, { n: '₹0', l: 'To join' }
            ].map(s => (
              <div key={s.l} className="card px-5 py-4 text-center animate-float shadow-lg" style={{ animationDelay: `${Math.random() * 2}s` }}>
                <p className="font-display text-2xl font-bold text-ink-900">{s.n}</p>
                <p className="text-xs text-ink-400 mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features strip */}
      <section className="bg-ink-900 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900/20 to-saffron-900/20 pointer-events-none" />
        <div className="section relative">
          <div className="flex items-center gap-2 mb-10 justify-center">
            <Sparkles size={18} className="text-violet-400" />
            <span className="text-violet-300 font-semibold text-sm uppercase tracking-widest">AI-Powered Features</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {AI_FEATURES.map((f, i) => (
              <div key={f.title} className="group p-5 rounded-2xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <f.icon size={18} className="text-white" />
                </div>
                <h3 className="font-semibold text-white text-sm mb-1.5">{f.title}</h3>
                <p className="text-xs text-ink-200/70 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="section">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-bold text-ink-900">Two sides. One platform.</h2>
            <p className="text-ink-500 mt-3 max-w-md mx-auto">Built specifically for Belgaum's unique B2B ecosystem</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { role: 'Retailer', icon: Store, color: 'blue', steps: ['Register your store free', 'Search wholesalers by category', 'Get AI-matched suggestions', 'Send AI-written enquiries'] },
              { role: 'Wholesaler', icon: TrendingUp, color: 'amber', steps: ['List your wholesale business', 'Browse retailers nearby', 'Receive direct enquiries', 'Track who viewed your profile'] },
            ].map(s => (
              <div key={s.role} className={`card p-8 border-t-4 ${s.color === 'blue' ? 'border-t-blue-400' : 'border-t-amber-400'}`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${s.color === 'blue' ? 'bg-blue-50' : 'bg-amber-50'}`}>
                    <s.icon size={22} className={s.color === 'blue' ? 'text-blue-500' : 'text-amber-500'} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-ink-900">For {s.role}s</h3>
                </div>
                <div className="space-y-3">
                  {s.steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${s.color === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>{i + 1}</div>
                      <span className="text-sm text-ink-700">{step}</span>
                    </div>
                  ))}
                </div>
                <Link to={`/register?role=${s.role.toLowerCase()}`} className={`mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all ${s.color === 'blue' ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}`}>
                  Join as {s.role} <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-cream">
        <div className="section">
          <h2 className="font-display text-3xl font-bold text-ink-900 text-center mb-10">Every industry in Belgaum</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {CATS.map(c => (
              <Link to="/register" key={c.name} className="card-hover p-4 flex flex-col items-center gap-2 text-center group">
                <span className="text-2xl group-hover:scale-125 transition-transform duration-200">{c.icon}</span>
                <span className="text-xs font-medium text-ink-600 group-hover:text-saffron-600 transition-colors">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="section">
          <div className="bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-saffron-500/10 to-violet-500/10 pointer-events-none" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
                <Zap size={14} className="text-saffron-400" />
                <span className="text-sm text-white/80">Free to join, forever</span>
              </div>
              <h2 className="font-display text-4xl font-bold text-white mb-4">Ready to grow in Belgaum?</h2>
              <p className="text-ink-100/70 mb-8 max-w-sm mx-auto">Join hundreds of local businesses already connecting and growing through BelgaumB2B.</p>
              <Link to="/register" className="inline-flex items-center gap-2 bg-saffron-500 hover:bg-saffron-400 text-white font-bold px-8 py-4 rounded-2xl transition-all text-lg shadow-2xl shadow-saffron-900/30 hover:-translate-y-0.5">
                Get Started Free <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink-100 py-8 bg-white">
        <div className="section flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-saffron-400 to-saffron-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">B</span>
            </div>
            <span className="font-display font-bold text-ink-900">BelgaumB2B</span>
          </div>
          <p className="text-xs text-ink-400">© 2025 BelgaumB2B · Made with ❤️ for Belgaum business community</p>
          <a href="https://wa.me/919611165008" target="_blank" rel="noreferrer" className="text-xs text-green-600 font-medium hover:underline flex items-center gap-1">
            💬 WhatsApp Support
          </a>
        </div>
      </footer>
    </main>
  )
}
