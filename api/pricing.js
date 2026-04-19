import { requireCurrentUser } from '../server/currentUser.js'
import { calculatePrice } from '../server/pricing-core.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const user = await requireCurrentUser(req, res)
  if (!user) return

  if (user.plan !== 'pro') {
    return res.status(403).json({ error: 'Pro access required' })
  }

  const pricing = calculatePrice({ ...(req.body ?? {}), pricingMode: 'pro' })
  return res.status(200).json(pricing)
}
