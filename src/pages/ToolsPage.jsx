import { useEffect, useMemo, useState } from 'react'
import { analyzeOffer, calculatePrice } from '../utils/pricing'
import useRevealAnimation from '../hooks/useRevealAnimation'

const SCENARIO_STORAGE_KEY = 'creator-deal-scenarios-v1'

export default function ToolsPage() {
  const rootRef = useRevealAnimation({ cardStagger: 0.08 })
  const [pricingMode, setPricingMode] = useState('pro')
  const [followers, setFollowers] = useState('50000')
  const [engagementRate, setEngagementRate] = useState('4.5')
  const [avgViews, setAvgViews] = useState('22000')
  const [avgStoryViews, setAvgStoryViews] = useState('6500')
  const [platform, setPlatform] = useState('TikTok')
  const [multiPlatform, setMultiPlatform] = useState(true)
  const [secondaryPlatform, setSecondaryPlatform] = useState('Instagram')
  const [secondaryFollowers, setSecondaryFollowers] = useState('30000')
  const [secondaryEngagementRate, setSecondaryEngagementRate] = useState('3.2')
  const [secondaryAvgViews, setSecondaryAvgViews] = useState('11000')
  const [secondaryAvgStoryViews, setSecondaryAvgStoryViews] = useState('4200')
  const [audienceOverlap, setAudienceOverlap] = useState('35')
  const [bundleType, setBundleType] = useState('crosspost')
  const [contentType, setContentType] = useState('video')
  const [niche, setNiche] = useState('tech')
  const [creatorTier, setCreatorTier] = useState('steady')
  const [productionLevel, setProductionLevel] = useState('standard')
  const [usageRights, setUsageRights] = useState('paidAds30')
  const [exclusivityDays, setExclusivityDays] = useState('30')
  const [deliverables, setDeliverables] = useState('1')
  const [turnaround, setTurnaround] = useState('standard')
  const [revisions, setRevisions] = useState('1')
  const [geo, setGeo] = useState('global')
  const [brandOffer, setBrandOffer] = useState('120')
  const [brandMessage, setBrandMessage] = useState('Hi! We would love to collaborate on a short sponsored video. Our budget is $120 for this campaign.')
  const [reply, setReply] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [savedScenarios, setSavedScenarios] = useState([])
  const [scenarioNotice, setScenarioNotice] = useState('')

  const priceRange = useMemo(
    () =>
      calculatePrice({
        followers,
        engagementRate,
        avgViews,
        avgStoryViews,
        platform,
        contentType,
        multiPlatform,
        secondaryPlatform,
        secondaryFollowers,
        secondaryEngagementRate,
        secondaryAvgViews,
        secondaryAvgStoryViews,
        audienceOverlap,
        bundleType,
        pricingMode,
        niche,
        creatorTier,
        productionLevel,
        usageRights,
        exclusivityDays,
        deliverables,
        turnaround,
        revisions,
        geo,
      }),
    [followers, engagementRate, avgViews, avgStoryViews, platform, contentType, multiPlatform, secondaryPlatform, secondaryFollowers, secondaryEngagementRate, secondaryAvgViews, secondaryAvgStoryViews, audienceOverlap, bundleType, pricingMode, niche, creatorTier, productionLevel, usageRights, exclusivityDays, deliverables, turnaround, revisions, geo],
  )

  const offerResult = useMemo(
    () => analyzeOffer(brandOffer, priceRange),
    [brandOffer, priceRange],
  )

  const counterOffer = useMemo(() => {
    if (priceRange.mode !== 'pro' || !priceRange.breakdown) {
      return offerResult.betterPrice
    }

    return Math.max(offerResult.betterPrice, priceRange.breakdown.recommendedAsk)
  }, [offerResult.betterPrice, priceRange])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SCENARIO_STORAGE_KEY)
      if (!stored) {
        return
      }

      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        setSavedScenarios(parsed)
      }
    } catch {
      setSavedScenarios([])
    }
  }, [])

  const persistScenarios = (nextScenarios) => {
    setSavedScenarios(nextScenarios)
    localStorage.setItem(SCENARIO_STORAGE_KEY, JSON.stringify(nextScenarios))
  }

  const handleSaveScenario = () => {
    const scenario = {
      id: `${Date.now()}`,
      label: `${platform} ${contentType} • ${followers} followers`,
      pricingMode,
      followers,
      engagementRate,
      avgViews,
      avgStoryViews,
      platform,
      multiPlatform,
      secondaryPlatform,
      secondaryFollowers,
      secondaryEngagementRate,
      secondaryAvgViews,
      secondaryAvgStoryViews,
      audienceOverlap,
      bundleType,
      contentType,
      niche,
      creatorTier,
      productionLevel,
      usageRights,
      exclusivityDays,
      deliverables,
      turnaround,
      revisions,
      geo,
      brandOffer,
      min: priceRange.min,
      max: priceRange.max,
      counterOffer,
      savedAt: new Date().toISOString(),
    }

    const nextScenarios = [scenario, ...savedScenarios].slice(0, 6)
    persistScenarios(nextScenarios)
    setScenarioNotice('Scenario saved')
    setTimeout(() => setScenarioNotice(''), 1400)
  }

  const handleLoadScenario = (scenario) => {
    setPricingMode(scenario.pricingMode || 'basic')
    setFollowers(String(scenario.followers || '0'))
    setEngagementRate(String(scenario.engagementRate || '0'))
    setAvgViews(String(scenario.avgViews || '0'))
    setAvgStoryViews(String(scenario.avgStoryViews || '0'))
    setPlatform(scenario.platform || 'TikTok')
    setMultiPlatform(Boolean(scenario.multiPlatform))
    setSecondaryPlatform(scenario.secondaryPlatform || 'Instagram')
    setSecondaryFollowers(String(scenario.secondaryFollowers || '0'))
    setSecondaryEngagementRate(String(scenario.secondaryEngagementRate || '0'))
    setSecondaryAvgViews(String(scenario.secondaryAvgViews || '0'))
    setSecondaryAvgStoryViews(String(scenario.secondaryAvgStoryViews || '0'))
    setAudienceOverlap(String(scenario.audienceOverlap || '0'))
    setBundleType(scenario.bundleType || 'crosspost')
    setContentType(scenario.contentType || 'video')
    setNiche(scenario.niche || 'lifestyle')
    setCreatorTier(scenario.creatorTier || 'steady')
    setProductionLevel(scenario.productionLevel || 'standard')
    setUsageRights(scenario.usageRights || 'organic')
    setExclusivityDays(String(scenario.exclusivityDays || '0'))
    setDeliverables(String(scenario.deliverables || '1'))
    setTurnaround(scenario.turnaround || 'standard')
    setRevisions(String(scenario.revisions || '1'))
    setGeo(scenario.geo || 'global')
    setBrandOffer(String(scenario.brandOffer || '0'))
    setScenarioNotice('Scenario loaded')
    setTimeout(() => setScenarioNotice(''), 1400)
  }

  const handleDeleteScenario = (scenarioId) => {
    const nextScenarios = savedScenarios.filter((scenario) => scenario.id !== scenarioId)
    persistScenarios(nextScenarios)
  }

  const handleGenerateReply = async () => {
    setIsLoading(true)
    setCopied(false)

    try {
      const response = await fetch('/api/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brandMessage,
          brandOffer,
          targetPrice: counterOffer,
          offerStatus: offerResult.status,
          negotiationContext: {
            pricingMode,
            platform,
            multiPlatform,
            secondaryPlatform,
            contentType,
            niche,
            creatorTier,
            productionLevel,
            usageRights,
            exclusivityDays,
            deliverables,
            turnaround,
            revisions,
            geo,
            audienceOverlap,
            bundleType,
            avgViews,
            avgStoryViews,
            secondaryAvgViews,
            secondaryAvgStoryViews,
            minRate: priceRange.min,
            maxRate: priceRange.max,
            anchorRate: priceRange.breakdown?.targetQuote || counterOffer,
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Reply generation failed')
      }

      const data = await response.json()
      setReply(data.reply)
    } catch {
      setReply('Hi, thank you for the offer. Based on the scope of this collaboration, my standard rate is higher, and the suggested range above is closer to what works for me. If that fits your budget, I would be happy to discuss next steps.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!reply) {
      return
    }

    try {
      await navigator.clipboard.writeText(reply)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div ref={rootRef} className="space-y-6">
      <section data-card className="rounded-[2rem] panel p-6 sm:p-8">
        <h1 className="text-4xl text-[var(--ink)]">Creator Tools</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
          Use the full creator workflow in one place: estimate your rate, review the offer, and generate a polished response for the brand.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-12">
        <section data-card className="rounded-[2rem] panel lg:col-span-7 p-6">
          <h2 className="text-2xl text-[var(--ink)]">Pricing Calculator</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Switch to Pro mode for a market-real quote with usage rights and deal terms.</p>

          <div className="mt-5 inline-flex rounded-full border border-white/15 bg-white/5 p-1 text-xs sm:text-sm">
            <button
              type="button"
              onClick={() => setPricingMode('basic')}
              className={`rounded-full px-4 py-1.5 transition ${pricingMode === 'basic' ? 'bg-[var(--secondary)] text-[#032936]' : 'text-[var(--muted)] hover:text-[var(--ink)]'}`}
            >
              Basic
            </button>
            <button
              type="button"
              onClick={() => setPricingMode('pro')}
              className={`rounded-full px-4 py-1.5 transition ${pricingMode === 'pro' ? 'bg-[var(--primary)] text-white' : 'text-[var(--muted)] hover:text-[var(--ink)]'}`}
            >
              Pro
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-[var(--muted)]">
              Followers
              <input type="number" min="0" className="form-field" value={followers} onChange={(event) => setFollowers(event.target.value)} />
            </label>

            <label className="text-sm font-medium text-[var(--muted)]">
              Engagement rate (%)
              <input type="number" min="0" step="0.1" className="form-field" value={engagementRate} onChange={(event) => setEngagementRate(event.target.value)} />
            </label>

            <label className="text-sm font-medium text-[var(--muted)]">
              Average views / reach
              <input type="number" min="0" className="form-field" value={avgViews} onChange={(event) => setAvgViews(event.target.value)} />
            </label>

            <label className="text-sm font-medium text-[var(--muted)]">
              Platform
              <select className="form-field" value={platform} onChange={(event) => setPlatform(event.target.value)}>
                <option value="TikTok">TikTok</option>
                <option value="Instagram">Instagram</option>
                <option value="YouTube">YouTube</option>
              </select>
            </label>

            <label className="text-sm font-medium text-[var(--muted)]">
              Multi-platform bundle
              <select className="form-field" value={multiPlatform ? 'yes' : 'no'} onChange={(event) => setMultiPlatform(event.target.value === 'yes')}>
                <option value="no">Single platform</option>
                <option value="yes">Instagram + TikTok bundle</option>
              </select>
            </label>

            <label className="text-sm font-medium text-[var(--muted)]">
              Content type
              <select className="form-field" value={contentType} onChange={(event) => setContentType(event.target.value)}>
                <option value="post">Post</option>
                <option value="story">Story</option>
                <option value="video">Video</option>
                <option value="UGC">UGC</option>
              </select>
            </label>

            {contentType === 'story' && (
              <label className="text-sm font-medium text-[var(--muted)]">
                Average story views
                <input type="number" min="0" className="form-field" value={avgStoryViews} onChange={(event) => setAvgStoryViews(event.target.value)} />
              </label>
            )}

            {multiPlatform && (
              <>
                <label className="text-sm font-medium text-[var(--muted)]">
                  Second platform
                  <select className="form-field" value={secondaryPlatform} onChange={(event) => setSecondaryPlatform(event.target.value)}>
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="YouTube">YouTube</option>
                  </select>
                </label>

                <label className="text-sm font-medium text-[var(--muted)]">
                  Second platform followers
                  <input type="number" min="0" className="form-field" value={secondaryFollowers} onChange={(event) => setSecondaryFollowers(event.target.value)} />
                </label>

                <label className="text-sm font-medium text-[var(--muted)]">
                  Second platform engagement (%)
                  <input type="number" min="0" step="0.1" className="form-field" value={secondaryEngagementRate} onChange={(event) => setSecondaryEngagementRate(event.target.value)} />
                </label>

                <label className="text-sm font-medium text-[var(--muted)]">
                  Second platform average views
                  <input type="number" min="0" className="form-field" value={secondaryAvgViews} onChange={(event) => setSecondaryAvgViews(event.target.value)} />
                </label>

                {contentType === 'story' && (
                  <label className="text-sm font-medium text-[var(--muted)]">
                    Second platform story views
                    <input type="number" min="0" className="form-field" value={secondaryAvgStoryViews} onChange={(event) => setSecondaryAvgStoryViews(event.target.value)} />
                  </label>
                )}

                <label className="text-sm font-medium text-[var(--muted)]">
                  Audience overlap (%)
                  <input type="number" min="0" max="80" className="form-field" value={audienceOverlap} onChange={(event) => setAudienceOverlap(event.target.value)} />
                </label>

                <label className="text-sm font-medium text-[var(--muted)] sm:col-span-2">
                  Bundle type
                  <select className="form-field" value={bundleType} onChange={(event) => setBundleType(event.target.value)}>
                    <option value="crosspost">Cross-posted creative</option>
                    <option value="custom">Platform-specific creative</option>
                  </select>
                </label>
              </>
            )}

            {pricingMode === 'pro' && (
              <>
                <label className="text-sm font-medium text-[var(--muted)]">
                  Niche
                  <select className="form-field" value={niche} onChange={(event) => setNiche(event.target.value)}>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="beauty">Beauty</option>
                    <option value="fashion">Fashion</option>
                    <option value="tech">Tech</option>
                    <option value="finance">Finance</option>
                    <option value="gaming">Gaming</option>
                  </select>
                </label>

                <label className="text-sm font-medium text-[var(--muted)]">
                  Creator tier
                  <select className="form-field" value={creatorTier} onChange={(event) => setCreatorTier(event.target.value)}>
                    <option value="emerging">Emerging creator</option>
                    <option value="steady">Steady creator</option>
                    <option value="established">Established creator</option>
                    <option value="premium">Premium creator</option>
                  </select>
                </label>

                <label className="text-sm font-medium text-[var(--muted)]">
                  Production level
                  <select className="form-field" value={productionLevel} onChange={(event) => setProductionLevel(event.target.value)}>
                    <option value="light">Light production</option>
                    <option value="standard">Standard production</option>
                    <option value="polished">Polished production</option>
                    <option value="premium">Premium production</option>
                  </select>
                </label>

                <label className="text-sm font-medium text-[var(--muted)]">
                  Usage rights
                  <select className="form-field" value={usageRights} onChange={(event) => setUsageRights(event.target.value)}>
                    <option value="organic">Organic only</option>
                    <option value="paidAds30">Paid ads (30 days)</option>
                    <option value="whitelisting30">Whitelisting (30 days)</option>
                    <option value="buyout">Full buyout</option>
                  </select>
                </label>

                <label className="text-sm font-medium text-[var(--muted)]">
                  Exclusivity
                  <select className="form-field" value={exclusivityDays} onChange={(event) => setExclusivityDays(event.target.value)}>
                    <option value="0">No exclusivity</option>
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                  </select>
                </label>

                <label className="text-sm font-medium text-[var(--muted)]">
                  Deliverables
                  <input type="number" min="1" className="form-field" value={deliverables} onChange={(event) => setDeliverables(event.target.value)} />
                </label>

                <label className="text-sm font-medium text-[var(--muted)]">
                  Turnaround
                  <select className="form-field" value={turnaround} onChange={(event) => setTurnaround(event.target.value)}>
                    <option value="standard">Standard</option>
                    <option value="fast72h">Fast (72h)</option>
                    <option value="rush24h">Rush (24h)</option>
                  </select>
                </label>

                <label className="text-sm font-medium text-[var(--muted)]">
                  Revisions included
                  <input type="number" min="1" className="form-field" value={revisions} onChange={(event) => setRevisions(event.target.value)} />
                </label>

                <label className="text-sm font-medium text-[var(--muted)] sm:col-span-2">
                  Target market
                  <select className="form-field" value={geo} onChange={(event) => setGeo(event.target.value)}>
                    <option value="local">Local market</option>
                    <option value="regional">Regional market</option>
                    <option value="western">Western Europe</option>
                    <option value="usuk">US / UK</option>
                    <option value="global">Global English-speaking market</option>
                  </select>
                </label>
              </>
            )}
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-[rgba(0,200,83,0.18)] bg-[rgba(0,200,83,0.08)] p-5">
            <p className="text-sm font-semibold text-[#8ff0b2]">
              You should charge between ${priceRange.min} and ${priceRange.max} for this deal.
            </p>
            <p className="mt-2 text-sm leading-6 text-[#c4f2d2]">{priceRange.explanation}</p>

            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" className="soft-secondary-button" onClick={handleSaveScenario}>
                Save scenario
              </button>
              {scenarioNotice && <p className="self-center text-xs font-semibold text-[#a3f4bf]">{scenarioNotice}</p>}
            </div>

            {priceRange.mode === 'pro' && priceRange.breakdown && (
              <div className="mt-4 grid gap-2 text-xs text-[#c7f8d9] sm:grid-cols-2">
                <p>Base rate: ${priceRange.breakdown.baseRate}</p>
                <p>Primary platform: ${priceRange.breakdown.primaryRate}</p>
                <p>Primary views used: {priceRange.breakdown.primaryViews}</p>
                {multiPlatform && <p>Second platform: ${priceRange.breakdown.secondaryRate}</p>}
                {multiPlatform && <p>Second views used: {priceRange.breakdown.secondaryViews}</p>}
                {multiPlatform && <p>Bundle discount: -${priceRange.breakdown.overlapDiscount}</p>}
                <p>Market adjusted: ${priceRange.breakdown.marketAdjusted}</p>
                <p>Deliverables adjusted: ${priceRange.breakdown.deliverablesAdjusted}</p>
                <p>Usage fee: +${priceRange.breakdown.usageFee}</p>
                <p>Exclusivity fee: +${priceRange.breakdown.exclusivityFee}</p>
                <p>Rush fee: +${priceRange.breakdown.rushFee}</p>
                <p>Revision fee: +${priceRange.breakdown.revisionFee}</p>
                <p>Floor check: ${priceRange.breakdown.floorApplied}</p>
                <p>Minimum accept: ${priceRange.breakdown.minimumAccept}</p>
                <p>Target quote: ${priceRange.breakdown.targetQuote}</p>
                <p className="sm:col-span-2 font-semibold text-[#a3f4bf]">Recommended ask: ${priceRange.breakdown.recommendedAsk}</p>
              </div>
            )}

            {priceRange.mode === 'basic' && multiPlatform && priceRange.breakdown && (
              <div className="mt-4 grid gap-2 text-xs text-[#c7f8d9] sm:grid-cols-2">
                <p>Primary platform: ${priceRange.breakdown.primaryRate}</p>
                <p>Primary views used: {priceRange.breakdown.primaryViews}</p>
                <p>Second platform: ${priceRange.breakdown.secondaryRate}</p>
                <p>Second views used: {priceRange.breakdown.secondaryViews}</p>
                <p>Bundle discount: -${priceRange.breakdown.overlapDiscount}</p>
                <p className="sm:col-span-2 font-semibold text-[#a3f4bf]">Combined baseline: ${priceRange.breakdown.combinedRate}</p>
              </div>
            )}

            {savedScenarios.length > 0 && (
              <div className="mt-5 border-t border-[rgba(255,255,255,0.12)] pt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9fe9bc]">Saved Scenarios</p>
                <div className="mt-3 space-y-2">
                  {savedScenarios.map((scenario) => (
                    <div key={scenario.id} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                      <p className="text-xs text-[#d6fbe3]">{scenario.label}</p>
                      <p className="mt-1 text-xs text-[#b9efcf]">
                        Range: ${scenario.min}-${scenario.max} • Counter: ${scenario.counterOffer}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <button type="button" className="soft-secondary-button" onClick={() => handleLoadScenario(scenario)}>
                          Load
                        </button>
                        <button type="button" className="soft-secondary-button" onClick={() => handleDeleteScenario(scenario.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section data-card className="rounded-[2rem] panel lg:col-span-5 p-6">
          <h2 className="text-2xl text-[var(--ink)]">Offer Analyzer</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Understand whether the incoming offer is weak, fair, or strong.</p>

          <label className="mt-6 block text-sm font-medium text-[var(--muted)]">
            Brand offer price (USD)
            <input type="number" min="0" className="form-field" value={brandOffer} onChange={(event) => setBrandOffer(event.target.value)} />
          </label>

          <div className="mt-6 rounded-[1.5rem] panel-soft p-5">
            <p className="text-sm text-[var(--muted)]">Status</p>
            <p className="mt-1 text-2xl font-bold text-[var(--secondary)]">{offerResult.status}</p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Suggested counter price: <span className="font-semibold text-[var(--ink)]">${counterOffer}</span>
            </p>
            {priceRange.mode === 'pro' && priceRange.breakdown && (
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                Walk-away floor: <span className="font-semibold text-[var(--ink)]">${priceRange.breakdown.minimumAccept}</span>
              </p>
            )}
          </div>
        </section>

        <section data-card className="rounded-[2rem] panel lg:col-span-12 p-6">
          <h2 className="text-2xl text-[var(--ink)]">Reply Generator</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Generate a faster, more natural brand reply based on the offer and the message context.</p>

          <label className="mt-6 block text-sm font-medium text-[var(--muted)]">
            Brand message
            <textarea rows="5" className="form-field resize-y" value={brandMessage} onChange={(event) => setBrandMessage(event.target.value)} />
          </label>

          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" className="soft-button" onClick={handleGenerateReply} disabled={isLoading}>
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Generating...
                </span>
              ) : (
                'Generate reply'
              )}
            </button>

            <button type="button" className="soft-secondary-button" onClick={handleCopy} disabled={!reply}>
              {copied ? 'Copied' : 'Copy reply'}
            </button>
          </div>

          <div className="mt-6 rounded-[1.5rem] panel-soft p-5">
            <p className="mb-2 text-sm font-semibold text-[var(--ink)]">Generated reply</p>
            <p className="whitespace-pre-wrap text-sm leading-7 text-[var(--muted)]">
              {reply || 'Your generated brand reply will appear here.'}
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
