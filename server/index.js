import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import OpenAI from 'openai'

dotenv.config()

const app = express()
const port = 5000
const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'
const includeDebug = process.env.NODE_ENV !== 'production'
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

app.use(cors())
app.use(express.json())

function pick(items) {
  return items[Math.floor(Math.random() * items.length)]
}

function formatMoney(value) {
  const amount = Math.round(Number(value) || 0)
  return `$${amount}`
}

function extractBudgetFromMessage(message) {
  const match = message.match(/(?:\$\s?|USD\s?)(\d+(?:\.\d{1,2})?)/i) || message.match(/(\d+(?:\.\d{1,2})?)\s?(?:usd|dollars?)/i)
  return match ? Number(match[1]) : null
}

function extractDeliverableFromMessage(message) {
  const lowerMessage = message.toLowerCase()
  const deliverables = [
    ['ugc video', 'a UGC video'],
    ['short sponsored video', 'a short sponsored video'],
    ['sponsored video', 'a sponsored video'],
    ['video', 'a video'],
    ['reel', 'a reel'],
    ['story', 'a story set'],
    ['post', 'a post'],
    ['campaign', 'the campaign'],
  ]

  const match = deliverables.find(([keyword]) => lowerMessage.includes(keyword))
  return match ? match[1] : null
}

function formatNegotiationTerms(negotiationContext) {
  if (!negotiationContext || negotiationContext.pricingMode !== 'pro') {
    return ''
  }

  const usageRights = negotiationContext.usageRights || 'organic'
  const exclusivityDays = Number(negotiationContext.exclusivityDays) || 0
  const deliverables = Number(negotiationContext.deliverables) || 1
  const turnaround = negotiationContext.turnaround || 'standard'
  const anchorRate = Math.round(Number(negotiationContext.anchorRate) || 0)

  return `The quote includes ${deliverables} deliverable(s), ${usageRights} usage rights, ${exclusivityDays}-day exclusivity, and ${turnaround} delivery${anchorRate ? `, anchored around $${anchorRate}` : ''}.`
}

function buildStatusParagraph({ offerStatus, targetPrice, offeredBudget, deliverable, negotiationContext }) {
  const targetPriceText = formatMoney(targetPrice)
  const offeredBudgetText = offeredBudget ? formatMoney(offeredBudget) : null
  const deliverableText = deliverable || 'this collaboration'
  const termsLine = formatNegotiationTerms(negotiationContext)

  if (offerStatus === 'Underpaid') {
    return pick([
      `${offeredBudgetText ? `I saw the proposed budget of ${offeredBudgetText}. ` : ''}For ${deliverableText}, my rate would need to be closer to ${targetPriceText} to make sense on my side.${termsLine ? ` ${termsLine}` : ''}`,
      `${offeredBudgetText ? `Thanks for sharing the ${offeredBudgetText} budget. ` : ''}Given the scope of ${deliverableText}, I would be looking for ${targetPriceText}.${termsLine ? ` ${termsLine}` : ''}`,
      `Based on the production time and value involved in ${deliverableText}, my rate for this type of partnership is ${targetPriceText}.${termsLine ? ` ${termsLine}` : ''}`,
    ])
  }

  if (offerStatus === 'Good deal') {
    return pick([
      `${offeredBudgetText ? `${offeredBudgetText} works for me, ` : ''}and I would be happy to move forward with ${deliverableText}.${termsLine ? ` ${termsLine}` : ''}`,
      `This feels aligned for ${deliverableText}, and I would be glad to continue with the next steps at ${targetPriceText}.${termsLine ? ` ${termsLine}` : ''}`,
      `The offer looks strong for ${deliverableText}, and I am open to moving ahead from here.${termsLine ? ` ${termsLine}` : ''}`,
    ])
  }

  return pick([
    `${offeredBudgetText ? `The budget you shared is in a workable range. ` : ''}I would be comfortable moving ahead at ${targetPriceText} for ${deliverableText}.${termsLine ? ` ${termsLine}` : ''}`,
    `This looks close to a fit, and ${targetPriceText} would be the right number for me on ${deliverableText}.${termsLine ? ` ${termsLine}` : ''}`,
    `I would be happy to proceed with ${deliverableText}, with ${targetPriceText} as the final rate.${termsLine ? ` ${termsLine}` : ''}`,
  ])
}

