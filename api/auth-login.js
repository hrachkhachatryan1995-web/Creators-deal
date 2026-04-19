import { setAppSession } from '../server/appSession.js'
import { getProfileById, sanitizeProfile, supabaseSignIn, upsertProfile } from '../server/supabase.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const email = String(req.body?.email || '').trim().toLowerCase()
  const password = String(req.body?.password || '')

  if (!email.includes('@') || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  try {
    const data = await supabaseSignIn({ email, password })
    const user = data?.user

    if (!user?.id) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const existingProfile = await getProfileById(user.id)
    const profile = await upsertProfile({
      id: user.id,
      email,
      plan: existingProfile?.plan || 'free',
      is_email_verified: Boolean(user.email_confirmed_at),
      last_login_at: new Date().toISOString(),
    })

    setAppSession(res, { userId: user.id })
    return res.status(200).json({ user: sanitizeProfile(profile) })
  } catch (error) {
    return res.status(401).json({ error: error.message || 'Invalid email or password' })
  }
}
