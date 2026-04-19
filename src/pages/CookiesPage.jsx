import LegalDocument, { LegalSection } from '../components/LegalDocument'
import { contactEmail } from '../config/site'

export default function CookiesPage() {
  return (
    <LegalDocument
      title="Cookie Policy"
      intro="This Cookie Policy explains how Creator Deal Assistant uses cookies and similar technologies. It should be read together with our Privacy Policy."
    >
      <p className="text-xs text-[var(--muted)]">Last updated: April 18, 2026</p>

      <LegalSection title="1. What are cookies?">
        <p>
          Cookies are small text files stored on your device. We also use similar technologies such as local storage to
          make the Service function properly (for example remembering UI preferences or plan state in your browser).
        </p>
        <p className="mt-2">
          We primarily rely on local storage instead of traditional cookies for core functionality.
        </p>
      </LegalSection>

      <LegalSection title="2. How we use cookies">
        <p className="font-medium text-[var(--ink)]">Essential / functional</p>
        <p>
          Creator Deal Assistant uses browser <span className="font-medium text-[var(--ink)]">local storage</span> (not
          strictly a cookie) to remember:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Your plan flag (Free or Pro)</li>
          <li>Optional saved calculator scenarios on this device</li>
        </ul>
        <p className="mt-2">
          Clearing your browser data will remove this information. Data stored locally is not backed up and may be lost
          if you clear your browser data or switch devices.
        </p>

        <p className="mt-4 font-medium text-[var(--ink)]">Analytics</p>
        <p>
          We use <span className="font-medium text-[var(--ink)]">Google Analytics</span> (gtag) with measurement ID{' '}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-[11px]">G-7RQGP5S2G4</code> to understand aggregate
          traffic and how users navigate the Service.
        </p>
        <p className="mt-2">
          Google may set cookies or use similar technologies according to its own policies. Learn more at{' '}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-[var(--secondary)] underline-offset-2 hover:underline"
          >
            https://policies.google.com/privacy
          </a>
          .
        </p>
        <p className="mt-2">
          We do not use advertising or personalized tracking cookies.
        </p>
      </LegalSection>

      <LegalSection title="3. Your choices">
        <p>
          Most browsers allow you to refuse or delete cookies. You can clear your browser storage, block cookies via
          browser settings, or use extensions that block analytics tracking.
        </p>
        <p className="mt-2">
          If you disable cookies or local storage, some parts of the Service may not function correctly.
        </p>
        <p className="mt-2">
          By continuing to use the Service, you consent to the use of analytics technologies as described in this policy.
        </p>
      </LegalSection>

      <LegalSection title="4. Contact">
        <p>
          Questions about this Cookie Policy:{' '}
          <a
            href={`mailto:${contactEmail}`}
            className="font-medium text-[var(--secondary)] underline-offset-2 hover:underline"
          >
            {contactEmail}
          </a>
          .
        </p>
      </LegalSection>
    </LegalDocument>
  )
}