import { getAppOrigin, sanitizeProfile, supabaseSignUp, upsertProfile } from '../server/supabase.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const email = String(req.body?.email || '').trim().toLowerCase()
  const password = String(req.body?.password || '')

  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' })
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' })
  }

  try {
    const emailRedirectTo = `${getAppOrigin(req)}/auth?mode=login&verified=1`
    const data = await supabaseSignUp({ email, password, emailRedirectTo })
    const user = data?.user

    if (!user?.id) {
      return res.status(502).json({ error: 'Could not create account' })
    }

    const profile = await upsertProfile({
      id: user.id,
      email,
      plan: 'free',
      is_email_verified: Boolean(user.email_confirmed_at),
    })

    return res.status(201).json({
      user: sanitizeProfile(profile),
      verification: {
        sent: true,
        email,
      },
    })
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Could not create account' })
  }
}
