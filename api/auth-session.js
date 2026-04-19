import { getCurrentUser } from '../server/currentUser.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const user = await getCurrentUser(req)
    return res.status(200).json({ user })
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Could not load session' })
  }
}
