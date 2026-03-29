import dotenv from 'dotenv'
import OpenAI from 'openai'

dotenv.config()

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'

const timeout = setTimeout(() => {
  console.log('OPENAI_TIMEOUT')
  process.exit(2)
}, 15000)

try {
  const response = await client.responses.create({
    model,
    input: 'Reply with exactly: OK',
  })

  clearTimeout(timeout)
  console.log('OPENAI_OK')
  console.log((response.output_text || '').trim())
} catch (error) {
  clearTimeout(timeout)
  console.log('OPENAI_ERROR')
  console.log(error.status || 'no_status')
  console.log(error.code || 'no_code')
  console.log((error.message || '').slice(0, 260))
  process.exit(1)
}
