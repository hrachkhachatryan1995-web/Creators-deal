import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import useRevealAnimation from '../hooks/useRevealAnimation'

function getMode(search) {
  const params = new URLSearchParams(search)
  return params.get('mode') === 'login' ? 'login' : 'register'
}

export default function AuthPage() {
  const rootRef = useRevealAnimation({ cardStagger: 0.08 })
  const location = useLocation()
  const navigate = useNavigate()
  const { register, login, isAuthenticated, isVerified, user } = useAuth()
  const [mode, setMode] = useState(getMode(location.search))
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setMode(getMode(location.search))
    if (new URLSearchParams(location.search).get('verified') === '1') {
      setSuccess('Your email was confirmed in Supabase. Sign in to continue.')
    }
  }, [location.search])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (mode === 'register' && password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      if (mode === 'register') {
        await register({ email, password })
        setSuccess('Account created. Check your email and confirm your address before signing in.')
      } else {
        await login({ email, password })
        navigate('/tools')
      }
    } catch (submitError) {
      setError(submitError.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  if (isAuthenticated) {
    return (
      <div ref={rootRef} className="space-y-6">
        <section data-card className="rounded-[2rem] panel p-6 sm:p-8">
          <h1 className="text-4xl text-[var(--ink)]">Account</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
            Signed in as {user.email}. {isVerified ? 'Your account is verified.' : 'Verify your email before syncing a Pro purchase.'}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/tools" className="soft-button">
              Open tools
            </Link>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div ref={rootRef} className="space-y-6">
      <section data-card className="rounded-[2rem] panel p-6 sm:p-8">
        <h1 className="text-4xl text-[var(--ink)]">Account Access</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
          Create a verified account first, then connect your Lemon Squeezy purchase to that account. Pro access stays tied to the signed-in account instead of a typed email field.
        </p>
      </section>

      <section data-card className="mx-auto max-w-xl rounded-[2rem] panel p-6 sm:p-8">
        <div className="inline-flex rounded-full border border-white/15 bg-white/5 p-1 text-sm">
          {['register', 'login'].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setMode(value)
                setError('')
                setSuccess('')
              }}
              className={`rounded-full px-4 py-2 capitalize transition ${mode === value ? 'bg-[var(--primary)] text-white' : 'text-[var(--muted)] hover:text-[var(--ink)]'}`}
            >
              {value}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-[var(--muted)]">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="form-field mt-1"
              placeholder="you@example.com"
            />
          </label>

          <label className="block text-sm font-medium text-[var(--muted)]">
            Password
            <input
              type="password"
              required
              minLength="8"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="form-field mt-1"
              placeholder="At least 8 characters"
            />
          </label>

          {mode === 'register' && (
            <label className="block text-sm font-medium text-[var(--muted)]">
              Confirm password
              <input
                type="password"
                required
                minLength="8"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="form-field mt-1"
                placeholder="Repeat your password"
              />
            </label>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}
          {success && <p className="text-sm text-emerald-300">{success}</p>}

          <button type="submit" className="soft-button w-full justify-center" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'register' ? 'Create account' : 'Sign in'}
          </button>
        </form>
      </section>
    </div>
  )
}
