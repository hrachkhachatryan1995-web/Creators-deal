const reasons = [
  {
    title: 'Creators lose money when they guess',
    text: 'Many creators still undercharge because they are unsure what to quote, when to counter, or how to respond without sounding awkward.',
  },
  {
    title: 'Generic AI alone is not enough',
    text: 'A chat model can write words, but creators also need pricing logic, offer analysis, and a workflow designed around real brand conversations.',
  },
  {
    title: 'This is a workflow, not just a calculator',
    text: 'The app combines pricing, offer evaluation, and brand replies into one clear creator experience.',
  },
]

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] panel p-6 sm:p-8">
        <h1 className="text-4xl text-[var(--ink)]">Why this product matters</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
          Creator Deal Assistant helps creators make better decisions during brand negotiations. It removes guesswork from pricing, offer review, and reply writing.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {reasons.map((reason) => (
          <article key={reason.title} className="rounded-[1.75rem] panel-soft p-5">
            <h2 className="text-xl text-[var(--ink)]">{reason.title}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{reason.text}</p>
          </article>
        ))}
      </section>

      <section className="rounded-[2rem] panel p-6 sm:p-8">
        <h2 className="text-3xl text-[var(--ink)]">What makes it different</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.5rem] panel-soft p-5">
            <p className="text-sm font-semibold text-[var(--ink)]">Built-in pricing logic</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Audience inputs are turned into practical rate guidance instead of vague generic advice.
            </p>
          </div>
          <div className="rounded-[1.5rem] panel-soft p-5">
            <p className="text-sm font-semibold text-[var(--ink)]">Negotiation support</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              The offer analyzer and reply generator make the next move clearer and more professional.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
