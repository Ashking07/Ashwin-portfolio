// app/api/jd/route.ts
import type { NextRequest } from 'next/server'
import { DeepSeekProvider } from '@/providers/deepseek'
import type { ChatMessage } from '@/lib/ai'
import { searchTopK, formatContext } from '@/lib/rag'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { jd } = await req.json().catch(() => ({}))
    if (!process.env.DEEPSEEK_API_KEY) return new Response('DeepSeek key missing', { status: 500 })
    if (!jd || typeof jd !== 'string' || jd.trim().length < 30) {
      return new Response('JD text required (≥30 chars)', { status: 400 })
    }

    // Retrieve Ashwin’s most relevant evidence from KB
    const chunks = searchTopK(jd, 8)
    const context = formatContext(chunks)

    const system: ChatMessage = {
      role: 'system',
      content:
        'You are Ashwin’s portfolio assistant. Using ONLY the provided CONTEXT (facts from his resume/projects), ' +
        'tailor a short response to the Job Description (JD). Do NOT invent facts. ' +
        'Output STRICT JSON with keys: {"summary": string, "bullets": string[], "citations": string[]} where ' +
        '"citations" are context ids like "#1", "#3" that support the bullets.\n' +
        `CONTEXT:\n${context}`,
    }

    const user: ChatMessage = {
      role: 'user',
      content:
        'JD:\n' + jd + '\n\nReturn ONLY JSON. Keep summary to 2–3 sentences and 5–7 concise bullets.',
    }

    const provider = new DeepSeekProvider()
    const stream = await provider.chatStream([system, user], {
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      temperature: 0.2,
      maxTokens: 600,
    })

   // Collect the stream into a string (we want JSON)
const raw = await new Response(stream).text()

// --- robust JSON extraction ---
const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)
const sliced = (() => {
  if (fenced) return fenced[1].trim()
  const first = raw.indexOf('{')
  const last = raw.lastIndexOf('}')
  if (first !== -1 && last !== -1 && last > first) return raw.slice(first, last + 1)
  return raw.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim()
})()

let payload: { summary: string; bullets: string[]; citations?: string[] }
try {
  payload = JSON.parse(sliced)
} catch {
  // minimal fallback
  payload = {
    summary: 'Tailored highlights based on Ashwin’s resume and the provided JD.',
    bullets: sliced ? sliced.split('\n').filter(Boolean).slice(0, 7) : [raw.trim()],
    citations: [],
  }
}

return Response.json(payload)

  } catch (err) {
    console.error('/api/jd error', err)
    return new Response('Something went wrong', { status: 500 })
  }
}
