import { Link, NavLink, Outlet } from 'react-router-dom'

const navigation = [
  { to: '/', label: 'Home', icon: '⌂' },
  { to: '/tools', label: 'Tools', icon: '▣' },
  { to: '/offer-reply', label: 'Reply', icon: '✉' },
  { to: '/pricing', label: 'Pricing', icon: '$' },
  { to: '/about', label: 'About', icon: 'i' },
]

function linkClass({ isActive }) {
  return isActive
    ? 'rounded-full bg-[rgba(108,92,231,0.18)] px-4 py-2 text-sm font-semibold text-white shadow-sm'
    : 'rounded-full px-4 py-2 text-sm font-medium text-[var(--muted)] transition hover:bg-[rgba(255,255,255,0.05)] hover:text-[var(--ink)]'
}

export default function Layout() {
  return (
    <div className="app-shell mx-auto min-h-screen w-full max-w-6xl px-3 pb-24 pt-3 sm:px-6 sm:pb-6 sm:pt-5 lg:px-8 lg:py-8">
      <header className="sticky top-2 z-20 mb-5 rounded-[1.4rem] panel p-3 backdrop-blur-xl sm:top-4 sm:mb-8 sm:rounded-[1.75rem]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand)]/12 text-sm font-bold text-[var(--brand)] sm:h-11 sm:w-11">
              CDA
            </div>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--brand)] sm:text-xs">
              Creator Deal Assistant
              </p>
              <p className="truncate text-xs text-[var(--muted)] sm:mt-1 sm:text-sm">
                Pricing clarity, offer analysis, and polished brand replies
              </p>
            </div>
          </div>

          <div className="hidden lg:flex lg:items-center lg:gap-3">
            <nav aria-label="Primary" className="flex flex-wrap gap-2 rounded-full bg-[rgba(255,255,255,0.03)] p-1.5">
              {navigation.map((item) => (
                <NavLink key={item.to} to={item.to} className={linkClass} end={item.to === '/'}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <NavLink
            to="/tools"
            aria-label="Open tools"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--accent)] px-4 py-2.5 text-xs font-semibold text-slate-950 shadow-[0_10px_24px_rgba(0,200,83,0.24)] transition hover:opacity-95 sm:px-5 sm:py-3 sm:text-sm"
          >
            Try App
          </NavLink>
        </div>
      </header>

      <Outlet />

      <footer className="mt-12 border-t border-[var(--line)] pt-8 pb-4 text-xs text-[var(--muted)] sm:text-sm">
        <nav aria-label="Legal and policies" className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          <Link to="/terms" className="transition hover:text-[var(--ink)]">
            Terms of Service
          </Link>
          <Link to="/privacy" className="transition hover:text-[var(--ink)]">
            Privacy Policy
          </Link>
          <Link to="/refunds" className="transition hover:text-[var(--ink)]">
            Refunds
          </Link>
          <Link to="/cookies" className="transition hover:text-[var(--ink)]">
            Cookies
          </Link>
          <Link to="/contact" className="transition hover:text-[var(--ink)]">
            Contact
          </Link>
        </nav>
        <p className="mt-4 text-center text-[11px] text-[var(--muted)]/90">
          © {new Date().getFullYear()} Creator Deal Assistant. Not legal advice — review policies with counsel for your
          region.
        </p>
      </footer>

      <nav aria-label="Bottom navigation" className="fixed bottom-3 left-1/2 z-30 flex w-[min(94vw,520px)] -translate-x-1/2 items-center justify-between gap-1 rounded-[1.3rem] border border-[rgba(248,250,252,0.12)] bg-[rgba(16,24,39,0.92)] p-1.5 shadow-[0_20px_45px_rgba(2,6,23,0.55)] backdrop-blur-xl lg:hidden">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            aria-label={item.label}
            className={({ isActive }) =>
              isActive
                ? 'flex min-w-[72px] flex-1 flex-col items-center justify-center rounded-xl bg-[rgba(108,92,231,0.26)] px-2 py-2 text-[11px] font-semibold text-white'
                : 'flex min-w-[72px] flex-1 flex-col items-center justify-center rounded-xl px-2 py-2 text-[11px] font-medium text-[var(--muted)] transition hover:bg-[rgba(255,255,255,0.05)]'
            }
          >
            <span className="text-sm leading-none">{item.icon}</span>
            <span className="mt-1 leading-none">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
