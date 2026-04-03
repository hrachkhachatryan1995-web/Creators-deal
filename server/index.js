import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import OpenAI from 'openai'

dotenv.config()

const app = express()
const port = 5000
const openaiModel = process.env.OPENAI_MODEL || 'gpt-4o-mini'
const groqModel = process.env.GROQ_MODEL || 'llama-3.1-8b-instant'
const huggingFaceModel = process.env.HUGGINGFACE_MODEL || 'HuggingFaceH4/zephyr-7b-beta'
const huggingFaceFallbackModels = (process.env.HUGGINGFACE_FALLBACK_MODELS || 'Qwen/Qwen2.5-7B-Instruct,HuggingFaceH4/zephyr-7b-beta,google/flan-t5-large')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean)
const aiProvider = process.env.AI_PROVIDER || 'auto'
const includeDebug = process.env.NODE_ENV !== 'production'
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null
const huggingFaceApiKey = process.env.HUGGINGFACE_API_KEY || ''
const groqApiKey = process.env.GROQ_API_KEY || ''

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

function resolveProviderOrder() {
  const available = {
    groq: Boolean(groqApiKey),
    huggingface: Boolean(huggingFaceApiKey),
    openai: Boolean(openai),
  }

  if (aiProvider === 'groq') {
    return available.groq ? ['groq'] : []
  }

  if (aiProvider === 'huggingface') {
    return available.huggingface ? ['huggingface'] : []
  }

  if (aiProvider === 'openai') {
    return available.openai ? ['openai'] : []
  }

  const providers = []
  if (available.groq) {
    providers.push('groq')
  }
  if (available.huggingface) {
    providers.push('huggingface')
  }
  if (available.openai) {
    providers.push('openai')
  }
  return providers
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
    model: openaiModel,
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

async function generateReplyWithGroq({ brandMessage, targetPrice, offerStatus, negotiationContext }) {
  const systemPrompt =
    'You are an assistant helping content creators negotiate brand collaborations. Write concise, professional, confident, and polite replies. Never be aggressive. Output only the reply message body with greeting and sign-off.'

  const userPrompt = [
    `Brand message: ${brandMessage}`,
    `Offer status: ${offerStatus}`,
    `Target price in USD: ${targetPrice}`,
    `Negotiation context: ${JSON.stringify(negotiationContext || {})}`,
    'Write a reply that thanks the brand, references value delivered, and proposes the target price clearly.',
  ].join('\n')

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${groqApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: groqModel,
      temperature: 0.7,
      max_tokens: 260,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  })

  if (!response.ok) {
    const bodyText = await response.text()
    throw new Error(`Groq request failed with status ${response.status}: ${bodyText.slice(0, 180)}`)
  }

  const data = await response.json()
  return data?.choices?.[0]?.message?.content?.trim() || null
}

async function generateReplyWithHuggingFace({ brandMessage, targetPrice, offerStatus, negotiationContext }) {
  const systemPrompt =
    'You help creators negotiate brand deals. Write concise, professional, confident, and polite replies. Output only the final reply.'

  const userPrompt = [
    `Brand message: ${brandMessage}`,
    `Offer status: ${offerStatus}`,
    `Target price in USD: ${targetPrice}`,
    `Negotiation context: ${JSON.stringify(negotiationContext || {})}`,
    'Write a reply that thanks the brand, references scope/value, and proposes the target price clearly.',
  ].join('\n')

  const prompt = `<s>[INST] ${systemPrompt}\n\n${userPrompt} [/INST]`
  const modelCandidates = [...new Set([huggingFaceModel, ...huggingFaceFallbackModels])]
  let lastError = null

  for (const modelCandidate of modelCandidates) {
    const endpoints = [
      `https://router.huggingface.co/hf-inference/models/${modelCandidate}`,
      `https://api-inference.huggingface.co/models/${modelCandidate}`,
    ]

    for (const endpoint of endpoints) {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${huggingFaceApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 240,
            temperature: 0.75,
            return_full_text: false,
          },
        }),
      })

      if (!response.ok) {
        const bodyText = await response.text()
        lastError = new Error(`Hugging Face request failed with status ${response.status} for ${modelCandidate}: ${bodyText.slice(0, 180)}`)

        if (response.status === 404 || response.status === 410 || response.status === 503) {
          continue
        }

        throw lastError
      }

      const data = await response.json()
      const generatedText =
        (Array.isArray(data) && data[0]?.generated_text) ||
        data?.generated_text ||
        ''

      const reply = String(generatedText).trim()
      if (reply) {
        return {
          reply,
          modelUsed: modelCandidate,
        }
      }
    }
  }

  if (lastError) {
    throw lastError
  }

  return null
}

