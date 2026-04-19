import { Link } from 'react-router-dom'
import LegalDocument, { LegalSection } from '../components/LegalDocument'
import { contactEmail } from '../config/site'

export default function RefundsPage() {
  return (
    <LegalDocument
      title="Refund & Cancellation Policy"
      intro={`This Refund & Cancellation Policy explains how cancellations and refunds work for paid access to Creator Deal Assistant. Payments are processed through Lemon Squeezy as our merchant of record.`}
    >
      <p className="text-xs text-[var(--muted)]">Last updated: April 18, 2026</p>

      <LegalSection title="1. Payment processing">
        <p>
          Paid plans are sold and billed by <strong>Lemon Squeezy</strong>, our merchant of record. This means Lemon
          Squeezy processes payments, taxes, and receipts on our behalf and may appear as the seller on your invoice.
        </p>
        <p className="mt-2">
          Their terms also apply in addition to our{' '}
          <Link to="/terms" className="font-medium text-[var(--secondary)] underline-offset-2 hover:underline">
            Terms of Service
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="2. Subscriptions">
        <p>
          If you purchase a subscription, it will automatically renew based on the billing period shown at checkout
          unless you cancel it before the renewal date.
        </p>
        <p className="mt-2">
          You can cancel anytime. After cancellation, you will not be charged for future billing periods, but access
          may continue until the end of the current paid period.
        </p>
      </LegalSection>

      <LegalSection title="3. Refund eligibility">
        <p>
          Refund requests are evaluated on a case-by-case basis. Common eligible cases may include duplicate charges,
          technical issues preventing access, or legally required refunds under applicable consumer protection laws.
        </p>

        <p className="mt-2">
          To request a refund, contact{' '}
          <a
            href={`mailto:${contactEmail}`}
            className="font-medium text-[var(--secondary)] underline-offset-2 hover:underline"
          >
            {contactEmail}
          </a>{' '}
          with your order email and a short explanation.
        </p>

        <p className="mt-2">
          Where applicable, refunds may be processed by Lemon Squeezy as the merchant of record in accordance with
          their refund policies.
        </p>
      </LegalSection>

      <LegalSection title="4. Chargebacks">
        <p>
          If you experience a billing issue, please contact us before initiating a chargeback so we can resolve it
          quickly.
        </p>
        <p className="mt-2">
          Unresolved or fraudulent chargebacks may result in loss of access to the Service.
        </p>
      </LegalSection>

      <LegalSection title="5. Free access">
        <p>
          This policy applies only to paid plans. Free features do not involve billing and are not subject to refunds.
        </p>
      </LegalSection>

      <LegalSection title="6. Contact">
        <p>
          For refund-related questions, contact{' '}
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
