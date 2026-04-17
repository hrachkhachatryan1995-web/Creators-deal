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
          Cookies are small text files stored on your device. We also use similar technologies such as local storage
          where needed for the Service to function (for example remembering UI preferences or plan state in the
          browser).
        </p>
      </LegalSection>

      <LegalSection title="2. How we use cookies">
        <p className="font-medium text-[var(--ink)]">Essential / functional</p>
        <p>
          Creator Deal Assistant uses browser <span className="font-medium text-[var(--ink)]">local storage</span> (not
          strictly a cookie) to remember your plan flag and optional saved calculator scenarios on this device. Clearing
          site data removes that state.
        </p>
        <p className="mt-3 font-medium text-[var(--ink)]">Analytics</p>
        <p>
          We load <span className="font-medium text-[var(--ink)]">Google Analytics</span> (gtag) with measurement ID{' '}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-[11px]">G-7RQGP5S2G4</code> for aggregate traffic and
          navigation. Google may set cookies or use similar technologies under its policies. Learn more at{' '}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-[var(--secondary)] underline-offset-2 hover:underline"
          >
            policies.google.com/privacy
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="3. Your choices">
        <p>
          Most browsers let you refuse or delete cookies. If you disable cookies, parts of the Service may not work as
          expected. You can also use browser extensions or device settings that block analytics cookies.
        </p>
      </LegalSection>

      <LegalSection title="4. Contact">
        <p>
          Questions about this Cookie Policy:{' '}
          <a href={`mailto:${contactEmail}`} className="font-medium text-[var(--secondary)] underline-offset-2 hover:underline">
            {contactEmail}
          </a>
          .
        </p>
      </LegalSection>
    </LegalDocument>
  )
}
