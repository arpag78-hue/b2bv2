import { Link } from 'react-router-dom'
import { CheckCircle, Crown, Zap, Star, ArrowRight, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const PLANS = [
  {
    id: 'free', name:'Free', price:'₹0', period:'forever',
    icon: Zap, grad: 'from-ink-400 to-ink-600',
    highlight: false,
    features: ['List your business profile','5 enquiries per month','Search full directory','Basic category listing'],
    cta:'Get Started Free', link:'/register',
  },
  {
    id:'pro', name:'Pro', price:'₹499', period:'/month',
    icon: Crown, grad:'from-saffron-400 to-saffron-600',
    highlight: true, badge:'Most Popular',
    features:['Everything in Free','Unlimited enquiries','Top search placement','See who viewed your profile','Pro badge on listing','WhatsApp enquiry alerts','AI smart match feature'],
    cta:'Upgrade to Pro', link:'/register',
  },
  {
    id:'premium', name:'Premium', price:'₹999', period:'/month',
    icon: Star, grad:'from-violet-400 to-violet-600',
    highlight: false,
    features:['Everything in Pro','⭐ Featured badge (top of all results)','AI weekly insight report','Full analytics dashboard','AI business description','Priority support'],
    cta:'Go Premium', link:'/register',
  },
]

export default function Pricing() {
  const { user } = useAuth()

  return (
    <div className="section py-16 max-w-5xl">
      {/* Header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-saffron-50 border border-saffron-200 rounded-full px-4 py-2 mb-6">
          <Sparkles size={13} className="text-saffron-500" />
          <span className="text-sm font-semibold text-saffron-700">Simple, honest pricing</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink-900">Grow at your pace</h1>
        <p className="text-ink-500 mt-4 max-w-md mx-auto">Start free. Upgrade when you see results. Cancel anytime. No hidden fees.</p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6 items-start">
        {PLANS.map(plan => (
          <div key={plan.id} className={`card p-7 flex flex-col relative transition-all duration-200 ${plan.highlight ? 'ring-2 ring-saffron-400 shadow-xl shadow-saffron-500/10 scale-[1.02]' : 'hover:shadow-lg'}`}>
            {plan.badge && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="bg-saffron-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-saffron-500/30 whitespace-nowrap">
                  ✦ {plan.badge}
                </span>
              </div>
            )}

            <div className="flex items-center gap-3 mb-5">
              <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${plan.grad} flex items-center justify-center shadow-lg`}>
                <plan.icon size={18} className="text-white" />
              </div>
              <h2 className="font-display text-xl font-bold text-ink-900">{plan.name}</h2>
            </div>

            <div className="mb-6">
              <div className="flex items-end gap-1">
                <span className="font-display text-4xl font-bold text-ink-900">{plan.price}</span>
                <span className="text-ink-400 text-sm mb-1">{plan.period}</span>
              </div>
              {plan.id !== 'free' && <p className="text-xs text-ink-400 mt-1">Billed monthly · Cancel anytime</p>}
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-ink-700">
                  <CheckCircle size={15} className={`flex-shrink-0 mt-0.5 ${plan.id === 'pro' ? 'text-saffron-400' : plan.id === 'premium' ? 'text-violet-400' : 'text-emerald-400'}`} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Link to={user ? '/dashboard' : plan.link}
              className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                plan.highlight ? 'btn-primary' :
                plan.id === 'premium' ? 'border-2 border-violet-400 text-violet-700 hover:bg-violet-50' :
                'border-2 border-ink-200 text-ink-700 hover:border-ink-400 hover:bg-ink-50'
              }`}>
              {plan.cta} <ArrowRight size={14} />
            </Link>
          </div>
        ))}
      </div>

      {/* Launch offer */}
      <div className="mt-10 bg-gradient-to-r from-ink-900 to-ink-800 rounded-3xl p-7 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-saffron-500/10 pointer-events-none" />
        <div className="relative">
          <p className="text-sm font-semibold text-white mb-1">🎉 Belgaum Launch Offer</p>
          <p className="text-ink-200/80 text-sm max-w-lg mx-auto">
            All wholesalers get <strong className="text-white">Pro free for 6 months</strong> during our launch phase. Register now to lock in this offer.
          </p>
          <Link to="/register?role=wholesaler" className="inline-flex items-center gap-2 bg-saffron-500 hover:bg-saffron-400 text-white font-bold px-6 py-3 rounded-xl mt-4 text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-saffron-900/20">
            Claim Free Pro as Wholesaler <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* FAQ mini */}
      <div className="mt-10 grid sm:grid-cols-3 gap-4">
        {[
          { q:'Can I cancel anytime?', a:'Yes. No contracts, no lock-in. Cancel from your dashboard in one click.' },
          { q:'How do I pay?', a:'UPI, net banking, or card via Razorpay. Invoices sent to your email.' },
          { q:'Is my data safe?', a:'Yes. Hosted on Supabase with enterprise-grade security. Your data never leaves India.' },
        ].map(f => (
          <div key={f.q} className="card p-5">
            <p className="font-semibold text-ink-900 text-sm mb-2">{f.q}</p>
            <p className="text-xs text-ink-500 leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
