import { useMemo, useState } from 'react'
import { analyzeOffer, calculatePrice } from '../utils/pricing'
import useRevealAnimation from '../hooks/useRevealAnimation'

export default function ToolsPage() {
  const rootRef = useRevealAnimation({ cardStagger: 0.08 })
  const [followers, setFollowers] = useState('50000')
  const [engagementRate, setEngagementRate] = useState('4.5')
  const [platform, setPlatform] = useState('TikTok')
  const [contentType, setContentType] = useState('video')
  const [brandOffer, setBrandOffer] = useState('120')
  const [brandMessage, setBrandMessage] = useState('Hi! We would love to collaborate on a short sponsored video. Our budget is $120 for this campaign.')
  const [reply, setReply] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const priceRange = useMemo(
    () =>
      calculatePrice({
        followers,
        engagementRate,
        platform,
        contentType,
      }),
    [followers, engagementRate, platform, contentType],
  )

  const offerResult = useMemo(
    () => analyzeOffer(brandOffer, priceRange),
    [brandOffer, priceRange],
  )

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
          targetPrice: offerResult.betterPrice,
          offerStatus: offerResult.status,
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
          <p className="mt-2 text-sm text-[var(--muted)]">Enter your deal details to see a fair pricing range.</p>

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
              Platform
              <select className="form-field" value={platform} onChange={(event) => setPlatform(event.target.value)}>
                <option value="TikTok">TikTok</option>
                <option value="Instagram">Instagram</option>
                <option value="YouTube">YouTube</option>
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
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-[rgba(0,200,83,0.18)] bg-[rgba(0,200,83,0.08)] p-5">
            <p className="text-sm font-semibold text-[#8ff0b2]">
              You should charge between ${priceRange.min} and ${priceRange.max} for this deal.
            </p>
            <p className="mt-2 text-sm leading-6 text-[#c4f2d2]">{priceRange.explanation}</p>
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
              Suggested counter price: <span className="font-semibold text-[var(--ink)]">${offerResult.betterPrice}</span>
            </p>
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
