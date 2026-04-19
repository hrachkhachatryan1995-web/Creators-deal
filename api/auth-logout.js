import { clearAppSession } from '../server/appSession.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  clearAppSession(res)
  return res.status(200).json({ ok: true })
}
