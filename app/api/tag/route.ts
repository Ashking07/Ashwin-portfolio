// app/api/tag/route.ts
import { NextRequest } from 'next/server'
import { DeepSeekProvider } from '@/providers/deepseek'
import type { ChatMessage } from '@/lib/ai'
import * as cheerio from 'cheerio'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json().catch(() => ({}))
    if (!process.env.DEEPSEEK_API_KEY) return new Response('DeepSeek key missing', { status: 500 })
    if (!url || !/^https?:\/\//i.test(url)) return new Response('Valid URL required', { status: 400 })

    // 1) Fetch page
    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(), 12_000)
    const res = await fetch(url, {
      headers: { 'User-Agent': 'AshwinPortfolioBot/1.0 (+https://example.com)' },
      signal: controller.signal,
    }).catch((e) => {
      throw new Error('Fetch failed: ' + e.message)
    })
    clearTimeout(t)

    if (!res.ok) return new Response('Failed to fetch URL', { status: 502 })
    const ctype = res.headers.get('content-type') || ''
    if (!ctype.includes('text/html')) {
      return new Response('URL is not HTML content', { status: 415 })
    }

    // 2) Extract text
    const html = await res.text()
    const $ = cheerio.load(html)
    const title = ($('meta[property="og:title"]').attr('content') || $('title').text() || '').trim()
    const desc =
      ($('meta[name="description"]').attr('content') ||
        $('meta[property="og:description"]').attr('content') ||
        '').trim()

    // Grab key blocks
    const blocks: string[] = []
    $('h1,h2,h3,p,li').each((_, el) => {
      const txt = $(el).text().replace(/\s+/g, ' ').trim()
      if (txt && txt.length > 40) blocks.push(txt)
    })

    // Limit to ~3–4k chars for prompt hygiene
    const body = blocks.join('\n').slice(0, 4000)

    // 3) Ask DeepSeek for summary + tags (strict JSON)
    const system: ChatMessage = {
      role: 'system',
      content:
        'You summarize web pages. Return ONLY compact JSON: ' +
        '{"title": string, "summary": string, "tags": string[]} ' +
        '(summary ≤ 2 sentences, tags = 3–5 short topics). No markdown or code fences.',
    }
    const user: ChatMessage = {
      role: 'user',
      content:
        `URL: ${url}\nTITLE: ${title}\nDESCRIPTION: ${desc}\nCONTENT:\n${body}\n\n` +
        'Output only the JSON object.',
    }

    const provider = new DeepSeekProvider()
    const stream = await provider.chatStream([system, user], {
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      temperature: 0.3,
      maxTokens: 300,
    })

    const raw = await new Response(stream).text()

    // Robust JSON extraction (handles accidental wrappers)
    const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)
    const sliced = (() => {
      if (fenced) return fenced[1].trim()
      const first = raw.indexOf('{')
      const last = raw.lastIndexOf('}')
      if (first !== -1 && last !== -1 && last > first) return raw.slice(first, last + 1)
      return raw.trim()
    })()

    let payload: { title?: string; summary: string; tags: string[] }
    try {
      payload = JSON.parse(sliced)
    } catch {
      payload = {
        title,
        summary: desc || (body ? body.slice(0, 180) + '…' : 'No summary available.'),
        tags: [],
      }
    }

    // Fill title if missing
    if (!payload.title) payload.title = title || new URL(url).hostname

    return Response.json(payload)
  } catch (e) {
    console.error('/api/tag error', e)
    return new Response('Something went wrong', { status: 500 })
  }
}
