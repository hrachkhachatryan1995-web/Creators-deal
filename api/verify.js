export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body ?? {}
  if (typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' })
  }

  const apiKey = process.env.LEMON_SQUEEZY_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Payment verification not configured' })
  }

  try {
    const response = await fetch(
      `https://api.lemonsqueezy.com/v1/subscriptions?filter[user_email]=${encodeURIComponent(email.trim().toLowerCase())}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: 'application/vnd.api+json',
        },
      },
    )

    if (!response.ok) {
      return res.status(502).json({ error: 'Could not reach payment provider' })
    }

    const data = await response.json()
    const subscriptions = data?.data || []

    const variantId = process.env.LEMON_SQUEEZY_VARIANT_ID
      ? String(process.env.LEMON_SQUEEZY_VARIANT_ID)
      : null

    const active = subscriptions.find((sub) => {
      const status = sub?.attributes?.status
      const subVariantId = String(sub?.attributes?.variant_id || '')
      const isActive = status === 'active' || status === 'trialing' || status === 'past_due'
      if (variantId) return isActive && subVariantId === variantId
      return isActive
    })

    if (active) {
      return res.status(200).json({ plan: 'pro' })
    }

    // Also check orders (one-time payments) just in case
    const ordersResponse = await fetch(
      `https://api.lemonsqueezy.com/v1/orders?filter[user_email]=${encodeURIComponent(email.trim().toLowerCase())}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: 'application/vnd.api+json',
        },
      },
    )

    if (ordersResponse.ok) {
      const ordersData = await ordersResponse.json()
      const orders = ordersData?.data || []
      const paidOrder = orders.find((o) => o?.attributes?.status === 'paid')
      if (paidOrder) {
        return res.status(200).json({ plan: 'pro' })
      }
    }

    return res.status(200).json({ plan: 'free' })
  } catch {
    return res.status(502).json({ error: 'Verification failed, please try again' })
  }
}
