/**
 * Shared layout for policy pages (terms, privacy, refunds, cookies).
 */
export default function LegalDocument({ title, intro, children }) {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] panel p-6 sm:p-8">
        <h1 className="text-3xl text-[var(--ink)] sm:text-4xl">{title}</h1>
        {intro ? (
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">{intro}</p>
        ) : null}
        <div className="mt-8 max-w-3xl space-y-8 text-sm leading-7 text-[var(--muted)] sm:text-base">{children}</div>
      </section>
    </div>
  )
}

export function LegalSection({ title, children }) {
  return (
    <section>
      <h2 className="text-lg font-semibold tracking-tight text-[var(--ink)] sm:text-xl">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  )
}
