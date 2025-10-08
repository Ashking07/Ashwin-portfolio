// providers/deepseek.ts
import type { AIProvider, ChatMessage, ChatStreamOptions } from '@/lib/ai'
import { pushChunk } from '@/lib/ai'

const BASE = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1'
const KEY = process.env.DEEPSEEK_API_KEY || ''
const DEFAULT_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat'

if (!KEY) {
  // Do not throw at import time on Vercel builds; route will surface the error nicely
  console.warn('[DeepSeek] Missing DEEPSEEK_API_KEY')
}

export class DeepSeekProvider implements AIProvider {
  async chatStream(messages: ChatMessage[], opts: ChatStreamOptions = {}) {
    const model = opts.model || DEFAULT_MODEL
    const temperature = opts.temperature ?? 0.4
    const max_tokens = opts.maxTokens ?? 800

    const url = `${BASE}/chat/completions`
   // ...
const res = await fetch(url, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model,
    messages,
    temperature,
    max_tokens,
    stream: true, // ask for SSE, but we’ll fall back if not provided
  }),
})

if (!res.ok || !res.body) {
  const text = await res.text().catch(() => '')
  throw new Error(`[DeepSeek] HTTP ${res.status}: ${text}`)
}

const ct = res.headers.get('content-type') || ''

// --- If DeepSeek returns JSON (no SSE), just emit the text once ---
if (!ct.includes('text/event-stream')) {
  const json = await res.json()
  const text = json?.choices?.[0]?.message?.content ?? ''
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      if (text) controller.enqueue(new TextEncoder().encode(text))
      controller.close()
    },
  })
  return stream
}

// --- Otherwise, handle SSE streaming ---
const reader = res.body.getReader()
const stream = new ReadableStream<Uint8Array>({
  async start(controller) {
    const decoder = new TextDecoder()
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        for (const line of chunk.split('\n')) {
          const t = line.trim()
          if (!t.startsWith('data:')) continue
          const payload = t.slice(5).trim()
          if (payload === '[DONE]') { controller.close(); return }
          try {
            const json = JSON.parse(payload)
            const delta = json.choices?.[0]?.delta?.content
            if (delta) controller.enqueue(new TextEncoder().encode(delta))
          } catch { /* ignore partial frames */ }
        }
      }
    } catch (e) { controller.error(e) }
    finally { controller.close() }
  },
  cancel() { reader.cancel() },
})
return stream
  }}