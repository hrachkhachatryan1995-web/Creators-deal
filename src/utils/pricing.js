const contentCpm = {
  TikTok: {
    post: 14,
    story: 8,
    video: 20,
    UGC: 22,
  },
  Instagram: {
    post: 16,
    story: 9,
    video: 22,
    UGC: 20,
  },
  YouTube: {
    post: 18,
    story: 8,
    video: 28,
    UGC: 24,
  },
}

const followerFloorPer1k = {
  TikTok: {
    post: 4,
    story: 2,
    video: 5,
    UGC: 5,
  },
  Instagram: {
    post: 5,
    story: 3,
    video: 6,
    UGC: 5,
  },
  YouTube: {
    post: 5,
    story: 2,
    video: 8,
    UGC: 6,
  },
}

const estimatedViewRatio = {
  TikTok: {
    post: 0.18,
    story: 0.08,
    video: 0.32,
    UGC: 0.24,
  },
  Instagram: {
    post: 0.14,
    story: 0.08,
    video: 0.22,
    UGC: 0.18,
  },
  YouTube: {
    post: 0.1,
    story: 0.04,
    video: 0.1,
    UGC: 0.08,
  },
}

function roundMoney(value) {
  return Math.round(value)
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function getEngagementMultiplier(engagementRate) {
  const engagement = Number(engagementRate) || 0

  if (engagement >= 8) {
    return 1.18
  }

  if (engagement >= 5) {
    return 1.1
  }

  if (engagement >= 3) {
    return 1
  }

  if (engagement >= 1.5) {
    return 0.93
  }

  return 0.86
}

function estimateViews({ followers, engagementRate, platform, contentType }) {
  const followersNum = Number(followers) || 0
  const ratio = estimatedViewRatio[platform]?.[contentType] ?? 0.12
  const engagementBoost = 1 + clamp((Number(engagementRate) || 0) / 12, 0, 0.9)
  return followersNum * ratio * engagementBoost
}

function calculateSinglePlatformBase({
  followers,
  engagementRate,
  avgViews,
  avgStoryViews,
  platform,
  contentType,
}) {
  const followersNum = Number(followers) || 0
  const providedViews = Number(contentType === 'story' ? avgStoryViews : avgViews) || 0
  const estimated = estimateViews({ followers, engagementRate, platform, contentType })
  const effectiveViews = providedViews > 0 ? Math.max(providedViews, estimated * 0.85) : estimated
  const cpm = contentCpm[platform]?.[contentType] ?? 14
  const viewBasedRate = (effectiveViews / 1000) * cpm
  const floorRate = (followersNum / 1000) * (followerFloorPer1k[platform]?.[contentType] ?? 4)
  const engagementAdjusted = Math.max(viewBasedRate, floorRate) * getEngagementMultiplier(engagementRate)

  return {
    effectiveViews: roundMoney(effectiveViews),
    estimatedViews: roundMoney(estimated),
    viewBasedRate: roundMoney(viewBasedRate),
    floorRate: roundMoney(floorRate),
    platformRate: roundMoney(engagementAdjusted),
  }
}

export function calculatePrice({
  followers,
  engagementRate,
  platform,
  contentType,
  pricingMode = 'basic',
  avgViews = 0,
  avgStoryViews = 0,
  multiPlatform = false,
  secondaryPlatform = 'Instagram',
  secondaryFollowers = 0,
  secondaryEngagementRate = 0,
  secondaryAvgViews = 0,
  secondaryAvgStoryViews = 0,
  audienceOverlap = 30,
  bundleType = 'crosspost',
}) {
  const overlapRatio = Math.min(80, Math.max(0, Number(audienceOverlap) || 0)) / 100

  const primaryResult = calculateSinglePlatformBase({
    followers,
    engagementRate,
    avgViews,
    avgStoryViews,
    platform,
    contentType,
  })
  const secondaryResult = multiPlatform
    ? calculateSinglePlatformBase({
        followers: secondaryFollowers,
        engagementRate: secondaryEngagementRate,
        avgViews: secondaryAvgViews,
        avgStoryViews: secondaryAvgStoryViews,
        platform: secondaryPlatform,
        contentType,
      })
    : null

  const primaryRate = primaryResult.platformRate
  const secondaryRate = secondaryResult?.platformRate || 0

  const overlapDiscountBase = Math.min(primaryRate, secondaryRate) * overlapRatio * 0.6
  const bundleDiscount = bundleType === 'crosspost'
    ? overlapDiscountBase + secondaryRate * 0.12
    : overlapDiscountBase * 0.45

  const combinedRate = Math.max(primaryRate, primaryRate + secondaryRate - bundleDiscount)

  const min = Math.max(25, roundMoney(combinedRate * 0.8))
  const max = Math.max(min + 20, roundMoney(combinedRate * 1.3))

  const explanation = multiPlatform
    ? `Based on your ${platform} and ${secondaryPlatform} audience, engagement, overlap, and ${contentType} bundle, this is a fair baseline range.`
    : `Based on your audience size, engagement, ${platform} demand, and ${contentType} deliverable, this is a fair baseline range.`

  return {
    min,
    max,
    explanation,
    mode: pricingMode === 'pro' ? 'pro-preview' : 'basic',
    breakdown: {
      primaryRate: roundMoney(primaryRate),
      primaryViews: primaryResult.effectiveViews,
      secondaryRate: roundMoney(secondaryRate),
      secondaryViews: secondaryResult?.effectiveViews || 0,
      overlapDiscount: roundMoney(bundleDiscount),
      combinedRate: roundMoney(combinedRate),
    },
  }
}

export function analyzeOffer(offerPrice, priceRange) {
  const offer = Number(offerPrice) || 0
  const target = priceRange.breakdown?.targetQuote || Math.round((priceRange.min + priceRange.max) / 2)

  if (offer < priceRange.min) {
    return {
      status: 'Underpaid',
      betterPrice: target,
    }
  }

  if (offer <= priceRange.max) {
    return {
      status: 'Fair',
      betterPrice: Math.max(offer, target),
    }
  }

  return {
    status: 'Good deal',
    betterPrice: offer,
  }
}
