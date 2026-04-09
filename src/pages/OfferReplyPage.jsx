import { useState } from 'react'
import useRevealAnimation from '../hooks/useRevealAnimation'

const TONE_OPTIONS = [
  { value: 'professional', label: 'Professional' },
  { value: 'warm', label: 'Warm & Friendly' },
  { value: 'firm', label: 'Firm & Direct' },
]

export default function OfferReplyPage() {
  const rootRef = useRevealAnimation({ cardStagger: 0.08 })
  const [offerText, setOfferText] = useState('')
  const [tone, setTone] = useState('professional')
  const [reply, setReply] = useState('')
  const [replySource, setReplySource] = useState('')
  const [replyDebug, setReplyDebug] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!offerText.trim()) return

    setIsLoading(true)
    setCopied(false)
    setReply('')
    setReplySource('')
    setReplyDebug('')

    try {
      const response = await fetch('/api/offer-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerText, tone }),
      })

      if (!response.ok) throw new Error('Request failed')

      const data = await response.json()
      setReply(data.reply || '')
      setReplySource(data.source || '')
      if (data.debug) {
        const debugMsg = data.debug.error?.message
          ? `${data.debug.reason}: ${data.debug.error.message}`
          : data.debug.reason || ''
        setReplyDebug(debugMsg)
      }
    } catch {
      setReply(
        'Hi there,\n\nThank you for reaching out about this collaboration opportunity. I appreciate you thinking of me for this campaign.\n\nI would love to discuss the details further, including the budget, deliverables, and timeline. Could you share more information so I can put together a proper response?\n\nLooking forward to hearing from you,\n[Your Name]',
      )
      setReplySource('template-fallback')
      setReplyDebug('REQUEST_FAILED')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!reply) return
    try {
      await navigator.clipboard.writeText(reply)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }

  const handleClear = () => {
    setOfferText('')
    setReply('')
    setReplySource('')
    setReplyDebug('')
    setCopied(false)
  }

  return (
    <div ref={rootRef} className="space-y-6">
      <section data-card className="hero-banner glow-border relative rounded-[1.8rem] panel px-5 py-7 sm:rounded-[2.25rem] sm:px-10 sm:py-10">
        <span className="eyebrow">AI Offer Reply</span>
        <h1 className="gradient-text mt-3 text-[2rem] leading-tight sm:text-4xl lg:text-5xl">
          Paste an offer, get a reply
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
          Copy and paste any brand collaboration offer or outreach email. The AI will read the context and generate a polished, professional response letter for you.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section data-card className="rounded-[2rem] panel p-6">
          <h2 className="text-xl font-semibold text-[var(--ink)]">Brand Offer</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Paste the full offer or outreach email below.</p>

          <label className="mt-5 block text-sm font-medium text-[var(--muted)]">
            Offer text
            <textarea
              rows="12"
              className="form-field resize-y mt-1"
              placeholder="Hi! We are reaching out on behalf of [Brand Name]. We would love to collaborate with you on an upcoming campaign. We are offering $300 for a short sponsored video on TikTok..."
              value={offerText}
              onChange={(e) => setOfferText(e.target.value)}
            />
          </label>

          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-[var(--muted)]">Reply tone</p>
            <div className="inline-flex rounded-full border border-white/15 bg-white/5 p-1 text-xs sm:text-sm">
              {TONE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTone(option.value)}
                  className={`rounded-full px-4 py-1.5 transition ${
                    tone === option.value
                      ? 'bg-[var(--primary)] text-white'
                      : 'text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              className="soft-button"
              onClick={handleGenerate}
              disabled={isLoading || !offerText.trim()}
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Generating...
                </span>
              ) : (
                'Generate reply'
              )}
            </button>

            {(offerText || reply) && (
              <button type="button" className="soft-secondary-button" onClick={handleClear}>
                Clear
              </button>
            )}
          </div>
        </section>

        <section data-card className="rounded-[2rem] panel p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-[var(--ink)]">Generated Reply</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">Your AI-crafted response letter.</p>
            </div>
            <button
              type="button"
              className="soft-secondary-button shrink-0"
              onClick={handleCopy}
              disabled={!reply}
            >
              {copied ? 'Copied ✓' : 'Copy reply'}
            </button>
          </div>


          {replyDebug && (
            <p className="mt-1 text-xs text-[#fca5a5]">
              Debug: <span className="font-semibold">{replyDebug}</span>
            </p>
          )}

          <div className="mt-4 min-h-[280px] rounded-[1.5rem] panel-soft p-5">
            {reply ? (
              <p className="whitespace-pre-wrap text-sm leading-7 text-[var(--muted)]">{reply}</p>
            ) : (
              <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-3 text-center">
                <span className="text-3xl opacity-30">✉</span>
                <p className="text-sm text-[var(--muted)] opacity-60">
                  Paste an offer on the left and click Generate reply.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
