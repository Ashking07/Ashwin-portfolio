'use client'

import { useState } from 'react'

type Result = { title?: string; summary: string; tags: string[] }

export default function UrlTagger() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [res, setRes] = useState<Result | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const analyze = async () => {
    setLoading(true); setErr(null); setRes(null)
    try {
      const r = await fetch('/api/tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      if (!r.ok) throw new Error(await r.text())
      const json = await r.json()
      setRes(json)
    } catch (e: any) {
      setErr(e.message || 'Failed to analyze URL')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-6 rounded-2xl border p-4 bg-white/70 dark:bg-zinc-900/60 backdrop-blur">
      <div className="text-sm font-medium mb-2">URL Tagger / Summary</div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded-xl px-3 py-2 bg-transparent"
          placeholder="https://example.com/article"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button onClick={analyze} disabled={loading || !/^https?:\/\//i.test(url)}
          className="border rounded-xl px-4 py-2">
          {loading ? 'Analyzing…' : 'Analyze'}
        </button>
        <button
          onClick={() => { setUrl(''); setRes(null); setErr(null) }}
          className="px-4 py-2 rounded-xl border hover:bg-black/5 dark:hover:bg-white/10 transition"
        >
    Clear
  </button>
      </div>

      {err && <div className="mt-3 text-sm text-red-600">{err}</div>}

      {res && (
        <div className="mt-4">
          <div className="font-medium">{res.title}</div>
          <p className="mt-2 text-sm opacity-80">{res.summary}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {res.tags?.map((t: string) => (
              <span key={t} className="border rounded-full px-3 py-1">{t}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