function getSafeErrorDetails(error) {
  return {
    status: error?.status || 'unknown',
    code: error?.code || 'unknown',
    message: String(error?.message || 'Unknown OpenAI error').slice(0, 220),
  }
}

function generateReply({ brandMessage, targetPrice, offerStatus, brandOffer, negotiationContext }) {
  const normalizedMessage = String(brandMessage || '').trim()
  const offeredBudget = Number(brandOffer) || extractBudgetFromMessage(normalizedMessage)
  const deliverable = extractDeliverableFromMessage(normalizedMessage)
  const greeting = pick([
    'Hi there,',
    'Hi team,',
    'Hello,',
  ])
  const opener = normalizedMessage
    ? pick([
        'Thank you for reaching out and sharing the campaign details.',
        'I appreciate you sending this opportunity over.',
        'Thanks for the message and for thinking of me for this collaboration.',
      ])
    : pick([
        'Thank you for reaching out.',
        'I appreciate the collaboration inquiry.',
        'Thanks for considering me for this opportunity.',
      ])
  const statusParagraph = buildStatusParagraph({
    offerStatus,
    targetPrice,
    offeredBudget,
    deliverable,
    negotiationContext,
  })
  const nextStep =
    offerStatus === 'Underpaid'
      ? pick([
          'If you have room to adjust the budget, I would be happy to keep the conversation going.',
          'If that rate is workable for your team, I can share availability and deliverable details.',
          'If you can come closer to that number, I would be glad to discuss next steps.',
        ])
      : pick([
          'If that works for your team, I can send over availability and timing.',
          'If you would like to move ahead, I am happy to confirm next steps.',
          'If this aligns on your side, I would be glad to finalize details.',
        ])
  const signOff = pick([
    'Best,\n[Your Name]',
    'Best regards,\n[Your Name]',
    'Looking forward to hearing from you,\n[Your Name]',
  ])

  return [greeting, opener, statusParagraph, nextStep, signOff].filter(Boolean).join('\n\n')
}

async function generateReplyWithAI({ brandMessage, targetPrice, offerStatus, negotiationContext }) {
  const systemPrompt =
    'You are an assistant helping content creators negotiate brand collaborations. Write concise, professional, confident, and polite replies. Never be aggressive. Output only the reply message body with greeting and sign-off.'

  const userPrompt = [
    `Brand message: ${brandMessage}`,
    `Offer status: ${offerStatus}`,
    `Target price in USD: ${targetPrice}`,
    `Negotiation context: ${JSON.stringify(negotiationContext || {})}`,
    'Write a reply that thanks the brand, references value delivered, and proposes the target price clearly.',
  ].join('\n')

  const response = await openai.responses.create({
    model,
    input: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  })

  return response.output_text?.trim() || generateReply({ brandMessage, targetPrice, offerStatus })
}

app.post('/api/reply', async (req, res) => {
  const { brandMessage, targetPrice, offerStatus, brandOffer, negotiationContext } = req.body ?? {}

  if (typeof brandMessage !== 'string') {
    return res.status(400).json({ error: 'brandMessage must be a string.' })
  }

  const payload = {
    brandMessage,
    targetPrice: Number(targetPrice) || 0,
    offerStatus: offerStatus || 'Fair',
    brandOffer: Number(brandOffer) || 0,
    negotiationContext:
      negotiationContext && typeof negotiationContext === 'object'
        ? negotiationContext
        : {},
  }

  try {
    if (!openai) {
      const fallbackResponse = {
        reply: generateReply(payload),
        source: 'template-fallback',
      }

      if (includeDebug) {
        fallbackResponse.debug = {
          reason: 'OPENAI_API_KEY_MISSING',
          model,
        }
      }

      return res.json(fallbackResponse)
    }

    const reply = await generateReplyWithAI(payload)
    return res.json({ reply, source: 'openai' })
  } catch (error) {
    console.error('AI generation failed, using fallback template:', error)
    const fallbackResponse = {
      reply: generateReply(payload),
      source: 'template-fallback',
    }

    if (includeDebug) {
      fallbackResponse.debug = {
        reason: 'OPENAI_REQUEST_FAILED',
        model,
        error: getSafeErrorDetails(error),
      }
    }

    return res.json(fallbackResponse)
  }
})

app.listen(port, () => {
  console.log(`Creator Deal Assistant API running on http://localhost:${port}`)
})
