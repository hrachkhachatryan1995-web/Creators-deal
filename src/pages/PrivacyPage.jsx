import { Link } from 'react-router-dom'
import LegalDocument, { LegalSection } from '../components/LegalDocument'
import { contactEmail, operatorLegalName } from '../config/site'

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      intro={`This Privacy Policy describes how ${operatorLegalName} ("we", "us") handles information when you use the website and web application "Creator Deal Assistant" (the "Service"). It explains what data is processed, stored, and shared when you use the Service.`}
    >
      <p className="text-xs text-[var(--muted)]">Last updated: April 18, 2026</p>

      <LegalSection title="1. Who operates the Service">
        <p>
          The Service is operated by {operatorLegalName}. For privacy-related questions, contact{' '}
          <a
            href={`mailto:${contactEmail}`}
            className="font-medium text-[var(--secondary)] underline-offset-2 hover:underline"
          >
            {contactEmail}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="2. What the Service does">
        <p>Creator Deal Assistant helps creators with:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Estimating collaboration pricing ranges using browser-based calculations</li>
          <li>Analyzing brand offers (underpaid / fair / strong)</li>
          <li>Generating draft replies and counter-offer messages using optional AI features</li>
        </ul>
        <p className="mt-3">
          The Service does not require account creation or password login and does not maintain a centralized user
          profile database.
        </p>
        <p className="mt-2">
          <strong>We do not maintain user accounts, identity profiles, or a centralized user database.</strong>
        </p>
      </LegalSection>

      <LegalSection title="3. Information stored in your browser">
        <p>
          The Service uses your browser’s local storage to store lightweight data required for functionality:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Plan status (Free or Pro)</li>
          <li>Saved calculator scenarios (optional)</li>
        </ul>
        <p className="mt-2">
          This data stays on your device and is not synced to any server. Clearing your browser data will remove it.
        </p>
      </LegalSection>

      <LegalSection title="4. Data sent to our servers">
        <p>When you use AI or verification features, your browser may send data to our API endpoints:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Offer text, brand messages, and negotiation inputs</li>
          <li>Calculator-derived values for generating replies</li>
          <li>Email address for subscription verification (if used)</li>
        </ul>
        <p className="mt-3">
          This data is used only to generate responses and is not used to build user profiles.
        </p>
        <p className="mt-2">
          <strong>Important:</strong> Do not submit sensitive personal, financial, or confidential business information.
        </p>
      </LegalSection>

      <LegalSection title="5. Server logs and infrastructure">
        <p>
          Our hosting providers (such as Vercel or similar infrastructure services) may automatically collect limited
          logs such as IP address, request time, and error information for security and debugging purposes.
        </p>
        <p className="mt-2">These logs are typically short-lived and managed by the infrastructure provider.</p>
      </LegalSection>

      <LegalSection title="6. AI processing">
        <p>
          When AI features are used, your inputs may be sent to third-party AI providers such as Groq, Hugging Face
          Inference, or OpenAI depending on configuration.
        </p>
        <p className="mt-2">
          Each provider processes data under its own privacy policy and terms.
        </p>
        <p className="mt-2">
          <strong>
            Do not include sensitive personal, financial, or confidential information in AI prompts.
          </strong>
        </p>
      </LegalSection>

      <LegalSection title="7. Payments">
        <p>
          Payments are processed through Lemon Squeezy. We do not collect or store credit card or billing details.
        </p>
        <p className="mt-2">
          Subscription verification may be performed using your email address via Lemon Squeezy’s API.
        </p>
      </LegalSection>

      <LegalSection title="8. Analytics">
        <p>
          We use Google Analytics to understand how users interact with the Service. This may include cookies or
          similar tracking technologies.
        </p>
        <p className="mt-2">
          You can learn more here:{' '}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-[var(--secondary)] underline-offset-2 hover:underline"
          >
            Google Privacy Policy
          </a>
        </p>
        <p className="mt-2">
          By continuing to use the Service, you consent to analytics tracking as described in this policy.
        </p>
      </LegalSection>

      <LegalSection title="9. Your rights">
        <p>
          Depending on your location, you may have rights to access, correct, or delete your personal data.
        </p>
        <p className="mt-2">
          Since we do not maintain user accounts or profiles, most requests can be handled by clearing browser data or
          contacting us directly.
        </p>
      </LegalSection>

      <LegalSection title="10. Data security">
        <p>
          We use HTTPS to protect data in transit. However, no system is completely secure, and you are responsible for
          protecting your own device and data.
        </p>
      </LegalSection>

      <LegalSection title="11. Children">
        <p>
          The Service is not intended for users under the age of 13 (or the minimum legal age in your country). We do
          not knowingly collect data from children.
        </p>
      </LegalSection>

      <LegalSection title="12. Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. Updates will be posted on this page with a new “Last
          updated” date.
        </p>
      </LegalSection>

      <LegalSection title="13. Contact">
        <p>
          For any questions about this Privacy Policy, contact{' '}
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