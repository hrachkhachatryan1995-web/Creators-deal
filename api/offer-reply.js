import OpenAI from 'openai'

const openaiModel = process.env.OPENAI_MODEL || 'gpt-4o-mini'
const groqModel = process.env.GROQ_MODEL || 'llama-3.1-8b-instant'
const groqApiKey = process.env.GROQ_API_KEY || ''
const aiProvider = process.env.AI_PROVIDER || 'auto'
const includeDebug = process.env.NODE_ENV !== 'production'

function buildSystemPrompt() {
  return (
    'You are a professional content creator writing a reply to a brand collaboration offer. ' +
    'Write a concise, confident, and polished reply letter. ' +
    'Acknowledge the key details from the offer (budget, deliverables, campaign goals). ' +
    'If the budget seems low or is missing, politely indicate your standard rates. ' +
    'Close with a clear next step. Output only the reply letter body with greeting and sign-off.'
  )
}

function buildUserPrompt(offerText, tone) {
  const toneMap = {
    professional: 'professional and formal',
    warm: 'warm and friendly',
    firm: 'firm and direct',
  }
  const toneLabel = toneMap[tone] || 'professional and balanced'

  return [
    `Brand offer / message:`,
    `"""`,
    offerText,
    `"""`,
    ``,
    `Write a ${toneLabel} reply from the creator's perspective. Reference the offer details, show interest, address the budget if mentioned, and propose clear next steps.`,
  ].join('\n')
}

function extractBudget(text) {
  const match =
    text.match(/(?:\$\s?|USD\s?)(\d+(?:,\d{3})*(?:\.\d{1,2})?)/i) ||
    text.match(/(\d+(?:,\d{3})*(?:\.\d{1,2})?)\s?(?:usd|dollars?)/i)
  return match ? Number(match[1].replace(/,/g, '')) : null
}

function generateFallbackReply(offerText) {
  const budget = extractBudget(offerText)
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

function resolveProviderOrder() {
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY)
  const hasGroq = Boolean(groqApiKey)

  if (aiProvider === 'groq') return hasGroq ? ['groq'] : []
  if (aiProvider === 'openai') return hasOpenAI ? ['openai'] : []

  const providers = []
  if (hasGroq) providers.push('groq')
  if (hasOpenAI) providers.push('openai')
  return providers
}

async function generateWithGroq(offerText, tone) {
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
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: buildUserPrompt(offerText, tone) },
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

async function generateWithOpenAI(offerText, tone) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  const openai = new OpenAI({ apiKey })
  const response = await openai.responses.create({
    model: openaiModel,
    input: [
      { role: 'system', content: buildSystemPrompt() },
      { role: 'user', content: buildUserPrompt(offerText, tone) },
    ],
  })

  return response.output_text?.trim() || null
}

async function generateWithProvider(offerText, tone) {
  const providerOrder = resolveProviderOrder()
  if (providerOrder.length === 0) return null

  let lastError = null

  for (const provider of providerOrder) {
    try {
      if (provider === 'groq') {
        const reply = await generateWithGroq(offerText, tone)
        if (reply) return { reply, source: 'groq', model: groqModel }
      }

      if (provider === 'openai') {
        const reply = await generateWithOpenAI(offerText, tone)
        if (reply) return { reply, source: 'openai', model: openaiModel }
      }
    } catch (error) {
      lastError = error
    }
  }

  if (lastError) throw lastError
  return null
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { offerText, tone } = req.body ?? {}

  if (typeof offerText !== 'string' || offerText.trim().length === 0) {
    return res.status(400).json({ error: 'offerText must be a non-empty string.' })
  }

  const sanitizedOffer = offerText.slice(0, 3000)

  try {
    const aiResult = await generateWithProvider(sanitizedOffer, tone)
    if (aiResult) return res.status(200).json(aiResult)

    const fallbackResponse = {
      reply: generateFallbackReply(sanitizedOffer),
      source: 'template-fallback',
    }

    if (includeDebug) {
      fallbackResponse.debug = { reason: 'NO_AI_PROVIDER_CONFIGURED', aiProvider }
    }

    return res.status(200).json(fallbackResponse)
  } catch (error) {
    const fallbackResponse = {
      reply: generateFallbackReply(sanitizedOffer),
      source: 'template-fallback',
    }

    if (includeDebug) {
      fallbackResponse.debug = {
        reason: 'AI_REQUEST_FAILED',
        error: { message: String(error?.message || '').slice(0, 220) },
      }
    }

    return res.status(200).json(fallbackResponse)
  }
}
