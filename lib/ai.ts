// lib/ai.ts
export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string }

export interface ChatStreamOptions {
  model?: string
  temperature?: number
  maxTokens?: number
}

export interface AIProvider {
  chatStream(messages: ChatMessage[], opts?: ChatStreamOptions): Promise<ReadableStream<Uint8Array>>
}

export function textEncoder() {
  return new TextEncoder()
}

// Simple SSE chunk helper (client already expects a raw text stream)
export function pushChunk(controller: ReadableStreamDefaultController<Uint8Array>, text: string) {
  const enc = textEncoder()
  controller.enqueue(enc.encode(text))
}
