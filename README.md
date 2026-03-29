# Creator Deal Assistant

Creator Deal Assistant is a SaaS-style MVP that helps content creators:
- calculate fair deal pricing ranges
- analyze brand offers as Underpaid, Fair, or Good deal
- generate confident and polite negotiation replies

## Tech Stack

- Frontend: React + Tailwind (Vite)
- Backend: Node.js + Express
- AI: Hugging Face Inference API (free tier) or OpenAI, with safe template fallback

## Setup

1. Install dependencies:

	npm install

2. Create an environment file from the example:

	Copy `.env.example` to `.env` and set your keys:

	AI_PROVIDER=auto
	HUGGINGFACE_API_KEY=your_huggingface_api_key_here
	HUGGINGFACE_MODEL=HuggingFaceH4/zephyr-7b-beta

	OPENAI_API_KEY=your_real_key
	OPENAI_MODEL=gpt-4o-mini

3. Start both frontend and backend:

	npm run dev

The app runs with Vite on the client and Express API on port 5000.

## AI Reply Generator Behavior

- If `AI_PROVIDER=auto`, the app tries Hugging Face first, then OpenAI.
- If `AI_PROVIDER=huggingface`, it uses Hugging Face only.
- If `AI_PROVIDER=openai`, it uses OpenAI only.
- If provider keys are missing or API calls fail, the server falls back to a built-in professional template reply so the feature keeps working.

## Deploy To Vercel

1. Push this repo to GitHub.
2. In Vercel, click `New Project` and import this repository.
3. Keep Framework Preset as `Vite`.
4. Add environment variables in Vercel Project Settings:

	AI_PROVIDER=auto
	HUGGINGFACE_API_KEY=your_huggingface_api_key_here
	HUGGINGFACE_MODEL=HuggingFaceH4/zephyr-7b-beta

	OPENAI_API_KEY=your_real_key
	OPENAI_MODEL=gpt-4o-mini

5. Click `Deploy`.

Notes:
- Frontend routes are handled via `vercel.json` rewrites.
- API runs from `api/reply.js` as a Vercel Serverless Function.
- Your frontend `fetch('/api/reply')` will work on the deployed domain.
