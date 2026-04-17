/** Public site strings for legal pages and footer (set in .env before launch). */
export const contactEmail =
  typeof import.meta.env.VITE_CONTACT_EMAIL === 'string' && import.meta.env.VITE_CONTACT_EMAIL.trim()
    ? import.meta.env.VITE_CONTACT_EMAIL.trim()
    : 'contact@yourdomain.com'

export const operatorLegalName =
  typeof import.meta.env.VITE_OPERATOR_LEGAL_NAME === 'string' &&
  import.meta.env.VITE_OPERATOR_LEGAL_NAME.trim()
    ? import.meta.env.VITE_OPERATOR_LEGAL_NAME.trim()
    : 'Creator Deal Assistant'
