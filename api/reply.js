import OpenAI from 'openai'

const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'
const includeDebug = process.env.NODE_ENV !== 'production'

function pick(items) {
  return items[Math.floor(Math.random() * items.length)]
}

function formatMoney(value) {
  const amount = Math.round(Number(value) || 0)
  return `$${amount}`
}

function extractBudgetFromMessage(message) {
  const match =
    message.match(/(?:\$\s?|USD\s?)(\d+(?:\.\d{1,2})?)/i) ||
    message.match(/(\d+(?:\.\d{1,2})?)\s?(?:usd|dollars?)/i)
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

function buildStatusParagraph({ offerStatus, targetPrice, offeredBudget, deliverable }) {
  const targetPriceText = formatMoney(targetPrice)
  const offeredBudgetText = offeredBudget ? formatMoney(offeredBudget) : null
  const deliverableText = deliverable || 'this collaboration'

  if (offerStatus === 'Underpaid') {
    return pick([
      `${offeredBudgetText ? `I saw the proposed budget of ${offeredBudgetText}. ` : ''}For ${deliverableText}, my rate would need to be closer to ${targetPriceText} to make sense on my side.`,
      `${offeredBudgetText ? `Thanks for sharing the ${offeredBudgetText} budget. ` : ''}Given the scope of ${deliverableText}, I would be looking for ${targetPriceText}.`,
      `Based on the production time and value involved in ${deliverableText}, my rate for this type of partnership is ${targetPriceText}.`,
    ])
  }

  if (offerStatus === 'Good deal') {
    return pick([
      `${offeredBudgetText ? `${offeredBudgetText} works for me, ` : ''}and I would be happy to move forward with ${deliverableText}.`,
      `This feels aligned for ${deliverableText}, and I would be glad to continue with the next steps at ${targetPriceText}.`,
      `The offer looks strong for ${deliverableText}, and I am open to moving ahead from here.`,
    ])
  }

  return pick([
    `${offeredBudgetText ? `The budget you shared is in a workable range. ` : ''}I would be comfortable moving ahead at ${targetPriceText} for ${deliverableText}.`,
    `This looks close to a fit, and ${targetPriceText} would be the right number for me on ${deliverableText}.`,
    `I would be happy to proceed with ${deliverableText}, with ${targetPriceText} as the final rate.`,
  ])
}

function getSafeErrorDetails(error) {
  return {
    status: error?.status || 'unknown',
    code: error?.code || 'unknown',
    message: String(error?.message || 'Unknown OpenAI error').slice(0, 220),
  }
}

function generateReply({ brandMessage, targetPrice, offerStatus, brandOffer }) {
  const normalizedMessage = String(brandMessage || '').trim()
  const offeredBudget = Number(brandOffer) || extractBudgetFromMessage(normalizedMessage)
  const deliverable = extractDeliverableFromMessage(normalizedMessage)

  const greeting = pick(['Hi there,', 'Hi team,', 'Hello,'])
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

async function generateReplyWithAI({ brandMessage, targetPrice, offerStatus }) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return null
  }

  const openai = new OpenAI({ apiKey })
  const systemPrompt =
    'You are an assistant helping content creators negotiate brand collaborations. Write concise, professional, confident, and polite replies. Never be aggressive. Output only the reply message body with greeting and sign-off.'

  const userPrompt = [
    `Brand message: ${brandMessage}`,
    `Offer status: ${offerStatus}`,
    `Target price in USD: ${targetPrice}`,
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

  return response.output_text?.trim() || null
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { brandMessage, targetPrice, offerStatus, brandOffer } = req.body ?? {}

  if (typeof brandMessage !== 'string') {
    return res.status(400).json({ error: 'brandMessage must be a string.' })
  }

  const payload = {
    brandMessage,
    targetPrice: Number(targetPrice) || 0,
    offerStatus: offerStatus || 'Fair',
    brandOffer: Number(brandOffer) || 0,
  }

  try {
    const aiReply = await generateReplyWithAI(payload)
    if (aiReply) {
      return res.status(200).json({ reply: aiReply, source: 'openai' })
    }

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

    return res.status(200).json(fallbackResponse)
  } catch (error) {
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

    return res.status(200).json(fallbackResponse)
  }
}
