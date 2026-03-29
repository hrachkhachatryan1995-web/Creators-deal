const platformMultiplier = {
  TikTok: 1.2,
  Instagram: 1,
  YouTube: 1,
}

const contentMultiplier = {
  post: 1,
  story: 1,
  video: 2,
  UGC: 1,
}

export function calculatePrice({ followers, engagementRate, platform, contentType }) {
  const followersNum = Number(followers) || 0
  const engagementDecimal = (Number(engagementRate) || 0) / 100

  const base = followersNum * engagementDecimal
  let rate = base * 0.02

  rate *= platformMultiplier[platform] ?? 1
  rate *= contentMultiplier[contentType] ?? 1

  if (contentType === 'UGC') {
    rate += 50
  }

  const min = Math.max(25, Math.round(rate * 0.8))
  const max = Math.max(min + 20, Math.round(rate * 1.3))

  const explanation = `Based on your audience size, engagement, ${platform} demand, and ${contentType} deliverable, this is a fair baseline range.`

  return {
    min,
    max,
    explanation,
  }
}

export function analyzeOffer(offerPrice, priceRange) {
  const offer = Number(offerPrice) || 0
  const mid = Math.round((priceRange.min + priceRange.max) / 2)

  if (offer < priceRange.min) {
    return {
      status: 'Underpaid',
      betterPrice: mid,
    }
  }

  if (offer <= priceRange.max) {
    return {
      status: 'Fair',
      betterPrice: Math.max(offer, mid),
    }
  }

  return {
    status: 'Good deal',
    betterPrice: offer,
  }
}
