import { NavLink, Outlet } from 'react-router-dom'

const navigation = [
  { to: '/', label: 'Home' },
  { to: '/tools', label: 'Tools' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'Why It Works' },
]

function linkClass({ isActive }) {
  return isActive
    ? 'rounded-full bg-[rgba(108,92,231,0.18)] px-4 py-2 text-sm font-semibold text-white shadow-sm'
    : 'rounded-full px-4 py-2 text-sm font-medium text-[var(--muted)] transition hover:bg-[rgba(255,255,255,0.05)] hover:text-[var(--ink)]'
}

export default function Layout() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
      <header className="sticky top-4 z-20 mb-8 rounded-[1.75rem] panel p-3 backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand)]/12 text-sm font-bold text-[var(--brand)]">
              CDA
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--brand)]">
              Creator Deal Assistant
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Pricing clarity, offer analysis, and polished brand replies
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <nav className="flex flex-wrap gap-2 rounded-full bg-[rgba(255,255,255,0.03)] p-1.5">
              {navigation.map((item) => (
                <NavLink key={item.to} to={item.to} className={linkClass} end={item.to === '/'}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <NavLink
              to="/tools"
              className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_12px_24px_rgba(0,200,83,0.24)] transition hover:opacity-95"
            >
              Try the App
            </NavLink>
          </div>
        </div>
      </header>

      <Outlet />
    </div>
  )
}