async function generateReplyWithProvider(payload) {
  const providerOrder = resolveProviderOrder()

  if (providerOrder.length === 0) {
    return null
  }

  let lastError = null

  for (const provider of providerOrder) {
    try {
      if (provider === 'groq') {
        const reply = await generateReplyWithGroq(payload)
        if (reply) {
          return {
            reply,
            source: 'groq',
            model: groqModel,
          }
        }
      }

      if (provider === 'huggingface') {
        const result = await generateReplyWithHuggingFace(payload)
        if (result?.reply) {
          return {
            reply: result.reply,
            source: 'huggingface',
            model: result.modelUsed,
          }
        }
      }

      if (provider === 'openai') {
        const reply = await generateReplyWithAI(payload)
        if (reply) {
          return { reply, source: 'openai' }
        }
      }
    } catch (error) {
      lastError = error
    }
  }

  if (lastError) {
    throw lastError
  }

  return null
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
    const aiResult = await generateReplyWithProvider(payload)

    if (!aiResult) {
      const fallbackResponse = {
        reply: generateReply(payload),
        source: 'template-fallback',
      }

      if (includeDebug) {
        fallbackResponse.debug = {
          reason: 'NO_AI_PROVIDER_CONFIGURED',
          aiProvider,
          groqModel,
          openaiModel,
          huggingFaceModel,
        }
      }

      return res.json(fallbackResponse)
    }

    return res.json(aiResult)
  } catch (error) {
    console.error('AI generation failed, using fallback template:', error)
    const fallbackResponse = {
      reply: generateReply(payload),
      source: 'template-fallback',
    }

    if (includeDebug) {
      fallbackResponse.debug = {
        reason: 'AI_REQUEST_FAILED',
        aiProvider,
        groqModel,
        openaiModel,
        huggingFaceModel,
        error: getSafeErrorDetails(error),
      }
    }

    return res.json(fallbackResponse)
  }
})

app.post('/api/verify', async (req, res) => {
  const { email } = req.body ?? {}
  if (typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' })
  }

  const apiKey = process.env.LEMON_SQUEEZY_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'Payment verification not configured' })

  try {
    const response = await fetch(
      `https://api.lemonsqueezy.com/v1/subscriptions?filter[user_email]=${encodeURIComponent(email.trim().toLowerCase())}`,
      { headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/vnd.api+json' } },
    )
    if (!response.ok) return res.status(502).json({ error: 'Could not reach payment provider' })

    const data = await response.json()
    const subscriptions = data?.data || []
    const variantId = process.env.LEMON_SQUEEZY_VARIANT_ID ? String(process.env.LEMON_SQUEEZY_VARIANT_ID) : null

    const active = subscriptions.find((sub) => {
      const status = sub?.attributes?.status
      const subVariantId = String(sub?.attributes?.variant_id || '')
      const isActive = status === 'active' || status === 'trialing' || status === 'past_due'
      return variantId ? isActive && subVariantId === variantId : isActive
    })
    if (active) return res.json({ plan: 'pro' })

    const ordersRes = await fetch(
      `https://api.lemonsqueezy.com/v1/orders?filter[user_email]=${encodeURIComponent(email.trim().toLowerCase())}`,
      { headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/vnd.api+json' } },
    )
    if (ordersRes.ok) {
      const ordersData = await ordersRes.json()
      const paidOrder = (ordersData?.data || []).find((o) => o?.attributes?.status === 'paid')
      if (paidOrder) return res.json({ plan: 'pro' })
    }

    return res.json({ plan: 'free' })
  } catch {
    return res.status(502).json({ error: 'Verification failed' })
  }
})

