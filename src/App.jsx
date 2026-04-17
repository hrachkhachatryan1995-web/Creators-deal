import { Suspense, lazy, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Layout from './components/Layout'

const HomePage = lazy(() => import('./pages/HomePage'))
const ToolsPage = lazy(() => import('./pages/ToolsPage'))
const PricingPage = lazy(() => import('./pages/PricingPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const OfferReplyPage = lazy(() => import('./pages/OfferReplyPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const RefundsPage = lazy(() => import('./pages/RefundsPage'))
const CookiesPage = lazy(() => import('./pages/CookiesPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))

function App() {
  const location = useLocation()

  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', 'G-7RQGP5S2G4', {
        page_path: location.pathname + location.search,
      })
    }
  }, [location])

  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 text-sm text-[var(--muted)]">
          Loading Creator Deal Assistant...
        </div>
      }
    >
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/offer-reply" element={<OfferReplyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/refunds" element={<RefundsPage />} />
          <Route path="/cookies" element={<CookiesPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
