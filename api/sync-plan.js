import { requireCurrentUser } from '../server/currentUser.js'
import { sanitizeProfile, upsertProfile } from '../server/supabase.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const user = await requireCurrentUser(req, res)
  if (!user) return

  if (!user.is_email_verified) {
    return res.status(403).json({ error: 'Verify your email before syncing your purchase' })
  }

  const apiKey = process.env.LEMON_SQUEEZY_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Payment verification not configured' })
  }

  const email = String(user.email || '').trim().toLowerCase()

  try {
    const subscriptionsResponse = await fetch(
      `https://api.lemonsqueezy.com/v1/subscriptions?filter[user_email]=${encodeURIComponent(email)}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: 'application/vnd.api+json',
        },
      },
    )

    if (!subscriptionsResponse.ok) {
      return res.status(502).json({ error: 'Could not reach payment provider' })
    }

    const subscriptionsData = await subscriptionsResponse.json()
    const subscriptions = subscriptionsData?.data || []
    const variantId = process.env.LEMON_SQUEEZY_VARIANT_ID ? String(process.env.LEMON_SQUEEZY_VARIANT_ID) : null

    const activeSubscription = subscriptions.find((subscription) => {
      const status = subscription?.attributes?.status
      const subscriptionVariantId = String(subscription?.attributes?.variant_id || '')
      const isActive = status === 'active' || status === 'trialing' || status === 'past_due'
      return variantId ? isActive && subscriptionVariantId === variantId : isActive
    })

    let plan = 'free'
    if (activeSubscription) {
      plan = 'pro'
    } else {
      const ordersResponse = await fetch(
        `https://api.lemonsqueezy.com/v1/orders?filter[user_email]=${encodeURIComponent(email)}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            Accept: 'application/vnd.api+json',
          },
        },
      )

      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json()
        const paidOrder = (ordersData?.data || []).find((order) => order?.attributes?.status === 'paid')
        if (paidOrder) {
          plan = 'pro'
        }
      }
    }

    const updatedProfile = await upsertProfile({
      id: user.id,
      email,
      plan,
      is_email_verified: true,
      last_login_at: user.last_login_at,
    })

    return res.status(200).json({
      plan,
      user: sanitizeProfile(updatedProfile),
    })
  } catch (error) {
    return res.status(502).json({ error: error.message || 'Verification failed, please try again' })
  }
}
