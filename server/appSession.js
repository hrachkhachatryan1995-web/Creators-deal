import crypto from 'node:crypto'

const COOKIE_NAME = 'creator_auth_session'
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30

function getSessionSecret() {
  return process.env.APP_SESSION_SECRET || process.env.LEMON_SQUEEZY_API_KEY || ''
}

function sign(value, secret) {
  return crypto.createHmac('sha256', secret).update(value).digest('base64url')
}

function parseCookies(cookieHeader = '') {
  return cookieHeader
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((acc, part) => {
      const separatorIndex = part.indexOf('=')
      if (separatorIndex === -1) return acc
      acc[part.slice(0, separatorIndex)] = part.slice(separatorIndex + 1)
      return acc
    }, {})
}

function buildCookie(value, maxAgeSeconds) {
  const parts = [
    `${COOKIE_NAME}=${value}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAgeSeconds}`,
  ]

  if (process.env.NODE_ENV === 'production') {
    parts.push('Secure')
  }

  return parts.join('; ')
}

export function setAppSession(res, { userId }) {
  const secret = getSessionSecret()
  if (!secret) {
    throw new Error('APP_SESSION_SECRET or LEMON_SQUEEZY_API_KEY is required')
  }

  const payload = Buffer.from(
    JSON.stringify({
      userId,
      exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    }),
  ).toString('base64url')
  const signature = sign(payload, secret)
  res.setHeader('Set-Cookie', buildCookie(`${payload}.${signature}`, SESSION_TTL_SECONDS))
}

export function clearAppSession(res) {
  res.setHeader('Set-Cookie', buildCookie('', 0))
}

export function readAppSession(req) {
  const secret = getSessionSecret()
  if (!secret) return null

  const cookies = parseCookies(req?.headers?.cookie || '')
  const raw = cookies[COOKIE_NAME]
  if (!raw) return null

  const [payload, signature] = raw.split('.')
  if (!payload || !signature) return null
  if (sign(payload, secret) !== signature) return null

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (!parsed?.userId || !parsed?.exp || parsed.exp < Math.floor(Date.now() / 1000)) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}
