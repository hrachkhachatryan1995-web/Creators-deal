const plans = [
  {
    name: 'Starter',
    price: '$0',
    summary: 'For creators testing the workflow',
    points: ['Core pricing calculator', 'Offer analyzer', 'Fallback reply generator'],
  },
  {
    name: 'Pro',
    price: '$15',
    summary: 'For active creators handling deals every month',
    points: ['Unlimited calculations', 'Stronger AI workflow later', 'Saved deal history in a future version'],
    featured: true,
  },
  {
    name: 'Studio',
    price: '$39',
    summary: 'For small teams or creator managers',
    points: ['Unlimited workflows', 'Advanced deal insights', 'Priority support'],
  },
]

const faq = [
  {
    q: 'How does the reply generator work today?',
    a: 'It currently runs on a fallback/template flow, so the product stays usable even before a paid AI provider is connected.',
  },
  {
    q: 'Can real AI be connected later?',
    a: 'Yes. The app is structured so a real provider like OpenAI can be added later without rebuilding the product from scratch.',
  },
  {
    q: 'Are these plans live for billing today?',
    a: 'Right now they are part of the product positioning, so the product feels like a real SaaS even at MVP stage.',
  },
]

export default function PricingPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] panel p-6 sm:p-8">
        <h1 className="text-4xl text-[var(--ink)]">Pricing</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
          These plans show how the product can grow from a lightweight creator tool into a full creator revenue workflow. Even at MVP stage, the positioning should already feel strong.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
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
            <p className="mt-3 text-4xl font-bold text-[var(--ink)]">{plan.price}<span className="text-sm font-medium text-[var(--muted)]">/month</span></p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{plan.summary}</p>
            <div className="mt-5 space-y-2">
              {plan.points.map((point) => (
                <div key={point} className="rounded-2xl bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-[var(--muted)]">
                  {point}
                </div>
              ))}
            </div>
            <button className={`mt-6 w-full rounded-full px-4 py-3 text-sm font-semibold transition ${plan.featured ? 'bg-[var(--accent)] text-slate-950' : 'bg-[rgba(255,255,255,0.05)] text-[var(--ink)]'}`}>
              Choose {plan.name}
            </button>
          </article>
        ))}
      </section>

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
