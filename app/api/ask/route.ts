// app/api/ask/route.ts
import type { NextRequest } from 'next/server'
import { DeepSeekProvider } from '@/providers/deepseek'
import type { ChatMessage } from '@/lib/ai'

export const runtime = 'nodejs'   // was 'edge'    
export const dynamic = 'force-dynamic'

const provider = new DeepSeekProvider()

import { formatContext, searchTopK } from '@/lib/rag'

export async function POST(req: Request) {
  try {
    const { query, history = [], debug = false } = await req.json().catch(() => ({}))
    if (!process.env.DEEPSEEK_API_KEY) return new Response('DeepSeek key missing', { status: 500 })
    if (!query || typeof query !== 'string') return new Response('Query required', { status: 400 })

    // --- RAG ---
    const chunks = searchTopK(query, 6)
    const context = formatContext(chunks)

    // Debug path: return what the KB found so we can verify it
    if (debug) {
      return new Response(JSON.stringify({ found: chunks.length, chunks }, null, 2), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // --- Prompt: put CONTEXT in a system message for stronger adherence ---
    const system: ChatMessage = {
  role: 'system',
  content:
    'You are Ashwin’s portfolio assistant. Use ONLY the facts in CONTEXT. ' +
    'Never guess or add numbers/years unless they appear verbatim in CONTEXT. ' +
    'If the answer isn’t in CONTEXT, reply exactly: "I don’t have that info on this site yet." ' +
    'End with citation tags like [#1][#3] that refer to CONTEXT.\n' +
    `CONTEXT:\n${context}`,
}
    const messages: ChatMessage[] = [
      system,
      ...(Array.isArray(history) ? history.slice(-4) : []),
      { role: 'user', content: query },
    ]

    const provider = new DeepSeekProvider()
    const stream = await provider.chatStream(messages, {
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      temperature: 0.1,
      maxTokens: 400,
    })

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache', 'X-Accel-Buffering': 'no' },
    })
  } catch (err) {
    console.error(err)
    return new Response('Something went wrong', { status: 500 })
  }
}
