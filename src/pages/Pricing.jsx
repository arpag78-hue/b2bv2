import { Link } from 'react-router-dom'
import { CheckCircle, Crown, Zap, Star, ArrowRight, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const PLANS = [
  { id:'free', name:'Free', price:'₹0', period:'forever', icon:Zap, grad:'from-k-400 to-k-600',
    features:['Business profile listing','5 enquiries/month','Search full directory','Basic category listing'],
    cta:'Get Started', link:'/register', style:'border-2 border-k-200 text-k-700 hover:border-k-400 hover:bg-k-50' },
  { id:'pro', name:'Pro', price:'₹499', period:'/month', icon:Crown, grad:'from-s-400 to-s-600', badge:'Most Popular',
    features:['Everything in Free','Unlimited enquiries','Top search placement','See who viewed you','Pro badge on listing','All 6 AI features','WhatsApp alerts'],
    cta:'Upgrade to Pro', link:'/register', style:'btn-primary' },
  { id:'premium', name:'Premium', price:'₹999', period:'/month', icon:Star, grad:'from-v-400 to-v-600',
    features:['Everything in Pro','⭐ Featured at top of all results','Full analytics dashboard','Weekly AI market report','Priority support','Custom AI business profile'],
    cta:'Go Premium', link:'/register', style:'border-2 border-v-400 text-v-700 hover:bg-v-50' },
]

export default function Pricing() {
  const { user } = useAuth()
  return (
    <div className="wrap py-16 max-w-5xl">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-s-50 border border-s-200 rounded-full px-4 py-2 mb-6">
          <Sparkles size={13} className="text-s-500"/>
          <span className="text-sm font-bold text-s-700">Simple, honest pricing</span>
        </div>
        <h1 className="font-display text-5xl font-bold text-k-900">Grow at your pace</h1>
        <p className="text-k-500 mt-4 max-w-sm mx-auto">Start free. Upgrade when you see value. Cancel anytime.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-start">
        {PLANS.map(p => (
          <div key={p.id} className={`card p-7 flex flex-col relative hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ${p.badge?'ring-2 ring-s-400 shadow-xl shadow-s-500/10 scale-[1.02]':''}`}>
            {p.badge && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="bg-s-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-s-500/30 whitespace-nowrap">✦ {p.badge}</span>
              </div>
            )}
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${p.grad} flex items-center justify-center shadow-lg`}>
                <p.icon size={18} className="text-white"/>
              </div>
              <h2 className="font-display text-xl font-bold text-k-900">{p.name}</h2>
            </div>
            <div className="mb-6">
              <span className="font-display text-4xl font-bold text-k-900">{p.price}</span>
              <span className="text-k-400 text-sm ml-1">{p.period}</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {p.features.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-k-700">
                  <CheckCircle size={15} className={`flex-shrink-0 mt-0.5 ${p.id==='pro'?'text-s-400':p.id==='premium'?'text-v-400':'text-e-400'}`}/>
                  {f}
                </li>
              ))}
            </ul>
            <Link to={user?'/dashboard':p.link} className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all ${p.style}`}>
              {p.cta}<ArrowRight size={14}/>
            </Link>
          </div>
        ))}
      </div>

      {/* Launch offer */}
      <div className="mt-10 bg-k-900 rounded-3xl p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.15),transparent_70%)] pointer-events-none"/>
        <p className="font-bold text-white mb-1">🎉 Belgaum Launch Offer</p>
        <p className="text-k-300 text-sm max-w-md mx-auto">All wholesalers get <strong className="text-white">Pro free for 6 months</strong> during our launch phase.</p>
        <Link to="/register?role=wholesaler" className="inline-flex items-center gap-2 bg-s-500 hover:bg-s-400 text-white font-bold px-6 py-3 rounded-xl mt-4 text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-s-900/20">
          Claim Free Pro as Wholesaler <ArrowRight size={14}/>
        </Link>
      </div>
    </div>
  )
}
