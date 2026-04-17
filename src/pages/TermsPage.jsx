import { Link } from 'react-router-dom'
import LegalDocument, { LegalSection } from '../components/LegalDocument'
import { contactEmail, operatorLegalName } from '../config/site'

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms of Service"
      intro={`These Terms of Service ("Terms") govern your access to and use of the website and application "Creator Deal Assistant" (the "Service"), operated by ${operatorLegalName} ("we", "us", "our"). By using the Service, you agree to these Terms. If you do not agree, do not use the Service.`}
    >
      <p className="text-xs text-[var(--muted)]">Last updated: April 18, 2026</p>

      <LegalSection title="1. What the Service is">
        <p>Creator Deal Assistant provides informational tools for content creators negotiating brand deals, including:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            A <span className="font-medium text-[var(--ink)]">pricing calculator</span> that estimates rate ranges from
            audience and campaign inputs. Basic mode runs primarily as client-side logic in your browser. Pro mode adds
            additional parameters and may be limited to subscribers.
          </li>
          <li>
            An <span className="font-medium text-[var(--ink)]">offer analyzer</span> that labels a budget as underpaid,
            fair, or a good deal relative to the numbers you enter—not relative to any undisclosed market database
            inside the Service beyond the calculator logic.
          </li>
          <li>
            <span className="font-medium text-[var(--ink)]">Draft reply and counter-offer generators</span> that produce
            text you can edit before sending to anyone. Outputs may use third-party AI when enabled on the server, or
            fall back to static templates when AI is unavailable.
          </li>
        </ul>
        <p className="mt-3">
          The Service does <span className="font-medium text-[var(--ink)]">not</span> include legal, tax, accounting, or
          talent-agency representation. Nothing on the Service is a promise of income, sponsorships, or platform growth.
        </p>
      </LegalSection>

      <LegalSection title="2. No traditional accounts">
        <p>
          The Service is not built around a password-protected user database in the application. Access to paid
          features is indicated in your browser (for example local storage and/or checkout return URLs) and may be
          confirmed by email against Lemon Squeezy as described on the Tools page. That model is convenient but is not
          the same as bank-grade entitlement management; you are responsible for the security of your own device and
          browser profile.
        </p>
      </LegalSection>

      <LegalSection title="3. Eligibility">
        <p>
          You must be at least the age of majority in your place of residence, or at least 13 with verifiable parental
          consent where required. If you use the Service on behalf of a company, you represent that you have authority
          to bind that company.
        </p>
      </LegalSection>

      <LegalSection title="4. Acceptable use">
        <p>You agree not to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Use the Service in violation of applicable law or third-party rights.</li>
          <li>Upload malware, probe for vulnerabilities, or attempt to overload or bypass limits of the infrastructure.</li>
          <li>
            Use AI features to generate unlawful, fraudulent, harassing, defamatory, or deceptive communications—or to
            impersonate another person or brand.
          </li>
          <li>
            Rely on generated text as a substitute for your own judgment, contracts, or professional advice when dealing
            with brands, platforms, or regulators.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="5. AI outputs and accuracy">
        <p>
          AI-generated drafts can be wrong, generic, or unsuitable for your situation. You must review, edit, and take
          responsibility for anything you send externally. We do not warrant that outputs are accurate, complete,
          non-infringing, or fit for any particular negotiation outcome.
        </p>
      </LegalSection>

      <LegalSection title="6. Payments, subscriptions, and taxes">
        <p>
          Paid plans, if offered, are processed by <span className="font-medium text-[var(--ink)]">Lemon Squeezy</span> as
          merchant of record or payment facilitator (as shown at checkout). Their terms and receipts apply in addition
          to these Terms. Taxes, invoices, and charge disputes may be handled through Lemon Squeezy&apos;s customer
          flows.
        </p>
        <p className="mt-3">
          Refunds and cancellations are summarized in our{' '}
          <Link to="/refunds" className="font-medium text-[var(--secondary)] underline-offset-2 hover:underline">
            Refund Policy
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="7. Intellectual property">
        <p>
          We retain rights in the Service name, branding, UI, and software. Subject to these Terms, we grant you a
          personal, revocable, non-exclusive, non-transferable license to use the Service for your own creator workflow.
        </p>
        <p className="mt-3">
          You keep rights to content you type in. To operate the Service, you grant us permission to process that
          content on our systems and to send portions to subprocessors (such as AI APIs) strictly to fulfill your
          requests.
        </p>
      </LegalSection>

      <LegalSection title="8. Disclaimers">
        <p>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND,
          WHETHER EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
          PURPOSE, AND NON-INFRINGEMENT, TO THE MAXIMUM EXTENT PERMITTED BY LAW.
        </p>
      </LegalSection>

      <LegalSection title="9. Limitation of liability">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE AND OUR SUPPLIERS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
          SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, GOODWILL, OR BUSINESS
          OPPORTUNITIES, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE.
        </p>
        <p className="mt-3">
          OUR TOTAL LIABILITY FOR CLAIMS ARISING OUT OF OR RELATED TO THE SERVICE WILL NOT EXCEED THE GREATER OF (A)
          THE AMOUNTS YOU PAID US FOR THE SERVICE IN THE TWELVE MONTHS BEFORE THE EVENT GIVING RISE TO LIABILITY OR (B)
          FIFTY US DOLLARS (USD $50), EXCEPT WHERE STATUTORY LAW DOES NOT ALLOW THAT CAP.
        </p>
      </LegalSection>

      <LegalSection title="10. Suspension">
        <p>
          We may suspend or limit the Service to protect security, comply with law, or stop abuse. We may stop offering
          the Service or features with reasonable notice where practicable.
        </p>
      </LegalSection>

      <LegalSection title="11. Changes to these Terms">
        <p>
          We may update these Terms. We will post the updated version on this page and change the &quot;Last
          updated&quot; date. Continued use after changes become effective constitutes acceptance of the revised Terms
          for new sessions; if you disagree, stop using the Service.
        </p>
      </LegalSection>

      <LegalSection title="12. Governing law">
        <p>
          Unless mandatory consumer laws where you live say otherwise, these Terms are governed by the laws of the
          jurisdiction where {operatorLegalName} is established, without regard to conflict-of-law rules. Courts in
          that jurisdiction may have exclusive venue, except where you have non-waivable rights as a consumer.
        </p>
      </LegalSection>

      <LegalSection title="13. Contact">
        <p>
          Questions about these Terms:{' '}
          <a href={`mailto:${contactEmail}`} className="font-medium text-[var(--secondary)] underline-offset-2 hover:underline">
            {contactEmail}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="14. Not legal advice">
        <p>
          These Terms are written to describe Creator Deal Assistant&apos;s real product shape (browser tools + optional
          API + Lemon Squeezy). They are not a substitute for advice from a qualified attorney in your country.
        </p>
      </LegalSection>
    </LegalDocument>
  )
}
