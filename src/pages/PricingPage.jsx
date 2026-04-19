import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

const redirectUrl = typeof window !== 'undefined'
  ? `${window.location.origin}/tools?checkout=success`
  : '/tools?checkout=success'
const proUrl = import.meta.env.VITE_LS_PRO_URL
  ? `${import.meta.env.VITE_LS_PRO_URL}?checkout[redirect_url]=${encodeURIComponent(redirectUrl)}`
  : null

const plans = [
  {
    name: 'Free',
    price: '$0',
    summary: 'Try the core workflow at no cost',
    points: ['Offer analyzer', 'AI reply generator', 'Pricing Calculator — Basic mode (Pro mode requires Pro)'],
    checkoutUrl: null,
  },
  {
    name: 'Pro',
    price: '$15',
    summary: 'For active creators handling deals every month',
    points: ['Full Pricing Calculator (Basic & Pro mode)', 'AI reply generator', 'Offer analyzer', 'Saved deal scenarios'],
    featured: true,
    checkoutUrl: proUrl,
  },
]

const faq = [
  {
    q: 'How does the reply generator work?',
    a: 'It uses Groq / OpenAI to analyze the brand offer and generate a polished, context-aware reply letter in seconds.',
  },
  {
    q: 'Is billing handled securely?',
    a: 'Yes. Payments and subscriptions are powered by Lemon Squeezy — a trusted merchant of record that handles tax and compliance.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Absolutely. You can cancel your subscription at any time from your Lemon Squeezy customer portal with no extra fees.',
  },
]

export default function PricingPage() {
  const { isAuthenticated, isVerified } = useAuth()

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] panel p-6 sm:p-8">
        <h1 className="text-4xl text-[var(--ink)]">Pricing</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
          Pick a plan and start negotiating brand deals with confidence. Payments are handled securely by Lemon Squeezy.
        </p>
      </section>

      <section className="grid gap-5 max-w-2xl mx-auto w-full lg:grid-cols-2">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`rounded-[2rem] border p-6 shadow-[0_14px_32px_rgba(2,6,23,0.34)] ${
              plan.featured
                ? 'border-[rgba(0,212,255,0.22)] bg-[linear-gradient(180deg,rgba(108,92,231,0.18),rgba(30,41,59,0.96))]'
                : 'border-[var(--line)] bg-[linear-gradient(180deg,rgba(30,41,59,0.96),rgba(15,23,42,0.94))]'
            }`}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--brand)]">{plan.name}</p>
            <p className="mt-3 text-4xl font-bold text-[var(--ink)]">
              {plan.price}
              {plan.price !== '$0' && <span className="text-sm font-medium text-[var(--muted)]">/month</span>}
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{plan.summary}</p>
            <div className="mt-5 space-y-2">
              {plan.points.map((point) => (
                <div key={point} className="rounded-2xl bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-[var(--muted)]">
                  {point}
                </div>
              ))}
            </div>

            {plan.checkoutUrl ? (
              isAuthenticated && isVerified ? (
                <>
                  <a
                    href={plan.checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-6 block w-full rounded-full px-4 py-3 text-center text-sm font-semibold transition ${
                      plan.featured
                        ? 'bg-[var(--accent)] text-slate-950 hover:opacity-90'
                        : 'bg-[rgba(255,255,255,0.05)] text-[var(--ink)] hover:bg-[rgba(255,255,255,0.09)]'
                    }`}
                  >
                    Get {plan.name}
                  </a>
                  <p className="mt-3 text-xs leading-6 text-[var(--muted)]">
                    After checkout, return to Tools and sync the purchase to your verified account.
                  </p>
                </>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className={`mt-6 block w-full rounded-full px-4 py-3 text-center text-sm font-semibold transition ${
                      plan.featured
                        ? 'bg-[var(--accent)] text-slate-950 hover:opacity-90'
                        : 'bg-[rgba(255,255,255,0.05)] text-[var(--ink)] hover:bg-[rgba(255,255,255,0.09)]'
                    }`}
                  >
                    Create verified account first
                  </Link>
                  <p className="mt-3 text-xs leading-6 text-[var(--muted)]">
                    Pro access is linked to a verified account, not a typed email restore field.
                  </p>
                </>
              )
            ) : plan.price === '$0' ? (
              <a
                href="/tools"
                className="mt-6 block w-full rounded-full bg-[rgba(255,255,255,0.05)] px-4 py-3 text-center text-sm font-semibold text-[var(--ink)] transition hover:bg-[rgba(255,255,255,0.09)]"
              >
                Start for free
              </a>
            ) : (
              <button
                disabled
                className="mt-6 w-full cursor-not-allowed rounded-full bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm font-semibold text-[var(--muted)] opacity-50"
              >
                Coming soon
              </button>
            )}
          </article>
        ))}
      </section>

      <p className="mx-auto max-w-2xl text-center text-xs leading-6 text-[var(--muted)]">
        By purchasing you agree to our{' '}
        <Link to="/terms" className="font-medium text-[var(--secondary)] underline-offset-2 hover:underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link to="/privacy" className="font-medium text-[var(--secondary)] underline-offset-2 hover:underline">
          Privacy Policy
        </Link>
        . Refund rules are described in our{' '}
        <Link to="/refunds" className="font-medium text-[var(--secondary)] underline-offset-2 hover:underline">
          Refund Policy
        </Link>
        .
      </p>

      {!isAuthenticated && (
        <p className="mx-auto max-w-2xl rounded-[1.5rem] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-5 py-4 text-center text-sm leading-7 text-[var(--muted)]">
          Start from the{' '}
          <Link to="/auth" className="font-medium text-[var(--secondary)] underline-offset-2 hover:underline">
            account page
          </Link>{' '}
          so checkout can be tied to your verified login.
        </p>
      )}

      <section className="rounded-[2rem] panel p-6 sm:p-8">
        <h2 className="text-3xl text-[var(--ink)]">Frequently asked questions</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {faq.map((item) => (
            <article key={item.q} className="rounded-[1.5rem] panel-soft p-5">
              <h3 className="text-lg text-[var(--ink)]">{item.q}</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{item.a}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
