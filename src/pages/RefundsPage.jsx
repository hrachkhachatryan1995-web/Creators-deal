import { Link } from 'react-router-dom'
import LegalDocument, { LegalSection } from '../components/LegalDocument'
import { contactEmail, operatorLegalName } from '../config/site'

export default function RefundsPage() {
  return (
    <LegalDocument
      title="Refund & cancellation policy"
      intro={`This policy explains how cancellations and refunds work for paid access to Creator Deal Assistant when purchases are made through Lemon Squeezy. ${operatorLegalName} wants checkout expectations to be clear for customers and payment partners.`}
    >
      <p className="text-xs text-[var(--muted)]">Last updated: April 18, 2026</p>

      <LegalSection title="1. Payment processor">
        <p>
          Paid plans are sold and billed by Lemon Squeezy, our merchant of record. Lemon Squeezy may appear as the
          seller on your receipt. Their terms apply to payment processing in addition to our{' '}
          <Link to="/terms" className="font-medium text-[var(--secondary)] underline-offset-2 hover:underline">
            Terms of Service
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="2. Subscriptions">
        <p>
          If you purchase a recurring subscription, it will renew according to the terms shown at checkout until you
          cancel. You can cancel before the next renewal date to avoid future charges. Cancellation stops future
          billing; it may not remove charges already processed.
        </p>
      </LegalSection>

      <LegalSection title="3. Refunds">
        <p>
          If you believe you are entitled to a refund (for example duplicate charge, failure to deliver access, or
          statutory cooling-off rights in your region), contact us at{' '}
          <a href={`mailto:${contactEmail}`} className="font-medium text-[var(--secondary)] underline-offset-2 hover:underline">
            {contactEmail}
          </a>{' '}
          with your order email and a short description. We will review requests in line with Lemon Squeezy&apos;s
          policies and applicable consumer law.
        </p>
        <p>
          Where Lemon Squeezy handles refund decisions as merchant of record, they may process refunds according to
          their rules after we confirm eligibility.
        </p>
      </LegalSection>

      <LegalSection title="4. Chargebacks">
        <p>
          If you have a billing issue, please contact us first so we can resolve it quickly. Unwarranted chargebacks may
          result in loss of access to the Service.
        </p>
      </LegalSection>

      <LegalSection title="5. Free features">
        <p>
          Features offered without charge do not create a payment relationship. This policy applies to paid products
          only.
        </p>
      </LegalSection>
    </LegalDocument>
  )
}
