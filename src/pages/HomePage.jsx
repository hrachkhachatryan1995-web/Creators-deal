import { Link } from 'react-router-dom'
import useRevealAnimation from '../hooks/useRevealAnimation'

const stats = [
  { value: '3 steps', label: 'from pricing to negotiation-ready reply' },
  { value: '1 workflow', label: 'price, analyze, and respond in one place' },
  { value: 'always available', label: 'fallback mode keeps replies working even before paid AI' },
]

const sections = [
  {
    title: 'Fair pricing guidance',
    text: 'Estimate a sensible brand rate using followers, engagement, platform, and content format.',
  },
  {
    title: 'Fast offer analysis',
    text: 'See whether the offer is underpaid, fair, or strong before you reply.',
  },
  {
    title: 'Confident brand reply',
    text: 'Generate a polished response that sounds professional, calm, and clear.',
  },
]

export default function HomePage() {
  const rootRef = useRevealAnimation({ cardStagger: 0.1 })

  return (
    <div ref={rootRef} className="space-y-4 sm:space-y-6">
      <section className="hero-banner glow-border relative rounded-[1.8rem] panel px-5 py-7 sm:rounded-[2.25rem] sm:px-10 sm:py-12">
        <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_0.9fr]">
          <div>
            <span data-hero className="eyebrow">
              Creator Deal Intelligence
            </span>
            <h1 data-hero className="gradient-text mt-4 max-w-3xl text-[2.15rem] leading-tight sm:mt-5 sm:text-5xl lg:text-6xl">
              Know your worth before you answer a brand
            </h1>
            <p data-hero className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:mt-5 sm:text-base sm:leading-8">
              Creator Deal Assistant helps content creators price deals fairly, understand offer quality, and reply with confidence instead of guessing on the spot.
            </p>
            <div data-hero className="mt-6 flex flex-wrap gap-2.5 sm:mt-7 sm:gap-3">
              <Link to="/tools" className="rounded-full bg-[var(--primary)] px-5 py-2.5 text-xs font-semibold text-white shadow-[0_12px_24px_rgba(108,92,231,0.30)] transition hover:translate-y-[-1px] hover:opacity-95 sm:px-6 sm:py-3 sm:text-sm">
                Open the tools
              </Link>
              <Link to="/about" className="rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.03)] px-5 py-2.5 text-xs font-semibold text-[var(--ink)] transition hover:bg-[rgba(255,255,255,0.06)] sm:px-6 sm:py-3 sm:text-sm">
                See why it works
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <article data-card className="rounded-[1.5rem] panel-soft p-5">
              <p className="text-sm font-semibold text-[var(--ink)]">Sample result</p>
              <p className="mt-3 text-3xl font-bold text-[var(--ink)]">$150 - $300</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                “This is a fair range for the deal based on your audience and content format.”
              </p>
            </article>
            <article data-card className="rounded-[1.5rem] panel-soft p-5">
              <p className="text-sm font-semibold text-[var(--ink)]">Offer review</p>
              <div className="mt-3 flex items-center justify-between rounded-2xl bg-[rgba(255,255,255,0.04)] px-4 py-3">
                <span className="text-sm text-[var(--muted)]">Status</span>
                <span className="text-lg font-bold text-[#7ce7ff]">Underpaid</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                Get a suggested counter-offer so you can negotiate from a stronger starting point.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((item) => (
          <article data-stat key={item.label} className="rounded-[1.5rem] panel-soft p-5">
            <p className="text-2xl font-bold text-[var(--ink)]">{item.value}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.label}</p>
          </article>
        ))}
      </section>

      <section data-card className="rounded-[2rem] panel p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl text-[var(--ink)]">What the platform helps you do</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
              It makes pricing and brand negotiation easier to understand, faster to act on, and more professional from the creator side.
            </p>
          </div>
          <Link to="/pricing" className="text-sm font-semibold text-[var(--brand)] transition hover:opacity-80">
            View pricing
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {sections.map((section) => (
            <article data-card key={section.title} className="rounded-[1.5rem] panel-soft p-5">
              <h3 className="text-lg text-[var(--ink)]">{section.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{section.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