app.post('/api/offer-reply', async (req, res) => {
  const { offerText, tone } = req.body ?? {}

  if (typeof offerText !== 'string' || offerText.trim().length === 0) {
    return res.status(400).json({ error: 'offerText must be a non-empty string.' })
  }

  const sanitizedOffer = offerText.slice(0, 3000)

  const toneMap = {
    professional: 'professional and formal',
    warm: 'warm and friendly',
    firm: 'firm and direct',
  }
  const toneLabel = toneMap[tone] || 'professional and balanced'

  const systemPrompt =
    'You are a professional content creator writing a reply to a brand collaboration offer. ' +
    'Write a concise, confident, and polished reply letter. ' +
    'Acknowledge the key details from the offer (budget, deliverables, campaign goals). ' +
    'If the budget seems low or is missing, politely indicate your standard rates. ' +
    'Close with a clear next step. Output only the reply letter body with greeting and sign-off.'

  const userPrompt = [
    `Brand offer / message:`,
    `"""`,
    sanitizedOffer,
    `"""`,
    ``,
    `Write a ${toneLabel} reply from the creator's perspective. Reference the offer details, show interest, address the budget if mentioned, and propose clear next steps.`,
  ].join('\n')

  function generateFallbackReply(text) {
    const match =
      text.match(/(?:\$\s?|USD\s?)(\d+(?:,\d{3})*(?:\.\d{1,2})?)/i) ||
      text.match(/(\d+(?:,\d{3})*(?:\.\d{1,2})?)\s?(?:usd|dollars?)/i)
    const budget = match ? Number(match[1].replace(/,/g, '')) : null
    const budgetLine = budget
      ? `Regarding the proposed budget of $${budget}, I would like to discuss whether we can align this with my standard rates for this type of collaboration.`
      : 'I would appreciate the opportunity to discuss the budget and deliverables in more detail to ensure we are well aligned.'

    return [
      'Hi there,',
      'Thank you for reaching out and sharing this collaboration opportunity. I appreciate you thinking of me for this campaign.',
      budgetLine,
      'I am excited about the potential of working together. Could you share any additional details about the campaign timeline, deliverables, and usage rights so I can give you a proper quote?',
      'Looking forward to hearing from you,\n[Your Name]',
    ].join('\n\n')
  }

  const providerOrder = resolveProviderOrder()

  try {
    for (const provider of providerOrder) {
      if (provider === 'groq') {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: groqModel,
            temperature: 0.7,
            max_tokens: 420,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const reply = data?.choices?.[0]?.message?.content?.trim()
          if (reply) return res.json({ reply, source: 'groq', model: groqModel })
        }
      }

      if (provider === 'openai' && openai) {
        const response = await openai.responses.create({
          model: openaiModel,
          input: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        })
        const reply = response.output_text?.trim()
        if (reply) return res.json({ reply, source: 'openai', model: openaiModel })
      }
    }

    const fallbackResponse = { reply: generateFallbackReply(sanitizedOffer), source: 'template-fallback' }
    if (includeDebug) fallbackResponse.debug = { reason: 'NO_AI_PROVIDER_CONFIGURED', aiProvider }
    return res.json(fallbackResponse)
  } catch (error) {
    console.error('offer-reply AI failed:', error)
    const fallbackResponse = { reply: generateFallbackReply(sanitizedOffer), source: 'template-fallback' }
    if (includeDebug) fallbackResponse.debug = { reason: 'AI_REQUEST_FAILED', error: getSafeErrorDetails(error) }
    return res.json(fallbackResponse)
  }
})

app.listen(port, () => {
  console.log(`Creator Deal Assistant API running on http://localhost:${port}`)
})
