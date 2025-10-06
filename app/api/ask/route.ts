import { NextRequest } from 'next/server'
export const runtime = 'edge'

export async function POST(req: NextRequest) {
const { query } = await req.json()
const stream = new ReadableStream({
start(controller) {
const enc = new TextEncoder()
const chunks = [
'Thanks for asking! ',
'This demo is wired for streaming. ',
`You asked: ${query}. `,
'Real retrieval + model calls go here.'
]
for (const c of chunks) controller.enqueue(enc.encode(`data: ${c}\n\n`))
controller.close()
}
})
return new Response(stream, {
headers: {
'Content-Type': 'text/event-stream; charset=utf-8',
'Cache-Control': 'no-cache, no-transform',
'X-Accel-Buffering': 'no'
}
})
}
