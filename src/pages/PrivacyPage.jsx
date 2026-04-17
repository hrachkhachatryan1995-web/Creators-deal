import { Link } from 'react-router-dom'
import LegalDocument, { LegalSection } from '../components/LegalDocument'
import { contactEmail, operatorLegalName } from '../config/site'

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      intro={`This Privacy Policy describes how ${operatorLegalName} ("we", "us") handles information when you use the website and web application "Creator Deal Assistant" (the "Service"). It reflects how the Service is built today: there are no user accounts or passwords in the app; most creator inputs stay in your browser unless you explicitly use features that call our API.`}
    >
      <p className="text-xs text-[var(--muted)]">Last updated: April 18, 2026</p>

      <LegalSection title="1. Who operates the Service">
        <p>
          The Service is operated by {operatorLegalName}. For privacy questions contact{' '}
          <a href={`mailto:${contactEmail}`} className="font-medium text-[var(--secondary)] underline-offset-2 hover:underline">
            {contactEmail}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="2. What the Service does (scope)">
        <p>Creator Deal Assistant is a creator-focused tool that helps you:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Estimate collaboration pricing ranges using formulas in the browser (Basic mode) and, for subscribers, an
            expanded &quot;Pro&quot; pricing mode with additional deal parameters.
          </li>
          <li>Analyze whether a brand budget looks underpaid, fair, or strong relative to your inputs.</li>
          <li>
            Generate draft email-style replies or counter-offer letters from text and numbers you provide, using
            optional AI when you click generate.
          </li>
        </ul>
        <p>
          The Service does <span className="font-medium text-[var(--ink)]">not</span> provide user registration, a
          password login, or a customer profile database inside the application code you interact with.
        </p>
      </LegalSection>

      <LegalSection title="3. Information stored only on your device (browser)">
        <p>
          The app uses your browser&apos;s <span className="font-medium text-[var(--ink)]">local storage</span> to
          remember preferences and lightweight state, including:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium text-[var(--ink)]">Plan flag</span> (<code className="rounded bg-white/10 px-1.5 py-0.5 text-[11px]">creator-deal-plan-v1</code>
            ): whether the UI treats you as Free or Pro. This can be set after checkout (for example via a URL
            parameter your checkout flow appends) or after email verification against Lemon Squeezy, as described
            below. It is not a cryptographic license and can be cleared by clearing site data.
          </li>
          <li>
            <span className="font-medium text-[var(--ink)]">Saved scenarios</span> (
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-[11px]">creator-deal-scenarios-v1</code>): up to a
            small number of saved calculator snapshots you choose to keep on this device.
          </li>
        </ul>
        <p>We do not sync those local files to a &quot;Creator Deal Assistant cloud account&quot; because none exists.</p>
      </LegalSection>

      <LegalSection title="4. When you send data to our servers (API requests)">
        <p>
          If you use AI generation or subscription verification, your browser sends HTTPS requests to endpoints served
          with the Service (for example on Vercel serverless functions or a self-hosted Node server, depending on how
          the operator deploys it). Based on the current codebase, those endpoints include:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium text-[var(--ink)]">POST /api/offer-reply</span> — sends the offer text you
            pasted plus a tone choice so the server can return a draft reply. The server forwards a prompt to configured
            AI providers (see section 6).
          </li>
          <li>
            <span className="font-medium text-[var(--ink)]">POST /api/reply</span> — sends your brand message, budget
            field, derived offer status, target amount, and a structured &quot;negotiation context&quot; block (for
            example platform, niche, usage rights, exclusivity, deliverables, and calculated range numbers) so the
            server can draft a reply aligned with the calculator output.
          </li>
          <li>
            <span className="font-medium text-[var(--ink)]">POST /api/counter-offer</span> — when your deployment
            includes the full Express server, sends counter-offer fields (budget, counter amount, minimum accept, niche,
            usage rights, exclusivity, deliverables, geography, creator tier, tone, and short justification bullets) to
            generate a counter-offer letter. If you deploy only the bundled Vercel API subset, this route may not be
            available until the operator adds a matching serverless function.
          </li>
          <li>
            <span className="font-medium text-[var(--ink)]">POST /api/verify</span> — sends an email address you type
            so the server can ask Lemon Squeezy&apos;s API whether there is an active subscription or paid order for
            that email. The Service responds with a simple plan flag (<code className="rounded bg-white/10 px-1 text-[11px]">pro</code> or{' '}
            <code className="rounded bg-white/10 px-1 text-[11px]">free</code>). The application code shown in this
            repository does not write that email into an application database.
          </li>
        </ul>
        <p className="mt-3">
          <span className="font-medium text-[var(--ink)]">Important:</span> anything you put into offer text, brand
          messages, or calculator fields may include personal or confidential business information. Only paste what you
          are comfortable transmitting to the operator&apos;s hosting environment and to third-party AI processors
          described below.
        </p>
      </LegalSection>

      <LegalSection title="5. Whether we keep a copy of your prompts">
        <p>
          The Service is designed to process requests and return text to your browser. The open-source application
          logic in this product does not include saving your prompts or replies into a first-party database operated by
          the app.
        </p>
        <p className="mt-3">
          However, <span className="font-medium text-[var(--ink)]">infrastructure providers</span> (such as Vercel,
          cloud hosts, or logging tools if enabled by the operator) may automatically generate short-lived server logs,
          metrics, or security telemetry that could include request metadata (for example timestamps, route paths, IP
          addresses, error traces). Those systems have their own retention policies.
        </p>
      </LegalSection>

      <LegalSection title="6. AI providers (subprocessors)">
        <p>
          When AI is enabled and configured with API keys on the server, prompts are sent to one or more external
          model APIs depending on configuration, including <span className="font-medium text-[var(--ink)]">Groq</span>,{' '}
          <span className="font-medium text-[var(--ink)]">Hugging Face Inference</span>, and/or{' '}
          <span className="font-medium text-[var(--ink)]">OpenAI</span>. The operator chooses which providers are active
          via environment variables (for example <code className="rounded bg-white/10 px-1 text-[11px]">AI_PROVIDER</code>
          ). If keys are missing or a call fails, the Service may return a non-AI template response instead.
        </p>
        <p className="mt-3">
          Each provider processes content under its own terms and privacy policy. You should read those documents if
          you need contractual detail beyond this summary.
        </p>
      </LegalSection>

      <LegalSection title="7. Payments (Lemon Squeezy)">
        <p>
          Paid access is sold through <span className="font-medium text-[var(--ink)]">Lemon Squeezy</span>. Card and
          billing details are collected by Lemon Squeezy, not typed into our pricing forms. The Service may call Lemon
          Squeezy&apos;s API with the email you supply to check whether a subscription or paid order exists for your
          product variant.
        </p>
        <p className="mt-3">
          See Lemon Squeezy&apos;s documentation for how they process customer records, tax, and invoices.
        </p>
      </LegalSection>

      <LegalSection title="8. Analytics (Google)">
        <p>
          The site loads <span className="font-medium text-[var(--ink)]">Google Analytics</span> (gtag) with measurement
          ID <code className="rounded bg-white/10 px-1.5 py-0.5 text-[11px]">G-7RQGP5S2G4</code> to understand aggregate
          traffic and navigation. Google may set cookies or use similar storage according to Google&apos;s policies.
          See also our{' '}
          <Link to="/cookies" className="font-medium text-[var(--secondary)] underline-offset-2 hover:underline">
            Cookie Policy
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="9. Legal bases and rights (summary)">
        <p>
          Depending on your country, privacy laws may give you rights to access, correct, delete, export, or restrict
          processing of personal data, and to object to certain processing. Because the Service stores little centralized
          account data, many requests will boil down to: clearing browser storage, asking the operator about server logs,
          or contacting Lemon Squeezy for purchase records.
        </p>
        <p className="mt-3">
          To exercise rights with us, email{' '}
          <a href={`mailto:${contactEmail}`} className="font-medium text-[var(--secondary)] underline-offset-2 hover:underline">
            {contactEmail}
          </a>
          . We may need to verify your request to prevent abuse.
        </p>
      </LegalSection>

      <LegalSection title="10. Children">
        <p>
          The Service is not directed to children under 13 (or the minimum age required in your jurisdiction). Do not
          submit children&apos;s personal information.
        </p>
      </LegalSection>

      <LegalSection title="11. Security">
        <p>
          We use HTTPS in normal deployment. No method of transmission is perfectly secure. You are responsible for
          keeping your device secure and for not sharing sensitive brand communications with people you do not trust.
        </p>
      </LegalSection>

      <LegalSection title="12. Changes">
        <p>
          We may update this policy when features or subprocessors change. We will post the new version on this page and
          update the &quot;Last updated&quot; date.
        </p>
      </LegalSection>

      <LegalSection title="13. Disclaimer">
        <p>
          This policy explains the product as implemented in the Creator Deal Assistant codebase. It is not legal
          advice. If you need compliance paperwork for GDPR, CCPA, or other regimes, work with qualified counsel.
        </p>
      </LegalSection>
    </LegalDocument>
  )
}
