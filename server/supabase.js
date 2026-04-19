const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

function ensureConfig(value, name) {
  if (!value) {
    throw new Error(`${name} is required`)
  }
  return value
}

function getAuthHeaders(key) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  }
}

async function parseResponse(response) {
  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const message = data?.msg || data?.message || data?.error_description || data?.error || 'Supabase request failed'
    throw new Error(message)
  }

  return data
}

export function getSupabaseConfig() {
  return {
    url: ensureConfig(SUPABASE_URL, 'SUPABASE_URL'),
    anonKey: ensureConfig(SUPABASE_ANON_KEY, 'SUPABASE_ANON_KEY'),
    serviceRoleKey: ensureConfig(SUPABASE_SERVICE_ROLE_KEY, 'SUPABASE_SERVICE_ROLE_KEY'),
  }
}

export function getAppOrigin(req) {
  const configured = process.env.APP_ORIGIN || process.env.VITE_APP_ORIGIN
  if (configured) return configured.replace(/\/$/, '')

  const protocol = req?.headers?.['x-forwarded-proto'] || 'http'
  const host = req?.headers?.host || 'localhost:5173'
  return `${protocol}://${host}`.replace(/\/$/, '')
}

export async function supabaseSignUp({ email, password, emailRedirectTo }) {
  const { url, anonKey } = getSupabaseConfig()
  const response = await fetch(`${url}/auth/v1/signup`, {
    method: 'POST',
    headers: getAuthHeaders(anonKey),
    body: JSON.stringify({
      email,
      password,
      options: {
        emailRedirectTo,
      },
    }),
  })

  return parseResponse(response)
}

export async function supabaseSignIn({ email, password }) {
  const { url, anonKey } = getSupabaseConfig()
  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: getAuthHeaders(anonKey),
    body: JSON.stringify({ email, password }),
  })

  return parseResponse(response)
}

export async function getProfileById(userId) {
  const { url, serviceRoleKey } = getSupabaseConfig()
  const response = await fetch(`${url}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}&select=*`, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Accept: 'application/json',
    },
  })

  const data = await parseResponse(response)
  return Array.isArray(data) ? data[0] || null : null
}

export async function upsertProfile(profile) {
  const { url, serviceRoleKey } = getSupabaseConfig()
  const response = await fetch(`${url}/rest/v1/profiles`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify([profile]),
  })

  const data = await parseResponse(response)
  return Array.isArray(data) ? data[0] || null : null
}

export function sanitizeProfile(profile) {
  if (!profile) return null
  return {
    id: profile.id,
    email: profile.email,
    plan: profile.plan || 'free',
    isVerified: Boolean(profile.is_email_verified),
    createdAt: profile.created_at,
    lastLoginAt: profile.last_login_at,
  }
}
