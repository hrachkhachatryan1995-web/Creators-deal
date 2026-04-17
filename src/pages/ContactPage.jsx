import { Link } from 'react-router-dom'
import { contactEmail, operatorLegalName } from '../config/site'

export default function ContactPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] panel p-6 sm:p-8">
        <h1 className="text-4xl text-[var(--ink)]">Contact</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
          {operatorLegalName} operates Creator Deal Assistant. For billing and receipts, use the links in your Lemon
          Squeezy customer email. For product, privacy, or legal questions, use the address below.
        </p>
        <div className="mt-8 max-w-xl rounded-[1.5rem] border border-[var(--line)] bg-[rgba(255,255,255,0.03)] p-6">
          <p className="text-sm font-semibold text-[var(--ink)]">Email</p>
          <a
            href={`mailto:${contactEmail}`}
            className="mt-2 inline-block text-lg font-semibold text-[var(--secondary)] underline-offset-4 hover:underline"
          >
            {contactEmail}
          </a>
          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            We aim to respond within a few business days. Set your real address in deployment using{' '}
            <span className="whitespace-nowrap rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11px]">VITE_CONTACT_EMAIL</span>.
          </p>
        </div>
        <p className="mt-8 text-sm text-[var(--muted)]">
          <Link to="/privacy" className="font-medium text-[var(--secondary)] underline-offset-2 hover:underline">
            Privacy Policy
          </Link>
          {' · '}
          <Link to="/terms" className="font-medium text-[var(--secondary)] underline-offset-2 hover:underline">
            Terms of Service
          </Link>
        </p>
      </section>
    </div>
  )
}
