// app/api/ask/route.ts
import type { NextRequest } from 'next/server'
import { DeepSeekProvider } from '@/providers/deepseek'
import type { ChatMessage } from '@/lib/ai'

export const runtime = 'edge'            // fast, streaming friendly
export const dynamic = 'force-dynamic'

const provider = new DeepSeekProvider()

export async function POST(req: NextRequest) {
  try {
    const { query, history = [] } = await req.json().catch(() => ({}))

    if (!process.env.DEEPSEEK_API_KEY) {
      return new Response('DeepSeek key missing', { status: 500 })
    }
    if (!query || typeof query !== 'string') {
      return new Response('Query required', { status: 400 })
    }

    // Minimal system prompt (we can RAG later)
    const system: ChatMessage = {
      role: 'system',
      content:
        'You are Ashwin’s portfolio assistant. Answer concisely (2–6 sentences), be helpful and professional. ' +
        'If asked about Ashwin’s experience, skills, or projects, answer from what a typical resume/portfolio contains. ' +
        'If unsure, say so briefly.',
    }

    // Optional short conversation memory from client
    const past: ChatMessage[] = Array.isArray(history) ? history.slice(-6) : []

    const messages: ChatMessage[] = [
      system,
      ...past,
      { role: 'user', content: query },
    ]

    const stream = await provider.chatStream(messages, {
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      temperature: 0.4,
      maxTokens: 600,
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
      },
    })
  } catch (err: any) {
    console.error('/api/ask error', err)
    return new Response('Something went wrong', { status: 500 })
  }
}
