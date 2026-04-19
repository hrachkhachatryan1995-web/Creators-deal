import { readAppSession } from './appSession.js'
import { getProfileById, sanitizeProfile } from './supabase.js'

export async function getCurrentUser(req) {
  const session = readAppSession(req)
  if (!session?.userId) return null
  const profile = await getProfileById(session.userId)
  return sanitizeProfile(profile)
}

export async function requireCurrentUser(req, res) {
  const session = readAppSession(req)
  if (!session?.userId) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  const profile = await getProfileById(session.userId)
  if (!profile) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  return profile
}
